import React from 'react';
import { NextRouter } from 'next/router';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import AuthService, { getUserEmail } from '@/lib/AuthService';
import { TealiumUtagService, TealiumData } from '@/utilities/utagHelper';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';

import Password from '../password';

let mockRouter: NextRouter;

const TEST_EMAIL = 'hello@care.com';

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

jest.mock('@/utilities/utagHelper', () => ({
  __esModule: true,
  TealiumUtagService: {
    view: jest.fn(),
  },
}));

jest.mock('@/utilities/account-creation-utils', () => ({
  __esModule: true,
  hash256: jest.fn(() => Promise.resolve('testHash256')),
}));

const tealiumMock = TealiumUtagService.view as jest.Mock;

jest.mock('@/lib/AuthService');
(getUserEmail as jest.Mock).mockImplementation(() => TEST_EMAIL);
(AuthService as jest.Mock).mockImplementation(() => ({
  getStore: jest.fn(() => ({
    profile: {
      email: TEST_EMAIL,
    },
  })),
}));

function renderPage(mocks: MockedResponse[] = []) {
  const initialState: AppState = {
    ...initialAppState,
  };
  const pathname = '/seeker/hk/account-creation/password';
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
        <AppStateProvider initialStateOverride={initialState}>
          <Password vertical="HK" />
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  return view;
}

describe('Password', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('sends the right data for Tealium event', () => {
    const tealiumData: TealiumData = {
      tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
      sessionId: undefined,
      email: TEST_EMAIL,
      emailSHA256: 'testHash256',
      slots: [
        '/us-subscription/conversion/seeker/basic/signup/',
        '/us-subscription/conversion/seeker/basic/signup/cj/',
        '/us-subscription/conversion/seeker/basic/signup/impact/',
      ],
      intent: 'WITHIN_A_WEEK',
      memberType: 'seeker',
      overallStatus: 'basic',
      serviceId: 'HK',
      subServiceId: 'HOUSEKEEP',
    };

    renderPage();

    expect(tealiumMock).toHaveBeenCalledWith(tealiumData);
  });
});
