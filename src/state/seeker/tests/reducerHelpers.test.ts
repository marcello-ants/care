import dayjs from 'dayjs';
import MockDate from 'mockdate';
import { DEFAULT_JOB_END_TIME, DEFAULT_JOB_START_TIME } from '@/types/common';
import { SeekerAction } from '@/types/seeker';
import { calculateOneTimeStartDateOverrides, mapCareTimes } from '../reducerHelpers';

let action: SeekerAction;

// if dayJsPrevDay = false then we mock dayjs() to be the same day
function setDayJsMockAndActionDate(actionDate: string, dayJsPrevDay: boolean) {
  const convertedActionDate = dayjs(actionDate);
  let mockDate: dayjs.Dayjs;

  if (dayJsPrevDay) {
    // This is used if we want to make dayjs() return action.date - 1 day
    // ex: action.date (the date we're setting the calendar) = 10/23/2020 and dayjs() (right now) is 10/22/2020
    // in other words we are trying to set a date in the calendar after today
    mockDate = convertedActionDate.subtract(1, 'day');
  } else {
    mockDate = convertedActionDate;
  }

  MockDate.set(new Date(mockDate.toISOString()));
  if (action.type === 'setOneTimeStartDate') {
    action.date = convertedActionDate.format('YYYY-MM-DD');
  }
}

describe('Seeker Reducer Helper', () => {
  beforeEach(() => {
    action = { type: 'setOneTimeStartDate', date: null };
  });
  afterEach(() => {
    MockDate.reset();
  });
  it('calculates there is no need for one time start date overrides', () => {
    // any date would suffice here, since we're mocking day js to be the previous day
    setDayJsMockAndActionDate('2020-10-23T16:00:00-05:00', true);
    const overrideTimes = calculateOneTimeStartDateOverrides(action);

    expect(overrideTimes.startTime).toEqual(undefined);
    expect(overrideTimes.endTime).toEqual(undefined);
  });

  it('calculates overrides', () => {
    // 10-23-2020 4:00PM CST
    setDayJsMockAndActionDate('2020-10-23T16:00:00-05:00', false);

    const overrideTimes = calculateOneTimeStartDateOverrides(action);

    // We we are at 4pm, so startOverride=5pm, endOverride=6pm
    expect(overrideTimes.startTime).toEqual('17:00');
    expect(overrideTimes.endTime).toEqual('18:00');
  });

  it('calculates default overrides when at early morning same day', () => {
    // 10-23-2020 6:00AM CST
    setDayJsMockAndActionDate('2020-10-23T06:00:00-05:00', false);

    const overrideTimes = calculateOneTimeStartDateOverrides(action);

    expect(overrideTimes.startTime).toEqual(DEFAULT_JOB_START_TIME);
    expect(overrideTimes.endTime).toEqual(DEFAULT_JOB_END_TIME);
  });

  it('calculates overrides but keeps end default', () => {
    // 10-23-2020 10:00AM CST
    setDayJsMockAndActionDate('2020-10-23T10:00:00-05:00', false);

    const overrideTimes = calculateOneTimeStartDateOverrides(action);

    // We we are at 10am, so startOverride=11am, endOverride=defaultEndTime
    expect(overrideTimes.startTime).toEqual('11:00');
    expect(overrideTimes.endTime).toEqual(DEFAULT_JOB_END_TIME);
  });

  it('calculates overrides with sliders at max', () => {
    // 10-23-2020 4:00PM CST
    setDayJsMockAndActionDate('2020-10-23T16:00:00-05:00', false);

    const overrideTimes = calculateOneTimeStartDateOverrides(action, '00:00', '24:00');

    // We we are at 4pm, so startOverride=5pm, endOverride=same position as before=24:00
    expect(overrideTimes.startTime).toEqual('17:00');
    expect(overrideTimes.endTime).toEqual('24:00');
  });
  it('should get the first block for non-consecutive options', () => {
    let range = mapCareTimes({ morning: true, evening: true });
    expect(range).toEqual({ start: '06:00', end: '12:00' });

    range = mapCareTimes({ afternoon: true, overnight: true });
    expect(range).toEqual({ start: '00:00', end: '06:00' });
  });

  it('should get the consecutive options', () => {
    let range = mapCareTimes({ overnight: false, morning: true, afternoon: true });
    expect(range).toEqual({ start: '06:00', end: '18:00' });

    range = mapCareTimes({ morning: true, afternoon: true, evening: true });
    expect(range).toEqual({ start: '06:00', end: '24:00' });

    range = mapCareTimes({ morning: true, afternoon: true, evening: true, overnight: true });
    expect(range).toEqual({ start: '00:00', end: '24:00' });

    range = mapCareTimes({ afternoon: true, evening: true });
    expect(range).toEqual({ start: '12:00', end: '24:00' });
  });
});
