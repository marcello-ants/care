// External Dependencies
import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { AppState } from '@/types/app';

// Internal Dependencies
import LastStep from '@/components/pages/seeker/cc/last-step/last-step';
import { CHILD_CARE_RECURRING_JOB_CREATE } from '@/components/request/GQL';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { ServerError } from '@apollo/client/core';
import { generateChildCareJobCreateInput } from '@/utilities/gqlPayloadHelper';
import { TealiumUtagService } from '@/utilities/utagHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import { DistanceUnit, ServiceType } from '@/__generated__/globalTypes';
import { topCaregiverMock } from '@/components/pages/seeker/cc/last-step/tests/mocks';
import { setupWindowLocation } from '@/__setup__/testUtil';

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
    link: jest.fn(),
  },
}));
let mockView: jest.Mock | null = null;

const analyticsMock = jest
  .spyOn(AnalyticsHelper, 'logEvent')
  .mockImplementation(() => Promise.resolve());

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '02452',
    jobPost: {
      ...initialAppState.seeker.jobPost,
    },
  },
  seekerCC: {
    ...initialAppState.seekerCC,
  },
};

const postAJobInput = generateChildCareJobCreateInput(initialState.seekerCC, initialState.seeker);
const postAJobMock: MockedResponse = {
  request: {
    query: CHILD_CARE_RECURRING_JOB_CREATE,
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

const getTopCaregiversMock = {
  request: {
    query: GET_TOP_CAREGIVERS,
    variables: {
      zipcode: '02452',
      serviceID: ServiceType.CHILD_CARE,
      numResults: 15,
      hourlyRate: {
        maximum: {
          amount: '22',
          currencyCode: 'USD',
        },
        minimum: {
          amount: '14',
          currencyCode: 'USD',
        },
      },
      fullTime: true,
      maxDistanceFromSeeker: {
        unit: DistanceUnit.MILES,
        value: 25,
      },
    },
  },
  result: {
    data: {
      topCaregivers: [topCaregiverMock],
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

function renderPage(state: AppState, mocks: MockedResponse[] = [], ldFlags: FeatureFlags = {}) {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <FeatureFlagsProvider flags={ldFlags}>
        <AppStateProvider initialStateOverride={state}>
          <LastStep />
        </AppStateProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
}

describe('Seeker - Child Care - last step', () => {
  const redirectLink =
    '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fchildcare%2Fpre-rate-card%3FenrollFlow%3Dtrue';
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
    mockView = TealiumUtagService.view as jest.Mock;
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
    const view = renderPage(initialState, [getTopCaregiversMock]);
    await screen.findByRole('button', { name: 'Submit' });

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('Filter our invalid chars from family description', async () => {
    renderPage(initialState);
    const description = await screen.findByRole('textbox');
    fireEvent.change(description, { target: { value: 'My Family is the BEST! Ὣ♂' } });
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'job_setJobDescription',
      description: 'My Family is the BEST! ',
      reducer: {
        prefix: 'cc',
        type: 'job_reducer',
      },
    });
  });

  it('should redirect the user to the second page, register Tealium slots and trigger one logChildCareEvent after Submit click results in a successful job post', async () => {
    const { mock: locationMock } = setupWindowLocation();
    renderPage(initialState, [getTopCaregiversMock, postAJobMock]);

    const submitButton = await screen.findByRole('button', { name: 'Submit' });
    submitButton.click();

    await waitFor(
      () => {
        expect(mockAppDispatch).toHaveBeenNthCalledWith(2, {
          type: 'job_setJobSubmissionInfo',
          submissionAttempted: true,
          attempts: 1,
          reducer: {
            prefix: 'cc',
            type: 'job_reducer',
          },
        });
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      // should have dispatched another message clearing that data after a successful PAJ
      expect(mockAppDispatch).toHaveBeenNthCalledWith(3, {
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: false,
        attempts: 0,
        reducer: {
          prefix: 'cc',
          type: 'job_reducer',
        },
      });
    });

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenNthCalledWith(4, {
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer: {
          prefix: 'cc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() => expect(locationMock).toHaveBeenCalledWith(redirectLink), { timeout: 1500 });

    await waitFor(() =>
      expect(mockView).toHaveBeenCalledWith({
        slots: ['/us-subscription/action/seeker/paj/cc'],
      })
    );

    await waitFor(() =>
      expect(analyticsMock.mock.calls).toEqual([
        [
          {
            name: 'Job Posted',
            data: {
              cta_clicked: 'next',
              final_step: true,
              job_flow: '',
              job_step: 'PAJ - Family info',
              vertical: 'Childcare',
              what_else_text: 0,
            },
          },
        ],
        [
          {
            name: 'Job Posted',
            data: {
              cta_clicked: 'next',
              final_step: false,
              job_flow: '',
              job_step: 'PAJ - Finish',
              vertical: 'Childcare',
            },
          },
        ],
      ])
    );
  });

  it('should log a warning after the user session after Submit click results in an auth error', async () => {
    renderPage(initialState, [getTopCaregiversMock, postAJobAuthFailureMock]);
    const submitButton = await screen.findByRole('button', { name: 'Submit' });

    submitButton.click();

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: 1,
        reducer: {
          prefix: 'cc',
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
      seekerCC: {
        ...initialState.seekerCC,
        jobPost: {
          ...initialState.seekerCC.jobPost,
          submissionInfo: {
            ...initialState.seekerCC.jobPost.submissionInfo,
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
          prefix: 'cc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer: {
          prefix: 'cc',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith(redirectLink), {
      timeout: 1500,
    });
  });

  it('should execute PAJ request on page load and log a warning if another auth error is received', async () => {
    const state = {
      ...initialState,
      seekerCC: {
        ...initialState.seekerCC,
        jobPost: {
          ...initialState.seekerCC.jobPost,
          submissionInfo: {
            ...initialState.seekerCC.jobPost.submissionInfo,
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
          prefix: 'cc',
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

  it('should execute PAJ request on page load and log an error when user is at max number of retries and if another auth error is received', async () => {
    const state = {
      ...initialState,
      seekerCC: {
        ...initialState.seekerCC,
        jobPost: {
          ...initialState.seekerCC.jobPost,
          submissionInfo: {
            ...initialState.seekerCC.jobPost.submissionInfo,
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
  });
});
