import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import {
  GET_AVERAGE_JOB_WAGE,
  GET_NUMBER_OF_JOBS_NEARBY,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
  PROVIDER_CREATE,
  PROVIDER_FREE_GATED_CREATE,
} from '@/components/request/GQL';
// eslint-disable-next-line camelcase
import { validateMemberEmail_validateMemberEmail_errors } from '@/__generated__/validateMemberEmail';
// eslint-disable-next-line camelcase
import { validateMemberPassword_validateMemberPassword_errors } from '@/__generated__/validateMemberPassword';
import Account from '@/pages/provider/cc/account';
import { AppStateProvider } from '@/components/AppState';
import {
  CLIENT_FEATURE_FLAGS,
  EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR,
  PROVIDER_CHILD_CARE_ROUTES,
} from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import AuthService from '@/lib/AuthService';
import { ServiceType, DistanceUnit } from '@/__generated__/globalTypes';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

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

describe('Account', () => {
  let mockRouter: any | null = null;
  let firstNameField: HTMLElement;
  let lastNameField: HTMLElement;
  let emailField: HTMLElement;
  let passwordField: HTMLElement;
  let joinNowBtn: HTMLElement;

  const initialState: AppState = {
    ...initialAppState,
    providerCC: {
      ...initialAppState.providerCC,
      zipcode: '12345',
      distance: 25,
      state: 'IL',
      city: 'Test City',
    },
  };

  const nearbyJobsMock = {
    request: {
      query: GET_NUMBER_OF_JOBS_NEARBY,
      variables: {
        zipcode: '12345',
        serviceType: 'CHILD_CARE',
      },
    },
    result: {
      data: {
        getNumberOfNewJobsNearby: 50,
      },
    },
  };

  const wageMock = {
    request: {
      query: GET_AVERAGE_JOB_WAGE,
      variables: {
        zipcode: '12345',
        serviceType: 'CHILD_CARE',
      },
    },
    result: {
      data: {
        getJobWages: { averages: { average: { amount: 15 } } },
      },
    },
  };

  function emailValidationMock(
    email: string,
    // eslint-disable-next-line camelcase
    error?: validateMemberEmail_validateMemberEmail_errors
  ) {
    return {
      request: {
        query: VALIDATE_MEMBER_EMAIL,
        variables: {
          email,
        },
      },
      result: {
        data: {
          validateMemberEmail: { errors: [error] },
        },
      },
    };
  }

  function passwordValidationMock(
    password: string,
    // eslint-disable-next-line camelcase
    error?: validateMemberPassword_validateMemberPassword_errors
  ) {
    return {
      request: {
        query: VALIDATE_MEMBER_PASSWORD,
        variables: {
          password,
        },
      },
      result: {
        data: {
          validateMemberPassword: { errors: [error] },
        },
      },
    };
  }

  const failingAccountCreateMsg = 'An error occurred creating your account, please try again.';
  const providerCreateFailureMock = {
    request: {
      query: PROVIDER_CREATE,
      variables: {
        input: {
          serviceType: ServiceType.CHILD_CARE,
          email: 'tim@care.com',
          howDidYouHearAboutUs: undefined,
          distanceWillingToTravel: { value: 25, unit: DistanceUnit.MILES },
          password: 'test456',
          referrerCookie: initialState.flow.referrerCookie,
          zipcode: '12345',
        },
      },
    },
    result: {
      data: {
        providerCreate: {
          errors: [
            {
              __typename: 'ProviderCreateError',
              message: failingAccountCreateMsg,
            },
          ],
          __typename: 'ProviderCreateError',
        },
      },
    },
  };

  const providerCreateSuccessMock = {
    request: {
      query: PROVIDER_CREATE,
      variables: {
        input: {
          serviceType: ServiceType.CHILD_CARE,
          email: 'tim@care.com',
          howDidYouHearAboutUs: undefined,
          distanceWillingToTravel: { value: 25, unit: DistanceUnit.MILES },
          password: 'test456',
          referrerCookie: initialState.flow.referrerCookie,
          zipcode: '12345',
        },
      },
    },
    result: {
      data: {
        providerCreate: {
          __typename: 'ProviderCreateSuccess',
          authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
          memberId: '4747',
        },
      },
    },
  };

  const providerFreeGatedCreateMock = {
    request: {
      query: PROVIDER_FREE_GATED_CREATE,
      variables: {
        input: {
          memberId: '4747',
        },
      },
    },
    result: {
      data: {
        providerFreeGatedCreate: {
          __typename: 'ProviderFreeGatedCreateSuccess',
          freeGated: true,
        },
      },
    },
  };

  const featureFlagsMockTrue = {
    [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
      value: true,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
  };

  const featureFlagsMockAuth0 = {
    [CLIENT_FEATURE_FLAGS.AUTH0_PASSWORD_RULES]: {
      value: true,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
  };

  function renderPage(mocks: ReadonlyArray<MockedResponse> = []) {
    const view = render(
      <MockedProvider mocks={mocks.length ? mocks : [nearbyJobsMock, wageMock]} addTypename={false}>
        <ThemeProvider theme={theme}>
          <AppStateProvider initialStateOverride={initialState}>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <Account />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </ThemeProvider>
      </MockedProvider>
    );

    firstNameField = screen.getByLabelText('First name');
    lastNameField = screen.getByLabelText('Last name');
    emailField = screen.getByLabelText('Email address');
    passwordField = screen.getByLabelText('Password');
    joinNowBtn = screen.getByRole('button', { name: 'Join now' });

    return view;
  }

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      query: { param: [] },
      pathname: '',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should initially render the submit button as disabled', async () => {
    renderPage();
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    await waitFor(() => expect(joinNowBtn).toBeDisabled());
  });

  it('should disable the submit button if an invalid email is entered', async () => {
    renderPage([
      nearbyJobsMock,
      wageMock,
      emailValidationMock('tim@care.com'),
      emailValidationMock('invalid@care.com', {
        __typename: 'MemberEmailInvalid',
        message: 'bad email',
      }),
      passwordValidationMock('test456'),
    ]);

    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });
    fireEvent.change(passwordField, { target: { value: 'test456' } });

    await waitFor(() => expect(joinNowBtn).toBeEnabled());

    fireEvent.change(emailField, { target: { value: 'invalid@care.com' } });

    await waitFor(() => expect(joinNowBtn).toBeDisabled());
  });

  it('should disable the submit button if an invalid password is entered', async () => {
    renderPage([
      nearbyJobsMock,
      wageMock,
      emailValidationMock('tim@care.com'),
      passwordValidationMock('test456'),
      passwordValidationMock('password', {
        __typename: 'MemberPasswordInvalidTerms',
        message: 'nope',
      }),
    ]);

    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });
    fireEvent.change(passwordField, { target: { value: 'test456' } });

    await waitFor(() => expect(joinNowBtn).toBeEnabled());

    fireEvent.change(passwordField, { target: { value: 'password' } });

    await waitFor(() => expect(joinNowBtn).toBeDisabled());
  });

  it('should disable the submit button when the email is in the password', async () => {
    renderPage([
      nearbyJobsMock,
      wageMock,
      emailValidationMock('tim@care.com'),
      passwordValidationMock('test456'),
    ]);

    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });
    fireEvent.change(passwordField, { target: { value: 'tim@care.com' } });

    await waitFor(() => expect(joinNowBtn).toBeDisabled());
    expect(await screen.findByText(EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR)).toBeVisible();
  });

  it('should redirect via AuthService then route to the account created page on successful submission', async () => {
    renderPage([
      nearbyJobsMock,
      wageMock,
      emailValidationMock('tim@care.com'),
      passwordValidationMock('test456'),
      providerCreateSuccessMock,
      providerFreeGatedCreateMock,
    ]);

    fireEvent.change(firstNameField, { target: { value: 'FirstName' } });
    fireEvent.change(lastNameField, { target: { value: 'LastName' } });
    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });
    fireEvent.change(passwordField, { target: { value: 'test456' } });

    await waitFor(() => expect(joinNowBtn).toBeEnabled());

    fireEvent.click(joinNowBtn);
    // AuthService.redirectLogin() will only be called in the case where our
    // mutation mock was found and invoked
    await waitFor(() => expect(redirectLoginSpy).toHaveBeenCalledTimes(1));
  });

  it('Checks the error message in the screen when mutation for account creation fails', async () => {
    renderPage([
      nearbyJobsMock,
      wageMock,
      emailValidationMock('tim@care.com'),
      passwordValidationMock('test456'),
      providerCreateFailureMock,
      providerFreeGatedCreateMock,
    ]);

    fireEvent.change(firstNameField, { target: { value: 'FirstName' } });
    fireEvent.change(lastNameField, { target: { value: 'LastName' } });
    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });
    fireEvent.change(passwordField, { target: { value: 'test456' } });

    await waitFor(() => expect(joinNowBtn).toBeEnabled());

    fireEvent.click(joinNowBtn);

    expect(await screen.findByText(failingAccountCreateMsg)).toBeVisible();
  });

  it('should redirect back to the index page when the zipcode is missing', async () => {
    const initialStateOverride: AppState = {
      ...initialState,
      providerCC: {
        ...initialState.providerCC,
        zipcode: '',
      },
    };

    render(
      <MockedProvider mocks={[nearbyJobsMock, wageMock]} addTypename={false}>
        <ThemeProvider theme={theme}>
          <AppStateProvider initialStateOverride={initialStateOverride}>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <Account />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </ThemeProvider>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(mockRouter.replace).toBeCalledWith(PROVIDER_CHILD_CARE_ROUTES.INDEX)
    );
  });

  it('should check for 6 charactes in the password if feature flag is disabled', () => {
    const view = renderPage();

    const passwordText = view.container.querySelector('#password-helper-text');
    expect(passwordText?.textContent).toBe('At least 6 characters');
  });

  it('should check for 8 charactes in the password if feature flag is enabled', () => {
    const view = render(
      <MockedProvider mocks={[nearbyJobsMock, wageMock]} addTypename={false}>
        <ThemeProvider theme={theme}>
          <AppStateProvider initialStateOverride={initialState}>
            <FeatureFlagsProvider flags={featureFlagsMockAuth0}>
              <Account />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </ThemeProvider>
      </MockedProvider>
    );

    const passwordText = view.container.querySelector('#password-helper-text');
    expect(passwordText?.textContent).toBe('At least 8 characters');
  });
});
