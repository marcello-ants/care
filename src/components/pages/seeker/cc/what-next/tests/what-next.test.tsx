// External Dependencies
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';

// Internal Dependencies
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { AppStateProvider } from '@/components/AppState';

import WhatNext from '../what-next';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: '/',
    },
  };
});

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const initialState: AppState = {
  ...initialAppState,
};

function renderPage() {
  const pathname = '/seeker/cc/what-next';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={initialState}>
      <WhatNext />
    </AppStateProvider>
  );
}

describe('Seeker - Child Care - Attributes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', async () => {
    const view = renderPage();
    const nextButton = screen.getByRole('button', { name: 'Got it' });
    await waitFor(() => expect(nextButton).toBeEnabled());

    expect(view.asFragment()).toMatchSnapshot();
  });
});
