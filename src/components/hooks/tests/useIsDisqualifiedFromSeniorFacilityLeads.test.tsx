import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { renderHook } from '@testing-library/react-hooks';

import { SeniorCarePaymentSource, SeniorCareRecipientCondition } from '@/__generated__/globalTypes';

import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import useIsDisqualifiedFromSeniorFacilityLeads from '@/components/hooks/useIsDisqualifiedFromSeniorFacilityLeads';
import { AppStateProvider } from '@/components/AppState';
import { SEEKER_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { HelpType, PaymentTypeOptions } from '@/types/seeker';
import logger from '@/lib/clientLogger';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const loggerInfoMock = jest.fn();

const initialStateClone = cloneDeep(initialAppState);
const defaultState = {
  ...initialStateClone,
  flow: {
    ...initialStateClone.flow,
    userHasAccount: false,
  },
  seeker: {
    ...initialStateClone.seeker,
    paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
  },
};

let mockRouter: any | null = null;

function renderHookWithState(state: AppState = defaultState, ldFlags: FeatureFlags = {}) {
  mockRouter = {
    asPath: SEEKER_ROUTES.INDEX,
    pathname: SEEKER_ROUTES.INDEX,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return renderHook(useIsDisqualifiedFromSeniorFacilityLeads, {
    wrapper: ({ children }) => (
      <FeatureFlagsProvider flags={ldFlags}>
        <AppStateProvider initialStateOverride={state}>{children}</AppStateProvider>
      </FeatureFlagsProvider>
    ),
  });
}

describe('useIsDisqualifiedFromSeniorFacilityLeads', () => {
  beforeAll(() => {
    logger.info = loggerInfoMock;
  });
  afterEach(() => {
    mockRouter = null;
    loggerInfoMock.mockReset();
  });

  it('should not return disqualified if no disqualifying information is selected', () => {
    const utils = renderHookWithState(defaultState);
    expect(utils.result.current).toEqual(false);
  });

  it('should return disqualified if GOVERNMENT paymentType & no paymentDetailTypes', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        paymentType: PaymentTypeOptions.GOVERNMENT,
        paymentDetailTypes: [],
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromSeniorFacilityLeads',
      isNursingFacilityNeeded: false,
      isDisqualifiedForBudget: true,
    });
  });

  it('should return disqualified if HELP paymentType & OTHER paymentDetailTypes is selected', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        paymentType: PaymentTypeOptions.HELP,
        paymentDetailTypes: [SeniorCarePaymentSource.OTHER],
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromSeniorFacilityLeads',
      isNursingFacilityNeeded: false,
      isDisqualifiedForBudget: true,
    });
  });

  it('should return disqualified if only GOVERNMENT_HEALTH_PROGRAM in detail view is selected', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        paymentType: PaymentTypeOptions.PRIVATE,
        paymentDetailTypes: [SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM],
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromSeniorFacilityLeads',
      isNursingFacilityNeeded: false,
      isDisqualifiedForBudget: true,
    });
  });

  it('should return disqualified if user requires nursing facility options', () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        condition: SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(true);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'isDisqualifiedFromSeniorFacilityLeads',
      isNursingFacilityNeeded: true,
      isDisqualifiedForBudget: false,
    });
  });

  it("should not return disqualified if user doesn't requires nursing facility options", () => {
    const state: AppState = {
      ...defaultState,
      seeker: {
        ...defaultState.seeker,
        helpTypes: [HelpType.COMPANIONSHIP],
        condition: SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
      },
    };
    const utils = renderHookWithState(state);
    expect(utils.result.current).toEqual(false);
  });
});
