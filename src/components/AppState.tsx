import { useRouter } from 'next/router';
import { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { debounce } from 'lodash-es';
import { configureScope, captureException, Severity } from '@sentry/nextjs';
import {
  initialAppState,
  rootReducer,
  isStateVersionCompatible,
  doesStateHaveDefaultKeys,
  validateState,
} from '@/state';
import patchAppState from '@/state/patch';
import { initialState as flowInitialState } from '@/state/flow';
import logger from '@/lib/clientLogger';
import { ClientLogger } from '@care/utils';
import getVertical from '@/utilities/verticalUtils';
import { SessionStorageHelper } from '@/utilities/SessionStorageHelper';
import { trackPageViewInSiftScience } from '@/utilities/siftScienceHelper';
import { AppAction, AppDispatch, AppState } from '@/types/app';
import { StateCheckingResponse } from '@/types/common';
import {
  LOCAL_STORAGE_STATE_KEY,
  CZEN_BASE_PATH,
  FLOWS,
  POST_A_JOB_ROUTES,
  CLIENT_FEATURE_FLAGS,
} from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

type AppStateProviderProps = {
  children: ReactNode;
  initialStateOverride?: AppState;
  czenJSessionId?: string | undefined;
  referrerCookie?: string | undefined | null;
  userHasAccount?: boolean;
  memberUuid?: string;
};

function getStateFromStorageOrDefault(defaultState: AppState) {
  let stateFromStorageJson;
  const sessionStorageAvailable = SessionStorageHelper.isAvailable();

  if (sessionStorageAvailable) {
    stateFromStorageJson = SessionStorageHelper.getItem(LOCAL_STORAGE_STATE_KEY);
  } else {
    logger.warn({ event: 'sessionStorageUnavailable' });
  }

  if (stateFromStorageJson) {
    const stateFromStorage = JSON.parse(stateFromStorageJson) as AppState;
    try {
      const patchedState = patchAppState(stateFromStorage, defaultState);

      if (isStateVersionCompatible(patchedState) && doesStateHaveDefaultKeys(patchedState)) {
        return patchedState;
      }
      logger.warn({ event: 'invalidStateFromLocalStorage', state: stateFromStorageJson });
    } catch (e) {
      captureException(e, { level: Severity.Warning });
    }
  }
  return defaultState;
}

function persistState(state: AppState) {
  SessionStorageHelper.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(state));
}

const debouncePersistState = debounce(persistState, 500, {
  leading: true,
  trailing: true,
  maxWait: 1000,
});

function reducerWrapper(state: AppState, action: AppAction) {
  const nextState = rootReducer(state, action);
  debouncePersistState(nextState);
  return nextState;
}

export function redirectIfInvalidState(state: AppState, pathname: string): StateCheckingResponse {
  if (
    typeof Intl === 'undefined' ||
    typeof Intl.NumberFormat === 'undefined' ||
    typeof Intl.DateTimeFormat === 'undefined'
  ) {
    // TODO: Remove this with SC-214
    logger.error({ event: 'IntlUnavailable', source: pathname, invalidState: state });
    return {
      redirectCalled: true,
      readableMessage: 'Safari 9 and lower is not currently supported',
    };
  }

  const isStateValid = validateState(state, pathname);
  const redirect = !isStateValid;

  if (redirect) {
    SessionStorageHelper.removeItem(LOCAL_STORAGE_STATE_KEY);

    window.location.assign(CZEN_BASE_PATH);
  }

  return { redirectCalled: redirect };
}

export function getFlowName(pathname: string, oldFlowName?: string): string {
  let newFlowName = Object.values(FLOWS).find((flow) => pathname.includes(flow.path))?.name;

  if (!newFlowName) {
    // TODO: this shouldn't be needed after SC-123 is implemented
    const isPostAJob = Object.values(POST_A_JOB_ROUTES).some((route) => pathname.includes(route));
    if (isPostAJob) {
      newFlowName = 'SEEKER_POST_A_JOB';
    }
  }

  // Don't allow shifting from in-facility to seeker flow name
  if (newFlowName === FLOWS.SEEKER.name && oldFlowName === FLOWS.SEEKER_IN_FACILITY.name) {
    return FLOWS.SEEKER_IN_FACILITY.name;
  }

  return newFlowName ?? '';
}

function useFlowDetection(dispatch: AppDispatch, oldFlowName: string) {
  const { pathname } = useRouter();
  const newFlowName = getFlowName(pathname, oldFlowName);
  const vertical = getVertical();
  ClientLogger.setLoggerStatics({ flow: newFlowName, vertical });

  useEffect(() => {
    dispatch({ type: 'setFlowName', flowName: newFlowName });

    configureScope((scope) => {
      scope.setTags({
        flow: newFlowName,
        vertical,
      });
    });
  }, [newFlowName]);
}

const AppStateContext = createContext<AppState>(initialAppState);
const AppDispatchContext = createContext<AppDispatch>(() =>
  // eslint-disable-next-line no-console
  console.warn(
    'Calling default dispatch is a no-op! You are probably consuming app dispatch in a component above AppStateProvider'
  )
);

export const AppStateProvider = ({
  children,
  initialStateOverride,
  czenJSessionId,
  referrerCookie,
  userHasAccount,
  memberUuid,
}: AppStateProviderProps) => {
  const hydratedInitialAppState = {
    ...initialAppState,
    flow: {
      ...flowInitialState,
      czenJSessionId,
      referrerCookie,
      userHasAccount,
      memberUuid,
    },
  };
  const featureFlags = useFeatureFlags();
  const sessionStorageRetrievalSuccessEvaluation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SESSION_STORAGE_RETRIEVAL_SUCCESS];
  const shouldMeasureSessionStorageRetrievalSuccess =
    sessionStorageRetrievalSuccessEvaluation?.variationIndex === 1;

  const router = useRouter();

  const logSessionStorageError = () => {
    logger.info({ event: 'sessionStorageStateUnavailable', path: router.pathname });
    AnalyticsHelper.logEvent({
      name: 'sessionStorageStateUnavailable',
    });
  };
  const launchDarklyWrappedGetStateFromStorageOrDefault = (defaultState: AppState) => {
    if (shouldMeasureSessionStorageRetrievalSuccess) {
      try {
        const sessionStorageState = SessionStorageHelper.getItem(LOCAL_STORAGE_STATE_KEY);
        if (sessionStorageState && sessionStorageState.length > 0) {
          const stateFromStorage = JSON.parse(sessionStorageState);
          if (stateFromStorage) {
            logger.info({ event: 'sessionStorageStateAvailable', path: router.pathname });
          } else {
            logSessionStorageError();
          }
        } else {
          logSessionStorageError();
        }
      } catch (_e) {
        logSessionStorageError();
      }
    }
    return getStateFromStorageOrDefault(defaultState);
  };

  const [state, dispatch] = useReducer(
    reducerWrapper,
    initialStateOverride ?? hydratedInitialAppState,
    launchDarklyWrappedGetStateFromStorageOrDefault
  );
  useFlowDetection(dispatch, state.flow.flowName);
  const routePath = router.asPath?.split('?')[0];
  const stateCheckResult = redirectIfInvalidState(state, routePath);
  if (stateCheckResult.redirectCalled) {
    if (stateCheckResult.readableMessage) {
      return (
        <>
          <p>Redirecting to Member Home Page...</p>
          <p>{stateCheckResult.readableMessage}</p>
        </>
      );
    }
    return <></>;
  }

  useEffect(() => {
    trackPageViewInSiftScience(state);
  }, [routePath]);

  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>{children}</AppStateContext.Provider>
    </AppDispatchContext.Provider>
  );
};

AppStateProvider.defaultProps = {
  initialStateOverride: undefined,
  czenJSessionId: undefined,
  referrerCookie: undefined,
  userHasAccount: false,
  memberUuid: undefined,
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);

export const useSeekerState = () => useContext(AppStateContext).seeker;
export const useProviderState = () => useContext(AppStateContext).provider;
export const useProviderCCState = () => useContext(AppStateContext).providerCC;
export const useFlowState = () => useContext(AppStateContext).flow;
export const useSeekerCCState = () => useContext(AppStateContext).seekerCC;
export const useSeekerHKState = () => useContext(AppStateContext).seekerHK;
export const useSeekerPCState = () => useContext(AppStateContext).seekerPC;
export const useSeekerTUState = () => useContext(AppStateContext).seekerTU;
export const useLtcgState = () => useContext(AppStateContext).ltcg;
