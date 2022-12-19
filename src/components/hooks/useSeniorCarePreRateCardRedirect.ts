// External dependencies
import getConfig from 'next/config';
import { useMemo } from 'react';

// Internal dependencies
import { CLIENT_FEATURE_FLAGS, VERTICALS_NAMES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import Logger from '@/lib/clientLogger';
import useFeatureFlag from './useFeatureFlag';

// Types & Interfaces
interface Options {
  query?: Record<string, string>;
  skipLogin: boolean;
}

// Constants
const FALLBACK_VARIANT = {
  contentUrl: '/app/ratecard/seniorcare/pre-rate-card',
  variantId: 'failure_default',
};

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

function useSeniorCarePreRateCardRedirect({ query, skipLogin }: Options) {
  const preRateCardFlag = useFeatureFlag(CLIENT_FEATURE_FLAGS.SEEKER_PRE_RATE_CARD);

  const { contentUrl, variantId } =
    (preRateCardFlag as TPreRateCardFlag)?.value || FALLBACK_VARIANT;

  const preRateCardURL = useMemo(() => {
    let queries = Object.keys(query ?? {}).reduce((str, key) => `${str}&${key}=${query![key]}`, '');

    queries = contentUrl.includes('?') ? queries : queries.replace('&', '?');
    let url = `${CZEN_GENERAL}${contentUrl}${queries}`;

    if (!skipLogin) {
      url = `${CZEN_GENERAL}/vis/auth/login?forwardUrl=${encodeURIComponent(url)}`;
    }

    return url;
  }, [contentUrl, query, skipLogin]);

  const goToPreRateCard = () => {
    AnalyticsHelper.logEvent({
      name: 'Test Exposure',
      data: {
        test_name: CLIENT_FEATURE_FLAGS.SEEKER_PRE_RATE_CARD,
        test_variant: variantId,
      },
    });

    if (variantId === FALLBACK_VARIANT.variantId) {
      Logger.warn({
        key: 'SeekerPreRatecardEvaluationFailure',
        source: 'useSeniorCarePreRateCardRedirect.ts',
        message: 'redirecting to fallback variant due to a failure with LaunchDarkly',
        vertical: VERTICALS_NAMES.SENIOR_CARE,
        flagEvaluation: preRateCardFlag,
        fallbackVariant: FALLBACK_VARIANT,
      });
    }

    window.location.assign(preRateCardURL);
  };

  return {
    preRateCardURL,
    goToPreRateCard,
  };
}

export default useSeniorCarePreRateCardRedirect;
