import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { renderHook } from '@testing-library/react-hooks';

import { SeniorCarePaymentSource } from '@/__generated__/globalTypes';
import { SEEKER_ROUTES } from '@/constants';

import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { PaymentTypeOptions, WhenLookingToMoveIntoCommunity } from '@/types/seeker';
import logger from '@/lib/clientLogger';
import useIsDisqualifiedFromCaringLeads from '../useIsDisqualifiedFromCaringLeads';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const loggerInfoMock = jest.fn();

const initialStateClone = cloneDeep(initialAppState);
const defaultState = {
  ...initialStateClone,
  seeker: {
    ...initialStateClone.seeker,
    paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
    caringFacilityCountNearBy: 12,
  },
};

let mockRouter: any | null = null;

function renderHookWithState(state: AppState = defaultState, ldFlags: FeatureFlags = {}) {
  mockRouter = {
    asPath: SEEKER_ROUTES.INDEX,
    pathname: SEEKER_ROUTES.INDEX,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return renderHook(useIsDisqualifiedFromCaringLeads, {
    wrapper: ({ children }) => (
      <FeatureFlagsProvider flags={ldFlags}>
        <AppStateProvider initialStateOverride={state}>{children}</AppStateProvider>
      </FeatureFlagsProvider>
    ),
  });
}

describe('useIsDisqualifiedFromCaringLeads', () => {
  beforeAll(() => {
    logger.info = loggerInfoMock;
  });
  afterEach(() => {
    mockRouter = null;
  });

  it('should not return disqualified if no disqualifying information is selected', () => {
    const utils = renderHookWithState(defaultState);
    expect(utils.result.current).toEqual(false);
  });

  it('should return disqualified when disqualified from Senior Facility Leads', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.OTHER],
        paymentType: PaymentTypeOptions.GOVERNMENT,
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromCaringLeads',
      isDisqualifiedFromSeniorFacilityLeads: true,
      noCaringFacility: false,
      lookingToMoveIntoCommunityInTwelveMonths: false,
    });
  });
  it('should return disqualified when Caring Facility Count Nearby is 0', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
        caringFacilityCountNearBy: 0,
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromCaringLeads',
      isDisqualifiedFromSeniorFacilityLeads: false,
      noCaringFacility: true,
      lookingToMoveIntoCommunityInTwelveMonths: false,
    });
  });
  it('should return disqualified when 12+ months is selected', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
        whenLookingToMove: WhenLookingToMoveIntoCommunity.TWELVE_MONTHS,
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromCaringLeads',
      isDisqualifiedFromSeniorFacilityLeads: false,
      noCaringFacility: false,
      lookingToMoveIntoCommunityInTwelveMonths: true,
    });
  });
});
