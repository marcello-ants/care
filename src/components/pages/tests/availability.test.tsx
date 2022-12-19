import React from 'react';
import { useRouter } from 'next/router';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { cloneDeep } from 'lodash-es';
import DayJSUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import Availability, { IAvailability } from '../availability';
import { AppStateProvider } from '../../AppState';
import { initialAppState } from '../../../state';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

const initialState = {
  ...initialStateClone,
  provider: {
    ...initialStateClone.provider,
    recurring: {
      ...initialStateClone.provider.recurring,
      start: '2020-12-28',
    },
  },
};

let mockRouter: any | null = null;
let renderResult: RenderResult;
const handleNext = jest.fn();

const props: IAvailability = {
  header: 'header test',
  handleNext,
  appState: initialState.provider,
};

const weekDays = [/sun/i, /mon/i, /tue/i, /wed/i, /thu/i, /fri/i, /sat/i];

const careTimes = [/morning/i, /afternoon/i, /evening/i, /overnight/i];

beforeEach(() => {
  mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
    pathname: '',
    asPath: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  renderResult = render(
    <MuiPickersUtilsProvider utils={DayJSUtils}>
      <AppStateProvider initialStateOverride={initialState}>
        <Availability {...props} />
      </AppStateProvider>
    </MuiPickersUtilsProvider>,
    {}
  );
});

afterEach(() => {
  // cleanup on exiting
  mockRouter = null;
});

describe('Availability component', () => {
  it('matches snapshot', () => {
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('shows correct header', () => {
    expect(screen.getByText(/header test/)).toBeInTheDocument();
  });
  it('should show the warning text if assigning past dates', () => {
    const todayDate = dayjs();
    const pastDate = todayDate.subtract(1, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText('Estimated start date');
    const endDateElement = screen.getByLabelText('Estimated end date');

    fireEvent.change(startDateElement, { target: { value: pastDate } });
    fireEvent.change(endDateElement, { target: { value: pastDate } });

    expect(screen.getAllByText('Date should not be before minimal date').length).toBe(2);
  });

  it('ignores invalid date format and keeps digits', () => {
    const garbageStartDate = '10-10-202o0';
    const garbageEndDate = '10-11-202o0';
    const startDateElement = screen.getByLabelText('Estimated start date');
    const endDateElement = screen.getByLabelText('Estimated end date');

    fireEvent.change(startDateElement, { target: { value: garbageStartDate } });
    fireEvent.change(endDateElement, { target: { value: garbageEndDate } });

    expect((startDateElement as HTMLInputElement).value).toEqual('10/10/2020');
    expect((endDateElement as HTMLInputElement).value).toEqual('10/11/2020');
  });

  it('should show the warning text if assigning start date > 6 months', () => {
    const todayDate = dayjs();
    const futureDate = todayDate.add(6, 'month').add(1, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText('Estimated start date');

    fireEvent.change(startDateElement, { target: { value: futureDate } });

    expect(screen.getAllByText('Date should not be after maximal date').length).toBe(1);
  });

  it('should show the warning text if assigning end date > 1 year', () => {
    const todayDate = dayjs();
    const futureDate = todayDate.add(1, 'year').add(1, 'day').format('MM-DD-YYYY');
    const endDateElement = screen.getByLabelText('Estimated end date');

    fireEvent.change(endDateElement, { target: { value: futureDate } });

    expect(screen.getAllByText('Date should not be after maximal date').length).toBe(1);
  });

  it('CTA should be disabled on start', () => {
    const button = screen.getByRole('button', { name: 'Next' });
    expect(button).toBeDisabled();
  });

  it('CTA should be enabled after date and time have been selected', () => {
    const morning = careTimes[0];
    const sunday = weekDays[0];
    const button = screen.getByRole('button', { name: 'Next' });

    fireEvent.click(screen.getByDisplayValue(sunday));
    fireEvent.click(screen.getByText(morning));
    expect(button).toBeEnabled();
    expect(
      screen.queryByText('Please select at least 1 day from the list below')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Please select at least 1 time from the list below')
    ).not.toBeInTheDocument();
  });

  it('should display the day error message when specific times mode is selected with no days selected', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Add specific times instead' }));
    expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible();
  });
  it('should not show the "Times" header when specific times mode is selected with no days selected', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Add specific times instead' }));
    expect(screen.queryByText('Times')).not.toBeInTheDocument();
  });

  it('should display correct number of accordions based on days selected', () => {
    const sunday = weekDays[0];
    const monday = weekDays[1];
    fireEvent.click(screen.getByDisplayValue(sunday));
    fireEvent.click(screen.getByDisplayValue(monday));
    fireEvent.click(screen.getByText(/Add specific times/i));
    expect(screen.queryAllByTestId('accordion')).toHaveLength(2);
  });

  it('calls handleNext once data is valid', () => {
    const sunday = weekDays[0];
    const morning = careTimes[0];

    fireEvent.click(screen.getByText(sunday));
    fireEvent.click(screen.getByText(morning));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(handleNext).toBeCalled();
  });
  it('should display maximun of 3 sliders and hide add time button (if multiple times are allowed)', () => {
    const sunday = weekDays[0];
    fireEvent.click(screen.getByDisplayValue(sunday));
    fireEvent.click(screen.getByText(/Add specific times/i));
    const sundayAccordion = screen.getByText('Sunday');
    fireEvent.click(sundayAccordion);
    expect(screen.getByTestId('time-slider')).toBeInTheDocument();
  });
});
