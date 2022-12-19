import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { CareDayTimeLabels } from '@/types/seekerCC';

import CareDayTime from '../care-day-time';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const initialState: AppState = {
  ...initialAppState,
};

function renderPage() {
  const pathname = '/seeker/cc/care-day-time';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AppStateProvider initialStateOverride={initialState}>
      <CareDayTime />
    </AppStateProvider>
  );
}

describe('Day care day time', () => {
  it('matches snapshot', () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    renderPage();
    expect(screen.getByText(CareDayTimeLabels.MORNING)).toBeInTheDocument();
    expect(screen.getByText(CareDayTimeLabels.AFTERNOON)).toBeInTheDocument();
    expect(screen.getByText(CareDayTimeLabels.ALLDAY)).toBeInTheDocument();
  });
});
