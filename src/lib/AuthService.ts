import { User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client';
import getConfig from 'next/config';
import logger from '@/lib/clientLogger';
import { SafeLocalStorage } from '@/utilities/localStorageHelper';
import captureExceptionOrMessage from '@/lib/apollo-link-sentry/errorHandler';
import { CLIENT_FEATURE_FLAGS, CLIENT_SIDE_ERROR_TAG, COOKIE_FLOW_LOG_TAG } from '@/constants';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

interface ConstantsProps {
  BASE_PATH: string;
  OIDC_STS_AUTHORITY: string;
  OIDC_CLIENT_ID: string;
  OIDC_RESPONSE_TYPE: string;
  OIDC_CLIENT_SCOPE: string;
  OIDC_CALLBACK_PATH: string;
  OIDC_LOGOUT_URL: string;
}

export interface Authenticable {
  getUser(): Promise<User | null> | null;

  login(authToken?: string): Promise<void>;

  redirectLogin(
    redirectUri: string,
    authToken?: string,
    oneTimeToken?: string | null
  ): Promise<void>;

  renewToken(): Promise<User>;

  getStore(): any;

  resetUserData(): Promise<void>;

  logout(): Promise<void>;

  validToken(bufferDuration: number): any;
}

// TODO: remove this module once the shared auth module has been built:
// https://jira.infra.carezen.net/browse/DNA-51
export function createAuthService(
  cookieFlowEnabled = false,
  cookieFlowEvaluation?: LDEvaluationDetail,
  cscSessionCookieFlowEvaluation?: LDEvaluationDetail
): Authenticable {
  const { publicRuntimeConfig } = getConfig();

  let userManager: UserManager;
  let clientStorage: SafeLocalStorage;
  const {
    BASE_PATH,
    OIDC_STS_AUTHORITY,
    OIDC_CLIENT_ID,
    OIDC_RESPONSE_TYPE,
    OIDC_CLIENT_SCOPE,
    OIDC_CALLBACK_PATH,
    OIDC_LOGOUT_URL,
  }: ConstantsProps = publicRuntimeConfig;

  const clientStorageKey = `czen.oidc.user:${OIDC_STS_AUTHORITY}:${OIDC_CLIENT_ID}`;

  if (typeof window !== 'undefined') {
    clientStorage = SafeLocalStorage.getInstance();
    if (
      !OIDC_STS_AUTHORITY ||
      !OIDC_CLIENT_ID ||
      !OIDC_RESPONSE_TYPE ||
      !OIDC_CLIENT_SCOPE ||
      !OIDC_CALLBACK_PATH ||
      !OIDC_LOGOUT_URL
    ) {
      throw new Error('AuthService: Missing required props');
    }

    // construct a callback URL that's relative to the browser's current origin
    const origin = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }`;
    const fullCallbackUrl = `${origin}${OIDC_CALLBACK_PATH}`;
    const settings: UserManagerSettings = {
      authority: OIDC_STS_AUTHORITY,
      client_id: OIDC_CLIENT_ID,
      redirect_uri: fullCallbackUrl,
      post_logout_redirect_uri: OIDC_LOGOUT_URL,
      response_type: OIDC_RESPONSE_TYPE,
      scope: OIDC_CLIENT_SCOPE,
      userStore: new WebStorageStateStore({
        prefix: 'czen.oidc.',
        store: clientStorage,
      }),
      automaticSilentRenew: true,
    };

    userManager = new UserManager(settings);
  }

  const getUser = () => {
    if (userManager) {
      return userManager.getUser();
    }
    return null;
  };

  const renewToken = () => {
    return userManager.signinSilent();
  };
  const getStore = () => {
    const item = clientStorage.getItem(clientStorageKey);
    return item === null ? null : JSON.parse(item);
  };
  const removeStore = (key: string) => {
    clientStorage.removeItem(key);
  };

  const resetUserData = async () => {
    try {
      await userManager.removeUser();
    } catch (e) {
      logger.error({ error: e as Error, tags: [CLIENT_SIDE_ERROR_TAG] });
      captureExceptionOrMessage(e);
    }

    removeStore(clientStorageKey);
  };

  const logout = () => {
    const idToken = getStore() && getStore().id_token;
    userManager.clearStaleState();
    return userManager
      .signoutRedirect({
        id_token_hint: idToken,
      })
      .catch((reason) => {
        logger.error({ error: reason, tags: [CLIENT_SIDE_ERROR_TAG] });
        captureExceptionOrMessage(reason);
      });
  };
  const validToken = (bufferDuration: number) => {
    const tokenInfo = getStore();
    if (tokenInfo === null || tokenInfo.expires_at === null) {
      return false;
    }

    // Use bufferDuration to prevent race conditions due to token being right on the cusp of expiring
    return tokenInfo.expires_at - bufferDuration > Date.now() / 1000;
  };

  const redirectLogin = async (redirectUri: string, authToken?: string, oneTimeToken?: string) => {
    AnalyticsHelper.logTestExposure(CLIENT_FEATURE_FLAGS.COOKIE_FLOW_AUTH, cookieFlowEvaluation!);
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.CSC_SESSION_COOKIE_FLOW,
      cscSessionCookieFlowEvaluation!
    );

    if (cookieFlowEnabled && oneTimeToken) {
      const cookieAuthCallBackUri = redirectUri.startsWith(BASE_PATH)
        ? `${window.location.origin}${redirectUri}`
        : redirectUri;

      const queryParams = new URLSearchParams();
      queryParams.append('redirect_uri', cookieAuthCallBackUri);

      if (cscSessionCookieFlowEvaluation?.value === 'control' && authToken) {
        queryParams.append('authToken', authToken);
      } else {
        queryParams.append('ott', oneTimeToken);
      }

      logger.info({
        event: 'CookieFlowLoginStart',
        tags: [COOKIE_FLOW_LOG_TAG],
      });

      return window.location.assign(`/api/id-oidc-proxy/care/login?${queryParams.toString()}`);
    }

    logger.info({ event: 'oidcRedirectLogin' });

    return userManager.signinRedirect({
      data: redirectUri,
      extraQueryParams: {
        ...(authToken ? { authToken } : {}),
      },
    });
  };

  const login = (authToken?: string) => {
    const redirectUri = document.location.pathname + document.location.search;
    return redirectLogin(redirectUri, authToken);
  };

  return {
    login,
    logout,
    redirectLogin,
    getUser,
    getStore,
    renewToken,
    resetUserData,
    validToken,
  };
}

let instance: Authenticable | null = null;
export default function AuthService(
  cookieFlowEnabled?: boolean,
  cookieFlowEvaluation?: LDEvaluationDetail,
  cscSessionCookieFlowEvaluation?: LDEvaluationDetail
): Authenticable {
  if (!instance) {
    instance = createAuthService(
      cookieFlowEnabled,
      cookieFlowEvaluation,
      cscSessionCookieFlowEvaluation
    );
  }

  return instance;
}

let email: null | string = null;

export function getUserEmail(): null | string {
  if (!email) {
    try {
      const authService = AuthService();
      const authStore = authService.getStore();
      email = authStore?.profile.email;
    } catch (e) {
      email = null;
    }
  }

  return email;
}
