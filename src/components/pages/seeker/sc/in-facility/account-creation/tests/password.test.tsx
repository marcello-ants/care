import { RouterContext } from 'next/dist/shared/lib/router-context';
import React from 'react';
import { Formik } from 'formik';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { AppState } from '@/types/app';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import PasswordPage from '../password';

interface RenderOptions {
  mocks?: ReadonlyArray<MockedResponse>;
  ldFlags?: FeatureFlags;
  state?: AppState;
}

describe('in facility password page', () => {
  let mockRouter: any = null;

  function buildReactElements(options: RenderOptions = {}) {
    const { mocks } = options;
    return (
      <ThemeProvider theme={theme}>
        <RouterContext.Provider value={mockRouter}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Formik
              initialValues={{
                firstName: '',
              }}
              onSubmit={() => {}}
              validateOnMount>
              <PasswordPage />
            </Formik>
          </MockedProvider>
        </RouterContext.Provider>
      </ThemeProvider>
    );
  }

  function renderPage(options: RenderOptions = {}) {
    const view = render(buildReactElements(options));
    return view;
  }
  beforeEach(() => {
    mockRouter = {
      pathname: '/seeker/sc/in-facility/account-creation/password',
      asPath: '/seeker/sc/in-facility/account-creation/password',
    };
  });

  afterEach(() => {
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });
});
