// External Dependencies
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJSUtils from '@date-io/dayjs';

// Internal Dependencies
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { DefaultCareKind } from '@/types/seekerCC';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { MockedProvider } from '@apollo/client/testing';
import InterstitialWithReviews from '../InterstitialWithReviews';

// Constants

const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
  seekerCC: {
    ...clonedAppState.seekerCC,
  },
};

// Mocks

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

jest.setTimeout(7600);

// Render Functions
let pathname = '/seeker/cc/recap';

async function renderPage(overrideState?: AppState, ldFlags: FeatureFlags = {}) {
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  const view = render(
    <MockedProvider mocks={[]} addTypename>
      <FeatureFlagsProvider flags={ldFlags}>
        <MuiPickersUtilsProvider utils={DayJSUtils}>
          <AppStateProvider initialStateOverride={overrideState || appState}>
            <InterstitialWithReviews />
          </AppStateProvider>
        </MuiPickersUtilsProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );

  await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
  return view;
}

describe('/cc/recap', () => {
  afterEach(() => {
    pathname = '/seeker/cc/recap';
  });

  it('matches snapshot - Nannies', async () => {
    const state: AppState = {
      ...appState,
    };
    const view = await renderPage(state);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot - One-time Sitters', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
      },
    };
    const view = await renderPage(state);
    expect(view.asFragment()).toMatchSnapshot();
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(appState, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(
      screen.getByText("We're searching for nannies in city that fit your needs...")
    ).toBeInTheDocument();
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(appState, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 0,
        value: 0,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('Looking for nannies in city, state...')).toBeInTheDocument();
  });
});
