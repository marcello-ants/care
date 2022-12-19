import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { render, screen } from '@testing-library/react';
import { CARE_DATES, FLOWS, CARE_DATE_LABELS } from '@/constants';
import { cloneDeep } from 'lodash-es';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import PetCareDatePage from '../care-date';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'query' | 'asPath' | 'pathname'>;

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const initialState = cloneDeep(initialAppState);

function renderPage(intentQueryParam: string = '', appState = initialState) {
  const pathname = '/seeker/pc/care-date';
  mockRouter = {
    push: jest.fn(),
    query: { intent: intentQueryParam },
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={appState}>
      <PetCareDatePage />
    </AppStateProvider>
  );
}

describe('PetCareDatePage', () => {
  it('matches snapshot', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    renderPage();

    expect(screen.getByText(CARE_DATE_LABELS.IN_1_2_MONTHS)).toBeInTheDocument();
    expect(screen.getByText(CARE_DATE_LABELS.JUST_BROWSING)).toBeInTheDocument();
    expect(screen.getByText(CARE_DATE_LABELS.RIGHT_NOW)).toBeInTheDocument();
    expect(screen.getByText(CARE_DATE_LABELS.WITHIN_A_WEEK)).toBeInTheDocument();
  });

  it('routes to next page when clicking next button', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Next' });

    nextButton.click();

    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('dispatch a `setCareDate` action on change pet care date', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    renderPage();
    const justBrowsingButton = screen.getByText(CARE_DATE_LABELS.JUST_BROWSING);
    justBrowsingButton.click();

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setPetCareDate',
      careDate: CARE_DATES.JUST_BROWSING,
    });
  });

  it('dispatch a `setCareDate` action if `intent` query parameter is provided', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
    const state: AppState = {
      ...initialState,
      flow: {
        ...initialAppState.flow,
        flowName: FLOWS.SEEKER_PET_CARE.name,
      },
    };
    renderPage('withinweek', state);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setPetCareDate',
      careDate: CARE_DATES.WITHIN_A_WEEK,
    });
  });
});
