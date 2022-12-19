import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServerError } from '@apollo/client/core';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useMediaQuery } from '@material-ui/core';
import dayjs from 'dayjs';
import logger from '@/lib/clientLogger';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { generateHousekeepingJobCreateInput } from '@/utilities/gqlPayloadHelper';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import {
  HOUSEKEEPING_ONE_TIME_JOB_CREATE,
  HOUSEKEEPING_RECURRING_JOB_CREATE,
} from '@/components/request/GQL';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import useProviderCount from '@/components/hooks/useProviderCount';
import LastStep from '../last-step';

const loggerWarnMock = jest.fn();

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: '',
    },
  };
});

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');
  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn(),
  };
});

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const windowLocationAssignMock = jest.fn();

let mockRouter: Pick<NextRouter, 'push' | 'pathname' | 'asPath' | 'basePath'>;

jest.mock('@/components/hooks/useProviderCount');
const mockProviderCount = {
  displayProviderMessage: true,
  numOfProviders: 100,
};
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
};

const todayDate = dayjs();
const startDate = todayDate.add(1, 'day').format('YYYY-MM-DD');
const endDate = todayDate.add(3, 'day').format('YYYY-MM-DD');

const onetimeState = {
  ...initialState.seekerHK,
  jobPost: {
    ...initialState.seekerHK.jobPost,
    jobType: 'onetime',
    jobDateTime: {
      dates: {
        startDate,
        endDate,
      },
      time: {
        startTime: '12:00',
        endTime: '14:00',
      },
    },
  },
};

const recurringState = {
  ...initialState.seekerHK,
  jobPost: {
    ...initialState.seekerHK.jobPost,
    jobType: 'recurring',
    jobDateTime: {
      dates: {
        startDate,
        endDate,
      },
      time: {
        startTime: '12:00',
        endTime: '14:00',
      },
    },
    schedule: {
      monday: {
        blocks: [
          { start: '07:00', end: '10:00' },
          { start: '14:00', end: '20:00' },
        ],
      },
      friday: { blocks: [{ start: '12:00', end: '18:00' }] },
    },
  },
};

const postAJobOnetimeInput = generateHousekeepingJobCreateInput(onetimeState, initialState.seeker);

const postAJobRecurringInput = generateHousekeepingJobCreateInput(
  recurringState,
  initialState.seeker
);

const postAJobOneTimeMock: MockedResponse = {
  request: {
    query: HOUSEKEEPING_ONE_TIME_JOB_CREATE,
    variables: {
      input: postAJobOnetimeInput,
    },
  },
  result: {
    data: {
      job: { id: 123 },
    },
  },
};

const postAJobRecurringMock: MockedResponse = {
  request: {
    query: HOUSEKEEPING_RECURRING_JOB_CREATE,
    variables: {
      input: postAJobRecurringInput,
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

const pathname = '/seeker/hk/last-step';

const postAJobAuthFailureMock: MockedResponse = {
  ...postAJobOneTimeMock,
  error: authError,
};

function renderPage(state: AppState, mocks: MockedResponse[] = [], ldFlags: FeatureFlags = {}) {
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    basePath: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

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

describe('/seeker/hk/last-step', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
    logger.warn = loggerWarnMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
    (useProviderCount as jest.Mock).mockReturnValue(mockProviderCount);

    mockRouter = {
      push: jest.fn(),
      pathname,
      asPath: pathname,
      basePath: '',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterAll(() => {
    window.location = originalLocation;
    loggerWarnMock.mockReset();
  });

  it('matches snapshot', async () => {
    const view = renderPage(initialState);
    const nextButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(nextButton).toBeEnabled());
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('renders caregiver count banner', () => {
    renderPage(initialState);

    expect(screen.getByText('Nice! 100 housekeepers near you!')).toBeInTheDocument();
  });

  it('should change description', async () => {
    renderPage(initialState);
    const description = screen.getByRole('textbox');
    fireEvent.change(description, { target: { value: 'Test description' } });
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'job_setJobDescription',
      description: 'Test description',
      reducer: {
        prefix: 'hk',
        type: 'job_reducer',
      },
    });
  });

  it('should successful submit one time and redirect the user to the next page', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    const state = {
      ...initialState,
      seekerHK: {
        ...onetimeState,
      },
    };
    renderPage(state, [postAJobOneTimeMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();
    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: 1,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: false,
        attempts: 0,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(
      () =>
        expect(windowLocationAssignMock).toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fhousekeeping%2Fpre-rate-card%3FenrollFlow%3Dtrue'
        ),
      { timeout: 1500 }
    );
  });

  it('should successfully submit recurring job and redirect the user to the next page', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    const state = {
      ...initialState,
      seekerHK: {
        ...recurringState,
      },
    };
    renderPage(state, [postAJobRecurringMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();
    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: 1,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: false,
        attempts: 0,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: true,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(
      () =>
        expect(windowLocationAssignMock).toHaveBeenCalledWith(
          '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fhousekeeping%2Fpre-rate-card%3FenrollFlow%3Dtrue'
        ),
      { timeout: 1500 }
    );
  });

  it('sends the right data for Tealium event', async () => {
    const tealiumData: TealiumData = {
      email: null,
      sessionId: undefined,
      slots: ['/us-subscription/action/seeker/paj/hk'],
    };
    const state = {
      ...initialState,
      seekerHK: {
        ...recurringState,
      },
    };

    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderPage(state, [postAJobRecurringMock]);
    userEvent.click(screen.getByText('Submit'));

    await waitFor(
      async () => {
        expect(tealiumMock).toHaveBeenCalledWith(tealiumData);
      },
      { timeout: 1200 }
    );
  });

  it('should send error because of incorrect data in request for one time job', async () => {
    const state = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '',
      },
      seekerHK: {
        ...onetimeState,
      },
    };
    renderPage(state, [postAJobAuthFailureMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();
    await waitFor(() => {
      expect(loggerWarnMock).toHaveBeenCalledWith({
        event: 'postAJobErrorNotFrom401',
        graphQLError: expect.anything(),
      });
    });
  });

  it('should send error because of incorrect data in request for recurring job', async () => {
    const state = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '',
      },
      seekerHK: {
        ...recurringState,
      },
    };
    renderPage(state, [postAJobAuthFailureMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();
    await waitFor(() => {
      expect(loggerWarnMock).toHaveBeenCalledWith({
        event: 'postAJobErrorNotFrom401',
        graphQLError: expect.anything(),
      });
    });
  });

  it('should log a warning after the Submit click results in an auth error', async () => {
    const state = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
      },
      seekerHK: {
        ...onetimeState,
      },
    };
    renderPage(state, [postAJobAuthFailureMock]);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();

    await waitFor(async () => expect(loggerWarnMock).toHaveBeenCalledTimes(1));

    await waitFor(async () =>
      expect(loggerWarnMock).toHaveBeenCalledWith({
        event: 'postAJobErrorFrom401',
        graphQLError: 'undefined',
      })
    );

    await waitFor(() =>
      expect(loggerWarnMock).toHaveBeenCalledWith({
        event: 'postAJobErrorFrom401',
        graphQLError: 'undefined',
      })
    );
  });

  it('should redirect with Continue without submitting button without submitting job because of attempts >= 3', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    const state = {
      ...initialAppState,
      seekerHK: {
        ...initialAppState.seekerHK,
        jobPost: {
          ...initialAppState.seekerHK.jobPost,
          submissionInfo: {
            ...initialAppState.seekerHK.jobPost.submissionInfo,
            attempts: 3,
          },
        },
      },
    };
    renderPage(state, [postAJobAuthFailureMock]);
    const submitButton = screen.getByRole('button', { name: 'Continue without submitting' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    submitButton.click();

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'job_setJobPostSuccessful',
        jobSuccessful: false,
        reducer: {
          prefix: 'hk',
          type: 'job_reducer',
        },
      })
    );

    await waitFor(() =>
      expect(windowLocationAssignMock).toHaveBeenCalledWith(
        '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fhousekeeping%2Fpre-rate-card%3FenrollFlow%3Dtrue'
      )
    );
  });

  it('should be a "Continue" button without the ability to create the job again', async () => {
    const state = {
      ...initialAppState,
      seekerHK: {
        ...initialAppState.seekerHK,
        jobPost: {
          ...initialAppState.seekerHK.jobPost,
          submissionInfo: {
            ...initialAppState.seekerHK.jobPost.submissionInfo,
            jobPostSuccessful: true,
          },
        },
      },
    };
    renderPage(state, [postAJobAuthFailureMock]);
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(continueButton).toBeEnabled());
    fireEvent.click(continueButton);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/vis/auth/login?forwardUrl=%2Fapp%2Fratecard%2Fhousekeeping%2Fpre-rate-card%3FenrollFlow%3Dtrue'
    );
  });
});
