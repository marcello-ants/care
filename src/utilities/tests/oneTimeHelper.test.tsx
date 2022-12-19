import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { calculateBoundaryDatesAndTimes } from '../oneTimeHelper';

dayjs.extend(Timezone);
dayjs.extend(utc);

function calculateBoundaryWrapper(currentDatetime: dayjs.Dayjs, startDate: string | null) {
  const formattedStartDate = currentDatetime.format('YYYY-MM-DD');
  const formattedStartDateNextDay = currentDatetime.add(1, 'day').format('YYYY-MM-DD');
  const formattedStartDatePlus6Months = currentDatetime.add(6, 'month').format('YYYY-MM-DD');
  const formattedStartDatePlus1Year = currentDatetime.add(1, 'year').format('YYYY-MM-DD');
  return {
    ...calculateBoundaryDatesAndTimes(startDate, currentDatetime),
    formattedStartDate,
    formattedStartDateNextDay,
    formattedStartDatePlus6Months,
    formattedStartDatePlus1Year,
  };
}

function getDateWithTZ(date: string, tz: string) {
  return dayjs(date).tz(tz);
}

describe('OneTime Helper', () => {
  it('calculates same day start date in the morning in EST', () => {
    const currentDateTime = getDateWithTZ('2020-10-23T08:00:00-05:00', 'America/New_York');
    const selectedStartDate = '2020-10-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDate,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(10);
  });

  it('calculates same day start date in the morning in EST, no start date supplied', () => {
    const currentDateTime = getDateWithTZ('2020-10-23T08:00:00-05:00', 'America/New_York');
    const selectedStartDate = null;
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDate,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('calculates start date with selected future startDate', () => {
    const currentDateTime = getDateWithTZ('2020-10-23T08:00:00-05:00', 'America/New_York');
    const selectedStartDate = '2020-10-24';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDate,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDateNextDay);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('converts same day start date in the evening in EST to next day', () => {
    const currentDateTime = getDateWithTZ('2020-11-23T21:00:00-05:00', 'America/New_York');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDateNextDay);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDateNextDay);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('converts same day start date in the afternoon in HST to next day', () => {
    // 4:00PM HAST === 9:00PM ET same day
    const currentDateTime = getDateWithTZ('2020-10-23T16:00:00-10:00', 'Pacific/Honolulu');
    const selectedStartDate = '2020-10-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDateNextDay);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDateNextDay);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('converts same day start date at 10pm in HST to next day', () => {
    // 10PM HAST === 3AM ET next day
    const currentDateTime = getDateWithTZ('2020-11-23T22:00:00-10:00', 'Pacific/Honolulu');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDateNextDay);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDateNextDay);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('converts same day start date at 11pm in Los Angeles to next day', () => {
    // 9:30PM Pacific === 12:30AM ET next day
    const currentDateTime = getDateWithTZ('2020-11-23T21:30:00-08:00', 'America/Los_Angeles');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDateNextDay);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDateNextDay);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('keeps same day start date at 12:30am in Los Angeles', () => {
    // 12:30AM Pacific === 3:30AM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T00:30:00-08:00', 'America/Los_Angeles');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDate,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(5);
  });

  it('converts same day start date at 11:59pm in Austin to next day', () => {
    // 11:59PM Central === 12:59AM ET next day
    const currentDateTime = getDateWithTZ('2020-11-23T23:59:00-06:00', 'America/Chicago');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDateNextDay);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDateNextDay);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(0);
  });

  it('keeps same day start date at 12:30am in Austin', () => {
    // 12:30AM Central === 3:30AM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T00:30:00-06:00', 'America/Chicago');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDate,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(3);
  });

  it('adds one hour to ET when making same day post in Pacific Time', () => {
    // 1:00PM Pacific === 4:00PM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T13:00:00-08:00', 'America/Los_Angeles');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDate,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(17);
  });

  it('adds two hours to ET when making same day post in Pacific Time', () => {
    // 1:30PM Pacific === 4:30PM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T13:30:00-08:00', 'America/Los_Angeles');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDate,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(18);
  });

  it('Adds one day to start day', () => {
    // 1:30PM Pacific === 4:30PM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T13:30:00-08:00', 'America/Los_Angeles');
    const selectedStartDate = '2020-11-23';
    const {
      earliestStartDate,
      latestStartDate,
      earliestEndDate,
      latestEndDate,
      earliestStartDatePlusOneDay,
      earliestTimeSelector,
      formattedStartDatePlus6Months,
      formattedStartDatePlus1Year,
      formattedStartDate,
      formattedStartDateNextDay,
    } = calculateBoundaryWrapper(currentDateTime, selectedStartDate);

    expect(earliestStartDate).toEqual(formattedStartDate);
    expect(latestStartDate).toEqual(formattedStartDatePlus6Months);
    expect(earliestStartDatePlusOneDay).toEqual(formattedStartDateNextDay);
    expect(earliestEndDate).toEqual(formattedStartDate);
    expect(latestEndDate).toEqual(formattedStartDatePlus1Year);
    expect(earliestTimeSelector).toEqual(18);
  });
});
