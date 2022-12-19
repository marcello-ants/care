import { NextRouter, useRouter } from 'next/router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServerError } from '@apollo/client/core';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import LastStep from '@/components/pages/seeker/pc/last-step/last-step';
import { PETCARE_RECURRING_JOB_CREATE } from '@/components/request/GQL';
import { AppState } from '@/types/app';
import logger from '@/lib/clientLogger';

import { generatePetCareJobCreateInput } from '@/utilities/gqlPayloadHelper';
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

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

jest.mock('@/utilities/utagHelper', () => ({
  __esModule: true,
  TealiumUtagService: {
    view: jest.fn(),
  },
}));
const tealiumMock = TealiumUtagService.view as jest.Mock;

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '02452',
  },
  seekerPC: {
    ...initialAppState.seekerPC,
  },
};

const postAJobInput = generatePetCareJobCreateInput(initialState.seekerPC, initialState.seeker);
const postAJobMock: MockedResponse = {
  request: {
    query: PETCARE_RECURRING_JOB_CREATE,
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

describe('Seeker - Pet Care - last step', () => {
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
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/seeker/cc/ideal-caregiver',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    loggerWarnMock.mockReset();
    loggerErrorMock.mockReset();
  });

  it('matches snapshot', async () => {
    const view = renderPage(initialState);
    const nextButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(nextButton).toBeEnabled());

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('Filter our invalid chars from pets description', async () => {
    renderPage(initialState);
    const description = screen.getByRole('textbox');
    userEvent.paste(description, 'My pets are the BEST! Ὣ♂');
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'job_setJobDescription',
      description: 'My pets are the BEST! ',
      reducer: {
        prefix: 'pc',
        type: 'job_reducer',
      },
    });
  });

  it('should redirect the user to the second next page after Submit click results in a successful job post', async () => {
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
        reducer: {
          prefix: 'pc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer: {
          prefix: 'pc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(
      () =>
        expect(window.location.assign).toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fpetcare%2Fpre-rate-card%3FenrollFlow%3Dtrue'
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
        reducer: {
          prefix: 'pc',
          type: 'job_reducer',
        },
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
      seekerPC: {
        ...initialState.seekerPC,
        jobPost: {
          ...initialState.seekerPC.jobPost,
          submissionInfo: {
            ...initialState.seekerPC.jobPost.submissionInfo,
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
        reducer: {
          prefix: 'pc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer: {
          prefix: 'pc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(
      () =>
        expect(window.location.assign).toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fpetcare%2Fpre-rate-card%3FenrollFlow%3Dtrue'
        ),
      { timeout: 1500 }
    );
  });

  it('should execute PAJ request on page load and log a warning if another auth error is received', async () => {
    const state = {
      ...initialState,
      seekerPC: {
        ...initialState.seekerPC,
        jobPost: {
          ...initialState.seekerPC.jobPost,
          submissionInfo: {
            ...initialState.seekerPC.jobPost.submissionInfo,
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
        reducer: {
          prefix: 'pc',
          type: 'job_reducer',
        },
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
      seekerPC: {
        ...initialState.seekerPC,
        jobPost: {
          ...initialState.seekerPC.jobPost,
          submissionInfo: {
            ...initialState.seekerPC.jobPost.submissionInfo,
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
          '/vis/auth/login?forwardUrl=/app/ratecard/petcare/pre-rate-card?enrollFlow=true'
        ),
      { timeout: 1500 }
    );
  });

  it('sends the right data for Tealium event', async () => {
    const tealiumData: TealiumData = {
      sessionId: undefined,
      slots: ['/us-subscription/action/seeker/paj/pc'],
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
});
