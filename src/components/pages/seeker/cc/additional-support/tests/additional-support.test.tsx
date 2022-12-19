// External Dependencies
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';

// Internal Dependencies
import AdditionalSupport from '../additional-support';
import { AppStateProvider } from '../../../../../AppState';
import { initialAppState } from '../../../../../../state';
import { AppState } from '../../../../../../types/app';

// Data

const TEST_DATA_SUCCESS_ZIP_CODE = '91911';

// Mocks

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: TEST_DATA_SUCCESS_ZIP_CODE,
  },
};

describe('Seeker - Child Care - Additional Support', () => {
  let asFragment: any | null = null;

  // Utilities Functions
  function renderPage() {
    const pathname = '/seeker/cc/additional-support';
    mockRouter = {
      push: jest.fn(),
      asPath: pathname,
      pathname,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    const mocks: MockedResponse[] = [];

    const view = render(
      <MockedProvider mocks={mocks} addTypename>
        <AppStateProvider initialStateOverride={appState}>
          <AdditionalSupport />
        </AppStateProvider>
      </MockedProvider>
    );
    ({ asFragment } = view);
  }
  it('matches snapshot', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeEnabled());

    expect(asFragment()).toMatchSnapshot();
  });
});
