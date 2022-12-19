import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { act, renderHook } from '@testing-library/react-hooks';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import useFlowNavigation from '../useFlowNavigation';
import { AppStateProvider } from '../../../AppState';
import { initialAppState } from '../../../../state';
import {
  FLOWS,
  FLOW_ROUTES_AND_STEP_NUMBERS,
  SEEKER_INSTANT_BOOK_ROUTES,
  SEEKER_CHILD_CARE_ROUTES,
} from '../../../../constants';
import { AppState } from '../../../../types/app';
import { TimeIntent } from '../../../../types/seekerCC';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

let mockRouter: any | null = null;

const defaultState = {
  ...initialStateClone,
  seeker: {
    ...initialStateClone.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
};
defaultState.flow.flowName = 'SEEKER_CHILD_CARE';

function renderHookOnPath(pathname: string, state = defaultState, ldFlags: FeatureFlags = {}) {
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return renderHook(useFlowNavigation, {
    wrapper: ({ children }) => (
      <FeatureFlagsProvider flags={ldFlags}>
        <AppStateProvider initialStateOverride={state}>{children}</AppStateProvider>
      </FeatureFlagsProvider>
    ),
  });
}

describe('useFlowNavigation', () => {
  afterEach(() => {
    mockRouter = null;
  });

  it('should call push next page path', () => {
    const routes = Object.entries(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).sort(
      ([, a], [, b]) => a - b
    );
    const path = routes[0][0];
    const nextPath = routes[2][0];
    const utils = renderHookOnPath(path);
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).toHaveBeenCalledWith(nextPath);
  });

  it('should not call push when there is no next page', () => {
    const routes = Object.entries(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).sort(
      ([, a], [, b]) => a - b
    );
    const path = routes[routes.length - 1][0];
    const utils = renderHookOnPath(path);
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should call next care-date page if page is care-location', () => {
    const state: AppState = {
      ...defaultState,
      flow: {
        ...defaultState.flow,
        flowName: FLOWS.SEEKER_CHILD_CARE.name,
      },
    };
    const utils = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.CARE_DATE, state);
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_CHILD_CARE_ROUTES.CARE_KIND);
  });

  it('should call recap screen', () => {
    const utils = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.CARE_WHO);
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/seeker/cc/recap');
  });

  it('should call what day and time screen for INSTANT_BOOKING_CC flow', () => {
    const utils = renderHookOnPath(SEEKER_INSTANT_BOOK_ROUTES.WHO);
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.WHAT_DAY_AND_TIME);
  });

  it('should not call push when route is not part of config', () => {
    const utils = renderHookOnPath('/test');
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should skip care-date when time intent is present', () => {
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
    const utils = renderHookOnPath(SEEKER_CHILD_CARE_ROUTES.INDEX, state);
    act(() => {
      utils.result.current.goNext();
    });
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_CHILD_CARE_ROUTES.CARE_KIND);
  });
});
