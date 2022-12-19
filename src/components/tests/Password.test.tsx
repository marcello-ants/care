import React from 'react';
import { NextRouter } from 'next/router';
import getConfig from 'next/config';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { useMediaQuery } from '@material-ui/core';

import AuthService from '@/lib/AuthService';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import {
  CLIENT_FEATURE_FLAGS,
  FLOWS,
  JOB_MFE_HK_PAJ,
  JOB_MFE_PC_PAJ,
  JOB_MFE_TU_PAJ,
  JOB_MFE_CC_PAJ_NTH_DAY,
  JOB_MFE_DC_PAJ_NTH_DAY,
  PAJ_NTH_DAY_HK,
  PAJ_NTH_DAY_HK_MW,
  PAJ_NTH_DAY_PC,
  PAJ_NTH_DAY_PC_MW,
  PAJ_NTH_DAY_SC,
  PAJ_NTH_DAY_SC_MW,
  PAJ_NTH_DAY_TU,
  PAJ_NTH_DAY_TU_MW,
  VerticalsAbbreviation,
} from '@/constants';
import { CHANGE_MEMBER_PASSWORD } from '@/components/request/GQL';
import Password from '@/components/Password';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

let mockRouter: NextRouter;
let buttonSetPassword: HTMLElement;
let buttonSkip: HTMLElement;
let inputPassword: HTMLElement;

const analyticsMock = jest
  .spyOn(AnalyticsHelper, 'logEvent')
  .mockImplementation(() => Promise.resolve());

const TEST_FIRSTNAME = 'myfirst';
const TEST_LASTNAME = 'mylast';
const TEST_EMAIL = 'hello@care.com';
const TEST_PHONENUMBER = '(222) 2131415';
const VALID_PASSWORD = 'jayenclaospdh';
const INVALID_PASSWORD = 'password';
const GENERIC_PASSWORD_ERROR = 'generic error';
const zipcode = '90210';
const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const jobMfePaths: [VerticalsAbbreviation, string, string][] = [
  ['HK', CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_HK, JOB_MFE_HK_PAJ],
  ['PC', CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_PC, JOB_MFE_PC_PAJ],
  ['TU', CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_TU, JOB_MFE_TU_PAJ],
];

const PAJPaths: [VerticalsAbbreviation, boolean, string][] = [
  ['DC', false, `${CZEN_GENERAL}${JOB_MFE_DC_PAJ_NTH_DAY}`], // [vertical, isDesktop, URL]
  ['CC', false, `${CZEN_GENERAL}${JOB_MFE_CC_PAJ_NTH_DAY}`],
  ['PC', false, `${CZEN_GENERAL}${PAJ_NTH_DAY_PC_MW}`],
  ['PC', true, `${CZEN_GENERAL}${PAJ_NTH_DAY_PC(zipcode)}`],
  ['HK', false, `${CZEN_GENERAL}${PAJ_NTH_DAY_HK_MW}`],
  ['HK', true, `${CZEN_GENERAL}${PAJ_NTH_DAY_HK(zipcode)}`],
  ['SC', false, `${CZEN_GENERAL}${PAJ_NTH_DAY_SC_MW}`],
  ['SC', true, `${CZEN_GENERAL}${PAJ_NTH_DAY_SC(zipcode)}`],
  ['TU', false, `${CZEN_GENERAL}${PAJ_NTH_DAY_TU_MW}`],
  ['TU', true, `${CZEN_GENERAL}${PAJ_NTH_DAY_TU(zipcode)}`],
];

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
jest.mock('@material-ui/core', () => ({
  // @ts-ignore
  ...jest.requireActual('@material-ui/core'),
  useMediaQuery: jest.fn(),
}));
jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;
const windowLocationAssignMock = jest.fn();

const getStoreSpy = jest.fn();
const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    getStore: getStoreSpy,
    redirectLogin: redirectLoginSpy,
  };
});

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

const changeMemberPasswordMockError = {
  request: {
    query: CHANGE_MEMBER_PASSWORD,
    variables: {
      passwordInput: {
        password: INVALID_PASSWORD,
      },
    },
  },
  result: {
    data: {
      memberChangePassword: {
        __typename: 'MemberChangePasswordError',
        errors: [{ __typename: 'MemberPasswordInvalid', message: GENERIC_PASSWORD_ERROR }],
      },
    },
  },
};

function renderPage(
  mocks: MockedResponse[] = [],
  appState?: AppState,
  vertical?: VerticalsAbbreviation,
  flags?: FeatureFlags,
  isShortEnrollment?: boolean
) {
  getStoreSpy.mockReturnValue({ profile: { email: TEST_EMAIL } });
  const initialState: AppState = appState || {
    ...initialAppState,
    seekerCC: {
      ...initialAppState.seekerCC,
      firstName: TEST_FIRSTNAME,
      lastName: TEST_LASTNAME,
      phoneNumber: TEST_PHONENUMBER,
      isSendLeadEnabled: true,
    },
    flow: {
      ...initialAppState.flow,
      flowName: FLOWS.SEEKER_CHILD_CARE.name,
    },
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
          <FeatureFlagsProvider flags={flags || {}}>
            <Password vertical={vertical ?? 'HK'} isShortEnrollment={isShortEnrollment ?? false} />
          </FeatureFlagsProvider>
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  buttonSetPassword = screen.getByRole('button', { name: 'Set password' });
  inputPassword = screen.getByLabelText('Password');

  if (!isShortEnrollment) {
    buttonSkip = screen.getByText('Skip for now');
  }

  return view;
}

describe('Day Care Account Password - Update Password', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders password field, set password and skip buttons', () => {
    renderPage();
    expect(inputPassword).toBeInTheDocument();
    expect(buttonSetPassword).toBeInTheDocument();
    expect(buttonSkip).toBeInTheDocument();
  });

  it('renders the account created banner', () => {
    renderPage();
    expect(screen.getByText('Account created!')).toBeInTheDocument();
  });

  it('validates password is at least 6 characters long', async () => {
    renderPage();

    userEvent.type(inputPassword, '123');
    inputPassword.blur();

    expect(await screen.findByText(/Password must be at least 6 characters./i)).toBeInTheDocument();
  });

  it('validates password does not match email', async () => {
    renderPage();

    userEvent.type(inputPassword, TEST_EMAIL);
    inputPassword.blur();

    expect(
      await screen.findByText(/Please don't use your name or email address in your password./i)
    ).toBeInTheDocument();
  });

  it(`pressing "Set password" updates user's password and redirects user to next page`, async () => {
    renderPage([changeMemberPasswordMockSuccess]);

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    await waitFor(() => {
      expect(windowLocationAssignMock).toHaveBeenCalledWith('/seeker/hk/schedule');
    });
  });

  it('renders error banner when there is an error', async () => {
    renderPage([changeMemberPasswordMockError]);
    userEvent.type(inputPassword, INVALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    expect(await screen.findByText(GENERIC_PASSWORD_ERROR)).toBeInTheDocument();
  });

  it(`pressing "Set password" updates user's password, redirects user to next page and fires logEvent`, async () => {
    renderPage([changeMemberPasswordMockSuccess], undefined);

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    await waitFor(() => {
      expect(windowLocationAssignMock).toHaveBeenCalledWith('/seeker/hk/schedule');
    });
    expect(analyticsMock).toHaveBeenCalledWith({
      name: 'CTA Interacted',
      data: {
        cta_clicked: 'Set password',
      },
    });
  });
  it(`pressing "Set password" on Pet care password page redirects user to next page`, async () => {
    renderPage([changeMemberPasswordMockSuccess], undefined, 'PC');
    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    await waitFor(() => {
      expect(windowLocationAssignMock).toHaveBeenCalledWith('/seeker/pc/schedule');
    });
  });
  it('pressing "Skip for now" redirects user to next page and fires logEvent', () => {
    renderPage(undefined, undefined);
    userEvent.click(buttonSkip);
    expect(windowLocationAssignMock).toHaveBeenCalledWith('/seeker/hk/schedule');
    expect(analyticsMock).toHaveBeenCalledWith({
      name: 'CTA Interacted',
      data: {
        cta_clicked: 'Skip step',
      },
    });
  });

  it('should render with PASSWORD_REQUIREMENTS_COPY text', () => {
    renderPage([], undefined, 'PC', {
      [CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY]: {
        variationIndex: 0,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(
      screen.getByText(
        'Create a new password to save time, or skip it for now, and we’ll email you a temporary one'
      )
    ).toBeInTheDocument();
  });

  it('should render without PASSWORD_REQUIREMENTS_COPY text', () => {
    renderPage([], undefined, 'PC', {
      [CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY]: {
        variationIndex: 0,
        value: 1,
        reason: { kind: '' },
      },
    });
    expect(
      screen.queryByText(
        'Create a new password to save time, or skip it for now, and we’ll email you a temporary one'
      )
    ).not.toBeInTheDocument();
  });

  it.each(jobMfePaths)(
    `pressing "Skip for now" with LD flag redirects user to job-mfe for %s`,
    (vertical, ldFlag, path) => {
      const ldFlags: FeatureFlags = {
        [ldFlag]: {
          reason: { kind: '' },
          value: true,
          variationIndex: 0,
        },
      };
      renderPage(undefined, undefined, vertical, ldFlags);
      userEvent.click(buttonSkip);
      expect(windowLocationAssignMock).toHaveBeenCalledWith(CZEN_GENERAL + path);
    }
  );

  it('should render short enrollment view', () => {
    const isShortEnrollment = true;
    renderPage([], undefined, 'PC', undefined, isShortEnrollment);
    expect(screen.getByText('Finish setting up your account')).toBeInTheDocument();
  });

  it.each(PAJPaths)(
    `should redirect to the expect URL for %s in short enrollment flow`,
    async (vertical, isDesktop, url) => {
      (useMediaQuery as jest.Mock).mockReturnValue(isDesktop);
      const mockState: AppState = {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          seekerInfo: {
            firstName: TEST_FIRSTNAME,
            lastName: TEST_LASTNAME,
            email: TEST_EMAIL,
            phone: TEST_PHONENUMBER,
          },
          zipcode,
        },
        flow: {
          ...initialAppState.flow,
          flowName: FLOWS.SEEKER_CHILD_CARE.name,
        },
      };
      renderPage([changeMemberPasswordMockSuccess], mockState, vertical, undefined, true);

      userEvent.type(inputPassword, VALID_PASSWORD);
      inputPassword.blur();

      userEvent.click(buttonSetPassword);

      await waitFor(() => expect(windowLocationAssignMock).toHaveBeenCalledWith(url));
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'CTA Interacted',
        data: {
          cta_clicked: 'Set password',
          job_flow: 'SingleEnrollment',
        },
      });
    }
  );
});
