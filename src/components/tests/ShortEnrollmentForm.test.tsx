import { AppState } from '@/types/app';
import { MockedResponse } from '@apollo/client/testing';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initialAppState } from '@/state';
import { ServiceType } from '@/__generated__/globalTypes';
import AuthService from '@/lib/AuthService';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  GET_ZIP_CODE_SUMMARY,
  SEEKER_CREATE,
  VALIDATE_MEMBER_EMAIL,
} from '@/components/request/GQL';
import { preRenderPage } from '@/__setup__/testUtil';
import { ERROR_CREATING_ACCOUNT } from '@/components/pages/seeker/three-step-account-creation/constants';
import { SHORT_ENROLLMENT_ROUTES } from '@/constants';

import { FeatureFlags } from '../FeatureFlagsContext';
import ShortEnrollmentForm from '../ShortEnrollmentForm';

let buttonJoinNow: HTMLElement;
let textboxEmail: HTMLElement;
let textboxFirstName: HTMLElement;
let textboxLastName: HTMLElement;
let zipcodeInput: HTMLElement;
let buttonCareKind: HTMLElement;

jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const analyticsMock = jest
  .spyOn(AnalyticsHelper, 'logEvent')
  .mockImplementation(() => Promise.resolve());

const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '',
  },
};

const TEST_DATA_SUCCESS_FIRST_NAME = 'John';
const TEST_DATA_SUCCESS_LAST_NAME = 'Doe';
const TEST_DATA_SUCCESS_EMAIL = 'email@success.com';
const TEST_DATA_SUCCESS_ZIP_CODE = '02453';

const getZipcodeSummarySuccessMock = {
  request: {
    query: GET_ZIP_CODE_SUMMARY,
    variables: {
      zipcode: TEST_DATA_SUCCESS_ZIP_CODE,
    },
  },
  result: {
    data: {
      getZipcodeSummary: {
        __typename: 'ZipcodeSummary',
        city: 'Waltham',
        state: 'MA',
        zipcode: TEST_DATA_SUCCESS_ZIP_CODE,
        latitude: 1,
        longitude: 1,
      },
    },
  },
};

const seekerCreateWithoutReferrerCookieSuccessMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_SUCCESS_FIRST_NAME,
        lastName: TEST_DATA_SUCCESS_LAST_NAME,
        serviceType: ServiceType.CHILD_CARE,
        zipcode: TEST_DATA_SUCCESS_ZIP_CODE,
        howDidYouHearAboutUs: undefined,
        careDate: null,
        referrerCookie: undefined,
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
        firstName: TEST_DATA_SUCCESS_FIRST_NAME,
        lastName: TEST_DATA_SUCCESS_LAST_NAME,
        serviceType: ServiceType.CHILD_CARE,
        zipcode: TEST_DATA_SUCCESS_ZIP_CODE,
        howDidYouHearAboutUs: undefined,
        careDate: null,
        referrerCookie: undefined,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        errors: [
          {
            __typename: 'MemberCreateError',
            message: ERROR_CREATING_ACCOUNT,
          },
        ],
        __typename: 'SeekerCreateError',
      },
    },
  },
};

const emailValidationFailureMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: '',
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [{ message: 'Please enter a valid email.' }] },
    },
  },
};

const emailValidationSuccessMock = {
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

async function renderPage(
  mocks: MockedResponse[] = [],
  ldFlags: FeatureFlags = {},
  state: AppState = initialState,
  pathname: string = SHORT_ENROLLMENT_ROUTES.INDEX,
  nextPageURL: string = 'password'
) {
  const { renderFn } = preRenderPage({ mocks, flags: ldFlags, appState: state, pathname });

  return renderFn(<ShortEnrollmentForm nextPageURL={nextPageURL} />);
}

const getElements = () => {
  textboxFirstName = screen.getByRole('textbox', { name: 'First name' });
  textboxLastName = screen.getByRole('textbox', { name: 'Last name' });
  textboxEmail = screen.getByRole('textbox', { name: 'Email address' });
  zipcodeInput = screen.getByLabelText('ZIP code');
  buttonJoinNow = screen.getByRole('button', { name: 'Join free now' });
  buttonCareKind = screen.getByRole('button', { name: 'What type of care do you need?' });
};

const enterFormDataAndTriggerSubmit = async () => {
  fireEvent.mouseDown(buttonCareKind);
  const listbox = within(screen.getByRole('listbox'));
  fireEvent.click(listbox.getByText('Child care'));
  await waitFor(() => {
    expect(screen.getByText('Child care')).toBeInTheDocument();
  });

  userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
  fireEvent.blur(textboxEmail);
  await waitFor(() => {
    expect(textboxEmail).toBeValid();
  });

  userEvent.type(textboxFirstName, TEST_DATA_SUCCESS_FIRST_NAME);
  fireEvent.blur(textboxFirstName);
  await waitFor(() => {
    expect(textboxFirstName).toBeValid();
  });

  userEvent.type(textboxLastName, TEST_DATA_SUCCESS_LAST_NAME);
  fireEvent.blur(textboxLastName);
  await waitFor(() => {
    expect(textboxLastName).toBeValid();
  });

  fireEvent.change(zipcodeInput, { target: { value: TEST_DATA_SUCCESS_ZIP_CODE } });
  fireEvent.blur(zipcodeInput);

  await waitFor(() => {
    expect(screen.getByText('Waltham, MA')).toBeInTheDocument();
  });

  userEvent.click(buttonJoinNow);
};

describe('ShortEnrollmentForm', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows validation errors', async () => {
    await renderPage([emailValidationFailureMock]);
    getElements();
    userEvent.click(buttonJoinNow);
    expect(await screen.findByText(/Please select an option/)).toBeInTheDocument();
    expect(await screen.findByText(/First name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Last name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Please enter a valid email./)).toBeInTheDocument();
    expect(await screen.findByText(/Enter a valid ZIP code/)).toBeInTheDocument();
  });

  it('submits form successfully, logs events and gets redirected', async () => {
    renderPage([
      emailValidationSuccessMock,
      getZipcodeSummarySuccessMock,
      seekerCreateWithoutReferrerCookieSuccessMock,
    ]);
    getElements();

    await enterFormDataAndTriggerSubmit();

    await waitFor(() => {
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          vertical: 'Childcare',
          final_step: true,
          enrollment_step: 'SingleEnrollment',
          cta_clicked: 'Join free now',
          enrollment_flow: 'SingleEnrollment',
          memberType: 'seeker',
        },
      });
    });

    await await waitFor(
      () =>
        expect(redirectLoginSpy).toHaveBeenCalledWith(
          '/password',
          'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.'
        ),
      {
        timeout: 2000,
      }
    );
  });

  it('shows error message if the form submission is unsuccessful', async () => {
    renderPage([
      emailValidationSuccessMock,
      getZipcodeSummarySuccessMock,
      seekerCreateWithoutReferrerCookieFailureMock,
    ]);
    getElements();

    await enterFormDataAndTriggerSubmit();
    await waitFor(() => {
      expect(
        screen.getByText('An error occurred creating your account, please try again.')
      ).toBeInTheDocument();
    });
  });
});
