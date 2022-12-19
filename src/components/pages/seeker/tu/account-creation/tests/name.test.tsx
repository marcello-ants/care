import React from 'react';
import { NextRouter } from 'next/router';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import AuthService from '@/lib/AuthService';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import Name from '../name';

let mockRouter: NextRouter;

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      OIDC_STS_AUTHORITY: 'OIDC_STS_AUTHORITY',
      OIDC_CLIENT_ID: 'OIDC_CLIENT_ID',
      OIDC_RESPONSE_TYPE: 'OIDC_RESPONSE_TYPE',
      OIDC_CLIENT_SCOPE: 'OIDC_CLIENT_SCOPE',
      OIDC_CALLBACK_PATH: 'OIDC_CALLBACK_PATH',
      OIDC_LOGOUT_URL: 'OIDC_LOGOUT_URL',
      CZEN_GENERAL: 'https://www.dev.carezen.net',
    },
  };
});

jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const getStoreSpy = jest.fn();
const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    getStore: getStoreSpy,
    redirectLogin: redirectLoginSpy,
  };
});

function renderPage(mocks: MockedResponse[] = []) {
  const pathname = '/seeker/tu/account-creation/name';
  // @ts-ignore
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    basePath: '',
  };
  const view = render(
    <RouterContext.Provider value={mockRouter}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AppStateProvider initialStateOverride={initialAppState}>
          <Name />
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  return view;
}

describe('Password for TU', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });
});
