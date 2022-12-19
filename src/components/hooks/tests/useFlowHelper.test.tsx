import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { renderHook } from '@testing-library/react-hooks';

import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import {
  FLOW_ROUTES_AND_STEP_NUMBERS,
  FLOWS,
  SEEKER_CHILD_CARE_ROUTES,
  SEEKER_DAYCARE_CHILD_CARE_ROUTES,
  SEEKER_ROUTES,
  LTCG_ROUTES,
  CLIENT_FEATURE_FLAGS,
} from '@/constants';
import { AppState } from '@/types/app';
import { ServiceIdsForMember, TimeIntent } from '@/types/seekerCC';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import useFlowHelper from '../useFlowHelper';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);
const defaultState = {
  ...initialStateClone,
  seeker: {
    ...initialStateClone.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
};

let mockRouter: any | null = null;

function renderHookOnPath(pathname: string, state = defaultState, ldFlags: FeatureFlags = {}) {
  mockRouter = {
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return renderHook(useFlowHelper, {
    wrapper: ({ children }) => (
      <FeatureFlagsProvider flags={ldFlags}>
        <AppStateProvider initialStateOverride={state}>{children}</AppStateProvider>
      </FeatureFlagsProvider>
    ),
  });
}

describe('useFlowHelper', () => {
  afterEach(() => {
    mockRouter = null;
  });

  it('should show default total steps for child care flow', () => {
    const state: AppState = {
      ...defaultState,
      flow: {
        ...defaultState.flow,
        flowName: FLOWS.SEEKER_CHILD_CARE.name,
      },
    };
    const totalSteps = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).length - 1;
    const { result } = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.INDEX, state);
    expect(result.current.totalSteps).toEqual(totalSteps);
  });
  it('should set correct currentFlow for senior care in facility flow', () => {
    const state: AppState = {
      ...defaultState,
      flow: {
        ...defaultState.flow,
        flowName: FLOWS.SEEKER.name,
      },
      seeker: {
        ...defaultState.seeker,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };
    const currentFlow = FLOWS.SEEKER_IN_FACILITY.name;
    const { result } = renderHookOnPath(SEEKER_ROUTES.INDEX, state);
    expect(result.current.currentFlow).toEqual(currentFlow);
  });

  describe('child care', () => {
    it('should adjust step number when intent is present and page was skipped', () => {
      const state: AppState = {
        ...defaultState,
        flow: {
          ...defaultState.flow,
          flowName: FLOWS.SEEKER_CHILD_CARE.name,
        },
        seekerCC: {
          ...defaultState.seekerCC,
          czenServiceIdForMember: ServiceIdsForMember.babysitter,
          czenTimeIntent: TimeIntent.withinOneWeek,
        },
      };
      const { result } = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.CARE_WHO, state);
      const routeStep = Object.entries(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).find(
        ([route]) => route === SEEKER_CHILD_CARE_ROUTES.CARE_WHO
      );
      const step = routeStep![1];
      expect(result.current.stepNumber).toEqual(step - 2);
    });

    it('should reduced steps by one when time intent is present', () => {
      const state: AppState = {
        ...defaultState,
        flow: {
          ...defaultState.flow,
          flowName: FLOWS.SEEKER_CHILD_CARE.name,
        },
        seekerCC: {
          ...defaultState.seekerCC,
          czenTimeIntent: TimeIntent.withinOneWeek,
        },
      };
      const totalSteps = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).length - 1;
      const { result } = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.INDEX, state);
      expect(result.current.totalSteps).toEqual(totalSteps - 1);
    });
    it('should reduced daycare steps by two when both kind and time intent are present', () => {
      const state: AppState = {
        ...defaultState,
        flow: {
          ...defaultState.flow,
          flowName: FLOWS.SEEKER_DAYCARE_CHILD_CARE.name,
        },
        seekerCC: {
          ...defaultState.seekerCC,
          czenTimeIntent: TimeIntent.withinOneWeek,
          czenServiceIdForMember: ServiceIdsForMember.babysitter,
        },
      };
      const totalSteps = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_DAYCARE_CHILD_CARE).length;
      const { result } = renderHookOnPath(SEEKER_DAYCARE_CHILD_CARE_ROUTES.WHO, state);
      expect(result.current.totalSteps).toEqual(totalSteps - 4);
    });

    it('should reduced steps by one when kind intent is present', () => {
      const state: AppState = {
        ...defaultState,
        flow: {
          ...defaultState.flow,
          flowName: FLOWS.SEEKER_CHILD_CARE.name,
        },
        seekerCC: {
          ...defaultState.seekerCC,
          czenServiceIdForMember: ServiceIdsForMember.babysitter,
        },
      };
      const totalSteps = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).length - 1;
      const { result } = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.INDEX, state);
      expect(result.current.totalSteps).toEqual(totalSteps - 1);
    });

    it('should reduced steps by two when both kind and time intent are present', () => {
      const state: AppState = {
        ...defaultState,
        flow: {
          ...defaultState.flow,
          flowName: FLOWS.SEEKER_CHILD_CARE.name,
        },
        seekerCC: {
          ...defaultState.seekerCC,
          czenTimeIntent: TimeIntent.withinOneWeek,
          czenServiceIdForMember: ServiceIdsForMember.babysitter,
        },
      };
      const totalSteps = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).length - 1;
      const { result } = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.INDEX, state);
      expect(result.current.totalSteps).toEqual(totalSteps - 2);
    });
  });

  it("shouldn't show total steps for LTCG flow", () => {
    const state: AppState = {
      ...defaultState,
      flow: {
        ...defaultState.flow,
        flowName: FLOWS.LTCG.name,
      },
    };

    const { result } = renderHookOnPath(LTCG_ROUTES.INSURANCE_CARRIER, state);
    expect(result.current.hideStepNumber).toEqual(true);
  });

  it("shouldn't show steps for CC + DC flow and logs test exposure event", () => {
    const logTestExposure = jest.spyOn(AnalyticsHelper, 'logTestExposure');
    const state: AppState = {
      ...defaultState,
      flow: {
        ...defaultState.flow,
        flowName: FLOWS.SEEKER_CHILD_CARE.name,
      },
      seekerCC: {
        ...defaultState.seekerCC,
        czenServiceIdForMember: ServiceIdsForMember.babysitter,
      },
    };

    const mockedFlags = {
      [CLIENT_FEATURE_FLAGS.CC_DC_REMOVE_STEP_COUNTER]: {
        value: 2,
        variationIndex: 0,
        reason: { kind: '' },
      },
    };

    const { result } = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.INDEX, state, mockedFlags);
    expect(result.current.hideStepNumber).toEqual(true);
    expect(logTestExposure).toBeCalledTimes(1);
    expect(logTestExposure.mock.calls[0][0]).toBe(CLIENT_FEATURE_FLAGS.CC_DC_REMOVE_STEP_COUNTER);
  });
});
