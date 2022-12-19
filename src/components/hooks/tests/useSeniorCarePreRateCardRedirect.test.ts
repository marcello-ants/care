// External dependencies
import { renderHook } from '@testing-library/react-hooks';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';

// Internal dependencies
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { setupWindowLocation } from '@/__setup__/testUtil';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import Logger from '@/lib/clientLogger';
import useSeniorCarePreRateCardRedirect from '../useSeniorCarePreRateCardRedirect';
import useFeatureFlag from '../useFeatureFlag';

// Mocks
jest.mock('../useFeatureFlag');
const useFeatureFlagMock = useFeatureFlag as jest.Mock;
jest.mock('@/utilities/analyticsHelper', () => ({
  __esModule: true,
  AnalyticsHelper: { logEvent: jest.fn() },
}));

const LogWarninigMock = jest.spyOn(Logger, 'warn');

const PRE_RATE_CARD_URL = '/app/ratecard/seniorcare/pre-rate-card';

const controlFFMock = {
  reason: {
    kind: 'RULE_MATCH',
  },
  value: {
    contentUrl: PRE_RATE_CARD_URL,
    variantId: 'sc-control',
  },
  variationIndex: 1,
} as LDEvaluationDetail;

describe('useSeniorCarePreRateCardRedirect', () => {
  let windowLocation: ReturnType<typeof setupWindowLocation>;

  const query = {
    enrollFlow: 'true',
  };

  beforeAll(() => {
    useFeatureFlagMock.mockReturnValue(controlFFMock);

    windowLocation = setupWindowLocation();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    windowLocation.cleanUp();
  });

  it('should fire test exposure event when executing goToPreRateCardURL', () => {
    const { result } = renderHook(() =>
      useSeniorCarePreRateCardRedirect({ query, skipLogin: true })
    );
    const { goToPreRateCard } = result.current;

    goToPreRateCard();

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Test Exposure',
      data: {
        test_name: 'seeker-pre-ratecard',
        test_variant: 'sc-control',
      },
    });
  });

  it('should redirect directly to pre-rate-card when skipLogin is true', () => {
    const { result } = renderHook(() =>
      useSeniorCarePreRateCardRedirect({ query, skipLogin: true })
    );
    const { goToPreRateCard, preRateCardURL } = result.current;

    goToPreRateCard();

    const expectedURL = 'CZEN_GENERAL/app/ratecard/seniorcare/pre-rate-card?enrollFlow=true';
    expect(preRateCardURL).toBe(expectedURL);
    expect(window.location.assign).toHaveBeenCalledWith(expectedURL);
  });

  it('should redirect to pre-rate-card using the auth flow when skipLogin is false', () => {
    const { result } = renderHook(() =>
      useSeniorCarePreRateCardRedirect({ query, skipLogin: false })
    );
    const { goToPreRateCard, preRateCardURL } = result.current;

    goToPreRateCard();

    const expectedURL =
      'CZEN_GENERAL/vis/auth/login?forwardUrl=CZEN_GENERAL%2Fapp%2Fratecard%2Fseniorcare%2Fpre-rate-card%3FenrollFlow%3Dtrue';
    expect(preRateCardURL).toBe(expectedURL);
    expect(window.location.assign).toHaveBeenCalledWith(expectedURL);
  });

  it('should use fallback variant if launch darkly does not return a value', () => {
    useFeatureFlagMock.mockReturnValue({
      [CLIENT_FEATURE_FLAGS.SEEKER_PRE_RATE_CARD]: {
        reason: {
          kind: 'ERROR',
        },
        value: null,
        variationIndex: null,
      },
    });

    const { result } = renderHook(() =>
      useSeniorCarePreRateCardRedirect({ query, skipLogin: true })
    );
    const { goToPreRateCard, preRateCardURL } = result.current;

    goToPreRateCard();

    const expectedURL = 'CZEN_GENERAL/app/ratecard/seniorcare/pre-rate-card?enrollFlow=true';
    expect(preRateCardURL).toBe(expectedURL);
    expect(window.location.assign).toHaveBeenCalledWith(expectedURL);

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Test Exposure',
      data: {
        test_name: 'seeker-pre-ratecard',
        test_variant: 'failure_default',
      },
    });

    expect(LogWarninigMock).toBeCalledWith({
      flagEvaluation: {
        'seeker-pre-ratecard': { reason: { kind: 'ERROR' }, value: null, variationIndex: null },
      },
      key: 'SeekerPreRatecardEvaluationFailure',
      message: 'redirecting to fallback variant due to a failure with LaunchDarkly',
      source: 'useSeniorCarePreRateCardRedirect.ts',
      vertical: 'Seniorcare',
      fallbackVariant: {
        contentUrl: '/app/ratecard/seniorcare/pre-rate-card',
        variantId: 'failure_default',
      },
    });
  });
});
