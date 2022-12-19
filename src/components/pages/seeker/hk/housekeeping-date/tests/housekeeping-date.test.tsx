import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useAppDispatch } from '@/components/AppState';
import { render, screen } from '@testing-library/react';
import { CARE_DATES, CARE_DATE_LABELS } from '@/constants';
import HousekeepingDatePage from '../housekeeping-date';

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

function renderPage() {
  const pathname = '/seeker/hk/housekeeping-date';
  mockRouter = {
    push: jest.fn(),
    query: {},
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(<HousekeepingDatePage />);
}

describe('HousekeepingDatePage', () => {
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
  it('dispatch a `setHousekeepingDate` action on change housekeeping date', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    renderPage();
    const justBrowsingButton = screen.getByText(CARE_DATE_LABELS.JUST_BROWSING);
    justBrowsingButton.click();

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setHousekeepingDate',
      careDate: CARE_DATES.JUST_BROWSING,
    });
  });
});
