import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { GET_NEW_JOBS_PROVIDER } from '@/components/request/GQL';
import { MockedProvider } from '@apollo/client/testing';
import JobsMatching from '@/pages/provider/cc/jobs-matching';
import JobCardFooter from '@/components/pages/provider/JobCardFooter';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { PROVIDER_CHILD_CARE_ROUTES, CZEN_BACKGROUND_CHECK_CC } from '@/constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialState: AppState = {
  ...initialAppState,
  providerCC: {
    ...initialAppState.providerCC,
    numberOfJobsNear: 3,
  },
};

const moreThanOneJobMatchingMock = {
  request: {
    query: GET_NEW_JOBS_PROVIDER,
    variables: {
      numResults: 3,
    },
  },
  result: {
    data: {
      getNewJobsForProvider: [
        {
          title: 'Companion Care Needed For My Mother In Round Rock',
          description:
            'We need companion care to take care of my mother in Round Rock. We would prefer someone who can handle light housekeeping. Additional responsibilities include meal preparation. We might ask you to run errands now and then. ',
          state: 'TX',
          city: 'Round Rock',
          payRange: {
            hourlyRateFrom: { amount: '14', currencyCode: 'USD', __typename: 'Money' },
            hourlyRateTo: { amount: '22', currencyCode: 'USD', __typename: 'Money' },
            __typename: 'PayRange',
          },
          jobPostDate: '2021-04-12T20:12:00.000Z',
          __typename: 'JobSummary',
        },
        {
          title: 'Hands-on Care Needed For Myself In Round Rock',
          description:
            'We need hands-on care to take care of myself in Round Rock. Personal care required, including feeding. Part of your responsibilities will include running errands. We ask that you handle transportation as needed.',
          state: 'TX',
          city: 'Round Rock',
          payRange: {
            hourlyRateFrom: { amount: '14.50', currencyCode: 'USD', __typename: 'Money' },
            hourlyRateTo: { amount: '22', currencyCode: 'USD', __typename: 'Money' },
            __typename: 'PayRange',
          },
          jobPostDate: '2021-04-15T13:12:00.000Z',
          __typename: 'JobSummary',
        },
        {
          title: 'Hands-on Care Needed For My Mother In Austin',
          description:
            'We need hands-on care to take care of myself in Round Rock. Personal care required, including feeding. Part of your responsibilities will include running errands. We ask that you handle transportation as needed.',
          state: 'TX',
          city: 'Austin',
          payRange: {
            hourlyRateFrom: { amount: '14', currencyCode: 'USD', __typename: 'Money' },
            hourlyRateTo: { amount: '22', currencyCode: 'USD', __typename: 'Money' },
            __typename: 'PayRange',
          },
          jobPostDate: '2021-04-20T16:12:00.000Z',
          __typename: 'JobSummary',
        },
      ],
    },
  },
};
const oneMatchingJobMock = {
  request: {
    query: GET_NEW_JOBS_PROVIDER,
    variables: {
      numResults: 1,
    },
  },
  result: {
    data: {
      getNewJobsForProvider: [
        {
          title: 'Hands-on Care Needed For My Mother In Austin',
          description:
            'We need hands-on care to take care of myself in Round Rock. Personal care required, including feeding. Part of your responsibilities will include running errands. We ask that you handle transportation as needed.',
          state: 'TX',
          city: 'Austin',
          payRange: {
            hourlyRateFrom: { amount: '14', currencyCode: 'USD', __typename: 'Money' },
            hourlyRateTo: { amount: '22', currencyCode: 'USD', __typename: 'Money' },
            __typename: 'PayRange',
          },
          jobPostDate: '2021-04-20T13:12:00.000Z',
          __typename: 'JobSummary',
        },
      ],
    },
  },
};
const noJobsMatchingMock = {
  request: {
    query: GET_NEW_JOBS_PROVIDER,
    variables: {
      numResults: 0,
    },
  },
  result: {},
};
const jobsNearMe = 3;
const nojobMocksList = [noJobsMatchingMock];
async function renderNoJobsRedirect(mocks: any, nextUrl: any) {
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ThemeProvider {...{ theme }}>
        <AppStateProvider initialStateOverride={initialState}>
          <JobCardFooter numberOfJobsNear={jobsNearMe} nextUrl={nextUrl} />
        </AppStateProvider>
      </ThemeProvider>
    </MockedProvider>,
    {}
  );
  return view;
}
const mocksList = [moreThanOneJobMatchingMock, oneMatchingJobMock];
async function renderResultAndWaitFinished(mocks: any) {
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ThemeProvider {...{ theme }}>
        <AppStateProvider initialStateOverride={initialState}>
          <JobsMatching />
        </AppStateProvider>
      </ThemeProvider>
    </MockedProvider>,
    {}
  );
  await waitFor(() => {
    expect(
      screen.getByText('Companion Care Needed For My Mother In Round Rock')
    ).toBeInTheDocument();
  });

  return view;
}

describe('Jobs matching page', () => {
  let mockRouter: any = null;
  const { location: originalLocation } = window;
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2021-04-20T16:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn(),
      pathname: PROVIDER_CHILD_CARE_ROUTES.JOBS_MATCHING,
      asPath: PROVIDER_CHILD_CARE_ROUTES.JOBS_MATCHING,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // @ts-ignore
    delete window.location;
    /* eslint-disable no-restricted-globals */
    (window.location as Pick<typeof window.location, 'assign'>) = {
      assign: jest.fn(),
    };
  });
  afterEach(() => {
    mockRouter = null;
    window.location = originalLocation;
  });
  it('matches snapshot', () => {
    const view = render(
      <ThemeProvider theme={theme}>
        <JobCardFooter numberOfJobsNear={jobsNearMe} nextUrl={CZEN_BACKGROUND_CHECK_CC} />
      </ThemeProvider>
    );
    expect(view.asFragment()).toMatchSnapshot();
  });
  it('query should redirect when there are 0 jobs', async () => {
    await renderNoJobsRedirect(nojobMocksList, CZEN_BACKGROUND_CHECK_CC);
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);
    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith(CZEN_BACKGROUND_CHECK_CC);
    });
  });
  it('query should redirect when Provider clicks on Next Button', async () => {
    await renderNoJobsRedirect(mocksList, CZEN_BACKGROUND_CHECK_CC);
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);
    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith(CZEN_BACKGROUND_CHECK_CC);
    });
  });
  it('query returns more than 1 jobSummaries results', async () => {
    await renderResultAndWaitFinished(mocksList);
    expect(screen.getByText('Companion Care Needed For My Mother In Round Rock')).toBeVisible();
  });
  it('query returns 1 jobSummary result', async () => {
    await renderResultAndWaitFinished(mocksList);
    expect(screen.getByText('Hands-on Care Needed For My Mother In Austin')).toBeVisible();
  });
  it('query returns Job posted with in 7 days', async () => {
    await renderResultAndWaitFinished(mocksList);
    expect(screen.getByText(/days ago/)).toBeVisible();
  });
  it('query returns Job posted with in one hour', async () => {
    await renderResultAndWaitFinished(mocksList);
    expect(screen.getByText(/hour ago/)).toBeVisible();
  });
});
