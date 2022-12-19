import React from 'react';
import { NextRouter } from 'next/router';
import getConfig from 'next/config';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import AuthService, { getUserEmail } from '@/lib/AuthService';
import { TealiumUtagService, TealiumData } from '@/utilities/utagHelper';
import { AppStateProvider } from '@/components/AppState';
import { CHANGE_MEMBER_PASSWORD } from '@/components/request/GQL';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { JOB_MFE_CC_PAJ_NTH_DAY, SHORT_ENROLLMENT_ROUTES } from '@/constants';

import { SeekerVerticalType } from '@/types/seeker';
import Password from '../password';

let mockRouter: NextRouter;
let buttonSetPassword: HTMLElement;
let inputPassword: HTMLElement;

const TEST_FIRSTNAME = 'myfirst';
const TEST_LASTNAME = 'mylast';
const TEST_EMAIL = 'hello@care.com';
const TEST_PHONENUMBER = '(222) 2131415';
const VALID_PASSWORD = 'jayenclaospdh';
const zipcode = '90210';

const windowLocationAssignMock = jest.fn();

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

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

const changeMemberPasswordMockSuccess = {
  request: {
    query: CHANGE_MEMBER_PASSWORD,
    variables: {
      passwordInput: {
        password: VALID_PASSWORD,
      },
    },
  },
  result: {
    data: {
      memberChangePassword: {
        __typename: 'MemberChangePasswordSuccess',
        authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
      },
    },
  },
};

function renderPage(
  mocks: MockedResponse[] = [],
  vertical: SeekerVerticalType = 'Housekeeping',
  customState?: AppState
) {
  const initialState: AppState = {
    ...initialAppState,
    seeker: {
      ...initialAppState.seeker,
      vertical,
    },
  };
  const pathname = SHORT_ENROLLMENT_ROUTES.PASSWORD;
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
        <AppStateProvider initialStateOverride={customState || initialState}>
          <Password />
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  buttonSetPassword = screen.getByRole('button', { name: 'Set password' });
  inputPassword = screen.getByLabelText('Password');

  return view;
}

describe('Short Enrollment Password', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('sends the right data for Tealium event', async () => {
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
    await waitFor(() => expect(tealiumMock).toHaveBeenCalledWith(tealiumData));
  });
  it('should redirect to the expected URL', async () => {
    const vertical: SeekerVerticalType = 'Childcare';
    const mockState: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        vertical,
        seekerInfo: {
          firstName: TEST_FIRSTNAME,
          lastName: TEST_LASTNAME,
          email: TEST_EMAIL,
          phone: TEST_PHONENUMBER,
        },
        zipcode,
      },
    };
    renderPage([changeMemberPasswordMockSuccess], vertical, mockState);
    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();

    userEvent.click(buttonSetPassword);
    await waitFor(() =>
      expect(windowLocationAssignMock).toHaveBeenCalledWith(
        `${CZEN_GENERAL}${JOB_MFE_CC_PAJ_NTH_DAY}`
      )
    );
  });
});
