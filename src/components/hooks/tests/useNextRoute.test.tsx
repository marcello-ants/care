import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { renderHook } from '@testing-library/react-hooks';
import { initialAppState } from '@/state';
import { SEEKER_ROUTES, SEEKER_HOUSEKEEPING_ROUTES } from '@/constants';
import { AppState } from '@/types/app';
import { AppStateProvider } from '@/components/AppState';
import useNextRoute from '../useNextRoute';

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

function renderHookOnPath(pathname: string, state = defaultState) {
  mockRouter = {
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return renderHook(useNextRoute, {
    wrapper: ({ children }) => (
      <AppStateProvider initialStateOverride={state}>{children}</AppStateProvider>
    ),
  });
}

describe('useNextRoute', () => {
  afterEach(() => {
    mockRouter = null;
  });

  describe('w/o test flag', () => {
    it('should direct to help type page', () => {
      const state: AppState = {
        ...defaultState,
        seeker: {
          ...defaultState.seeker,
        },
      };

      const utils = renderHookOnPath(SEEKER_ROUTES.INDEX, state);
      expect(utils.result.current.nextRoute).toEqual('/seeker/sc/help-type');
    });

    it('should direct to next different index', () => {
      const state: AppState = {
        ...defaultState,
        seeker: {
          ...defaultState.seeker,
        },
      };
      const utils = renderHookOnPath(SEEKER_HOUSEKEEPING_ROUTES.INDEX, state);
      expect(utils.result.current.nextRoute).not.toEqual('/seeker/hk/housekeeping-date');

      expect(utils.result.current.nextRoute).toEqual('/seeker/hk/housekeeper-what');
    });
  });
});
