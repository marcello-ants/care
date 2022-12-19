import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, act, RenderResult, waitFor, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { initialRecurringState } from '@/types/common';
import JobTypesPage from '@/pages/provider/cc/job-types';
import {
  ServiceType,
  JobInterestUpdateSource,
  JobHoursUnit,
  Language,
  ChildCareAgeGroups,
} from '@/__generated__/globalTypes';
import { PROVIDER_JOB_INTEREST_UPDATE, GET_DEFAULT_JOB_WAGES } from '@/components/request/GQL';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { GraphQLError } from 'graphql';
import { PROVIDER_CHILD_CARE_ROUTES } from '@/constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const zipcode = '01234';

const getDefaultJobWagesMock = {
  request: {
    query: GET_DEFAULT_JOB_WAGES,
    variables: {
      serviceType: ServiceType.CHILD_CARE,
      zipcode,
    },
  },
  result: {
    data: {
      getJobWages: {
        legalMinimum: { amount: '14', __typename: 'Money' },
        defaultMaxWage: { amount: '19', __typename: 'Money' },
        defaultMinWage: { amount: '14', __typename: 'Money' },
        maxAllowed: { amount: '50', __typename: 'Money' },
        __typename: 'WagesPayload',
      },
    },
  },
};

const jobTypesOneTimeUpdateSuccessMock = {
  request: {
    query: PROVIDER_JOB_INTEREST_UPDATE,
    variables: {
      input: {
        source: JobInterestUpdateSource.ENROLLMENT,
        oneTimeJobInterest: {
          jobHours: {
            minimum: 7,
            unit: JobHoursUnit.PER_JOB,
          },
          childCareJobRates: [
            {
              numberOfChildren: 1,
              hourlyRate: {
                currencyCode: 'USD',
                amount: '14',
              },
            },
          ],
        },
        recurringJobInterest: null,
        serviceType: ServiceType.CHILD_CARE,
      },
    },
  },
  result: {
    data: {
      providerJobInterestUpdate: { __typename: 'ProviderJobInterestUpdateSuccess', dummy: null },
    },
  },
};

const jobTypesOneTimeUpdateFailedMock = {
  request: {
    query: PROVIDER_JOB_INTEREST_UPDATE,
    variables: {
      input: {
        source: JobInterestUpdateSource.ENROLLMENT,
        oneTimeJobInterest: {
          jobHours: {
            minimum: 7,
            unit: JobHoursUnit.PER_JOB,
          },
          childCareJobRates: [
            {
              numberOfChildren: 1,
              hourlyRate: {
                currencyCode: 'USD',
                amount: '14',
              },
            },
          ],
        },
        recurringJobInterest: null,
        serviceType: ServiceType.CHILD_CARE,
      },
    },
  },
  result: { errors: [new GraphQLError('error')] },
};

const jobTypesRecurringUpdateSuccessMock = {
  request: {
    query: PROVIDER_JOB_INTEREST_UPDATE,
    variables: {
      input: {
        source: JobInterestUpdateSource.ENROLLMENT,
        oneTimeJobInterest: null,
        recurringJobInterest: {
          jobHours: {
            minimum: 7,
            maximum: 9,
            unit: JobHoursUnit.PER_WEEK,
          },
          jobRate: {
            maximum: {
              amount: '19',
              currencyCode: 'USD',
            },
            minimum: {
              amount: '14',
              currencyCode: 'USD',
            },
          },
        },
        serviceType: ServiceType.CHILD_CARE,
      },
    },
  },
  result: {
    data: {
      providerJobInterestUpdate: { __typename: 'ProviderJobInterestUpdateSuccess', dummy: null },
    },
  },
};

const jobTypesRecurringUpdateWithoutMaximumSuccessMock = {
  request: {
    query: PROVIDER_JOB_INTEREST_UPDATE,
    variables: {
      input: {
        source: JobInterestUpdateSource.ENROLLMENT,
        oneTimeJobInterest: null,
        recurringJobInterest: {
          jobHours: {
            minimum: 7,
            maximum: undefined,
            unit: JobHoursUnit.PER_WEEK,
          },
          jobRate: {
            maximum: {
              amount: '19',
              currencyCode: 'USD',
            },
            minimum: {
              amount: '14',
              currencyCode: 'USD',
            },
          },
        },
        serviceType: ServiceType.CHILD_CARE,
      },
    },
  },
  result: {
    data: {
      providerJobInterestUpdate: { __typename: 'ProviderJobInterestUpdateSuccess', dummy: null },
    },
  },
};

describe('Job Types', () => {
  let renderResult: RenderResult;
  let mockRouter: any | null = null;

  async function renderComponent(mocks: MockedResponse<Record<string, any>>[]) {
    const state = {
      ...initialAppState,
      providerCC: {
        city: '',
        state: '',
        zipcode,
        distance: 15,
        lat: null,
        lng: null,
        recurringJob: false,
        oneTime: false,
        defaultRatePerChild: [0],
        defaultRecurringHourlyRate: [0, 0],
        min: '',
        max: '',
        hours: '',
        initialAccountCreationAttempted: false,
        caregiverPreferencesPersisted: false,
        firstName: '',
        lastName: '',
        headline: '',
        bio: '',
        hourlyRate: 14,
        numberOfJobsNear: 0,
        jobTypes: [],
        jobTypesSchedules: {},
        recurring: { ...initialRecurringState.recurring },
        languages: [Language.ENGLISH],
        education: 'SOME_HIGH_SCHOOL',
        selectedAboutMe: ['smokes'],
        selectedHelpWith: [],
        selectedSkills: [],
        experienceYears: 1,
        numberOfChildren: 1,
        ageGroups: [ChildCareAgeGroups.EARLY_SCHOOL],
        careForSickChild: false,
        covidVaccinated: '',
        freeGated: false,
        callFreeGatedMutation: true,
        callProviderNameUpdateMutation: true,
        textAnalysisValidationId: '',
      },
    };

    renderResult = render(
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={mocks} addTypename>
          <AppStateProvider initialStateOverride={state}>
            <JobTypesPage />
          </AppStateProvider>
        </MockedProvider>
      </ThemeProvider>
    );

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
  }

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      query: { param: [] },
      pathname: '/provider/cc/job-types',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('should match snapshot', async () => {
    await renderComponent([getDefaultJobWagesMock]);
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('should disable submit button by default', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const btn = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(btn).toBeDisabled());
  });

  it('should enable submit button when user selects one time job and enters hours', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const hoursInput = screen.getByPlaceholderText('Hours');
    fireEvent.change(hoursInput, { target: { value: '7' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(btn).toBeEnabled());
  });

  it('should be able to add several rates for children for one time job', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const addChild = await screen.findByText('Add another child');
    fireEvent.click(addChild);

    const first = await screen.findByText('1 child');
    const second = await screen.findByText('2 children');
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
  });

  it('should be able to remove rate for one time job', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const addChild = await screen.findByText('Add another child');
    fireEvent.click(addChild);

    const removeChildRate = await screen.findByTestId('remove-rate');
    fireEvent.click(removeChildRate);

    const first = screen.getByText('1 child');
    const second = screen.queryByText('2 children');
    expect(first).toBeInTheDocument();
    expect(second).not.toBeInTheDocument();
  });

  it('should be able to add up to 4 rates for children for one time job', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const addChild = screen.getByText('Add another child');
    fireEvent.click(addChild);
    fireEvent.click(addChild);
    fireEvent.click(addChild);

    expect(screen.queryByText('Add another child')).not.toBeInTheDocument();
  });

  it('should be able to submit changes for one time job', async () => {
    await renderComponent([getDefaultJobWagesMock, jobTypesOneTimeUpdateSuccessMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const hoursInput = screen.getByPlaceholderText('Hours');
    fireEvent.change(hoursInput, { target: { value: '7' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PROFILE)
    );
  });

  it('should be able to redirect after failing mutation', async () => {
    await renderComponent([getDefaultJobWagesMock, jobTypesOneTimeUpdateFailedMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const hoursInput = screen.getByPlaceholderText('Hours');
    fireEvent.change(hoursInput, { target: { value: '7' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const gotItBtn = await screen.findByRole('button', { name: 'Got it' });
    await waitFor(() => expect(gotItBtn).toBeInTheDocument());
    fireEvent.click(gotItBtn);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
  });

  it('should be able to redirect after failing mutation to Profile page', async () => {
    await renderComponent([getDefaultJobWagesMock, jobTypesOneTimeUpdateFailedMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'One-time jobs Date nights, backup sitter, and special occasions. Pick up occasional jobs based on your preferred schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const hoursInput = screen.getByPlaceholderText('Hours');
    fireEvent.change(hoursInput, { target: { value: '7' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const gotItBtn = await screen.findByRole('button', { name: 'Got it' });
    await waitFor(() => expect(gotItBtn).toBeInTheDocument());
    fireEvent.click(gotItBtn);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PROFILE)
    );
  });

  it('should enable submit button when user selects recurring job and enters min/max hours', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'Recurring jobs Nanny, after-school and summer jobs. Work a regular, full, or part-time schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const minInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minInput, { target: { value: '7' } });

    const maxInput = screen.getByPlaceholderText('Max');
    fireEvent.change(maxInput, { target: { value: '9' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(btn).toBeEnabled());
  });

  it('should be able to submit recurring job', async () => {
    await renderComponent([getDefaultJobWagesMock, jobTypesRecurringUpdateSuccessMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'Recurring jobs Nanny, after-school and summer jobs. Work a regular, full, or part-time schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const minInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minInput, { target: { value: '7' } });

    const maxInput = screen.getByPlaceholderText('Max');
    fireEvent.change(maxInput, { target: { value: '9' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY)
    );
  });

  it('should be able to submit recurring job without maximum', async () => {
    await renderComponent([
      getDefaultJobWagesMock,
      jobTypesRecurringUpdateWithoutMaximumSuccessMock,
    ]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'Recurring jobs Nanny, after-school and summer jobs. Work a regular, full, or part-time schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const minInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minInput, { target: { value: '7' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
  });

  it('should disable submit button when user writes a wrong value for hours', async () => {
    await renderComponent([getDefaultJobWagesMock]);

    const oneTimeJobCheckbox = screen.getByRole('checkbox', {
      name: 'Recurring jobs Nanny, after-school and summer jobs. Work a regular, full, or part-time schedule.',
    });
    fireEvent.click(oneTimeJobCheckbox);

    const minInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minInput, { target: { value: '7' } });

    const maxInput = screen.getByPlaceholderText('Max');
    fireEvent.change(maxInput, { target: { value: '5' } });

    const btn = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(btn).toBeDisabled());
  });
});
