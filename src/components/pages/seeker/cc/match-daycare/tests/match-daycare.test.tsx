import React from 'react';
import { render } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';

// Internal Dependencies
import { AppStateProvider } from '@/components/AppState';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import AdditionalSupport from '../match-daycare';

// Data
const TEST_DATA_SUCCESS_ZIP_CODE = '91911';

// Mocks
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const flags = {
  'enrollment-mfe-seeker-daycare-recommendation': {
    reason: { kind: 'FALLTHROUGH' },
    value: false,
    variationIndex: 1,
  },
};

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: TEST_DATA_SUCCESS_ZIP_CODE,
  },
};

// Utilities Functions

function renderPage() {
  const pathname = '/seeker/cc/match-daycare';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  const mocks: MockedResponse[] = [];

  return render(
    <MockedProvider mocks={mocks} addTypename>
      <FeatureFlagsProvider flags={flags}>
        <AppStateProvider initialStateOverride={appState}>
          <AdditionalSupport />
        </AppStateProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
}

describe('Daycare - Match daycares', () => {
  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });
});
