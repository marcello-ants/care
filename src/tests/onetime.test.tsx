import React from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';

import MockDate from 'mockdate';
import DayJSUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import setAmPmFormat from '@/tests/12HourFormatForSnapshot';
import { POST_A_JOB_ROUTES } from '../constants';
import OneTimePage from '../pages/onetime';
import { AppStateProvider } from '../components/AppState';
import { initialAppState } from '../state';
import { AppState } from '../types/app';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialAppStateClone = cloneDeep(initialAppState);
const initialStateOverrideWithQueryParamData: AppState = {
  ...initialAppStateClone,
  seeker: {
    ...initialAppStateClone.seeker,
    jobPost: {
      ...initialAppStateClone.seeker.jobPost,
      zip: '10004',
      servicesNeeded: [],
      intent: 'NOW',
      selfNeedsCare: false,
      careFrequency: 'onetime',
    },
  },
};

let mockRouter = null;

const startDatePlaceholder = 'Estimated start date';
const endDatePlaceholder = 'Estimated end date (optional)';

beforeEach(() => {
  mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
    pathname: '/onetime',
    asPath: '/onetime',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

afterEach(() => {
  mockRouter = null;
  MockDate.reset();
});

describe('One time page', () => {
  let asFragment: any | null = null;
  let getByTestId: any | null = null;

  const renderComponent = () => {
    const view = render(
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider initialStateOverride={initialStateOverrideWithQueryParamData}>
          <OneTimePage />
        </AppStateProvider>
      </MuiPickersUtilsProvider>,
      {}
    );
    ({ asFragment, getByTestId } = view);
  };

  beforeAll(() => {
    setAmPmFormat();
  });

  afterEach(() => {
    // cleanup on exiting
    asFragment = null;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should enable next button after date selection', () => {
    renderComponent();
    const todayDate = dayjs();
    const startDate = todayDate.add(1, 'day').format('MM-DD-YYYY');
    const endDate = todayDate.add(3, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

    fireEvent.change(startDateElement, { target: { value: startDate } });
    fireEvent.change(endDateElement, { target: { value: endDate } });

    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('should show the warning text if assigning past dates', () => {
    renderComponent();
    const todayDate = dayjs();
    const pastDate = todayDate.subtract(1, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: pastDate } });
    fireEvent.change(endDateElement, { target: { value: pastDate } });

    expect(screen.getAllByText('Date should not be before minimal date').length).toBe(2);
  });

  it('ignores invalid date format and keeps digits', () => {
    renderComponent();
    const garbageStartDate = '10-10-202o0';
    const garbageEndDate = '10-11-202o0';
    const startDateElement = screen.getByLabelText(startDatePlaceholder) as HTMLInputElement;
    const endDateElement = screen.getByLabelText(endDatePlaceholder) as HTMLInputElement;

    fireEvent.change(startDateElement, { target: { value: garbageStartDate } });
    fireEvent.change(endDateElement, { target: { value: garbageEndDate } });

    expect(startDateElement.value).toEqual('10/10/2020');
    expect(endDateElement.value).toEqual('10/11/2020');
  });

  it('should show the warning text if assigning start date > 6 months', () => {
    renderComponent();
    const todayDate = dayjs();
    const futureDate = todayDate.add(6, 'month').add(1, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: futureDate } });

    expect(screen.getAllByText('Date should not be after maximal date').length).toBe(1);
  });

  it('should show the warning text if assigning end date > 1 year', () => {
    renderComponent();
    const todayDate = dayjs();
    const futureDate = todayDate.add(1, 'year').add(1, 'day').format('MM-DD-YYYY');
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(endDateElement, { target: { value: futureDate } });

    expect(screen.getAllByText('Date should not be after maximal date').length).toBe(1);
  });

  it('routes to the pay-for-care page after selection and button click', () => {
    renderComponent();
    const todayDate = dayjs();
    const startDate = todayDate.add(1, 'day').format('MM-DD-YYYY');
    const endDate = todayDate.add(3, 'day').format('MM-DD-YYYY');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: startDate } });
    fireEvent.change(endDateElement, { target: { value: endDate } });

    screen.getByRole('button', { name: 'Next' }).click();

    expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.PAY_FOR_CARE);
  });

  it('should change the text label when clicking on slider', () => {
    renderComponent();
    const sliderInput = getByTestId('time-slider');

    sliderInput.getBoundingClientRect = jest.fn(() => {
      return {
        bottom: 286.22918701171875,
        height: 28,
        left: 19.572917938232422,
        right: 583.0937919616699,
        top: 258.22918701171875,
        width: 563.5208740234375,
        x: 19.572917938232422,
        y: 258.22918701171875,
      };
    });

    expect(sliderInput).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();

    fireEvent.mouseDown(sliderInput, { clientX: 162, clientY: 302 });

    expect(screen.getByText('6:00 AM - 5:00 PM')).toBeInTheDocument();
  });

  it('should remain disabled the next button if date is empty', () => {
    renderComponent();
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    const endDateElement = screen.getByLabelText(endDatePlaceholder);

    fireEvent.change(startDateElement, { target: { value: '' } });
    fireEvent.change(endDateElement, { target: { value: '' } });

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('should override start time when default start time is before earliest time', () => {
    renderComponent();
    // 11:08:50 in CST
    MockDate.set('2020-12-31T12:08:50');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    fireEvent.change(startDateElement, { target: { value: '12/31/2020' } });
    expect(screen.getByText('1:00 PM - 5:00 PM')).toBeInTheDocument();
  });

  it('should use default times', () => {
    renderComponent();
    // 11:35:50 in CST
    MockDate.set('2021-01-01T12:35:50');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    fireEvent.change(startDateElement, { target: { value: '01/02/2021' } });
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
  });

  it('should override both start and end time when before earliest time', () => {
    renderComponent();
    // 17:00:50 in CST
    MockDate.set('2020-12-31T18:00:50');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    fireEvent.change(startDateElement, { target: { value: '12/31/2020' } });
    expect(screen.getByText('7:00 PM - 8:30 PM')).toBeInTheDocument();
  });

  it('should not allow you to select same day when after 20:00 PM', () => {
    renderComponent();
    // 20:35:50 in CST
    MockDate.set('2020-12-31T21:00:50');
    const startDateElement = screen.getByLabelText(startDatePlaceholder);
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    fireEvent.change(startDateElement, { target: { value: '12/31/2020' } });
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
  });
});

describe('One time page -- bad state', () => {
  const { location } = window;

  beforeAll((): void => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: jest.fn(),
    };
  });

  afterAll((): void => {
    window.location = location;
    mockRouter = null;
  });

  it('should render then redirect if default state is present', async () => {
    render(
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider>
          <OneTimePage />
        </AppStateProvider>
      </MuiPickersUtilsProvider>
    );
    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith('/');
    });
  });
});
