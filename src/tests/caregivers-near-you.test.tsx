// External dependencies
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';

// Internal dependencies
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';
import useSeniorCarePreRateCardRedirect from '@/components/hooks/useSeniorCarePreRateCardRedirect';

import * as getTopCaregiversHelper from '@/components/pages/seeker/sc/getTopCaregiversHelper';
import * as leadAndConnectHelper from '@/utilities/leadAndConnectHelper';
import CaregiversNearYou from '../pages/caregivers-near-you';
import { AppStateProvider } from '../components/AppState';
import { initialAppState } from '../state';
import { topCaregiversMock, topCaregiversMockNoResults } from './mocks';

// Mocks
const generateLeadConnectMfeSessionStateMock = jest.spyOn(
  leadAndConnectHelper,
  'generateLeadConnectMfeSessionState'
);
const generateInputAndCallGetTopCaregiversMock = jest.spyOn(
  getTopCaregiversHelper,
  'generateInputAndCallGetTopCaregivers'
);
const generateSCTestAwareGetTopCaregiversInputMock = jest.spyOn(
  getTopCaregiversHelper,
  'generateSCTestAwareGetTopCaregiversInput'
);
const goToPreRateCardMock = jest.fn();
jest.mock('@/components/hooks/useSeniorCarePreRateCardRedirect', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    goToPreRateCard: goToPreRateCardMock,
    preRateCardURL: '/pre-ratecard-url',
  })),
}));
const useSeniorCarePreRateCardRedirectMock = useSeniorCarePreRateCardRedirect as jest.Mock;

jest.mock('@/constants', () => {
  const originalConstants = jest.requireActual('@/constants');

  return {
    __esModule: true,
    ...originalConstants,
    CAREGIVERS_NEAR_YOU_REDIRECTION_TIMEOUT: 0,
  };
});

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: 'CZEN_URL',
    },
  };
});

jest.mock('@/utilities/analyticsHelper', () => {
  const original = jest.requireActual('@/utilities/analyticsHelper');

  return {
    __esModule: true,
    ...original,
    AnalyticsHelper: {
      ...original.AnalyticsHelper,
      logTestExposure: jest.fn(),
    },
  };
});

const initialStateClone = cloneDeep(initialAppState);
const initialStateOverrideWithZip = {
  ...initialStateClone,
  seeker: {
    ...initialStateClone.seeker,
    jobPost: {
      ...initialStateClone.seeker.jobPost,
      jobPostSuccessful: true,
      zip: '10004',
    },
  },
};

const controlLCFlagState: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.LEAD_CONNECT_PROVIDER_NETWORK]: {
    value: 0,
    variationIndex: 0,
    reason: {
      kind: 'control',
    },
  },
  [CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION]: {
    value: false,
    variationIndex: 1,
    reason: {
      kind: 'RULE_MATCH',
    },
  },
};

const skipLoginFFVariation: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION]: {
    value: true,
    variationIndex: 2,
    reason: {
      kind: 'RULE_MATCH',
    },
  },
};

let mockRouter = null;

function renderView(mocks: any, initialFlagState: FeatureFlags = {}) {
  return render(
    <FeatureFlagsProvider flags={initialFlagState}>
      <MockedProvider mocks={mocks}>
        <AppStateProvider initialStateOverride={initialStateOverrideWithZip}>
          <CaregiversNearYou />
        </AppStateProvider>
      </MockedProvider>
    </FeatureFlagsProvider>,
    {}
  );
}

const windowLocationAssignMock = jest.fn();

describe('Caregivers Near You page', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      href: 'CZEN_URL/app/enrollment/caregivers-near-you',
      assign: windowLocationAssignMock,
    };
    jest.spyOn(AnalyticsHelper, 'logEvent');
    jest.spyOn(AnalyticsHelper, 'logTestExposure');
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderView([topCaregiversMock(10, false)]);

    await screen.findByText('Top caregivers in your area');

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot - no results', async () => {
    const { asFragment } = renderView([topCaregiversMockNoResults(10, false)]);

    await screen.findByText('Your job needs have been shared!');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call useSeniorCarePreRateCardRedirectMock', async () => {
    renderView([topCaregiversMock(10, false)], controlLCFlagState);

    await screen.findByText('Top caregivers in your area');

    expect(useSeniorCarePreRateCardRedirectMock).toBeCalledWith({
      query: { enrollFlow: 'true' },
      skipLogin: false,
    });
  });

  it('calls goToPreRateCard when Upgrade - autoskip', async () => {
    renderView([topCaregiversMock(10, false)], controlLCFlagState);

    await screen.findByText('Top caregivers in your area');

    await waitFor(() => {
      expect(logger.info).toBeCalledWith({
        event: 'PreRateCardRedirection',
        isFlagEnabled: false,
        currentPageURL: 'CZEN_URL/app/enrollment/caregivers-near-you',
        redirectsTo: '/pre-ratecard-url',
      });
    });
    expect(goToPreRateCardMock).toHaveBeenCalledWith();
  });

  it('should call generateInputAndCallGetTopCaregivers', async () => {
    renderView([topCaregiversMock(10, false)], controlLCFlagState);

    await screen.findByText('Top caregivers in your area');

    expect(generateInputAndCallGetTopCaregiversMock).toHaveBeenCalledWith(
      0,
      {
        helpTypes: [],
        rate: { legalMinimum: 8, maximum: 22, minimum: 14 },
        zipcode: '10004',
      },
      expect.any(Function),
      10,
      undefined
    );
  });

  it('should call generateSCTestAwareGetTopCaregiversInput', async () => {
    renderView([topCaregiversMock(10, false)], controlLCFlagState);

    await screen.findByText('Top caregivers in your area');

    expect(generateSCTestAwareGetTopCaregiversInputMock).toHaveBeenCalledWith(
      0,
      {
        helpTypes: [],
        rate: { legalMinimum: 8, maximum: 22, minimum: 14 },
        zipcode: '10004',
      },
      10,
      undefined
    );
  });

  it('should call generateLeadConnectMfeSessionState', async () => {
    renderView([topCaregiversMock(10, false)], controlLCFlagState);

    await screen.findByText('Top caregivers in your area');

    expect(generateLeadConnectMfeSessionStateMock).toHaveBeenCalledWith(
      {
        zipcode: '10004',
        serviceID: 'SENIOR_CARE',
        numResults: 10,
        hourlyRate: null,
        hasCareCheck: true,
        qualities: null,
        services: null,
        maxDistanceFromSeeker: { unit: 'MILES', value: 10 },
        hasApprovedActivePhoto: undefined,
        enableFuzzySearch: undefined,
        daysSinceLastActive: undefined,
        isActiveAccount: undefined,
        minimumAvgReviewRating: undefined,
      },
      { minimum: 14, maximum: 22, legalMinimum: 8 },
      [],
      'COMPANION',
      'PARENT'
    );
  });

  it('should fire test exposure event and log "PreRateCardRedirection" in splunk - A/B Test - skip-login-in-ratecard-redirection', async () => {
    renderView([topCaregiversMock(10, false)], skipLoginFFVariation);

    await screen.findByText('Top caregivers in your area');

    expect(AnalyticsHelper.logTestExposure).toHaveBeenCalledWith(
      'skip-login-in-ratecard-redirection',
      { reason: { kind: 'RULE_MATCH' }, value: true, variationIndex: 2 }
    );

    await waitFor(() => {
      expect(logger.info).toBeCalledWith({
        event: 'PreRateCardRedirection',
        isFlagEnabled: true,
        currentPageURL: 'CZEN_URL/app/enrollment/caregivers-near-you',
        redirectsTo: '/pre-ratecard-url',
      });
    });

    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
