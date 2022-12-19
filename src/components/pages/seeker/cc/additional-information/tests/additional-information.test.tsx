import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { initialAppState } from '../../../../../../state';
import { AppStateProvider } from '../../../../../AppState';
import { AppState } from '../../../../../../types/app';

import CareFrequency from '../additional-information';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const initialState: AppState = {
  ...initialAppState,
};

describe('Additional information about child', () => {
  let asFragment: any | null = null;
  function renderPage() {
    const pathname = '/seeker/cc/additional-information';
    mockRouter = {
      push: jest.fn(),
      asPath: pathname,
      pathname,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    const view = render(
      <AppStateProvider initialStateOverride={initialState}>
        <CareFrequency />
      </AppStateProvider>
    );
    ({ asFragment } = view);
  }
  it('matches snapshot', () => {
    renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('additional information display next when field has no data (next always active)', async () => {
    renderPage();
    const description = screen.getByRole('textbox');

    fireEvent.change(description, {
      target: { value: '' },
    });

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeEnabled());
  });
});
