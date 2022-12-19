import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { HOW_DID_YOU_HEAR_ABOUT_US, SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import AuthService from '@/lib/AuthService';
import AccountCreation from '@/pages/seeker/sc/account-creation/[[...param]]';
import {
  GET_CAREGIVERS_NEARBY,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
  SENIOR_CARE_SEEKER_CREATE,
} from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import {
  CLIENT_FEATURE_FLAGS,
  EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR,
  POST_A_JOB_ROUTES,
  SEEKER_ROUTES,
} from '@/constants';
import { initialState as flowInitialState } from '@/state/flow';
import { TealiumUtagService } from '@/utilities/utagHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

let asFragment: any | null = null;
let btn: any | null = null;
let emailField: any | null = null;
let passwordField: any | null = null;
let hdyhauField: any | null = null;
let savedLocalStorage: Storage;
let mockRouter: any = null;

jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

jest.mock('@/utilities/utagHelper', () => ({
  TealiumUtagService: {
    view: jest.fn(),
  },
}));

const passingEmail = 'test@test.com';
const passingPassword = 'ABCDEFGH';
const failingAccountCreateMsg = 'Custom SeniorCareSeekerCreateError error message.';

const passwordPassingAllButAccountCreate = 'passesAllButLast';

const testingZipCode = '78665';
const emailValidationMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: passingEmail,
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [] },
    },
  },
};

const passwordValidationMock = (matchPassword: string) => {
  return {
    request: {
      query: VALIDATE_MEMBER_PASSWORD,
      variables: {
        password: matchPassword,
      },
    },
    result: {
      data: {
        validateMemberPassword: { errors: [] },
      },
    },
  };
};

const passwordValidationMockMatchingEmail = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: passingEmail,
    },
  },
  result: {
    data: {
      validateMemberPassword: { errors: [] },
    },
  },
};

const caregiversNearbyMock = {
  request: {
    query: GET_CAREGIVERS_NEARBY,
    variables: {
      zipcode: testingZipCode,
      serviceType: 'SENIOR_CARE',
      radius: 1,
      subServiceType: null,
    },
  },
  result: {
    data: {
      getCaregiversNearby: 60,
    },
  },
};

const failingSeekerCreateMock = {
  request: {
    query: SENIOR_CARE_SEEKER_CREATE,
    variables: {
      input: {
        email: passingEmail,
        password: passwordPassingAllButAccountCreate,
        firstName: 'John',
        lastName: 'Smith',
        zipcode: testingZipCode,
        referrerCookie: undefined,
        careType: SENIOR_CARE_TYPE.IN_HOME,
        howDidYouHearAboutUs: undefined,
      },
    },
  },
  result: {
    data: {
      seniorCareSeekerCreate: {
        errors: [
          {
            __typename: 'SeniorCareSeekerCreateError',
            message: failingAccountCreateMsg,
          },
        ],
        __typename: 'SeniorCareSeekerCreateError',
      },
    },
  },
};

const testReferrerCookieValue = 'testReferrerCookieValue';

const seekerCreateWithReferrerCookieMock = {
  request: {
    query: SENIOR_CARE_SEEKER_CREATE,
    variables: {
      input: {
        email: passingEmail,
        password: passingPassword,
        firstName: 'John',
        lastName: 'Smith',
        zipcode: testingZipCode,
        referrerCookie: testReferrerCookieValue,
        careType: SENIOR_CARE_TYPE.IN_HOME,
        howDidYouHearAboutUs: undefined,
      },
    },
  },
  result: {
    data: {
      seniorCareSeekerCreate: {
        __typename: 'SeniorCareSeekerCreateSuccess',
        authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
        memberId: '4747',
        oneTimeToken: 'oneTimeToken',
      },
    },
  },
};

const seekerCreateWithoutReferrerCookieMock = {
  request: {
    query: SENIOR_CARE_SEEKER_CREATE,
    variables: {
      input: {
        email: passingEmail,
        password: passingPassword,
        firstName: 'John',
        lastName: 'Smith',
        zipcode: testingZipCode,
        referrerCookie: null,
        careType: SENIOR_CARE_TYPE.IN_HOME,
        howDidYouHearAboutUs: undefined,
      },
    },
  },
  result: {
    data: {
      seniorCareSeekerCreate: {
        __typename: 'SeniorCareSeekerCreateSuccess',
        authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
        memberId: '4747',
        oneTimeToken: 'oneTimeToken',
      },
    },
  },
};

const seekerCreateWithHdyhauMock = {
  request: {
    query: SENIOR_CARE_SEEKER_CREATE,
    variables: {
      input: {
        email: passingEmail,
        password: passingPassword,
        firstName: 'John',
        lastName: 'Smith',
        zipcode: testingZipCode,
        referrerCookie: undefined,
        careType: SENIOR_CARE_TYPE.IN_HOME,
        howDidYouHearAboutUs: HOW_DID_YOU_HEAR_ABOUT_US.TV_AD,
      },
    },
  },
  result: {
    data: {
      seniorCareSeekerCreate: {
        __typename: 'SeniorCareSeekerCreateSuccess',
        authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
        memberId: '4747',
        oneTimeToken: 'oneTimeToken',
      },
    },
  },
};

interface ReactElementOptions extends RenderVarsOptions {
  router: any;
  computedFlags?: any;
}

function buildReactElements(options: ReactElementOptions) {
  const { mocks, router, referrerCookie, ldFlags } = options;
  const initialState: AppState = {
    ...initialAppState,
    seeker: {
      ...initialAppState.seeker,
      zipcode: testingZipCode,
      typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
    },
    flow: {
      ...flowInitialState,
      referrerCookie,
    },
  };

  return (
    <RouterContext.Provider value={router}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <FeatureFlagsProvider flags={ldFlags || {}}>
          <AppStateProvider initialStateOverride={initialState}>
            <AccountCreation />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
}

interface RenderVarsOptions {
  mocks: any;
  referrerCookie?: string | null | undefined;
  ldFlags?: FeatureFlags | undefined;
  computedFlags?: any;
  pathname?: string;
}

function setupRenderVars(options: RenderVarsOptions) {
  const { mocks, referrerCookie, ldFlags, computedFlags, pathname = '' } = options;
  let rerender: () => void;
  mockRouter = {
    beforePopState: () => {},
    query: { param: [] },
    pathname,
    asPath: pathname,
    basePath: '',
    push: jest.fn((url) => {
      if (url === SEEKER_ROUTES.ACCOUNT_CREATION_NAME) {
        mockRouter.query.param = ['name'];
      } else if (url === SEEKER_ROUTES.ACCOUNT_CREATION_PASSWORD) {
        mockRouter.query.param = ['password'];
      } else {
        mockRouter.query.param = [];
      }
      // since we're mocking the router, we need to manually rerender on pushes
      rerender();
    }),
    replace: jest.fn(),
  };

  const view = render(
    buildReactElements({ mocks, router: mockRouter, referrerCookie, ldFlags, computedFlags })
  );
  emailField = screen.getByLabelText('Email address');
  btn = screen.getByRole('button', { name: 'Continue' });

  if (ldFlags?.[CLIENT_FEATURE_FLAGS.HDYHAU]?.variationIndex === 1) {
    hdyhauField = screen.getByRole('button', { name: 'How did you hear about us?' });
  }
  ({ asFragment } = view);
  rerender = () =>
    view.rerender(
      buildReactElements({ mocks, router: mockRouter, referrerCookie, ldFlags, computedFlags })
    );
}

describe('seeker account-creation page', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
    // Delete the real local storage first
    Object.defineProperty(window, 'localStorage', { value: undefined });
  });
  afterAll(() => {
    // Restore the real local storage
    Object.defineProperty(window, 'localStorage', { value: savedLocalStorage });
  });

  afterEach(() => {
    mockRouter = null;
    redirectLoginSpy.mockClear();
  });

  it('matches snapshot', async () => {
    setupRenderVars({
      mocks: [emailValidationMock, passwordValidationMock(passingPassword), caregiversNearbyMock],
    });
    await screen.findByText(/Create a free account to see caregivers who match your needs./i);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    setupRenderVars({
      mocks: [emailValidationMock, passwordValidationMock(passingPassword), caregiversNearbyMock],
    });

    expect(
      await screen.findByText(/Create a free account to see caregivers who match your needs./i)
    ).toBeVisible();
  });

  it('disables button on start', async () => {
    setupRenderVars({
      mocks: [emailValidationMock, passwordValidationMock(passingPassword), caregiversNearbyMock],
    });
    await waitFor(() => expect(btn).toBeDisabled());
  });

  it('button enables when passed valid email', async () => {
    setupRenderVars({
      mocks: [emailValidationMock, passwordValidationMock(passingPassword), caregiversNearbyMock],
    });
    expect(btn).toBeDisabled();
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());
  });

  it('button is disabled when passed valid email and password that are equal', async () => {
    setupRenderVars({
      mocks: [emailValidationMock, passwordValidationMockMatchingEmail, caregiversNearbyMock],
    });
    expect(btn).toBeDisabled();
    // Use `passingEmail` on both inputs
    fireEvent.change(emailField, { target: { value: passingEmail } });

    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());

    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/What's your name?/i)).toBeVisible());

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());

    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/You're one step closer to finding your perfect caregiver/i)
      ).toBeVisible()
    );

    passwordField = screen.getByLabelText('Password');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.change(passwordField, { target: { value: passingEmail } });
    fireEvent.blur(passwordField);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(await screen.findByText(EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR)).toBeVisible();
  });

  it('display and fill NameForm after click next button', async () => {
    setupRenderVars({
      mocks: [emailValidationMock, caregiversNearbyMock],
    });
    expect(btn).toBeDisabled();
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());

    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/What's your name\?/i)).toBeVisible());
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_ROUTES.ACCOUNT_CREATION_NAME);

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());
  });

  it('Checks the error message in the screen when mutation for account creation fails', async () => {
    const ldFlags: FeatureFlags = {};
    setupRenderVars({
      mocks: [
        emailValidationMock,
        passwordValidationMock(passwordPassingAllButAccountCreate),
        caregiversNearbyMock,
        failingSeekerCreateMock,
      ],
      ldFlags,
    });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/What's your name?/i)).toBeVisible());

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());

    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/You're one step closer to finding your perfect caregiver/i)
      ).toBeVisible()
    );

    passwordField = screen.getByLabelText('Password');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.change(passwordField, { target: { value: passwordPassingAllButAccountCreate } });
    fireEvent.blur(passwordField);

    await waitFor(() => expect(submitBtn).toBeEnabled());

    fireEvent.click(submitBtn);

    expect(await screen.findByText(failingAccountCreateMsg)).toBeVisible();
  });

  it('Includes the referrerCookie value in the seniorCareSeekerCreate mutation', async () => {
    setupRenderVars({
      mocks: [
        emailValidationMock,
        passwordValidationMock(passingPassword),
        caregiversNearbyMock,
        seekerCreateWithReferrerCookieMock,
      ],

      referrerCookie: testReferrerCookieValue,
    });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());

    fireEvent.click(btn);

    await screen.findByText(/What's your name\?/i);

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());

    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/You're one step closer to finding your perfect caregiver/i)
      ).toBeVisible()
    );

    passwordField = screen.getByLabelText('Password');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.change(passwordField, { target: { value: passingPassword } });
    fireEvent.blur(passwordField);

    await waitFor(() => expect(submitBtn).toBeEnabled());

    fireEvent.click(submitBtn);

    // AuthService.redirectLogin() will only be called in the case where our `seekerCreateWithReferrerCookieMock`
    // mutation mock was found and invoked
    await waitFor(() => expect(redirectLoginSpy).toHaveBeenCalledTimes(1));
    expect(redirectLoginSpy).toHaveBeenCalledWith(
      POST_A_JOB_ROUTES.POST_A_JOB,
      'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
      'oneTimeToken'
    );
  });

  it('Includes a null referrerCookie value in the seniorCareSeekerCreate mutation', async () => {
    setupRenderVars({
      mocks: [
        emailValidationMock,
        passwordValidationMock(passingPassword),
        caregiversNearbyMock,
        seekerCreateWithoutReferrerCookieMock,
      ],

      referrerCookie: null,
    });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());

    fireEvent.click(btn);

    await screen.findByText(/What's your name\?/i);

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());

    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/You're one step closer to finding your perfect caregiver/i)
      ).toBeVisible()
    );

    passwordField = screen.getByLabelText('Password');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.change(passwordField, { target: { value: passingPassword } });
    fireEvent.blur(passwordField);

    await waitFor(() => expect(submitBtn).toBeEnabled());

    fireEvent.click(submitBtn);

    // AuthService.redirectLogin() will only be called in the case where our `seekerCreateWithoutReferrerCookieMock`
    // mutation mock was found and invoked
    await waitFor(() => expect(redirectLoginSpy).toHaveBeenCalledTimes(1));
    expect(redirectLoginSpy).toHaveBeenCalledWith(
      POST_A_JOB_ROUTES.POST_A_JOB,
      'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
      'oneTimeToken'
    );
  });

  it('Includes the HDYHAU value on the seniorCareSeekerCreate mutation', async () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.HDYHAU]: {
        reason: { kind: '' },
        value: 1,
        variationIndex: 1,
      },
    };

    setupRenderVars({
      mocks: [
        emailValidationMock,
        caregiversNearbyMock,
        seekerCreateWithHdyhauMock,
        passwordValidationMock(passingPassword),
      ],
      ldFlags,
    });

    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    expect(hdyhauField).toBeVisible();
    const hdyhauInput = hdyhauField.parentElement?.querySelector('input');
    fireEvent.change(hdyhauInput!, { target: { value: HOW_DID_YOU_HEAR_ABOUT_US.TV_AD } });
    fireEvent.blur(hdyhauInput);
    fireEvent.blur(hdyhauField);

    await waitFor(() => expect(btn).toBeEnabled());

    fireEvent.click(btn);

    await screen.findByText(/What's your name\?/i);

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nxtBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nxtBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nxtBtn).toBeEnabled());

    fireEvent.click(nxtBtn);

    await screen.findByText(/You're one step closer/i);

    const submitBtn = screen.getByRole('button', { name: 'Submit' });

    passwordField = screen.getByLabelText('Password');

    fireEvent.change(passwordField, { target: { value: passingPassword } });
    fireEvent.blur(passwordField);

    await waitFor(() => expect(submitBtn).toBeEnabled());
  });

  it('TealiumUtagService.utagViewed should be called after seeker account creation', async () => {
    setupRenderVars({
      mocks: [
        emailValidationMock,
        passwordValidationMock(passingPassword),
        caregiversNearbyMock,
        seekerCreateWithReferrerCookieMock,
      ],

      referrerCookie: testReferrerCookieValue,
    });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);

    await waitFor(() => expect(btn).toBeEnabled());

    fireEvent.click(btn);

    await screen.findByText(/What's your name\?/i);

    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());

    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/You're one step closer to finding your perfect caregiver/i)
      ).toBeVisible()
    );

    passwordField = screen.getByLabelText('Password');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.change(passwordField, { target: { value: passingPassword } });
    fireEvent.blur(passwordField);

    await waitFor(() => expect(submitBtn).toBeEnabled());

    fireEvent.click(submitBtn);

    await waitFor(() => expect(TealiumUtagService.view).toHaveBeenCalled());
  });

  it('calls all analytic events when feature flag is on', async () => {
    // Listeners/Spy Mocks
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');
    const ampliEmailListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledEmailCollection');
    const ampliNameListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledFirstAndLastName');
    const ampliAccountListener = jest.spyOn(AmpliHelper.ampli, 'accountCreatedSeeker');
    const ampliIdentifyListener = jest.spyOn(AmpliHelper.ampli, 'identify');

    // Setup
    setupRenderVars({
      mocks: [
        emailValidationMock,
        passwordValidationMock(passingPassword),
        caregiversNearbyMock,
        seekerCreateWithReferrerCookieMock,
      ],
      referrerCookie: testReferrerCookieValue,
      ldFlags: {
        [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
          value: 'variation',
          variationIndex: 1,
          reason: { kind: 'FALLTHROUGH' },
        },
      },
    });

    // Trigger email events
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.blur(emailField);
    await waitFor(() => expect(btn).toBeEnabled());
    fireEvent.click(btn);
    await screen.findByText(/What's your name\?/i);

    // Expected email events
    expect(ampliEmailListener).toHaveBeenCalledTimes(1);
    expect(amplitudeListener).toHaveBeenCalledTimes(1);
    expect(amplitudeListener.mock.calls[0][0]).toMatchObject({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'Email and Password',
      },
    });

    // Trigger name events
    const firstNameField = screen.getByLabelText('First name');
    const lastNameField = screen.getByLabelText('Last name');
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.change(firstNameField, { target: { value: 'John' } });
    await waitFor(() => expect(nextBtn).toBeDisabled());
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    await waitFor(() => expect(nextBtn).toBeEnabled());
    fireEvent.click(nextBtn);
    await waitFor(() =>
      expect(
        screen.getByText(/You're one step closer to finding your perfect caregiver/i)
      ).toBeVisible()
    );

    // Expected name events
    expect(ampliNameListener).toHaveBeenCalledTimes(1);
    expect(amplitudeListener).toHaveBeenCalledTimes(2);
    expect(amplitudeListener.mock.calls[1][0]).toMatchObject({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'first and last name',
      },
    });

    // Trigger account creation and password events
    passwordField = screen.getByLabelText('Password');
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.change(passwordField, { target: { value: passingPassword } });
    fireEvent.blur(passwordField);
    await waitFor(() => expect(submitBtn).toBeEnabled());
    fireEvent.click(submitBtn);

    // Final expected events
    await waitFor(() => expect(ampliIdentifyListener).toBeCalledTimes(1));
    expect(ampliIdentifyListener.mock.calls[0][0]).toEqual('4747');
    expect(ampliAccountListener).toHaveBeenCalledTimes(1);
    expect(amplitudeListener).toHaveBeenCalledTimes(3);
    expect(amplitudeListener.mock.calls[2][0]).toMatchObject({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'password_only_screen',
      },
    });
  });
});
