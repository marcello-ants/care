// External Dependencies
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

import { AppStateProvider } from '@/components/AppState';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';

import AboutPets from '../about-pets';
import { GENERAL_ERROR_MESSAGE } from '../aboutPetsForm';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const initialState: AppState = {
  ...initialAppState,
};

function renderPage(state?: AppState) {
  const pathname = '/seeker/pc/about-pets';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <ThemeProvider theme={theme}>
      <AppStateProvider initialStateOverride={state || initialState}>
        <AboutPets />
      </AppStateProvider>
    </ThemeProvider>
  );
}

describe('Seeker - Pet Care - About Pets', () => {
  it('matches snapshot', async () => {
    const view = renderPage();

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('shows error if total pets number is equal to 0', async () => {
    renderPage();

    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    const error = await screen.findByText(GENERAL_ERROR_MESSAGE);
    expect(error).toBeInTheDocument();
  });

  it('shows no error if total pets number is greater than 0', () => {
    const state: AppState = {
      ...initialAppState,
      seekerPC: {
        ...initialAppState.seekerPC,
        pets: { dogs: 1, cats: 0, other: 0 },
      },
    };
    renderPage(state);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    const error = screen.queryByText(GENERAL_ERROR_MESSAGE);
    expect(error).not.toBeInTheDocument();
  });
});
