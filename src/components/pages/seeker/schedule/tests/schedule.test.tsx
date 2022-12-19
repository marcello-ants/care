import React from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { act, fireEvent, render, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJSUtils from '@date-io/dayjs';
import { cloneDeep } from 'lodash-es';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { initialAppState } from '@/state';
import { AppStateProvider } from '@/components/AppState';
import { GET_CAREGIVERS_NEARBY, GET_JOB_WAGES } from '@/components/request/GQL';
import { ServiceType } from '@/__generated__/globalTypes';

import Page from '../schedule';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: any | null = null;

const weekDays = [/Sun/i, /Mon/i, /Tue/i, /Wed/i, /Thu/i, /Fri/i, /Sat/i];

const careTimes = [/morning/i, /afternoon/i, /evening/i, /overnight/i];
const TEST_DATA_ZIP_CODE = '02452';
const wageMock = {
  request: {
    query: GET_JOB_WAGES,
    variables: {
      zipcode: '02452',
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getJobWages: {
        averages: {
          average: {
            amount: '20',
          },
          minimum: {
            amount: '18',
          },
          maximum: {
            amount: '26',
          },
        },
        legalMinimum: {
          amount: '15',
        },
      },
    },
  },
};

const caregiversNearbyMock = {
  request: {
    query: GET_CAREGIVERS_NEARBY,
    variables: {
      zipcode: TEST_DATA_ZIP_CODE,
      serviceType: 'CHILD_CARE',
      radius: 1,
      subServiceType: null,
    },
  },
  result: {
    data: {
      getCaregiversNearby: 60,
    },
  },
};

const initialStateClone = cloneDeep(initialAppState);
const initialStateOverrideWithZip = {
  ...initialStateClone,
  seeker: {
    ...initialStateClone.seeker,
    zipcode: '02452',
  },
  seekerCC: {
    ...initialStateClone.seekerCC,
  },
};
const mocksList = [wageMock, caregiversNearbyMock];

const startDatePlaceholder = 'Estimated start date';
const endDatePlaceholder = 'Estimated end date (optional)';

async function renderResultAndWaitFinished(
  mocks: any,
  flags: FeatureFlags = {},
  pathname: string = ''
) {
  mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
    asPath: pathname || '/seeker/cc/schedule',
    pathname: pathname || '/seeker/cc/schedule',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider initialStateOverride={initialStateOverrideWithZip}>
          <FeatureFlagsProvider flags={flags}>
            <Page serviceType={ServiceType.CHILD_CARE} nextPageURL="/next-page" />
          </FeatureFlagsProvider>
        </AppStateProvider>
      </MuiPickersUtilsProvider>
    </MockedProvider>
  );
  if (!pathname) {
    await screen.findByText('$18 - 26');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());
  }

  return view;
}

function setDates(getByLabelTextFunc: any, endDateNum: number | null = 3) {
  const todayDate = dayjs();
  const startDate = todayDate.add(1, 'day').format('MM-DD-YYYY');
  const endDate = Number(endDateNum)
    ? todayDate.add(endDateNum as number, 'day').format('MM-DD-YYYY')
    : null;
  const startDateElement = getByLabelTextFunc(startDatePlaceholder);
  const endDateElement = getByLabelTextFunc(endDatePlaceholder);
  fireEvent.change(startDateElement, { target: { value: startDate } });
  fireEvent.change(endDateElement, { target: { value: endDate } });
}

beforeEach(() => {});

afterEach(() => {
  // cleanup on exiting
  mockRouter = null;
});

describe('Child Care Post A Job schedule page testing', () => {
  it('renders with the current date selected by default', async () => {
    const mockFlags = {};
    await renderResultAndWaitFinished(mocksList, mockFlags);
    const currentDate = dayjs().tz('America/New_York').add(3, 'hour').format('MM/DD/YYYY');
    // By default the start date is today (or tomorrow if current time in EST >= 21:00) and no end date
    expect(screen.getByRole('textbox', { name: startDatePlaceholder })).toHaveDisplayValue(
      currentDate
    );
    expect(screen.getByRole('textbox', { name: endDatePlaceholder })).toHaveDisplayValue('');

    // Recurring offer by default
    // need to use `toContain` here since the actual class name is something like "makeStyles-is-selected-31"
    // TODO: use role "radio" and .toBeChecked() once https://jira.infra.carezen.net/browse/DNA-1896 is done
    // eslint-disable-next-line jest-dom/prefer-to-have-class
    expect(screen.getByRole('button', { name: 'Recurring' }).className).toContain('selected');

    // No weekday selected by default
    [
      'sun',
      'mon',
      'tue',
      'wed',
      'thu',
      'fri',
      'sat',
      'morning',
      'afternoon',
      'evening',
      'overnight',
    ].forEach((weekday) => {
      const input = screen.getByDisplayValue(weekday);
      expect(input).toBeInTheDocument();
      expect(input).not.toBeChecked();
    });

    // slider's min/max are 15 and 50. Current values by default are 18-26
    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '18');
    expect(sliders[0]).toHaveAttribute('aria-valuemin', '15');
    expect(sliders[0]).toHaveAttribute('aria-valuemax', '50');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '26');
    expect(sliders[1]).toHaveAttribute('aria-valuemin', '15');
    expect(sliders[1]).toHaveAttribute('aria-valuemax', '50');
  });

  // flexible start date tests
  it('flexible start date should be false by default', async () => {
    await renderResultAndWaitFinished(mocksList);
    const flexibleDates = screen.getByRole('checkbox', { name: 'My start date is flexible' });

    expect(flexibleDates).not.toBeChecked();
    flexibleDates.click();
    expect(flexibleDates).toBeChecked();
  });

  // days, time blocks and specifc time tests
  it('should show an error message when the next button is pressed without a day selection', async () => {
    await renderResultAndWaitFinished(mocksList);
    setDates(screen.getByLabelText);
    const morning = careTimes[0];
    screen.getByDisplayValue(morning).click();
    act(() => screen.getByRole('button', { name: 'Next' }).click());
    expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should remove the day error message when a day is selected', async () => {
    await renderResultAndWaitFinished(mocksList);
    setDates(screen.getByLabelText);
    act(() => screen.getByRole('button', { name: 'Next' }).click());
    expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible();

    const sunday = weekDays[0];
    act(() => screen.getByText(sunday).click());
    expect(
      screen.queryByText('Please select at least 1 day from the list below')
    ).not.toBeInTheDocument();
  });

  it('should show an error message when the next button is pressed without a time selection', async () => {
    await renderResultAndWaitFinished(mocksList);
    setDates(screen.getByLabelText);
    const sunday = weekDays[0];
    screen.getByDisplayValue(sunday).click();
    act(() => screen.getByRole('button', { name: 'Next' }).click());
    expect(screen.getByText('Please select at least 1 time from the list below')).toBeVisible();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should remove the time error message when a day is selected', async () => {
    await renderResultAndWaitFinished(mocksList);
    setDates(screen.getByLabelText);
    const morning = careTimes[0];
    const button = screen.getByRole('button', { name: 'Next' });
    act(() => button.click());

    expect(screen.getByText('Please select at least 1 time from the list below')).toBeVisible();
    act(() => screen.getByText(morning).click());
    expect(
      screen.queryByText('Please select at least 1 time from the list below')
    ).not.toBeInTheDocument();
  });

  it('should remove the time error message when specific times mode is selected', async () => {
    await renderResultAndWaitFinished(mocksList);
    setDates(screen.getByLabelText);
    act(() => screen.getByRole('button', { name: 'Next' }).click());
    expect(screen.getByText('Please select at least 1 time from the list below')).toBeVisible();
    act(() => screen.getByRole('button', { name: 'Add specific times instead' }).click());
    expect(
      screen.queryByText('Please select at least 1 time from the list below')
    ).not.toBeInTheDocument();
  });
  it('should display the day error message when specific times mode is selected with no days selected', async () => {
    await renderResultAndWaitFinished(mocksList);
    act(() => screen.getByRole('button', { name: 'Add specific times instead' }).click());
    expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible();
  });

  it('should not show the "Times" header when specific times mode is selected with no days selected', async () => {
    await renderResultAndWaitFinished(mocksList);
    act(() => screen.getByRole('button', { name: 'Add specific times instead' }).click());
    expect(screen.queryByText('Times')).not.toBeInTheDocument();
  });

  // schedule my vary test
  it('schedule my vary should be false by default', async () => {
    await renderResultAndWaitFinished(mocksList);
    const scheduleMayVary = screen.getByRole('checkbox', { name: 'My schedule may vary' });

    expect(scheduleMayVary).not.toBeChecked();
    scheduleMayVary.click();
    expect(scheduleMayVary).toBeChecked();
  });

  it('updates the slider value the from GQL call', async () => {
    await renderResultAndWaitFinished(mocksList);
    const avgRange = screen.getByText('$18 - 26');
    expect(avgRange).not.toBeUndefined();
  });

  it('should show the warning text if assigning past dates', async () => {
    await renderResultAndWaitFinished(mocksList);
    const todayDate = dayjs();
    const pastDate = todayDate.subtract(1, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: pastDate } });
    fireEvent.change(endDateElement, { target: { value: pastDate } });

    expect(screen.getAllByText('Date should not be before minimal date').length).toBe(2);
  });

  it('should remain disabled the next button if date is empty', async () => {
    await renderResultAndWaitFinished(mocksList);
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: '' } });
    fireEvent.change(endDateElement, { target: { value: '' } });

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('check if start and end date is displayed', async () => {
    await renderResultAndWaitFinished(mocksList);
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: '01-02-2021' } });
    fireEvent.change(endDateElement, { target: { value: '01-03-2021' } });

    expect(startDateElement).toHaveValue('01/02/2021');
    expect(endDateElement).toHaveValue('01/03/2021');
  });

  it('should unselect sunday', async () => {
    await renderResultAndWaitFinished(mocksList);
    const sunday = weekDays[0];
    const sundayButton = screen.getByText(sunday);
    fireEvent.click(sundayButton);
    fireEvent.click(sundayButton);
    expect(sundayButton).not.toBeChecked();
  });

  it('routes to the next page on button click', async () => {
    await renderResultAndWaitFinished([], {}, '/seeker/cc/schedule');
    const sunday = weekDays[0];
    const morning = careTimes[0];
    fireEvent.click(screen.getByText(sunday));
    fireEvent.click(screen.getByText(morning));

    // Without endDate
    setDates(screen.getByLabelText, null);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/next-page');

    fireEvent.click(screen.getByRole('button', { name: 'One time' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/next-page');

    // With endDate
    setDates(screen.getByLabelText);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/next-page');

    fireEvent.click(screen.getByRole('button', { name: 'Recurring' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/next-page');
  });
});
