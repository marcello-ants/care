import { NextRouter, useRouter } from 'next/router';
import { render, waitFor, screen } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import LastStep from '@/components/pages/seeker/tu/last-step/last-step';
import { AppState } from '@/types/app';
import logger from '@/lib/clientLogger';
import userEvent from '@testing-library/user-event';
import { TUTORING_RECURRING_JOB_CREATE } from '@/components/request/GQL';
import { generateTutoringJobCreateInput } from '@/utilities/gqlPayloadHelper';
import { ServerError } from '@apollo/client';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';

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
      CZEN_GENERAL: '',
    },
  };
});

let mockRouter: Pick<NextRouter, 'push' | 'pathname'>;

jest.mock('@/utilities/utagHelper', () => ({
  __esModule: true,
  TealiumUtagService: {
    view: jest.fn(),
  },
}));
const tealiumMock = TealiumUtagService.view as jest.Mock;

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const reducer = {
  prefix: 'tu',
  type: 'job_reducer',
};

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '02452',
  },
  seekerTU: {
    ...initialAppState.seekerTU,
  },
};

const postAJobInput = generateTutoringJobCreateInput(initialState.seekerTU, initialState.seeker);
const postAJobMock: MockedResponse = {
  request: {
    query: TUTORING_RECURRING_JOB_CREATE,
    variables: {
      input: postAJobInput,
    },
  },
  result: {
    data: {
      job: { id: 123 },
    },
  },
};

const authError: ServerError = {
  statusCode: 401,
} as any;
const postAJobAuthFailureMock: MockedResponse = {
  ...postAJobMock,
  error: authError,
};

function renderPage(state: AppState, mocks: MockedResponse[] = []) {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AppStateProvider initialStateOverride={state}>
        <LastStep />
      </AppStateProvider>
    </MockedProvider>
  );
}

describe('Seeker - Tutoring - last step', () => {
  const realLoggerWarn = logger.warn;
  const realLoggerError = logger.error;

  const loggerWarnMock = jest.fn();
  const loggerErrorMock = jest.fn();

  beforeAll(() => {
    logger.warn = loggerWarnMock;
    logger.error = loggerErrorMock;
  });

  afterAll(() => {
    logger.warn = realLoggerWarn;
    logger.error = realLoggerError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/tu/last-step',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    loggerWarnMock.mockReset();
    loggerErrorMock.mockReset();
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderPage(initialState);
    const nextButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(nextButton).toBeEnabled());
    expect(asFragment()).toMatchSnapshot();
  });

  it('Filter our invalid chars from description', async () => {
    renderPage(initialState);
    const description = screen.getByRole('textbox');
    userEvent.paste(description, 'Nice!  Ὣ♂');
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'job_setJobDescription',
      description: 'Nice!  ',
      reducer,
    });
  });

  it('should redirect the user to pre-rate card page by clicking on Submit button when job was posted', async () => {
    // @ts-ignore
    delete window.location;
    /* eslint-disable no-restricted-globals */
    (window.location as Pick<typeof window.location, 'assign'>) = {
      assign: jest.fn(),
    };

    renderPage(initialState, [postAJobMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    userEvent.click(submitButton);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: 1,
        reducer,
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer,
      })
    );

    await waitFor(
      () =>
        expect(window.location.assign).toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Ftutoring%2Fpre-rate-card%3FenrollFlow%3Dtrue'
        ),
      { timeout: 1500 }
    );
  });

  it('should log a warning after the user session after Submit click results in an auth error', async () => {
    renderPage(initialState, [postAJobAuthFailureMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    userEvent.click(submitButton);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: 1,
        reducer,
      })
    );

    await waitFor(() => expect(loggerErrorMock).not.toHaveBeenCalled());
    await waitFor(() => expect(loggerWarnMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(loggerWarnMock).toHaveBeenCalledWith({
        event: 'postAJobErrorFrom401',
        graphQLError: 'undefined',
      })
    );
  });

  it('should execute PAJ request on page load if an attempt was previously made by the user', async () => {
    const state = {
      ...initialState,
      seekerTU: {
        ...initialState.seekerTU,
        jobPost: {
          ...initialState.seekerTU.jobPost,
          submissionInfo: {
            ...initialState.seekerTU.jobPost.submissionInfo,
            submissionAttempted: true,
            attempts: 1,
          },
        },
      },
    };

    renderPage(state, [postAJobMock]);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: false,
        attempts: 0,
        reducer,
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer,
      })
    );

    await waitFor(
      () =>
        expect(window.location.assign).toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Ftutoring%2Fpre-rate-card%3FenrollFlow%3Dtrue'
        ),
      { timeout: 1500 }
    );
  });

  it('should execute PAJ request on page load and log a warning if another auth error is received', async () => {
    const state = {
      ...initialState,
      seekerTU: {
        ...initialState.seekerTU,
        jobPost: {
          ...initialState.seekerTU.jobPost,
          submissionInfo: {
            ...initialState.seekerTU.jobPost.submissionInfo,
            submissionAttempted: true,
            attempts: 1,
          },
        },
      },
    };

    renderPage(state, [postAJobAuthFailureMock]);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: 2,
        reducer,
      })
    );

    await waitFor(() => expect(loggerErrorMock).not.toHaveBeenCalled());
    await waitFor(() => expect(loggerWarnMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(loggerWarnMock).toHaveBeenCalledWith({
        event: 'postAJobErrorFrom401',
        graphQLError: 'undefined',
      })
    );
  });

  it('should execute PAJ request on page load aand log an error when user is at max number of retries and if another auth error is received', async () => {
    const state = {
      ...initialState,
      seekerTU: {
        ...initialState.seekerTU,
        jobPost: {
          ...initialState.seekerTU.jobPost,
          submissionInfo: {
            ...initialState.seekerTU.jobPost.submissionInfo,
            submissionAttempted: true,
            attempts: 3,
          },
        },
      },
    };

    renderPage(state, [postAJobAuthFailureMock]);

    await waitFor(() => expect(loggerWarnMock).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(loggerErrorMock).toHaveBeenCalledWith({
        event: 'postAJobMaxAttemptsFrom401',
        graphQLError: 'undefined',
      })
    );
    await waitFor(
      () =>
        expect(window.location.assign).not.toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=/app/ratecard/tutoring/pre-rate-card?enrollFlow=true'
        ),
      { timeout: 1500 }
    );
  });

  it('sends the right data for Tealium event', async () => {
    const tealiumData: TealiumData = {
      sessionId: undefined,
      slots: ['/us-subscription/action/seeker/paj/tu'],
    };

    renderPage(initialState, [postAJobMock]);
    userEvent.click(screen.getByText('Submit'));

    await waitFor(
      async () => {
        expect(tealiumMock).toHaveBeenCalledWith(tealiumData);
      },
      { timeout: 1200 }
    );
  });

  it('should not allow user to post the same job', async () => {
    const state = {
      ...initialState,
      seekerTU: {
        ...initialState.seekerTU,
        jobPost: {
          ...initialState.seekerTU.jobPost,
          submissionInfo: {
            ...initialState.seekerTU.jobPost.submissionInfo,
            jobPostSuccessful: true,
          },
        },
      },
    };

    renderPage(state);
    const nextButton = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(nextButton).toBeEnabled());
  });

  it('should redirect user to prerate-card without submitting job because of MAX_JOB_POST_ATTEMPTS', async () => {
    const state = {
      ...initialState,
      seekerTU: {
        ...initialState.seekerTU,
        jobPost: {
          ...initialState.seekerTU.jobPost,
          submissionInfo: {
            ...initialState.seekerTU.jobPost.submissionInfo,
            attempts: 3,
          },
        },
      },
    };

    renderPage(state);
    const nextButton = screen.getByRole('button', { name: 'Continue without submitting' });
    await waitFor(() => expect(nextButton).toBeEnabled());
    userEvent.click(nextButton);
    expect(window.location.assign).toHaveBeenCalledWith(
      '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Ftutoring%2Fpre-rate-card%3FenrollFlow%3Dtrue'
    );
  });
});
