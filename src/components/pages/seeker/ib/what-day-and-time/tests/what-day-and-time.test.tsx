import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import dayjs from 'dayjs';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import WhaDayAndTime from '../what-day-and-time';

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
  },
}));

const ERRORS = {
  LESS_THAN_HOUR: 'LESS_THAN_HOUR',
  LESS_THAN_DAY: 'LESS_THAN_DAY',
  MORE_THAN_12_HOUR: 'MORE_THAN_12_HOUR',
};

const errorMessages = {
  [ERRORS.LESS_THAN_HOUR]: 'Duration must be at least 1 hour',
  [ERRORS.LESS_THAN_DAY]: 'Start time must be at least 24 hours from now',
  [ERRORS.MORE_THAN_12_HOUR]: 'Keep it less than 12 hours',
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

function renderPage(state = initialAppState) {
  const pathname = '/seeker/ib/what-day-and-time';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={state}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <WhaDayAndTime />
      </MuiPickersUtilsProvider>
    </AppStateProvider>
  );
}

describe('Seeker - Instant Book - Child Care - What Day and Time', () => {
  const startDate = dayjs().add(3, 'days').minute(0);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render page correctly', () => {
    renderPage();
    const day = startDate.format('ddd, MMM DD');

    const startTime = screen.getByDisplayValue('1:00 PM');
    const endTime = screen.getByDisplayValue('7:00 PM');
    const date = screen.getByDisplayValue(day);

    expect(startTime).toBeInTheDocument();
    expect(endTime).toBeInTheDocument();
    expect(date).toBeInTheDocument();
  });

  it('display LESS_THAN_HOUR error', async () => {
    const state = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          timeBlock: {
            start: startDate.subtract(2, 'days').format(),
            end: startDate.subtract(2, 'days').format(),
          },
        },
      },
    };

    renderPage(state);

    const nextButtom = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButtom);

    const error = await screen.findByText(errorMessages[ERRORS.LESS_THAN_HOUR]);
    expect(error).toBeInTheDocument();
    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Error Viewed',
      data: {
        enrollment_step: 'Booking Date',
        error_type: 'Form Validation Error',
        error: errorMessages[ERRORS.LESS_THAN_HOUR],
      },
    });
  });

  it('display MORE_THAN_12_HOUR error', async () => {
    const state = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          timeBlock: {
            start: startDate.format(),
            end: startDate.add(13, 'hour').format(),
          },
        },
      },
    };

    renderPage(state);

    const nextButtom = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButtom);

    const error = await screen.findByText(errorMessages[ERRORS.MORE_THAN_12_HOUR]);
    expect(error).toBeInTheDocument();
    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Error Viewed',
      data: {
        enrollment_step: 'Booking Date',
        error_type: 'Form Validation Error',
        error: errorMessages[ERRORS.MORE_THAN_12_HOUR],
      },
    });
  });

  it('display LESS_THAN_DAY error', async () => {
    const state = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          timeBlock: {
            start: startDate.subtract(62, 'hour').format(),
            end: startDate.subtract(60, 'hour').format(),
          },
        },
      },
    };

    renderPage(state);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);

    const error = await screen.findByText(errorMessages[ERRORS.LESS_THAN_DAY]);
    await waitFor(() => expect(error).toBeInTheDocument());
    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Error Viewed',
      data: {
        enrollment_step: 'Booking Date',
        error_type: 'Form Validation Error',
        error: errorMessages[ERRORS.LESS_THAN_DAY],
      },
    });
  });

  it('display next day under end time', async () => {
    const state = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          timeBlock: {
            start: startDate.hour(23).format(),
            end: startDate.hour(4).format(),
          },
        },
      },
    };

    renderPage(state);
    const nextDay = screen.getByText('Next day');
    expect(nextDay).toBeInTheDocument();

    const nextButtom = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButtom);
    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(SEEKER_INSTANT_BOOK_ROUTES.PAY_FOR_CARE);
    });
  });

  it('show tooltip on time change', async () => {
    renderPage();
    const startTime = screen.getByDisplayValue('1:00 PM');
    fireEvent.change(startTime, { target: { value: '6:00 PM' } });

    const endTime = screen.getByDisplayValue('7:00 PM');
    fireEvent.change(endTime, { target: { value: '9:00 PM' } });

    const tooltip = await screen.findByText(
      'Start 30 mins early so you can get to know the sitter before you leave.'
    );

    expect(screen.getByDisplayValue('9:00 PM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('6:00 PM')).toBeInTheDocument();
    await waitFor(() => expect(tooltip).toBeInTheDocument());
  });

  it('redirect to the next page', async () => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2022-07-07T00:00:00-05:00'));

    renderPage();
    const nextButtom = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButtom);
    await waitFor(() => {
      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          job_flow: 'MW VHP enrollment',
          final_step: false,
          enrollment_step: 'Booking Date',
          booking_start_time: '2022-07-10T13:00:00-05:00',
          booking_end_time: '2022-07-10T19:00:00-05:00',
          cta_clicked: 'next',
        },
      });
    });
    await waitFor(() => {
      expect(mockRouter.push).toBeCalledWith(SEEKER_INSTANT_BOOK_ROUTES.PAY_FOR_CARE);
    });
    jest.useRealTimers();
  });
});
