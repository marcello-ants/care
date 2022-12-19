import React from 'react';
import { NextRouter } from 'next/router';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import AuthService from '@/lib/AuthService';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { BOOKING_MFE_IB_ASSESSMENT, CLIENT_FEATURE_FLAGS, FLOWS } from '@/constants';
import { CHANGE_MEMBER_PASSWORD } from '@/components/request/GQL';
import { TealiumUtagService } from '@/utilities/utagHelper';
import { DaycareProviderProfile, DefaultCareKind } from '@/types/seekerCC';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

import DaycareAccountPassword from '@/components/pages/seeker/cc/account-creation/password';
import { cloneDeep } from 'lodash-es';

let mockRouter: NextRouter;
let buttonSetPassword: HTMLElement;
let buttonSkip: HTMLElement;
let inputPassword: HTMLElement;

const analyticsMock = jest
  .spyOn(AnalyticsHelper, 'logEvent')
  .mockImplementation(() => Promise.resolve());

const analyticsLogTestExposureMock = jest
  .spyOn(AnalyticsHelper, 'logTestExposure')
  .mockImplementation(() => Promise.resolve());

const TEST_FIRSTNAME = 'myfirst';
const TEST_LASTNAME = 'mylast';
const TEST_EMAIL = 'hello@care.com';
const TEST_PHONENUMBER = '(222) 2131415';
const VALID_PASSWORD = 'jayenclaospdh';
const INVALID_PASSWORD = 'password';
const GENERIC_PASSWORD_ERROR = 'generic error';

const skipLoginForRateCardVariation = {
  reason: { kind: 'kind' },
  value: true,
  variationIndex: 2,
};

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

function generateRecommendations(selectedValues: boolean[]): DaycareProviderProfile[] {
  const recommendations = [] as DaycareProviderProfile[];
  selectedValues.forEach((selected, idx) =>
    recommendations.push({
      __typename: 'Provider',
      id: `${idx}`,
      selected,
      name: '',
      avgReviewRating: 2,
      description: '',
      address: null,
      images: null,
      logo: null,
      license: null,
      reviews: null,
      hasCoordinates: true,
      centerType: null,
    })
  );
  return recommendations;
}

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

const defaultCarekind = {
  careKind: DefaultCareKind.DAY_CARE_CENTERS,
};

function renderPage(mocks: MockedResponse[] = [], appState?: AppState, ldFlags?: FeatureFlags) {
  getStoreSpy.mockReturnValue({ profile: { email: TEST_EMAIL } });
  const initialState: AppState = appState || {
    ...initialAppState,
    seekerCC: {
      ...initialAppState.seekerCC,
      ...defaultCarekind,
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

  // @ts-ignore
  mockRouter = {
    push: jest.fn(),
    asPath: '',
    pathname: '',
    basePath: '',
  };
  const view = render(
    <RouterContext.Provider value={mockRouter}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <FeatureFlagsProvider flags={ldFlags || {}}>
          <AppStateProvider initialStateOverride={initialState}>
            <DaycareAccountPassword />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  buttonSetPassword = screen.getByRole('button', { name: 'Set password' });
  buttonSkip = screen.getByText('Skip for now');
  inputPassword = screen.getByLabelText('Password');

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

  it('pressing "skip for now" redirects user to next page', () => {
    renderPage();
    userEvent.click(buttonSkip);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.dev.carezen.net/vis/auth/login?forwardUrl=https%3A%2F%2Fwww.dev.carezen.net%2Fapp%2Fratecard%2Fchildcare%2Fpre-rate-card%3FenrollFlow%3Dtrue'
    );
  });

  it('fires test exposure event - A/B test - skip-login-in-ratecard-redirection', () => {
    renderPage(undefined, undefined, {
      [CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION]: skipLoginForRateCardVariation,
    });

    expect(analyticsLogTestExposureMock).toBeCalledWith(
      'skip-login-in-ratecard-redirection',
      skipLoginForRateCardVariation
    );
  });

  it('pressing "skip for now" redirects user directly to ratecard-mfe - A/B test - skip-login-in-ratecard-redirection', () => {
    renderPage(undefined, undefined, {
      [CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION]: skipLoginForRateCardVariation,
    });
    userEvent.click(buttonSkip);

    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.dev.carezen.net/app/ratecard/childcare/pre-rate-card?enrollFlow=true'
    );
  });

  it('pressing "set password" redirects user directly to ratecard-mfe - A/B test - skip-login-in-ratecard-redirection', async () => {
    renderPage([changeMemberPasswordMockSuccess], undefined, {
      [CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION]: skipLoginForRateCardVariation,
    });

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    await waitFor(() => {
      expect(windowLocationAssignMock).toHaveBeenCalledWith(
        'https://www.dev.carezen.net/app/ratecard/childcare/pre-rate-card?enrollFlow=true'
      );
    });
  });

  it('validates password is at least 6 characters long', async () => {
    renderPage();

    userEvent.type(inputPassword, '123');
    inputPassword.blur();

    expect(await screen.findByText(/Password must be at least 6 characters./i)).toBeInTheDocument();
  });

  it('validates password does not contain first name', async () => {
    renderPage();

    userEvent.type(inputPassword, TEST_FIRSTNAME);
    inputPassword.blur();

    expect(
      await screen.findByText(/Please don't use your first name in your password./i)
    ).toBeInTheDocument();
  });

  it('validates password does not contain last name', async () => {
    renderPage();

    userEvent.type(inputPassword, TEST_LASTNAME);
    inputPassword.blur();

    expect(
      await screen.findByText(/Please don't use your last name in your password./i)
    ).toBeInTheDocument();
  });

  it('validates password does not match email', async () => {
    renderPage();

    userEvent.type(inputPassword, TEST_EMAIL);
    inputPassword.blur();

    expect(
      await screen.findByText(/Please don't use your name or email address in your password./i)
    ).toBeInTheDocument();
  });

  it(`pressing "set password" updates user's password and redirects user to next page`, async () => {
    renderPage([changeMemberPasswordMockSuccess]);

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    await waitFor(() => {
      expect(windowLocationAssignMock).toHaveBeenCalledWith(
        'https://www.dev.carezen.net/vis/auth/login?forwardUrl=https%3A%2F%2Fwww.dev.carezen.net%2Fapp%2Fratecard%2Fchildcare%2Fpre-rate-card%3FenrollFlow%3Dtrue'
      );
    });
  });

  it('renders error banner when there is an error', async () => {
    renderPage([changeMemberPasswordMockError]);
    userEvent.type(inputPassword, INVALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    expect(await screen.findByText(GENERIC_PASSWORD_ERROR)).toBeInTheDocument();
  });

  it('sends the right value for `leadCount` in the Tealium event', () => {
    const slots = { slots: ['/us-marketplace/daycare/leads-submitted/'] };
    const appState: AppState = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        ...defaultCarekind,
        dayCare: {
          ...initialAppState.seekerCC.dayCare,
          recommendations: generateRecommendations([true, false, true, false]),
        },
        firstName: TEST_FIRSTNAME,
        lastName: TEST_LASTNAME,
        phoneNumber: TEST_PHONENUMBER,
      },
      flow: {
        ...initialAppState.flow,
        flowName: FLOWS.SEEKER_CHILD_CARE.name,
      },
    };
    renderPage([], appState);
    expect(tealiumMock).not.toHaveBeenCalledWith(slots);
  });

  it('useTealiumTracking should be called when careKind is DAYCARE', async () => {
    renderPage();
    await waitFor(() => {
      expect(tealiumMock).toHaveBeenCalledTimes(1);
    });
  });

  it('useTealiumTracking should not be called when careKind is ONE_TIME_BABYSITTERS', async () => {
    const slots = [
      '/us-subscription/conversion/seeker/basic/signup/',
      '/us-subscription/conversion/seeker/basic/signup/impact/',
    ];
    const teliumData = {
      sessionId: undefined,
      slots,
      tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
      email: TEST_EMAIL,
      emailSHA256: 'testHash256',
      intent: 'WITHIN_A_WEEK',
      memberType: 'seeker',
      overallStatus: 'basic',
      serviceId: 'CHILD_CARE',
      subServiceId: 'ONE_TIME_BABYSITTERS',
    };
    defaultCarekind.careKind = DefaultCareKind.ONE_TIME_BABYSITTERS;
    renderPage();

    await waitFor(() => {
      expect(tealiumMock).toBeCalledWith(teliumData);
    });
  });

  it('careKind is not DAY_CARE_CENTERS pressing "skip for now" redirects user to second next page', () => {
    defaultCarekind.careKind = DefaultCareKind.ONE_TIME_BABYSITTERS;
    renderPage();
    userEvent.click(buttonSkip);
    expect(windowLocationAssignMock).toHaveBeenCalledWith('/seeker/cc/schedule');
  });

  it(`careKind is not DAY_CARE_CENTERS, pressing "set password" updates user's password, redirects user to next page`, async () => {
    defaultCarekind.careKind = DefaultCareKind.ONE_TIME_BABYSITTERS;
    renderPage([changeMemberPasswordMockSuccess]);
    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    userEvent.type(inputPassword, VALID_PASSWORD);
    inputPassword.blur();
    userEvent.click(buttonSetPassword);

    await waitFor(() => {
      expect(windowLocationAssignMock).toHaveBeenCalledWith('/seeker/cc/schedule');
    });
  });

  it('leads-submitted tealium and amplitude should not be called when recommendations is empty', () => {
    const slots = { slots: ['/us-marketplace/daycare/leads-submitted/'] };
    const appState: AppState = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        ...defaultCarekind,
        dayCare: {
          ...initialAppState.seekerCC.dayCare,
          recommendations: generateRecommendations([]),
        },
        firstName: TEST_FIRSTNAME,
        lastName: TEST_LASTNAME,
        phoneNumber: TEST_PHONENUMBER,
      },
      flow: {
        ...initialAppState.flow,
        flowName: FLOWS.SEEKER_CHILD_CARE.name,
      },
    };
    renderPage([], appState);
    expect(tealiumMock).not.toHaveBeenCalledWith(slots);
    expect(analyticsMock).not.toHaveBeenCalledWith({
      name: 'Slot Sent',
      data: slots,
    });
  });

  it('Basic signup tealium and amplitude should be call on page load', async () => {
    const slots = [
      '/us-subscription/conversion/seeker/basic/signup/',
      '/us-subscription/conversion/seeker/basic/signup/impact/',
    ];
    const teliumData = {
      sessionId: undefined,
      slots,
      tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
      email: TEST_EMAIL,
      emailSHA256: 'testHash256',
      intent: 'WITHIN_A_WEEK',
      memberType: 'seeker',
      overallStatus: 'basic',
      serviceId: 'CHILD_CARE',
      subServiceId: 'ONE_TIME_BABYSITTERS',
    };
    renderPage();

    await waitFor(() => {
      expect(tealiumMock).toHaveBeenCalledWith(teliumData);
    });
    await waitFor(() => {
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Slot Sent',
        data: {
          slots,
        },
      });
    });
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage([], initialAppState, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText(/Set a password for next time./)).toBeInTheDocument();
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage([], initialAppState, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 0,
        value: 0,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('Finish setting up your account')).toBeInTheDocument();
  });

  it('should render with PASSWORD_REQUIREMENTS_COPY text', () => {
    renderPage([], initialAppState, {
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
    renderPage([], initialAppState, {
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

  describe('Instant book redirection flow', () => {
    let ldFlags: FeatureFlags;
    const redirectURL = `https://www.dev.carezen.net${BOOKING_MFE_IB_ASSESSMENT}`;

    beforeEach(() => {
      ldFlags = {
        [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_M1]: {
          variationIndex: 2,
          value: '2',
          reason: { kind: '' },
        },
      };
    });

    function skipRedirect(redirectsToInstantBookFlow: boolean) {
      userEvent.click(buttonSkip);
      if (redirectsToInstantBookFlow) {
        expect(windowLocationAssignMock).toHaveBeenCalledWith(redirectURL);
      } else {
        expect(windowLocationAssignMock).not.toHaveBeenCalledWith(redirectURL);
      }
    }

    async function setPasswordRedirect(redirectsToInstantBookFlow: boolean) {
      // set password
      userEvent.type(inputPassword, VALID_PASSWORD);
      inputPassword.blur();
      userEvent.click(buttonSetPassword);

      await waitFor(() => {
        if (redirectsToInstantBookFlow) {
          expect(windowLocationAssignMock).toHaveBeenCalledWith(redirectURL);
        } else {
          expect(windowLocationAssignMock).not.toHaveBeenCalledWith(redirectURL);
        }
      });
    }

    async function testRedirectURL(redirectsToInstantBookFlow = false) {
      // test skip
      skipRedirect(redirectsToInstantBookFlow);
      // test set password
      await setPasswordRedirect(redirectsToInstantBookFlow);
    }

    it('should not redirect to booking MFE when careKind is not ONE_TIME_BABYSITTERS (skip or set pass btn)', async () => {
      const appState: AppState = cloneDeep(initialAppState);
      appState.seekerCC.instantBook.eligibleLocation = true;
      appState.seekerCC.careKind = DefaultCareKind.DAY_CARE_CENTERS;
      renderPage([changeMemberPasswordMockSuccess], appState, ldFlags);

      await testRedirectURL();
    });
    it('should not redirect to booking MFE when location is not eligible (skip or set pass btn)', async () => {
      const appState: AppState = cloneDeep(initialAppState);
      appState.seekerCC.careKind = DefaultCareKind.ONE_TIME_BABYSITTERS;
      appState.seekerCC.instantBook.eligibleLocation = false;
      renderPage([changeMemberPasswordMockSuccess], appState, ldFlags);

      await testRedirectURL();
    });
    it('should not redirect to booking MFE when instantBookM1Flag variation is not 2 (skip or set pass btn)', async () => {
      const appState: AppState = cloneDeep(initialAppState);
      appState.seekerCC.careKind = DefaultCareKind.ONE_TIME_BABYSITTERS;
      appState.seekerCC.instantBook.eligibleLocation = true;

      ldFlags[CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_M1]!.variationIndex = 0;
      renderPage([changeMemberPasswordMockSuccess], appState, ldFlags);

      await testRedirectURL();
    });
    it('should redirect to booking MFE when all criteria above passed (skip or set pass btn)', async () => {
      const appState: AppState = cloneDeep(initialAppState);
      appState.seekerCC.careKind = DefaultCareKind.ONE_TIME_BABYSITTERS;
      appState.seekerCC.instantBook.eligibleLocation = true;

      renderPage([changeMemberPasswordMockSuccess], appState, ldFlags);

      await testRedirectURL(true);
    });
  });
});
