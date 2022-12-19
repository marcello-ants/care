import React from 'react';
import { render } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { cloneDeep } from 'lodash-es';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { CARE_DATES, FLOWS } from '@/constants';
import HousekeepingIndex from '../housekeeping-index';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname' | 'query'>;

const initialStateClone = cloneDeep(initialAppState);

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

function renderPage(intentQueryParam: string = '', appState = initialStateClone) {
  const pathname = '/seeker/hk';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    query: { intent: intentQueryParam },
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={appState}>
      <HousekeepingIndex />
    </AppStateProvider>
  );
}

describe('/seeker/hk', () => {
  it('matches snapshot', () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('dispatch a `setHousekeepingDate` action if `intent` query parameter is provided', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
    const state: AppState = {
      ...initialStateClone,
      flow: {
        ...initialAppState.flow,
        flowName: FLOWS.SEEKER_HOUSEKEEPING.name,
      },
    };

    renderPage('withinmonth', state);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setHousekeepingDate',
      careDate: CARE_DATES.IN_1_2_MONTHS,
    });
  });
});
