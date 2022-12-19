import React from 'react';
import { NextRouter } from 'next/router';
import { render, waitFor, screen, fireEvent, MatcherFunction } from '@testing-library/react';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';
import { GraphQLError } from 'graphql';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { ServiceType, SubServiceType } from '@/__generated__/globalTypes';
import AuthService from '@/lib/AuthService';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import {
  GET_CAREGIVERS_NEARBY,
  SEEKER_CREATE,
  VALIDATE_MEMBER_EMAIL,
} from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { CLIENT_FEATURE_FLAGS, FLOWS } from '@/constants';
import DaycareAccountCreation from '@/components/pages/seeker/cc/account-creation/daycare';
import ContactMethod from '@/components/pages/seeker/cc/account-creation/ContactMethod';

let savedLocalStorage: Storage;
let mockRouter: NextRouter;
let textboxFirstName: HTMLElement;
let textboxLastName: HTMLElement;
let textboxEmail: HTMLElement;
let textboxPhone: HTMLElement;
let buttonJoinNow: HTMLElement;

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

jest.mock('@/components/pages/seeker/cc/account-creation/ContactMethod');
jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

const TEST_DATA_SUCCESS_EMAIL = 'email@success.com';
const TEST_DATA_ZIP_CODE = '78665';
const TEST_DATA_FIRSTNAME = 'John';
const TEST_DATA_LASTNAME = 'Smith';
const TEST_DATA_PHONE = '5555555555';
const TEST_DATE_CARE_DATE = 'WITHIN_A_WEEK';

const withMarkup =
  (query: (fn: MatcherFunction) => Element | null) =>
  (target: string | RegExp): Element | null =>
    query((content: string, element: Element | null) => {
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

const seekerCreateWithoutReferrerCookieSuccessMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.DAY_CARE,
        zipcode: TEST_DATA_ZIP_CODE,
        referrerCookie: undefined,
        howDidYouHearAboutUs: undefined,
        careDate: TEST_DATE_CARE_DATE,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        __typename: 'SeekerCreateSuccess',
        authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
        memberId: '4747',
      },
    },
  },
};

const seekerCreateWithoutReferrerCookieFailureMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.DAY_CARE,
        zipcode: TEST_DATA_ZIP_CODE,
        referrerCookie: undefined,
        howDidYouHearAboutUs: undefined,
        careDate: TEST_DATE_CARE_DATE,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        errors: [
          {
            __typename: 'MemberCreateError',
            message: 'MemberCreateError',
          },
        ],
        __typename: 'SeekerCreateError',
      },
    },
  },
};

const seekerCreateWithoutReferrerCookieGraphQLFailureMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.DAY_CARE,
        zipcode: TEST_DATA_ZIP_CODE,
        referrerCookie: undefined,
        howDidYouHearAboutUs: undefined,
      },
    },
  },
  errors: [new GraphQLError('GraphQLError')],
};

const getCaregiversNearbyMock = (count: number, radius: number) => ({
  request: {
    query: GET_CAREGIVERS_NEARBY,
    variables: {
      zipcode: TEST_DATA_ZIP_CODE,
      serviceType: 'CHILD_CARE',
      radius,
      subServiceType: SubServiceType.DAY_CARE,
    },
  },
  result: {
    data: {
      getCaregiversNearby: count,
    },
  },
});

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

function renderPage({
  mocks = [],
  appState = initialState,
  overrideFlags,
}: {
  mocks?: MockedResponse[];
  appState?: AppState;
  overrideFlags?: Record<string, LDEvaluationDetail>;
}) {
  const pathname = '/seeker/cc/account-creation/daycare';
  // @ts-ignore
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    basePath: '',
  };
  const flags = {
    'enrollment-mfe-seeker-hdyhau': { variationIndex: 1, value: 1, reason: { kind: '' } },
    'growth-dc-enrollment-cta-iteration': { variationIndex: 1, value: 1, reason: { kind: '' } },
    ...overrideFlags,
  };

  return render(
    <RouterContext.Provider value={mockRouter}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <FeatureFlagsProvider flags={flags}>
          <AppStateProvider initialStateOverride={appState}>
            <DaycareAccountCreation />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
}

function getElements() {
  textboxFirstName = screen.getByRole('textbox', { name: 'First name' });
  textboxLastName = screen.getByRole('textbox', { name: 'Last name' });
  textboxEmail = screen.getByRole('textbox', { name: 'Email Address' });
  textboxPhone = screen.getByRole('textbox', { name: 'Phone number' });
  buttonJoinNow = screen.getByRole('button', { name: 'Join and view matches' });
}

describe('Day Care Account Creation - Sign Up', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined });
  });

  afterAll(() => {
    Object.defineProperty(window, 'localStorage', { value: savedLocalStorage });
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage({ mocks: [getCaregiversNearbyMock(150, 1)] });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    renderPage({ mocks: [getCaregiversNearbyMock(150, 1)] });
    getElements();

    expect(textboxFirstName).toBeInTheDocument();
    expect(textboxLastName).toBeInTheDocument();
    expect(textboxEmail).toBeInTheDocument();
    expect(textboxPhone).toBeInTheDocument();
    expect(buttonJoinNow).toBeInTheDocument();
  });

  it('renders caregivers nearby banner', async () => {
    renderPage({ mocks: [getCaregiversNearbyMock(150, 1)] });

    await waitFor(() => {
      const el = queryByTextWithMarkup(/Nice! \d+ caregivers are near you!/i);
      if (!el) return;
      expect(el).toBeInTheDocument();
    });
  });

  it('does not render caregivers nearby banner', async () => {
    renderPage({
      mocks: [
        getCaregiversNearbyMock(0, 1),
        getCaregiversNearbyMock(0, 3),
        getCaregiversNearbyMock(0, 5),
        getCaregiversNearbyMock(0, 10),
        getCaregiversNearbyMock(0, 20),
      ],
    });

    await waitFor(() => {
      expect(queryByTextWithMarkup(/Nice! \d+ caregivers are near you!/i)).not.toBeInTheDocument();
    });
  });

  it('enables button when fields are valid', async () => {
    renderPage({ mocks: [getCaregiversNearbyMock(150, 1), emailValidationMock] });
    getElements();

    userEvent.type(textboxFirstName, 'john');
    fireEvent.blur(textboxFirstName);
    userEvent.type(textboxLastName, 'smith');
    fireEvent.blur(textboxLastName);
    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    userEvent.type(textboxPhone, TEST_DATA_PHONE);
    fireEvent.blur(textboxPhone);

    await waitFor(() => {
      expect(buttonJoinNow).toBeEnabled();
    });
  });

  it('submits form successfully and gets redirected', async () => {
    renderPage({
      mocks: [getCaregiversNearbyMock(150, 1), seekerCreateWithoutReferrerCookieSuccessMock],
      overrideFlags: {
        [CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD]: {
          reason: { kind: 'FALLTHROUGH' },
          variationIndex: 0,
          value: 1,
        },
      },
    });
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(textboxEmail).toBeValid();
    });
    userEvent.type(textboxPhone, TEST_DATA_PHONE);
    fireEvent.blur(textboxPhone);
    await waitFor(() => {
      expect(textboxPhone).toBeValid();
    });
    userEvent.type(textboxFirstName, TEST_DATA_FIRSTNAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => {
      expect(textboxFirstName).toBeValid();
    });
    userEvent.type(textboxLastName, TEST_DATA_LASTNAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => {
      expect(textboxLastName).toBeValid();
    });
    await waitFor(() => {
      expect(buttonJoinNow).toBeEnabled();
    });
    userEvent.click(buttonJoinNow);

    await waitFor(() => expect(redirectLoginSpy).toHaveBeenCalledTimes(1), { timeout: 2000 });
  });

  it('submits form and errors message shows up', async () => {
    renderPage({
      mocks: [getCaregiversNearbyMock(150, 1), seekerCreateWithoutReferrerCookieFailureMock],
      overrideFlags: {
        [CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD]: {
          reason: { kind: 'FALLTHROUGH' },
          variationIndex: 0,
          value: 1,
        },
      },
    });
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(textboxEmail).toBeValid();
    });
    userEvent.type(textboxPhone, TEST_DATA_PHONE);
    fireEvent.blur(textboxPhone);
    await waitFor(() => {
      expect(textboxPhone).toBeValid();
    });
    userEvent.type(textboxFirstName, TEST_DATA_FIRSTNAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => {
      expect(textboxFirstName).toBeValid();
    });
    userEvent.type(textboxLastName, TEST_DATA_LASTNAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => {
      expect(textboxLastName).toBeValid();
    });
    await waitFor(() => {
      expect(buttonJoinNow).toBeEnabled();
    });
    userEvent.click(buttonJoinNow);

    await screen.findByText('MemberCreateError', undefined, { timeout: 2000 });
  });

  it('submits form and network error prevents submission', async () => {
    renderPage({
      mocks: [getCaregiversNearbyMock(150, 1), seekerCreateWithoutReferrerCookieGraphQLFailureMock],
      overrideFlags: {
        [CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD]: {
          reason: { kind: 'FALLTHROUGH' },
          variationIndex: 0,
          value: 1,
        },
      },
    });
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(textboxEmail).toBeValid();
    });
    userEvent.type(textboxPhone, TEST_DATA_PHONE);
    fireEvent.blur(textboxPhone);
    await waitFor(() => {
      expect(textboxPhone).toBeValid();
    });
    userEvent.type(textboxFirstName, TEST_DATA_FIRSTNAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => {
      expect(textboxFirstName).toBeValid();
    });
    userEvent.type(textboxLastName, TEST_DATA_LASTNAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => {
      expect(textboxLastName).toBeValid();
    });
    await waitFor(() => {
      expect(buttonJoinNow).toBeEnabled();
    });
    userEvent.click(buttonJoinNow);

    await screen.findByText(
      'An error occurred creating your account, please try again.',
      undefined,
      { timeout: 2000 }
    );
  });

  it('shows error message for invalid email', async () => {
    renderPage({ mocks: [getCaregiversNearbyMock(150, 1)] });
    getElements();

    userEvent.type(textboxEmail, 'sample');
    fireEvent.blur(textboxEmail);

    expect(await screen.findByText(/Please enter a valid email/i)).toBeInTheDocument();
  });

  it('shows error message for invalid phone number', async () => {
    renderPage({ mocks: [getCaregiversNearbyMock(150, 1)] });
    getElements();

    userEvent.type(textboxPhone, '55555');
    fireEvent.blur(textboxPhone);

    expect(await screen.findByText(/Phone number must be valid/i)).toBeInTheDocument();
  });

  it('shows error message for invalid first name', async () => {
    renderPage({ mocks: [getCaregiversNearbyMock(150, 1)] });
    getElements();

    userEvent.type(textboxFirstName, 'a');
    fireEvent.blur(textboxFirstName);

    expect(
      await screen.findByText(/First name needs to have at least two letters./i)
    ).toBeInTheDocument();
  });

  it('shows error message for invalid last name', async () => {
    renderPage({
      mocks: [getCaregiversNearbyMock(150, 1)],
    });
    textboxLastName = screen.getByRole('textbox', { name: 'Last name' });

    userEvent.type(textboxLastName, 'a');
    fireEvent.blur(textboxLastName);

    expect(
      await screen.findByText(/Last name needs to have at least two letters./i)
    ).toBeInTheDocument();
  });

  it('redirects to first step if zipcode is not available', async () => {
    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        flowName: FLOWS.SEEKER_CHILD_CARE.name,
      },
      seeker: {
        ...initialAppState.seeker,
        zipcode: '',
      },
    };
    renderPage({ appState });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/seeker/cc/care-location');
    });
  });

  it('Shows the contact method component when test is active', async () => {
    const contatcMethodMock = ContactMethod as jest.Mock;
    contatcMethodMock.mockImplementation(() => <div>Contact Method Shown</div>);

    renderPage({
      mocks: [getCaregiversNearbyMock(150, 1)],
      overrideFlags: {
        [CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD]: {
          reason: { kind: 'FALLTHROUGH' },
          variationIndex: 1,
          value: 1,
        },
      },
    });
    expect(screen.getByText('Contact Method Shown')).toBeInTheDocument();
  });
});
