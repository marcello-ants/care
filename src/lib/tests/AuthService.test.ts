import { useRouter } from 'next/router';
import { UserManager } from 'oidc-client';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';

import { SafeLocalStorage } from '@/utilities/localStorageHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS } from '@/constants';

import AuthService, { createAuthService } from '../AuthService';
import Logger from '../clientLogger';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      BASE_PATH: '/app/enrollment',
      OIDC_STS_AUTHORITY: 'auth',
      OIDC_CLIENT_ID: 'czen-pub',
      OIDC_RESPONSE_TYPE: 'code',
      OIDC_CLIENT_SCOPE: 'test client scope',
      OIDC_CALLBACK_PATH: '/test/path',
      OIDC_LOGOUT_URL: 'http://www.logout.url',
    },
  };
});

jest.mock('oidc-client');

jest.unmock('../clientLogger');
jest.mock('../clientLogger', () => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

const jan1st2021EpochTime = 1609459200;

describe('Auth Service', () => {
  afterEach(() => {
    (Logger.info as jest.Mock).mockReset();
    (Logger.warn as jest.Mock).mockReset();
    (Logger.error as jest.Mock).mockReset();
  });

  describe('AuthService()', () => {
    it('should return the same Authenticable instance across invocations', () => {
      const instance1 = AuthService();
      const instance2 = AuthService();
      expect(instance2).toBe(instance1);
    });
  });

  describe('createAuthService()', () => {
    let mockRouter: any | null = null;
    beforeEach(() => {
      mockRouter = {
        basePath: 'app/enrollment',
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      // 2021-01-01 in epoch time
      jest.spyOn(global.Date, 'now').mockImplementation(() => jan1st2021EpochTime * 1000);
    });

    afterEach(() => {
      mockRouter = null;
      (UserManager as jest.Mock).mockReset();
    });

    afterAll(() => {
      jest.mock('../clientLogger');
    });

    describe('getStore', () => {
      it('should return null if client storage is invalid', () => {
        const authService = createAuthService();
        expect(authService.getStore()).toBe(null);
      });

      it('should return the client storage', () => {
        const instance = SafeLocalStorage.getInstance();
        const item = '{"id":"2"}';

        jest.spyOn(instance, 'getItem').mockImplementation(() => {
          return item;
        });

        const authService = createAuthService();
        expect(authService.getStore()).toEqual(JSON.parse(item));
      });
    });

    describe('redirectLogin', () => {
      const originalLocation = window.location;

      beforeAll(() => {
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = {
          assign: jest.fn(),
          origin: 'https://www.care.com',
        };
      });

      afterAll(() => {
        window.location = originalLocation;
      });

      it('should call `userManager.signinRedirect` with the given redirectUri and authToken', () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];

        authService.redirectLogin('/foo/bar', 'auth-token');

        expect(Logger.info).toHaveBeenCalledWith({ event: 'oidcRedirectLogin' });

        expect(userManager.signinRedirect).toHaveBeenCalledWith({
          data: '/foo/bar',
          extraQueryParams: {
            authToken: 'auth-token',
          },
        });
      });

      it('should call `userManager.signinRedirect` with the given redirectUri and no authToken', () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];

        authService.redirectLogin('/foo/bar');

        expect(Logger.info).toHaveBeenCalledWith({ event: 'oidcRedirectLogin' });

        expect(userManager.signinRedirect).toHaveBeenCalledWith({
          data: '/foo/bar',
          extraQueryParams: {},
        });
      });

      it('should make a call to api/id-oidc-proxy/care/login when the cookie flow is enabled and a oneTimeToken is passed and csc-session-cookie is enabled', async () => {
        const cscSessionCookieFlowEvaluation: LDEvaluationDetail = {
          value: 'variant',
          variationIndex: 1,
          reason: { kind: 'OVERRIDE' },
        };
        const authService = createAuthService(true, undefined, cscSessionCookieFlowEvaluation);
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];

        await authService.redirectLogin('/app/enrollment/foo/bar', 'authToken', 'oneTimeToken');

        expect(Logger.info).not.toHaveBeenCalledWith(
          expect.objectContaining({ event: 'oidcRedirectLogin' })
        );

        expect(window.location.assign).toHaveBeenCalled();
        const assignArgs = (window.location.assign as jest.Mock).mock.calls[0];
        expect(assignArgs[0]).toEqual(expect.stringContaining('/api/id-oidc-proxy/care/login'));
        expect(assignArgs[0]).toEqual(expect.stringContaining('ott=oneTimeToken'));
        expect(assignArgs[0]).toEqual(
          expect.stringContaining(
            `redirect_uri=${encodeURIComponent('https://www.care.com/app/enrollment/foo/bar')}`
          )
        );

        expect(userManager.signinRedirect).not.toHaveBeenCalled();
      });

      it('should make a call to AnalyticsHelper.logTestExposure', () => {
        const cookieFlowAuth: LDEvaluationDetail = {
          value: true,
          variationIndex: 0,
          reason: { kind: 'OVERRIDE' },
        };
        const cscSessionCookieFlow: LDEvaluationDetail = {
          value: 'control',
          variationIndex: 1,
          reason: { kind: 'OVERRIDE' },
        };
        jest.spyOn(AnalyticsHelper, 'logTestExposure');

        const authService = createAuthService(true, cookieFlowAuth, cscSessionCookieFlow);
        authService.redirectLogin('/app/enrollment/foo/bar', 'authToken', 'oneTimeToken');
        expect(AnalyticsHelper.logTestExposure).toHaveBeenCalledWith(
          CLIENT_FEATURE_FLAGS.COOKIE_FLOW_AUTH,
          cookieFlowAuth
        );
        expect(AnalyticsHelper.logTestExposure).toHaveBeenCalledWith(
          CLIENT_FEATURE_FLAGS.CSC_SESSION_COOKIE_FLOW,
          cscSessionCookieFlow
        );
      });
    });

    describe('login', () => {
      it('should call `userManager.signinRedirect` with the given authToken and current document location', () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];

        authService.login('auth-token');

        expect(Logger.info).toHaveBeenCalledWith({ event: 'oidcRedirectLogin' });

        expect(userManager.signinRedirect).toHaveBeenCalledWith({
          data: '/',
          extraQueryParams: {
            authToken: 'auth-token',
          },
        });
      });
    });

    describe('logout', () => {
      it('should logout', () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];
        userManager.signoutRedirect = jest.fn(() => Promise.resolve());
        authService.logout();

        expect(userManager.clearStaleState).toHaveBeenCalled();

        expect(userManager.signoutRedirect).toHaveBeenCalled();
      });
      it('should logout throw error', async () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];
        userManager.signoutRedirect = jest.fn(() => Promise.reject(new Error('Catch error')));
        authService.logout();

        await expect(userManager.signoutRedirect).rejects.toThrowError('Catch error');
      });
    });

    describe('resetUserData', () => {
      it('should resetUserData', () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];
        userManager.removeUser = jest.fn(() => Promise.resolve());
        authService.resetUserData();

        expect(userManager.removeUser).toHaveBeenCalled();
      });
      it('should resetUserData throw error', async () => {
        const authService = createAuthService();
        const userManager: UserManager = (UserManager as jest.Mock).mock.instances[0];
        userManager.removeUser = jest.fn(() => Promise.reject(new Error('Catch error')));
        await authService.resetUserData();

        await expect(userManager.removeUser).rejects.toThrowError('Catch error');
      });
    });

    describe('validToken', () => {
      it('should return false if client storage is invalid', () => {
        const authService = createAuthService();
        expect(authService.validToken(0)).toBe(false);
      });

      it('should return false if expires_at is invalid', () => {
        const instance = SafeLocalStorage.getInstance();
        const item = '{"expires_at":null}';

        jest.spyOn(instance, 'getItem').mockImplementation(() => {
          return item;
        });

        const authService = createAuthService();
        expect(authService.validToken(0)).toBe(false);
      });

      it('should return true if unexpired token in client storage', () => {
        const instance = SafeLocalStorage.getInstance();
        // This is the year 2200 in epoch time, safe to say this token is not yet expired
        const item = '{"expires_at":"7276834333"}';

        jest.spyOn(instance, 'getItem').mockImplementation(() => {
          return item;
        });

        const authService = createAuthService();
        expect(authService.validToken(0)).toBe(true);
      });

      it('should return false if expired token in client storage', () => {
        const instance = SafeLocalStorage.getInstance();
        // This is the year 1970 in epoch time, this token is definitely expired
        const item = '{"expires_at":"0"}';

        jest.spyOn(instance, 'getItem').mockImplementation(() => {
          return item;
        });

        const authService = createAuthService();
        expect(authService.validToken(0)).toBe(false);
      });

      it('should return false if token is about to expire in client storage', () => {
        const instance = SafeLocalStorage.getInstance();
        // This is 5 seconds before Date.now(), so this token is on the cusp of expiring
        const item = `{"expires_at":"${jan1st2021EpochTime - 5}"}`;

        jest.spyOn(instance, 'getItem').mockImplementation(() => {
          return item;
        });

        const authService = createAuthService();
        expect(authService.validToken(0)).toBe(false);
      });
    });
  });
});
