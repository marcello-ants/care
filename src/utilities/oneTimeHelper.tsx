import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(Timezone);
dayjs.extend(utc);

interface boundaryDatesAndTimes {
  earliestStartDate: string;
  latestStartDate: string;
  earliestEndDate: string;
  latestEndDate: string;
  earliestTimeSelector: number;
  earliestStartDatePlusOneDay: string;
}

// TODO: Use official 'isSame' after this bug is fixed - https://github.com/iamkun/dayjs/issues/1208
function isSameDate(date1: dayjs.Dayjs, date2: dayjs.Dayjs) {
  return date1.get('month') === date2.get('month') && date1.get('date') === date2.get('date');
}

// eslint-disable-next-line import/prefer-default-export
export function calculateBoundaryDatesAndTimes(
  startDate: string | null,
  todayLocalTZ: dayjs.Dayjs
): boundaryDatesAndTimes {
  let earliestTimeSelector = 0;
  let convertedEarliestEndDate;
  const todayEST = todayLocalTZ.tz('America/New_York');

  // czen interprets and validates a job's dates in Eastern Time, so we need to use the current Eastern date and time when determining the earliest start date we'll allow the user to select
  const sameDayBookingEnabled = todayEST.hour() < 21;

  const convertedEarliestStartDate = sameDayBookingEnabled ? todayEST : todayEST.add(1, 'day');

  if (startDate) {
    const convertedStartDate = dayjs(startDate, 'YYYY-MM-DD');

    if (isSameDate(convertedEarliestStartDate, convertedStartDate) && sameDayBookingEnabled) {
      if (todayEST.minute() >= 30) {
        earliestTimeSelector = todayEST.hour() + 2;
      } else {
        earliestTimeSelector = todayEST.hour() + 1;
      }
    }

    convertedEarliestEndDate = convertedStartDate.isAfter(convertedEarliestStartDate, 'date')
      ? convertedStartDate
      : convertedEarliestStartDate;
  } else {
    convertedEarliestEndDate = convertedEarliestStartDate;
  }

  const earliestStartDate = convertedEarliestStartDate.format('YYYY-MM-DD');
  const latestStartDate = todayLocalTZ.add(6, 'month').format('YYYY-MM-DD');
  const earliestEndDate = convertedEarliestEndDate.format('YYYY-MM-DD');
  const latestEndDate = todayLocalTZ.add(1, 'year').format('YYYY-MM-DD');
  const earliestStartDatePlusOneDay = convertedEarliestStartDate.add(1, 'day').format('YYYY-MM-DD');
  return {
    earliestStartDate,
    latestStartDate,
    earliestEndDate,
    latestEndDate,
    earliestTimeSelector,
    earliestStartDatePlusOneDay,
  };
}
