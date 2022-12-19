import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import { AppState } from '@/types/app';
import { NextRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import AuthService from '@/lib/AuthService';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import EmailPasswordIbPage from '../last-step';
import {
  existingEmailValidationMock,
  initialState,
  ibShortEnrollmentState,
  passwordValidationMock,
  seekerCreateWithoutReferrerCookieFailureMock,
  seekerCreateWithoutReferrerCookieGraphQLFailureMock,
  seekerCreateWithoutReferrerCookieSuccessMock,
  passwordErrorMock,
  TEST_DATA_SUCCESS_EMAIL,
  TEST_WRONG_PASSWORD,
} from './mocks';

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: 'https://www.dev.carezen.net',
    },
  };
});
jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
    logTestExposure: jest.fn(),
  },
}));

jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

let mockRouter: NextRouter;
let textboxPassword: HTMLElement;
let textboxEmail: HTMLElement;
let buttonJoinNow: HTMLElement;

async function renderPage(
  mocks: MockedResponse[] = [],
  ldFlags: FeatureFlags = {},
  state: AppState = initialState,
  pathname: string = '/seeker/ib/last-page'
) {
  // @ts-ignore
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  const view = render(
    <RouterContext.Provider value={mockRouter}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <FeatureFlagsProvider flags={ldFlags}>
          <AppStateProvider initialStateOverride={state}>
            <EmailPasswordIbPage />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  return view;
}

const getElements = () => {
  textboxPassword = screen.getByLabelText('Password (optional)');
  textboxEmail = screen.getByRole('textbox', { name: 'Email address' });
  buttonJoinNow = screen.getByRole('button', { name: 'Join now' });
};

describe('Child Care - Instant Book Last step page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', async () => {
    const { asFragment } = await renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows error message for invalid email', async () => {
    await renderPage();
    getElements();

    userEvent.type(textboxEmail, 'sample');
    fireEvent.blur(textboxEmail);
    expect(await screen.findByText(/Please enter a valid email/i)).toBeInTheDocument();
  });

  it('shows message for existing email', async () => {
    await renderPage([existingEmailValidationMock]);
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    expect(await screen.findByText(/This email is already registered./i)).toBeInTheDocument();
  });

  it('submits form and errors message shows up', async () => {
    await renderPage([seekerCreateWithoutReferrerCookieFailureMock]);
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => expect(textboxEmail).toBeValid());
    userEvent.click(buttonJoinNow);
    await screen.findByText('MemberCreateError', undefined, { timeout: 2000 });
  });

  it('submits form and network error prevents submission', async () => {
    await renderPage([seekerCreateWithoutReferrerCookieGraphQLFailureMock]);
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => expect(textboxEmail).toBeValid());
    userEvent.click(buttonJoinNow);
    await screen.findByText(
      'An error occurred creating your account, please try again.',
      undefined,
      { timeout: 2000 }
    );
  });

  it('submits form successfully and gets redirected', async () => {
    await renderPage([seekerCreateWithoutReferrerCookieSuccessMock]);
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => expect(textboxEmail).toBeValid());
    userEvent.click(buttonJoinNow);

    await waitFor(() =>
      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Email And Password',
          cta_clicked: 'Join now',
          created_password: 'No',
          member_type: 'Seeker',
          job_flow: 'MW VHP enrollment',
          final_step: true,
        },
      })
    );
    await waitFor(
      () =>
        expect(redirectLoginSpy).toHaveBeenNthCalledWith(
          1,
          'https://www.dev.carezen.net/app/booking/otc/careNeeds?showMatch=true&enrollFlow=true',
          'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.'
        ),
      {
        timeout: 2000,
      }
    );
  });

  it('show password error', async () => {
    await renderPage([passwordValidationMock]);
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    fireEvent.blur(textboxEmail);
    userEvent.type(textboxPassword, TEST_WRONG_PASSWORD);
    fireEvent.blur(textboxPassword);
    await waitFor(() => {
      expect(
        screen.getByText(
          /Don't use a repeating sequence of 1,2,3 or 4 characters for your password./i
        )
      ).toBeInTheDocument();
    });
  });

  it('password error response', async () => {
    await renderPage([passwordErrorMock]);
    getElements();

    userEvent.type(textboxEmail, TEST_DATA_SUCCESS_EMAIL);
    userEvent.type(textboxPassword, TEST_DATA_SUCCESS_EMAIL);
    userEvent.click(buttonJoinNow);
    expect(
      await screen.findByText(
        'Please dont use your name or email address in your password.',
        undefined,
        { timeout: 2000 }
      )
    ).toBeInTheDocument();
  });

  it('Instant Book control enrollment flow', async () => {
    await renderPage();

    expect(await screen.findByText('Last step! Create a free account')).toBeInTheDocument();
    expect(await screen.findByText('Join now')).toBeInTheDocument();
  });

  it('Instant Book shortened enrollment flow', async () => {
    await renderPage([], {}, ibShortEnrollmentState, '/seeker/ib/short/email');

    expect(await screen.findByText('Join free to book a babysitter')).toBeInTheDocument();
    expect(await screen.findByText('Next')).toBeInTheDocument();
  });
});
