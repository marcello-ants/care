import React from 'react';
import { PrepareTreeOptions, preRenderPage } from '@/__setup__/testUtil';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthService from '@/lib/AuthService';
import userEmailStore from '@/lib/UserEmailStore';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { SEEKER_CREATE } from '@/components/request/GQL';
import {
  CLIENT_FEATURE_FLAGS,
  FLOWS,
  SEEKER_CHILD_CARE_ROUTES,
  VerticalsAbbreviation,
} from '@/constants';
import { SubServiceType } from '@/__generated__/globalTypes';
import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { AccountCreationNameFormProps } from '@/components/pages/seeker/three-step-account-creation/interfaces';
import { DefaultCareKind } from '@/types/seekerCC';
import { SERVICE_TYPE_BY_VERTICAL } from '@/components/pages/seeker/three-step-account-creation/constants';
import { FeatureFlags } from '@/components/FeatureFlagsContext';

jest.mock('@/lib/AuthService');
jest.mock('@/components/hooks/useNearbyCaregivers');
jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(() => jest.fn()),
}));
const AuthServiceMock = AuthService as jest.Mock;
const redirectLoginSpy = jest.fn();

AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

let textboxFirstName: HTMLElement;
let textboxLastName: HTMLElement;
let buttonJoinNow: HTMLElement;

const TEST_DATA_ZIP_CODE = '02452';
const TEST_DATA_FIRST_NAME = 'John';
const TEST_DATA_LAST_NAME = 'Smith';
const TEST_DATA_EMAIL = 'email@test.com';
const TEST_DATA_CARE_DATE = 'WITHIN_A_WEEK';

userEmailStore.getEmail = jest.fn(() => TEST_DATA_EMAIL);
userEmailStore.clearEmail = jest.fn();

const seekerCreateWithoutReferrerCookieMock = (vertical: VerticalsAbbreviation) => ({
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_EMAIL,
        firstName: TEST_DATA_FIRST_NAME,
        lastName: TEST_DATA_LAST_NAME,
        serviceType: SERVICE_TYPE_BY_VERTICAL[vertical],
        zipcode: TEST_DATA_ZIP_CODE,
        careDate: TEST_DATA_CARE_DATE,
        ...(vertical === 'CC'
          ? {
              subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
            }
          : {}),
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        __typename: 'SeekerCreateSuccess',
        authToken: 'testToken',
        memberId: '100000',
      },
    },
  },
});
const failingAccountCreateMsg = 'An error occurred creating your account, please try again.';
const failingSeekerCreateMock = (vertical: VerticalsAbbreviation) => ({
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_EMAIL,
        firstName: TEST_DATA_FIRST_NAME,
        lastName: TEST_DATA_LAST_NAME,
        serviceType: SERVICE_TYPE_BY_VERTICAL[vertical],
        zipcode: TEST_DATA_ZIP_CODE,
        careDate: TEST_DATA_CARE_DATE,
        ...(vertical === 'CC' || vertical === 'DC'
          ? {
              subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
            }
          : {}),
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        errors: [
          {
            __typename: 'SeekerCreateError',
            message: failingAccountCreateMsg,
          },
        ],
        __typename: 'SeekerCreateError',
      },
    },
  },
});

const initialState: AppState = {
  ...initialAppState,
  flow: {
    ...initialAppState.flow,
    flowName: FLOWS.SEEKER_HOUSEKEEPING.name,
    facebookData: {
      accessToken: 'fbAccessToken',
    },
  },
  seeker: {
    ...initialAppState.seeker,
    zipcode: TEST_DATA_ZIP_CODE,
  },
  seekerCC: {
    ...initialAppState.seekerCC,
    email: TEST_DATA_EMAIL,
    careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
  },
};

function renderPage(props: AccountCreationNameFormProps, options?: PrepareTreeOptions) {
  const { renderFn, routerMock } = preRenderPage({
    appState: initialState,
    ...options,
  });
  const view = renderFn(<AccountCreationNameForm {...props} />);

  textboxFirstName = screen.getByRole('textbox', { name: 'First name' });
  textboxLastName = screen.getByRole('textbox', { name: 'Last name' });
  if (!options?.flags?.[CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION]) {
    buttonJoinNow = screen.getByRole('button', {
      name: props.vertical === 'DC' ? 'Join and view matches' : 'Join now',
    });
  }
  return { view, routerMock };
}

describe('name and last name account creation form for CC, HK, PC, TU, DC, IB', () => {
  const CASES: AccountCreationNameFormProps[] = [
    {
      vertical: 'CC',
      verticalState: initialState.seekerCC,
      nextPageURL: '/seeker/cc/v2/account-creation/password',
    },
    { vertical: 'HK', verticalState: initialState.seekerHK, nextPageURL: '/next-page' },
    { vertical: 'PC', verticalState: initialState.seekerPC, nextPageURL: '/next-page' },
    { vertical: 'TU', verticalState: initialState.seekerTU, nextPageURL: '/next-page' },
    { vertical: 'DC', verticalState: initialState.seekerCC, nextPageURL: '/next-page' },
    { vertical: 'IB', verticalState: initialState.seekerCC, nextPageURL: '/next-page' },
  ];
  it.each(CASES)('matches snapshots for $vertical', (props) => {
    const { view } = renderPage(props);

    expect(view.asFragment()).toMatchSnapshot();
  });

  it.each(CASES)('renders correctly for $vertical', (props) => {
    renderPage(props);
    expect(textboxFirstName).toBeInTheDocument();
    expect(textboxLastName).toBeInTheDocument();
    expect(buttonJoinNow).toBeInTheDocument();
  });

  it.each(CASES)('shows validation errors for $vertical', async (props) => {
    renderPage(props);

    userEvent.type(textboxFirstName, '222');
    userEvent.type(textboxLastName, 'o');
    fireEvent.blur(textboxLastName);

    expect(
      await screen.findByText(/Special characters or numbers are not allowed/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name needs to have at least two letters/)
    ).toBeInTheDocument();

    userEvent.clear(textboxFirstName);
    userEvent.clear(textboxLastName);
    fireEvent.blur(textboxLastName);

    expect(await screen.findByText(/First name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Last name is required/)).toBeInTheDocument();
  });

  it.each(CASES)('creates an account for $vertical', async (props) => {
    renderPage(props, {
      mocks: [seekerCreateWithoutReferrerCookieMock(props.vertical)],
    });

    userEvent.type(textboxFirstName, TEST_DATA_FIRST_NAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => expect(textboxFirstName).toBeValid());

    userEvent.type(textboxLastName, TEST_DATA_LAST_NAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => expect(textboxLastName).toBeValid());

    userEvent.click(buttonJoinNow);

    await waitFor(() => expect(redirectLoginSpy).toHaveBeenCalled(), { timeout: 2000 });
    expect(userEmailStore.clearEmail).toHaveBeenCalled();
  });

  it.each(CASES)('fails to create an account for $vertical', async (props) => {
    renderPage(props, { mocks: [failingSeekerCreateMock(props.vertical)] });

    userEvent.type(textboxFirstName, TEST_DATA_FIRST_NAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => expect(textboxFirstName).toBeValid());

    userEvent.type(textboxLastName, TEST_DATA_LAST_NAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => expect(textboxLastName).toBeValid());

    userEvent.click(buttonJoinNow);
    expect(await screen.findByText(failingAccountCreateMsg)).toBeVisible();
  });

  it('creates an account for CC with $flow and redirects to $url', async () => {
    redirectLoginSpy.mockReset();
    renderPage(CASES[0], {
      mocks: [seekerCreateWithoutReferrerCookieMock(CASES[0].vertical)],
    });

    userEvent.type(textboxFirstName, TEST_DATA_FIRST_NAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => expect(textboxFirstName).toBeValid());

    userEvent.type(textboxLastName, TEST_DATA_LAST_NAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => expect(textboxLastName).toBeValid());

    userEvent.click(buttonJoinNow);

    await waitFor(
      () =>
        expect(redirectLoginSpy).toHaveBeenCalledWith(
          '//seeker/cc/v2/account-creation/password',
          'testToken'
        ),
      {
        timeout: 2000,
      }
    );
  });

  it('name before email test does not create an account for CC and navigates to email', async () => {
    redirectLoginSpy.mockReset();
    const overrideState: AppState = {
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
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_NAME_BEFORE_EMAIL]: {
        reason: { kind: '' },
        value: 2,
        variationIndex: 2,
      },
    };
    const customCase = {
      ...CASES[0],
      nextPageURL: '/seeker/cc/v2/account-creation/email',
    };
    const { routerMock } = renderPage(customCase, {
      appState: overrideState,
      flags: ldFlags,
    });

    userEvent.type(textboxFirstName, TEST_DATA_FIRST_NAME);
    fireEvent.blur(textboxFirstName);
    await waitFor(() => expect(textboxFirstName).toBeValid());

    userEvent.type(textboxLastName, TEST_DATA_LAST_NAME);
    fireEvent.blur(textboxLastName);
    await waitFor(() => expect(textboxLastName).toBeValid());

    userEvent.click(buttonJoinNow);

    await waitFor(
      () =>
        expect(routerMock.push).toHaveBeenCalledWith(
          SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL
        ),
      {
        timeout: 2000,
      }
    );
    expect(redirectLoginSpy).not.toHaveBeenCalled();
  });

  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(CASES[0], {
      flags: {
        [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
          variationIndex: 2,
          value: 2,
          reason: { kind: '' },
        },
      },
    });
    expect(screen.getByText(/What's your name?/)).toBeInTheDocument();
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(CASES[0], {
      flags: {
        [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
          variationIndex: 0,
          value: 0,
          reason: { kind: '' },
        },
      },
    });
    expect(screen.getByText('Almost done, add a few details about yourself.')).toBeInTheDocument();
  });
  it('should render with SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION Variation 2 CTA text', () => {
    renderPage(CASES[4], {
      flags: {
        [CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION]: {
          variationIndex: 0,
          value: 2,
          reason: { kind: '' },
        },
      },
    });
    expect(screen.getByText('Agree & view matching daycares')).toBeInTheDocument();
  });
  it('should render with SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION Variation 3 CTA text', () => {
    renderPage(CASES[4], {
      flags: {
        [CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION]: {
          variationIndex: 0,
          value: 3,
          reason: { kind: '' },
        },
      },
    });
    expect(screen.getByText('Join & view matching daycares')).toBeInTheDocument();
  });
  it('should render with SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION Variation 4 CTA text', () => {
    renderPage(CASES[4], {
      flags: {
        [CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION]: {
          variationIndex: 0,
          value: 4,
          reason: { kind: '' },
        },
      },
    });
    expect(screen.getByText('View matching daycares')).toBeInTheDocument();
  });

  it.each(CASES)(
    'should show error message when the first and last name have special characters and SEEKER_NAME_SPECIAL_CHARS_VALIDATION = 2 for $vertical',
    async (props) => {
      renderPage(props, {
        flags: {
          [CLIENT_FEATURE_FLAGS.SEEKER_NAME_SPECIAL_CHARS_VALIDATION]: {
            variationIndex: 2,
            value: 2,
            reason: { kind: '' },
          },
        },
      });

      userEvent.type(textboxFirstName, 'jane@');
      fireEvent.blur(textboxFirstName);
      userEvent.type(textboxLastName, '!doe');
      fireEvent.blur(textboxLastName);

      expect(
        await screen.findByText(
          /Please enter a valid first name. Special characters or numbers are not allowed./
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          /Please enter a valid last name. Special characters or numbers are not allowed./
        )
      ).toBeInTheDocument();
    }
  );

  it('should display One more step! as page header for IB short enrollment', () => {
    renderPage({ vertical: 'IB', verticalState: initialState.seekerCC, nextPageURL: '/next-page' });
    expect(screen.getByText('One more step!')).toBeInTheDocument();
  });
});
