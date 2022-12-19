import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

import { AppStateProvider } from '@/components/AppState';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

import {
  SeniorCarePaymentSource,
  SeniorCareRecipientCondition,
  SENIOR_CARE_TYPE,
} from '@/__generated__/globalTypes';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { SeniorLivingOptions, WhenLookingToMoveIntoCommunity } from '@/types/seeker';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';

import Recap from '../recap';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.useFakeTimers();

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '90001',
    city: 'Los Angeles',
    state: 'CA',
    typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
  },
};

describe('Infacility Recap page', () => {
  let mockRouter: any = null;

  const renderComponent = (initialInnerState: AppState, flags: FeatureFlags = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <FeatureFlagsProvider flags={flags}>
          <AppStateProvider initialStateOverride={initialInnerState}>
            <Recap />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/seeker/sc',
      asPath: '/seeker/sc',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    jest.clearAllMocks();
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent(initialState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('routes to the account creation page', () => {
    renderComponent(initialState);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/seeker/sc/in-facility/account-creation');
  });

  it('routes to /community-list when user has an account and there is inventory', () => {
    const appState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        assistedLivingCenterFacilityCount: 6,
      },
      flow: {
        ...initialState.flow,
        userHasAccount: true,
      },
    };
    renderComponent(appState);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST);
  });

  it('routes to /caring-leads when user has an account and there is no inventory', () => {
    const appState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        assistedLivingCenterFacilityCount: 0,
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        caringFacilityCountNearBy: 3,
        whenLookingToMove: WhenLookingToMoveIntoCommunity.IMMEDIATELY,
      },
      flow: {
        ...initialState.flow,
        userHasAccount: true,
      },
    };
    renderComponent(appState);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.CARING_LEADS);
  });

  it('should get text strings with correct values if city and state are NOT empty for in Facility', () => {
    const invalidState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    renderComponent(invalidState);
    expect(screen.getByText('In Los Angeles, CA')).toBeInTheDocument();
  });

  it('should get text strings with correct values if city and state are NOT empty for nth day in facility', () => {
    const invalidState: AppState = {
      ...initialState,
      flow: { ...initialAppState.flow, userHasAccount: true, memberId: '12345' },
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    renderComponent(invalidState);
    expect(
      screen.getByText('Looking for assisted living communities near Los Angeles, CA...')
    ).toBeInTheDocument();
  });

  it('should get the correct text if there is already a recommendation in the state', () => {
    const customState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
        recommendedHelpType: SeniorLivingOptions.MEMORY_CARE,
      },
    };

    renderComponent(customState);
    expect(screen.getByText('In Los Angeles, CA')).toBeInTheDocument();
  });
  it('should get the correct text if there is already a recommendation in the state for nth day in facility', () => {
    const customState: AppState = {
      ...initialState,
      flow: { ...initialAppState.flow, userHasAccount: true, memberId: '12345' },
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
        recommendedHelpType: SeniorLivingOptions.MEMORY_CARE,
      },
    };

    renderComponent(customState);
    expect(
      screen.getByText('Looking for memory care communities near Los Angeles, CA...')
    ).toBeInTheDocument();
  });

  it('should display word you when there is no city', () => {
    const invalidState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        city: '',
        state: '',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    renderComponent(invalidState);
    expect(screen.getByText('In your area')).toBeInTheDocument();
  });
  it('should display word you when there is no city for nth day in facility', () => {
    const invalidState: AppState = {
      ...initialState,
      flow: { ...initialAppState.flow, userHasAccount: true, memberId: '12345' },
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        city: '',
        state: '',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    renderComponent(invalidState);
    expect(
      screen.getByText('Looking for assisted living communities near you...')
    ).toBeInTheDocument();
  });

  it('should render In-Facility Senior Living Preview', () => {
    const invalidState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        city: '',
        state: '',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    renderComponent(invalidState);
    act(() => {
      jest.runAllTimers();
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/seeker/sc/in-facility/account-creation');
  });

  describe('InFacility recap page FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations', () => {
    const appState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    const flag: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        variationIndex: 1,
        value: 'variant',
        reason: { kind: '' },
      },
    };

    it('Should render correctly', () => {
      renderComponent(appState, flag);
      expect(screen.getByText(/Thanks for sharing!/)).toBeInTheDocument();
      expect(
        screen.getByText('We’re looking for assisted living communities near Los Angeles, CA...')
      ).toBeInTheDocument();
    });

    it('Should route to /account-creation', () => {
      renderComponent(appState, flag);
      act(() => {
        jest.runAllTimers();
      });
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION);
    });
  });
});
