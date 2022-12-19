import React from 'react';
import { NextRouter } from 'next/router';
import { render, waitFor, screen, fireEvent, MatcherFunction } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import AuthService from '@/lib/AuthService';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { GET_CAREGIVER_COUNT_FOR_JOB, VALIDATE_MEMBER_EMAIL } from '@/components/request/GQL';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { FLOWS, CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import UpfrontAccountCreation, { dispatchValues, getCallbackFunc } from '../email';

let savedLocalStorage: Storage;
let mockRouter: NextRouter;
let textboxEmail: HTMLElement;
let buttonJoinNow: HTMLElement;
let buttonContinueWithFb: HTMLElement | null;

const CONTINUE_WITH_FACEBOOK = 'Continue with Facebook';
const accessToken = 'XXX';

const FB_SIGNUP_UNAPPROVED_STATES = ['CA'];
const FB_SIGNUP_APPROVED_STATES = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'VI',
  'WA',
  'WV',
  'WI',
  'WY',
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
    },
  };
});
jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;
const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const analyticsMock = jest
  .spyOn(AnalyticsHelper, 'logEvent')
  .mockImplementation(() => Promise.resolve());

const TEST_DATA_SUCCESS_EMAIL = 'email@success.com';
const TEST_DATA_ZIP_CODE = '02452';
const withMarkup =
  (query: (fn: MatcherFunction) => Element | null) =>
  (target: string | RegExp): Element | null =>
    query((content: string, element: Element | null | undefined) => {
      if (!element) return false;
      const hasText = (el: Element) => {
        if (typeof target === 'string') return el.textContent === target;
        return target.test(element.textContent || '');
      };
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child as Element)
      );
      return hasText(element) && childrenDontHaveText;
    });
const queryByTextWithMarkup = withMarkup(screen.queryByText);
const emailValidationMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: TEST_DATA_SUCCESS_EMAIL,
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [] },
    },
  },
};

const useProvidersCountMock = (count: number) => ({
  request: {
    query: GET_CAREGIVER_COUNT_FOR_JOB,
    variables: {
      zipcode: TEST_DATA_ZIP_CODE,
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverCountForJob: {
        count,
      },
    },
  },
});

function renderPage(
  mocks: MockedResponse[] = [],
  ldFlags: FeatureFlags = {},
  state: string = '',
  skipNextButton?: boolean
) {
  const initialState: AppState = {
    ...initialAppState,
    flow: {
      ...initialAppState.flow,
      flowName: FLOWS.SEEKER_CHILD_CARE.name,
    },
    seeker: {
      ...initialAppState.seeker,
      zipcode: TEST_DATA_ZIP_CODE,
      state,
    },
  };
  const pathname = '/seeker/cc/account-creation/email';
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
        <FeatureFlagsProvider flags={ldFlags}>
          <AppStateProvider initialStateOverride={initialState}>
            <UpfrontAccountCreation />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
  textboxEmail = screen.getByRole('textbox', { name: 'Email Address' });
  if (!skipNextButton) {
    buttonJoinNow = screen.getByRole('button', { name: 'Next' });
  }
  return view;
}
describe('Child Care - Split Account Creation', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: savedLocalStorage });
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage([useProvidersCountMock(150)]);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders correctly', () => {
    renderPage([useProvidersCountMock(150)]);
    expect(textboxEmail).toBeInTheDocument();
    expect(buttonJoinNow).toBeInTheDocument();
  });
  it('renders caregivers nearby banner', async () => {
    renderPage([useProvidersCountMock(150)]);
    await waitFor(() => {
      const el = queryByTextWithMarkup(/We found \d+ caregivers near you!/i);
      if (!el) return;
      expect(el).toBeInTheDocument();
    });
  });
  it('does not render caregivers nearby banner', async () => {
    renderPage([useProvidersCountMock(10)]);
    await waitFor(() => {
      expect(queryByTextWithMarkup(/We found! \d+ caregivers near you!/i)).not.toBeInTheDocument();
    });
  });
  it('enables button when fields are valid', async () => {
    renderPage([useProvidersCountMock(150), emailValidationMock]);
    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(buttonJoinNow).toBeEnabled();
    });
  });
  it('logs event on successful submission', async () => {
    renderPage([useProvidersCountMock(0), emailValidationMock]);
    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(buttonJoinNow).toBeEnabled();
    });
    buttonJoinNow.click();
    expect(analyticsMock).toHaveBeenCalledWith({
      name: 'Member Enrolled',
      data: {
        caregiverCount: 0,
        cta_clicked: 'Next',
        enrollmentStep: 'Email',
        enrollment_flow: 'MW VHP',
        final_step: false,
        member_type: 'Seeker',
      },
    });
  });
  it('shows error message for invalid email', async () => {
    renderPage([useProvidersCountMock(150)]);
    userEvent.type(textboxEmail, 'sample');
    fireEvent.blur(textboxEmail);
    expect(await screen.findByText(/Please enter a valid email/i)).toBeInTheDocument();
  });
  FB_SIGNUP_UNAPPROVED_STATES.map((state) =>
    it(`renders without fb button for users in ${state}`, () => {
      renderPage([useProvidersCountMock(150)], undefined, state);
      buttonContinueWithFb = screen.queryByText(CONTINUE_WITH_FACEBOOK);

      expect(textboxEmail).toBeInTheDocument();
      expect(buttonJoinNow).toBeInTheDocument();
      expect(buttonContinueWithFb).toBeNull();
    })
  );
});

describe('Child Care - Split Account Creation with LD flag', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: savedLocalStorage });
  });

  const ldFlags: FeatureFlags = {
    [CLIENT_FEATURE_FLAGS.CC_SEEKER_FB_SIGNUP]: {
      reason: { kind: '' },
      value: 2,
      variationIndex: 2,
    },
  };

  mockAppDispatch = jest.fn();
  (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
  const dispatch = useAppDispatch();

  it('matches snapshot', () => {
    const { asFragment } = renderPage([useProvidersCountMock(150)], ldFlags);
    expect(asFragment()).toMatchSnapshot();
  });

  FB_SIGNUP_APPROVED_STATES.forEach((state) =>
    it(`renders with fb button for users in ${state}`, () => {
      renderPage([useProvidersCountMock(150)], ldFlags, state);
      buttonContinueWithFb = screen.getByRole('button', { name: CONTINUE_WITH_FACEBOOK });

      expect(textboxEmail).toBeInTheDocument();
      expect(buttonJoinNow).toBeInTheDocument();
      expect(buttonContinueWithFb).toBeInTheDocument();
    })
  );

  it(`renders without fb button for CC_SEEKER_FB_SIGNUP === 1`, async () => {
    const ldFlagsNoFbSignup: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.CC_SEEKER_FB_SIGNUP]: {
        reason: { kind: '' },
        value: 1,
        variationIndex: 1,
      },
    };
    renderPage([useProvidersCountMock(150)], ldFlagsNoFbSignup, undefined);

    buttonContinueWithFb = screen.queryByText(CONTINUE_WITH_FACEBOOK);

    expect(buttonContinueWithFb).not.toBeInTheDocument();
    expect(textboxEmail).toBeInTheDocument();
    expect(buttonJoinNow).toBeInTheDocument();
  });

  const fbEmphasizedFlagValues = [0, 1, 2, 3];
  fbEmphasizedFlagValues.forEach((flagValue: number) =>
    it(`renders fb button corretly for SEEKER_FB_SIGNUP_EMPHASIZED === ${flagValue} and CC_SEEKER_FB_SIGNUP === 2`, () => {
      const customLdFlags: FeatureFlags = {
        [CLIENT_FEATURE_FLAGS.CC_SEEKER_FB_SIGNUP]: {
          reason: { kind: '' },
          value: 2,
          variationIndex: 1,
        },
        [CLIENT_FEATURE_FLAGS.SEEKER_FB_SIGNUP_EMPHASIZED]: {
          reason: { kind: '' },
          value: flagValue,
          variationIndex: flagValue,
        },
      };
      renderPage([useProvidersCountMock(150)], customLdFlags, undefined);
      buttonContinueWithFb = screen.queryByText(CONTINUE_WITH_FACEBOOK);

      expect(textboxEmail).toBeInTheDocument();
      expect(buttonJoinNow).toBeInTheDocument();
      expect(buttonContinueWithFb).toBeInTheDocument();
    })
  );

  FB_SIGNUP_UNAPPROVED_STATES.forEach((state) =>
    it(`renders without fb button for users in ${state}`, () => {
      renderPage([useProvidersCountMock(150)], ldFlags, state);
      buttonContinueWithFb = screen.queryByText(CONTINUE_WITH_FACEBOOK);

      expect(textboxEmail).toBeInTheDocument();
      expect(buttonJoinNow).toBeInTheDocument();
      expect(buttonContinueWithFb).toBeNull();
    })
  );

  it('dispatch form values with email', () => {
    const valuesToDispatch = { email: 'xxx@xxx.pl' };
    dispatchValues(valuesToDispatch, dispatch);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      email: 'xxx@xxx.pl',
      type: 'cc_setSeekerEmail',
    });
  });

  it('dispatch form values with email and first name', () => {
    const valuesToDispatch = { accessToken, email: 'xxx@xxx.pl', firstName: 'xxx' };
    dispatchValues(valuesToDispatch, dispatch);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      email: 'xxx@xxx.pl',
      type: 'cc_setSeekerEmail',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      firstName: 'xxx',
      lastName: '',
      type: 'cc_setSeekerName',
    });
  });

  it('dispatch form values with email and last name', () => {
    const valuesToDispatch = { accessToken, email: 'xxx@xxx.pl', lastName: 'yyy' };
    dispatchValues(valuesToDispatch, dispatch);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      email: 'xxx@xxx.pl',
      type: 'cc_setSeekerEmail',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      firstName: '',
      lastName: 'yyy',
      type: 'cc_setSeekerName',
    });
  });

  it('dispatch form values with email, first and last name', () => {
    const valuesToDispatch = {
      accessToken,
      email: 'xxx@xxx.pl',
      firstName: 'xxx',
      lastName: 'yyy',
    };
    dispatchValues(valuesToDispatch, dispatch);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      email: 'xxx@xxx.pl',
      type: 'cc_setSeekerEmail',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      firstName: 'xxx',
      lastName: 'yyy',
      type: 'cc_setSeekerName',
    });
  });

  it('dispatch only email it there is no accessToken', () => {
    const valuesToDispatch = {
      accessToken: '',
      email: 'xxx@xxx.pl',
      firstName: 'xxx',
      lastName: 'yyy',
    };
    dispatchValues(valuesToDispatch, dispatch);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      email: 'xxx@xxx.pl',
      type: 'cc_setSeekerEmail',
    });

    expect(mockAppDispatch).not.toHaveBeenCalledWith({
      accessToken: '',
      type: 'setFbAccessToken',
    });

    expect(mockAppDispatch).not.toHaveBeenCalledWith({
      firstName: 'xxx',
      lastName: 'yyy',
      type: 'cc_setSeekerName',
    });
  });

  const getMockedFuncs = ({ isError }: { isError: boolean }) => ({
    formik: {
      setFieldTouched: jest.fn(),
      setFieldValue: jest.fn(),
      validateForm: () => (isError ? { email: 'error' } : {}),
    },
    setShowApiCallErrorBanner: jest.fn(),
    handleSubmit: jest.fn(),
  });

  it('successful FB API call and successful validation', async () => {
    const { formik, setShowApiCallErrorBanner, handleSubmit } = getMockedFuncs({ isError: false });
    const handleFacebookLogin = getCallbackFunc({
      formik,
      setShowApiCallErrorBanner,
      handleSubmit,
    });
    await handleFacebookLogin({ accessToken, name: 'xxx', email: 'xxx@xxx.pl' });

    expect(setShowApiCallErrorBanner).not.toHaveBeenCalled();
    expect(formik.setFieldTouched).toHaveBeenCalled();
    expect(formik.setFieldValue).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('successful FB API call and unsuccessful validation', async () => {
    const { formik, setShowApiCallErrorBanner, handleSubmit } = getMockedFuncs({ isError: true });
    const handleFacebookLogin = getCallbackFunc({
      formik,
      setShowApiCallErrorBanner,
      handleSubmit,
    });
    await handleFacebookLogin({ accessToken, name: 'xxx', email: 'xxx@xxx.pl' });

    expect(setShowApiCallErrorBanner).not.toHaveBeenCalled();
    expect(formik.setFieldTouched).toHaveBeenCalled();
    expect(formik.setFieldValue).toHaveBeenCalled();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('unsuccessful FB API call', async () => {
    const { formik, setShowApiCallErrorBanner, handleSubmit } = getMockedFuncs({ isError: false });
    const handleFacebookLogin = getCallbackFunc({
      formik,
      setShowApiCallErrorBanner,
      handleSubmit,
    });
    await handleFacebookLogin({ accessToken: '', name: '', email: '' });

    expect(setShowApiCallErrorBanner).toHaveBeenCalled();
    expect(formik.setFieldTouched).not.toHaveBeenCalled();
    expect(formik.setFieldValue).not.toHaveBeenCalled();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', async () => {
    renderPage([useProvidersCountMock(150)], {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    await waitFor(() => {
      const el = queryByTextWithMarkup(/Great news! There are 150 nannies nearby./i);
      if (!el) return;
      expect(el).toBeInTheDocument();
    });
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage([useProvidersCountMock(150)], {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 0,
        value: 0,
        reason: { kind: '' },
      },
    });
    expect(
      screen.getByText('See caregivers who match your needs. It only takes a few seconds.')
    ).toBeInTheDocument();
  });
});

describe('Child Care - Name Before Email with LD flag', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: savedLocalStorage });
  });

  const ldFlags: FeatureFlags = {
    [CLIENT_FEATURE_FLAGS.SEEKER_CC_NAME_BEFORE_EMAIL]: {
      reason: { kind: '' },
      value: 2,
      variationIndex: 2,
    },
  };

  it('matches snapshot', () => {
    const { asFragment } = renderPage([useProvidersCountMock(150)], ldFlags, '', true);
    expect(asFragment()).toMatchSnapshot();
  });

  it(`renders legal disclaimer and join now button`, async () => {
    renderPage([useProvidersCountMock(150)], ldFlags, '', true);

    const legalDisclaimer = screen.queryByText('By clicking "Join now", you agree to our');
    const signupButton = screen.getByRole('button', { name: 'Join now' });
    expect(legalDisclaimer).toBeInTheDocument();
    expect(textboxEmail).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });
});
