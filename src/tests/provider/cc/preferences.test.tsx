import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, act, RenderResult, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { initialRecurringState } from '@/types/common';
import HourlyRatePage from '@/pages/provider/cc/preferences';
import { Language, ChildCareAgeGroups } from '@/__generated__/globalTypes';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('Preferences Page', () => {
  let renderResult: RenderResult;
  let mockRouter: any | null = null;

  async function renderComponent(mocks: MockedResponse<Record<string, any>>[]) {
    const state = {
      ...initialAppState,
      providerCC: {
        city: '',
        state: '',
        zipcode: '01234',
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
            <HourlyRatePage />
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
      pathname: '/provider/cc/preferences',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('should match snapshot', async () => {
    await renderComponent([]);
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('should render with correct default page text', async () => {
    await renderComponent([]);

    expect(screen.getByText('Who would you like to care for?')).toBeInTheDocument();
    expect(screen.getByText('Ages')).toBeInTheDocument();
    expect(screen.getByText('My hourly rate')).toBeInTheDocument();
    expect(screen.getByText('$14')).toBeInTheDocument();
    expect(screen.getByText('/hr')).toBeInTheDocument();
  });
});
