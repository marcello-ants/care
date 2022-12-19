import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { NextRouter, useRouter } from 'next/router';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { AppState } from '@/types/app';

import IdealCaregiver from '@/pages/ideal-caregiver';
import { SENIOR_CARE_RECURRING_JOB_CREATE } from '@/components/request/GQL';
import { CLIENT_FEATURE_FLAGS, POST_A_JOB_ROUTES } from '@/constants';
import { ServerError } from '@apollo/client/core';
import { generateJobCreateInput } from '@/utilities/gqlPayloadHelper';
import logger from '@/lib/clientLogger';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

jest.mock('@/components/FeatureFlagsContext', () => ({
  useFeatureFlags: jest.fn().mockReturnValue({ flags: {} }),
}));

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

let mockRouter: Pick<NextRouter, 'push' | 'pathname'>;

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
  },
};

const postAJobInput = generateJobCreateInput(initialState.seeker.jobPost);

const postAJobMock: MockedResponse = {
  request: {
    query: SENIOR_CARE_RECURRING_JOB_CREATE,
    variables: {
      input: postAJobInput,
    },
  },
  result: {
    data: {
      seniorCareRecurringJobCreate: {
        job: { id: 123 },
        __typename: 'SeniorCareRecurringJobCreatePayload',
      },
    },
  },
};

const inappropiateLanguageDescription =
  'This is a description with InappropiateLanguage, there are some forbidden words like bath or naked, this is an example. This is a description with InappropiateLanguage, there are some forbidden words like bath or naked, this is an example.';

const innapropiateLanguageState = {
  ...initialState,
  seeker: {
    ...initialState.seeker,
    jobPost: {
      ...initialState.seeker.jobPost,
      idealCaregiver: {
        ...initialState.seeker.jobPost.idealCaregiver,
        details: inappropiateLanguageDescription,
      },
    },
  },
};
const postAJobInappropiateLanguageInput = generateJobCreateInput(
  innapropiateLanguageState.seeker.jobPost
);
const postAJobInappropiateLanguageMock: MockedResponse = {
  request: {
    query: SENIOR_CARE_RECURRING_JOB_CREATE,
    variables: {
      input: {
        ...postAJobInappropiateLanguageInput,
      },
    },
  },
  result: {
    data: {
      seniorCareRecurringJobCreate: {
        errors: [
          {
            message:
              'Inappropriate language detected. Please check the information you entered in the Job Description field.',
            __typename: 'InappropriateLanguageInput',
          },
        ],
        __typename: 'SeniorCareRecurringJobCreateError',
      },
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
        <IdealCaregiver />
      </AppStateProvider>
    </MockedProvider>
  );
}

describe('Seeker - Senior Care - Ideal Caregiver', () => {
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
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/ideal-caregiver',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    loggerWarnMock.mockReset();
    loggerErrorMock.mockReset();
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderPage(initialState);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    expect(asFragment()).toMatchSnapshot();
  });

  it('should redirect the user to the next page after Submit click results in a successful job post', async () => {
    renderPage(initialState, [postAJobMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();

    await waitFor(() =>
      // should have dispatched than a submission was attempted
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setSubmissionAttempted',
        submissionAttempted: true,
        attempts: 1,
      })
    );

    await waitFor(() =>
      // should have dispatched another message clearing that data after a successful PAJ
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setSubmissionAttempted',
        submissionAttempted: false,
        attempts: 0,
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({ type: 'setJobStatus', jobSuccessful: true })
    );
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU)
    );
  });

  it('should log a warning after Submit click results in an auth error', async () => {
    renderPage(initialState, [postAJobAuthFailureMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setSubmissionAttempted',
        submissionAttempted: true,
        attempts: 1,
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
      seeker: {
        ...initialState.seeker,
        jobPost: {
          ...initialState.seeker.jobPost,
          idealCaregiver: {
            ...initialState.seeker.jobPost.idealCaregiver,
            submissionAttempted: true,
            attempts: 1,
          },
        },
      },
    };

    renderPage(state, [postAJobMock]);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setSubmissionAttempted',
        submissionAttempted: false,
        attempts: 0,
      })
    );
    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({ type: 'setJobStatus', jobSuccessful: true })
    );
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU)
    );
  });

  it('should execute PAJ request on page load and log a warning if another auth error is received', async () => {
    const state = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        jobPost: {
          ...initialState.seeker.jobPost,
          idealCaregiver: {
            ...initialState.seeker.jobPost.idealCaregiver,
            submissionAttempted: true,
            attempts: 1,
          },
        },
      },
    };

    renderPage(state, [postAJobAuthFailureMock]);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setSubmissionAttempted',
        submissionAttempted: true,
        attempts: 2,
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

  it('should execute PAJ request on page load and log an error when user is at max number of retries and if another auth error is received', async () => {
    const state = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        jobPost: {
          ...initialState.seeker.jobPost,
          idealCaregiver: {
            ...initialState.seeker.jobPost.idealCaregiver,
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
    await waitFor(() =>
      expect(mockRouter.push).not.toHaveBeenCalledWith(POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU)
    );
  });

  it('should show an error if used innapropiate language description', async () => {
    renderPage(innapropiateLanguageState, [postAJobInappropiateLanguageMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();

    await waitFor(() =>
      expect(loggerErrorMock).toHaveBeenCalledWith({
        event: 'postAJobInappropriateLanguageInput',
        graphQLError:
          'Inappropriate language detected. Please check the information you entered in the Job Description field.',
      })
    );
  });

  it('should fire both analytic events when feature flag is on', async () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'jobPostedCaregiverNeeds');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');

    (useFeatureFlags as jest.Mock).mockReturnValue({
      flags: { [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: { variationIndex: 1 } },
    });

    renderPage(initialState, [postAJobMock]);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());
    submitButton.click();

    await waitFor(() => {
      expect(ampliListener).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(amplitudeListener).toBeCalledTimes(1);
    });
  });
});
