import React from 'react';
import { render } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';

import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { cloneDeep } from 'lodash-es';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { MockedProvider } from '@apollo/client/testing';

import { initialAppState } from '@/state';
import CareIndex from '../child-care-index';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname' | 'query'>;

const initialStateClone = cloneDeep(initialAppState);

function renderPage(flags: FeatureFlags = {}, state = initialStateClone) {
  const pathname = '/seeker/cc';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    query: {},
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <MockedProvider mocks={[]} addTypename>
      <AppStateProvider initialStateOverride={state}>
        <FeatureFlagsProvider flags={flags}>
          <ThemeProvider theme={theme}>
            <CareIndex />
          </ThemeProvider>
        </FeatureFlagsProvider>
      </AppStateProvider>
    </MockedProvider>
  );
}

describe('/seeker/cc', () => {
  beforeEach(() => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
  });

  it('matches snapshot', () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('check when visitorStartedSACFlow is set', () => {
    const state = {
      ...initialAppState,
      seeker: {
        ...initialStateClone.seeker,
        visitorStartedSACFlow: true,
      },
    };
    renderPage({}, state);
    expect(mockAppDispatch).not.toHaveBeenCalledWith({
      type: 'setVisitorStartedSACFlow',
      visitorStartedSACFlow: true,
    });
  });
});
