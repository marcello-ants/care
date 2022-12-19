/* istanbul ignore next */
import {
  Config,
  EventPayload,
  logEvent as _logEvent,
  init,
  setUserProps,
  getInstance,
} from '@care/analytics';
import dayjs from 'dayjs';
import getConfig from 'next/config';
import logger from '@/lib/clientLogger';
import { CLIENT_SIDE_ERROR_TAG } from '@/constants';
import { captureException, configureScope } from '@sentry/nextjs';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { getCzenVisitorId, getCzenSessionId } from './czenCookiesHelper';
import getVertical from './verticalUtils';

const { publicRuntimeConfig } = getConfig();

export const AMPLITUDE_DATE_FORMAT = 'MMDDYYYY';
export const AMPLITUDE_TIME_FORMAT = 'hh:mm A';

let initialized = false;

/* istanbul ignore next */
function getCommonData() {
  const commonData: any = {
    job_flow: 'MW VHP enrollment',
    web_platform: window.innerWidth < 600 ? 'Mobile Web' : 'Desktop',
  };

  const czenSessionId = getCzenSessionId();
  if (czenSessionId) {
    commonData.czen_session_id = czenSessionId;
  }

  const czenVisitorId = getCzenVisitorId();
  if (czenVisitorId) {
    commonData.visitor_id = czenVisitorId;
  }

  return commonData;
}

const initialize = () => {
  if (!initialized) {
    const careAnalyticsConfig: Config = {
      analyticsEnabled: publicRuntimeConfig.ANALYTICS_ENABLED === 'true',
      key: publicRuntimeConfig.AMPLITUDE_API_KEY,
      commonData: getCommonData(),
    };
    init(careAnalyticsConfig);
    initialized = true;

    const amplitudeSessionId = getInstance()?.getSessionId();
    if (amplitudeSessionId) {
      configureScope((scope) => {
        const user = scope.getUser();
        scope.setUser({
          ...user,
          amplitudeSessionId,
        });
      });

      if (window.SplunkRum) {
        window.SplunkRum.setGlobalAttributes({
          'enduser.amplitudeSessionId': amplitudeSessionId,
        });
      }
    }
  }
};

interface AnalyticsHelperPayload extends EventPayload {
  vertical?: string;
}

export namespace AnalyticsHelper {
  /* istanbul ignore next */
  export const logEvent = (payload: AnalyticsHelperPayload) => {
    try {
      initialize();
      _logEvent({
        name: payload.name,
        data: { vertical: getVertical(), ...payload.data },
      });
    } catch (e: any) {
      logger.error({ error: e, tags: [CLIENT_SIDE_ERROR_TAG] });
      /* istanbul ignore next */
      captureException(e);
    }
  };

  /* istanbul ignore next */
  export const setDefaultUserProps = (careDeviceId: string) => {
    try {
      initialize();
      const userProps: any = {};
      const czenSessionId = getCzenSessionId();
      if (czenSessionId) {
        userProps.czen_session_id = czenSessionId;
      }
      const czenVisitorId = getCzenVisitorId();
      if (czenVisitorId) {
        userProps.visitor_id = czenVisitorId;
      }
      userProps.care_device_id = careDeviceId;
      setUserProps({
        props: userProps,
      });
    } catch (e: any) {
      logger.error({ error: e, tags: [CLIENT_SIDE_ERROR_TAG] });
      captureException(e);
    }
  };

  /* istanbul ignore next */
  export const setMemberId = (memberId: string) => {
    try {
      initialize();
      setUserProps({
        memberId: memberId || undefined,
      });
    } catch (e: any) {
      logger.error({ error: e, tags: [CLIENT_SIDE_ERROR_TAG] });
      captureException(e);
    }
  };

  /* istanbul ignore next */
  export const logTestExposure = (testName: string, evaluationDetail: FeatureFlags[string]) => {
    if (!evaluationDetail) return;

    // only log the exposure if the user matched the flag's inclusion rules,
    // in which case we also know that we have a non-null variationIndex since LD requires a variation
    // to be specified for each rule
    const loggableTestExposureReasons = ['RULE_MATCH', 'OVERRIDE'];
    if (loggableTestExposureReasons.includes(evaluationDetail.reason?.kind)) {
      AnalyticsHelper.logEvent({
        name: 'Test Exposure',
        data: {
          test_name: testName,
          test_variant: evaluationDetail.variationIndex!.toString(),
        },
      });
    }
  };

  /* istanbul ignore next */
  export const logScreenViewed = async (screenName: string, source: string) => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        screen_name: screenName,
        source,
      },
    });
  };
}

export const formatAmplitudeDate = (date: string | null) => {
  if (date == null) return '';
  return dayjs(date).format(AMPLITUDE_DATE_FORMAT);
};

export const formatAmplitudeTime = (time: string) => {
  const [hour, minute] = time.split(':');
  return dayjs().hour(Number(hour)).minute(Number(minute)).format(AMPLITUDE_TIME_FORMAT);
};
