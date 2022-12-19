import { RouterContext } from 'next/dist/shared/lib/router-context';
import React from 'react';
import { Formik } from 'formik';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import AccountDetailsPage from '../details';

describe('in facility details page', () => {
  let mockRouter: any = null;

  function buildReactElements() {
    return (
      <ThemeProvider theme={theme}>
        <RouterContext.Provider value={mockRouter}>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phoneNumber: '',
            }}
            onSubmit={() => {}}
            validateOnMount>
            <AccountDetailsPage onNext={() => {}} />
          </Formik>
        </RouterContext.Provider>
      </ThemeProvider>
    );
  }

  function renderPage() {
    const view = render(buildReactElements());
    return view;
  }
  beforeEach(() => {
    mockRouter = {
      pathname: '/seeker/sc/in-facility/account-creation/details',
      asPath: '/seeker/sc/in-facility/account-creation/details',
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
