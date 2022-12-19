// External Dependencies
import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';

// Internal Dependencies
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

import { CareDate as GQLCareDate } from '@/__generated__/globalTypes';
import {
  GET_CAREGIVERS_NEARBY,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
} from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import {
  EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR,
  FLOWS,
  SEEKER_CHILD_CARE_ROUTES,
  CARE_DATES,
} from '@/constants';
import SeekerAccountCreation, { careDateToGQLFormat } from '../account-creation';

// Variables

let asFragment: any | null = null;
let btn: any | null = null;
let emailInput: any | null = null;
let passwordInput: any | null = null;
let savedLocalStorage: Storage;
let mockRouter: any = null;

// Test Data

const TEST_DATA_SUCCESS_EMAIL = 'email@success.com';
const TEST_DATA_FAILURE_EMAIL = 'notanemail';
const TEST_DATA_SUCCESS_PASSWORD = 'GOODPASS';
const TEST_DATA_FAILURE_PASSWORD = 'FAIL';
const TEST_DATA_FAILURE_PASSWORD_2 = 'failure';
const TEST_DATA_ZIP_CODE = '78665';
const TEST_DATA_FAILURE_PWD_MSG = 'Password is invalid.';
const TEST_DATA_SUCCESS_FIRST_NAME = 'John';
const TEST_DATA_SUCCESS_LAST_NAME = 'Doe';

// Mocks

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

const caregiversNearbyMock = {
  request: {
    query: GET_CAREGIVERS_NEARBY,
    variables: {
      zipcode: TEST_DATA_ZIP_CODE,
      serviceType: 'CHILD_CARE',
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

const passwordValidationMockMatchingEmail = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: TEST_DATA_SUCCESS_EMAIL,
    },
  },
  result: {
    data: {
      validateMemberPassword: { errors: [] },
    },
  },
};

const failingPasswordValidationMock = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: TEST_DATA_FAILURE_PASSWORD_2,
    },
  },
  result: {
    data: {
      validateMemberPassword: {
        errors: [
          {
            __typename: 'MemberPasswordInvalid',
            message: TEST_DATA_FAILURE_PWD_MSG,
          },
        ],
      },
    },
  },
};

// Utility Functions

/**
 *
 * @param mocks
 * @param router
 */
function buildReactElements(mocks: any, router: any, flags: FeatureFlags = {}) {
  const initialState: AppState = {
    ...initialAppState,
    flow: {
      ...initialAppState.flow,
      flowName: FLOWS.SEEKER_CHILD_CARE.name,
    },
    seeker: {
      ...initialAppState.seeker,
      zipcode: TEST_DATA_ZIP_CODE,
    },
  };

  return (
    <RouterContext.Provider value={router}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <FeatureFlagsProvider
          flags={{
            ...flags,
            'enrollment-mfe-seeker-hdyhau': { variationIndex: 1, value: 1, reason: { kind: '' } },
          }}>
          <AppStateProvider initialStateOverride={initialState}>
            <SeekerAccountCreation />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
}

/**
 *
 * @param mocks
 */
function setupRenderVars(mocks: any, flags: FeatureFlags = {}) {
  let rerender: () => void;
  const pathname = '/seeker/cc/account-creation';

  mockRouter = {
    query: { param: [] },
    push: jest.fn((url) => {
      if (url === SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_DETAILS) {
        mockRouter.query.param = ['details'];
      } else {
        mockRouter.query.param = [];
      }
      rerender();
    }),
    pathname,
    asPath: pathname,
    beforePopState: () => {},
  };

  const view = render(buildReactElements(mocks, mockRouter, flags));
  ({ asFragment } = view);
  btn = screen.getByRole('button', { name: 'Continue' });
  emailInput = screen.getByLabelText('Email address');
  passwordInput = screen.getByLabelText('Password');
  rerender = () => view.rerender(buildReactElements(mocks, mockRouter));
}

describe('Account Creation - Sign Up', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined });
  });

  afterAll(() => {
    // Restore the real local storage
    Object.defineProperty(window, 'localStorage', { value: savedLocalStorage });
  });

  afterEach(() => {
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);

    await screen.findByText('Create a free account');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);

    await waitFor(() => {
      expect(screen.getByText(/Create a free account/i)).toBeInTheDocument();
    });
  });

  it('disables button on start', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);

    await waitFor(() => {
      expect(btn).toBeDisabled();
    });
  });

  it('enables button when email and password are valid', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);

    expect(btn).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.change(passwordInput, { target: { value: TEST_DATA_SUCCESS_PASSWORD } });
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(btn).toBeEnabled();
    });
  });

  it('disables button when email and password are valid but equal', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMockMatchingEmail,
      caregiversNearbyMock,
    ]);

    expect(btn).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.change(passwordInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(btn).toBeDisabled();
    });

    await waitFor(() => {
      const invalidEmailPassMessage = screen.getByText(EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR);
      expect(invalidEmailPassMessage).toBeInTheDocument();
    });
  });

  it('"How you hear about us" field does not affect button, it remains enabled when form is valid', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);

    expect(btn).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: TEST_DATA_SUCCESS_PASSWORD } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(btn).toBeEnabled();
    });
  });

  it('checks error messages in the input fields with client side validation', async () => {
    setupRenderVars([caregiversNearbyMock]);

    fireEvent.change(emailInput, { target: { value: TEST_DATA_FAILURE_EMAIL } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      const invalidEmailMessage = screen.getByText('Please enter a valid email.');
      expect(invalidEmailMessage).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: TEST_DATA_FAILURE_PASSWORD } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      const invalidPasswordMessage = screen.getByText('Password must be at least 6 characters.');
      expect(invalidPasswordMessage).toBeInTheDocument();
    });
  });

  it('checks error messages in the input fields with backend validation', async () => {
    setupRenderVars([emailValidationMock, failingPasswordValidationMock, caregiversNearbyMock]);

    fireEvent.change(emailInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, { target: { value: TEST_DATA_FAILURE_PASSWORD_2 } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      const invalidPasswordMessage = screen.getByText(TEST_DATA_FAILURE_PWD_MSG);
      expect(invalidPasswordMessage).toBeInTheDocument();
    });
  });

  it('displays and fills NameForm after clicking "Continue" button', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);
    expect(btn).toBeDisabled();
    fireEvent.change(emailInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, { target: { value: TEST_DATA_SUCCESS_PASSWORD } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(btn).toBeEnabled();
    });

    fireEvent.click(btn);

    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_DETAILS);
    expect(screen.getByText(/What's your name\?/i)).toBeInTheDocument();

    const firstNameField: any | null = screen.getByLabelText('First name');
    const lastNameField: any | null = screen.getByLabelText('Last name');
    const submitBtn: any | null = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameField, { target: { value: TEST_DATA_SUCCESS_FIRST_NAME } });
    fireEvent.blur(firstNameField);
    fireEvent.change(lastNameField, { target: { value: TEST_DATA_SUCCESS_LAST_NAME } });
    fireEvent.blur(lastNameField);
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });
  });

  it('disables submit button when first name is in password', async () => {
    setupRenderVars([
      emailValidationMock,
      passwordValidationMock(TEST_DATA_SUCCESS_PASSWORD),
      caregiversNearbyMock,
    ]);
    expect(btn).toBeDisabled();
    fireEvent.change(emailInput, { target: { value: TEST_DATA_SUCCESS_EMAIL } });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, { target: { value: TEST_DATA_SUCCESS_PASSWORD } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(btn).toBeEnabled();
    });

    fireEvent.click(btn);

    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_DETAILS);
    expect(screen.getByText(/What's your name\?/i)).toBeInTheDocument();

    const firstNameInput: any | null = screen.getByLabelText('First name');
    const lastNameInput: any | null = screen.getByLabelText('Last name');
    const submitBtn: any | null = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: TEST_DATA_SUCCESS_PASSWORD } });
    fireEvent.change(lastNameInput, { target: { value: TEST_DATA_SUCCESS_LAST_NAME } });
    fireEvent.blur(firstNameInput);
    fireEvent.blur(lastNameInput);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
    await waitFor(() => {
      const invalidEmailPassMessage = screen.getByText(
        "Please don't use your first name in your password."
      );
      expect(invalidEmailPassMessage).toBeInTheDocument();
    });
  });
});

describe('careDateToGQLFormat', () => {
  it('converts careDate to GraphQL type', () => {
    expect(careDateToGQLFormat(CARE_DATES.RIGHT_NOW)).toEqual(GQLCareDate.RIGHT_NOW);
    expect(careDateToGQLFormat(CARE_DATES.WITHIN_A_WEEK)).toEqual(GQLCareDate.WITHIN_A_WEEK);
    expect(careDateToGQLFormat(CARE_DATES.IN_1_2_MONTHS)).toEqual(GQLCareDate.WITHIN_A_MONTH);
    expect(careDateToGQLFormat(CARE_DATES.JUST_BROWSING)).toEqual(GQLCareDate.JUST_BROWSING);
  });
});
