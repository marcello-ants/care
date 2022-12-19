import React from 'react';
import { useRouter } from 'next/router';
import { fireEvent, render, RenderResult, screen, waitFor } from '@testing-library/react';

import { initialAppState } from '@/state';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS, POST_A_JOB_ROUTES } from '../constants';
import { AppStateProvider } from '../components/AppState';
import Page from '../pages/recurring';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/FeatureFlagsContext', () => ({
  useFeatureFlags: jest.fn().mockReturnValue({ flags: {} }),
}));

let mockRouter: any | null = null;
let renderResult: RenderResult;

const weekDays = [/Sun/i, /Mon/i, /Tue/i, /Wed/i, /Thu/i, /Fri/i, /Sat/i];
const careTimes = [/morning/i, /afternoon/i, /evening/i, /overnight/i];

const initialStateOverride: typeof initialAppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
  },
};

beforeEach(() => {
  mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
    pathname: '',
    asPath: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  renderResult = render(
    <AppStateProvider initialStateOverride={initialStateOverride}>
      <Page />
    </AppStateProvider>,
    {}
  );
});

afterEach(() => {
  // cleanup on exiting
  mockRouter = null;
});

describe('Recurring page', () => {
  it('matches snapshot', () => {
    expect(renderResult.asFragment()).toMatchSnapshot();
  });
  it('should show an error message when the next button is pressed without a day selection', async () => {
    const morning = careTimes[0];
    screen.getByDisplayValue(morning).click();
    screen.getByRole('button', { name: 'Next' }).click();
    await waitFor(() =>
      expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible()
    );
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
  it('should remove the day error message when a day is selected', async () => {
    screen.getByRole('button', { name: 'Next' }).click();
    await waitFor(() =>
      expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible()
    );
    const sunday = weekDays[0];
    screen.getByText(sunday).click();
    expect(
      screen.queryByText('Please select at least 1 day from the list below')
    ).not.toBeInTheDocument();
  });
  it('should show an error message when the next button is pressed without a time selection', async () => {
    const sunday = weekDays[0];
    screen.getByDisplayValue(sunday).click();
    screen.getByRole('button', { name: 'Next' }).click();
    await waitFor(() =>
      expect(screen.getByText('Please select at least 1 time from the list below')).toBeVisible()
    );
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
  it('should remove the time error message when a day is selected', async () => {
    const morning = careTimes[0];
    const button = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByText('Please select at least 1 time from the list below')).toBeVisible()
    );
    fireEvent.click(screen.getByText(morning));
    expect(
      screen.queryByText('Please select at least 1 time from the list below')
    ).not.toBeInTheDocument();
  });
  it('should remove the time error message when specific times mode is selected', async () => {
    screen.getByRole('button', { name: 'Next' }).click();
    await waitFor(() =>
      expect(screen.getByText('Please select at least 1 time from the list below')).toBeVisible()
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add specific times instead' }));
    await waitFor(() =>
      expect(
        screen.queryByText('Please select at least 1 time from the list below')
      ).not.toBeInTheDocument()
    );
  });
  it('should display the day error message when specific times mode is selected with no days selected', async () => {
    screen.getByRole('button', { name: 'Add specific times instead' }).click();
    await waitFor(() =>
      expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible()
    );
  });
  it('should not show the "Times" header when specific times mode is selected with no days selected', () => {
    screen.getByRole('button', { name: 'Add specific times instead' }).click();
    expect(screen.queryByText('Times')).not.toBeInTheDocument();
  });
  it('routes to the pay-for-care page after selection and button click', async () => {
    const sunday = weekDays[0];
    const morning = careTimes[0];

    fireEvent.click(screen.getByText(sunday));
    fireEvent.click(screen.getByText(morning));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.PAY_FOR_CARE)
    );
  });

  it('fires both analytics events when feature flag is on', () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'jobPostedSchedule');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');
    const sunday = weekDays[0];
    const morning = careTimes[0];

    (useFeatureFlags as jest.Mock).mockReturnValue({
      flags: {
        [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
          variationIndex: 1,
          value: 'variation',
          reason: { kind: 'FALLTHROUGH' },
        },
      },
    });

    fireEvent.click(screen.getByText(sunday));
    fireEvent.click(screen.getByText(morning));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(ampliListener).toBeCalledTimes(1);
    expect(amplitudeListener).toBeCalledTimes(1);
  });
});
