import dayjs from 'dayjs';
import { fromSliderToString } from '@/lib/TimeFormats';
import { calculateBoundaryDatesAndTimes } from '@/utilities/oneTimeHelper';
import { constructBlocksFromCareTimes } from '@/utilities/gqlPayloadHelper';
import {
  AvailabilityAction,
  DEFAULT_JOB_END_TIME,
  DEFAULT_JOB_START_TIME,
  PartsOfDay,
} from '@/types/common';
import { SeekerAction } from '@/types/seeker';
import { JobAction } from '@/types/job';

interface OverrideTimes {
  startTime?: string;
  endTime?: string;
}

export function convertTimeToDateTime(today: dayjs.Dayjs, time: string) {
  if (time && time.includes(':')) {
    const [hour, minute] = time.split(':');
    const adjustedHour = today.set('hour', Number(hour));
    return adjustedHour.set('minute', Number(minute));
  }

  return today;
}

export function calculateOneTimeStartDateOverrides(
  action: SeekerAction | AvailabilityAction | JobAction,
  fallbackStartTime?: string,
  fallbackEndTime?: string
): OverrideTimes {
  const overrideTimes: OverrideTimes = {};
  if (
    action.type === 'setOneTimeStartDate' ||
    action.type === 'setStartDate' ||
    action.type === 'job_setJobStartDate'
  ) {
    if (action.date) {
      const inputDate = dayjs(action.date, 'YYYY-MM-DD');
      const today = dayjs();
      if (today.isSame(inputDate, 'date')) {
        const startTime = today.add(1, 'hour');
        const endTime = startTime.add(1, 'hour');
        const startRemainder = startTime.minute() % 30 === 0 ? 0 : 30 - (startTime.minute() % 30);
        const endRemainder = endTime.minute() % 30 === 0 ? 0 : 30 - (endTime.minute() % 30);

        const adjustedStartTime = startTime.add(startRemainder, 'minute');
        const adjustedEndTime = endTime.add(endRemainder, 'minute');

        const suppliedStartTime = convertTimeToDateTime(
          today,
          fallbackStartTime ?? DEFAULT_JOB_START_TIME
        );
        let selectedStartTime;

        if (suppliedStartTime.isAfter(adjustedStartTime, 'hour')) {
          selectedStartTime = suppliedStartTime;
        } else {
          selectedStartTime = adjustedStartTime;
        }

        overrideTimes.startTime = selectedStartTime.format('HH:mm');

        let suppliedEndTime;
        if (fallbackEndTime === '24:00') {
          suppliedEndTime = convertTimeToDateTime(today, '23:30');
        } else {
          suppliedEndTime = convertTimeToDateTime(today, fallbackEndTime ?? DEFAULT_JOB_END_TIME);
        }
        if (suppliedEndTime.isAfter(selectedStartTime, 'hour')) {
          // I make this check due to a glitch where '24:00' gets converted to '00:00' of the next day
          if (fallbackEndTime === '24:00') {
            overrideTimes.endTime = '24:00';
          } else {
            overrideTimes.endTime = suppliedEndTime.format('HH:mm');
          }
        } else {
          overrideTimes.endTime = adjustedEndTime.format('HH:mm');
        }
      }
    }
  }
  return overrideTimes;
}

export function calculateTimes(
  startDate: string | null,
  defaultStartTime = DEFAULT_JOB_START_TIME,
  defaultEndTime = DEFAULT_JOB_END_TIME
) {
  let start = defaultStartTime;
  let end = defaultEndTime;
  const today = dayjs();

  const { earliestTimeSelector } = calculateBoundaryDatesAndTimes(startDate, dayjs());
  const earliestTime = convertTimeToDateTime(today, fromSliderToString(earliestTimeSelector));
  const startTimeConverted = convertTimeToDateTime(today, start);
  const endTimeConverted = convertTimeToDateTime(today, end);

  if (startTimeConverted.isBefore(earliestTime)) {
    start = earliestTime.format('HH:mm');
  }

  if (endTimeConverted.isBefore(earliestTime)) {
    end = earliestTime.add(1.5, 'hour').format('HH:mm');
  }

  return { start, end };
}

export function mapCareTimes(careTimes: PartsOfDay) {
  const { blocks } = constructBlocksFromCareTimes(careTimes);
  let start = '';
  let end = '';

  if (blocks.length === 1) {
    ({ start, end } = blocks[0]);
  } else {
    // groups hours based on consecutive options
    blocks.forEach((block) => {
      if (!start) {
        ({ start, end } = block);
      }

      if (end === block.start) {
        ({ end } = block);
      }
    });
  }

  return { start, end };
}

export async function asyncDispatch(dispatch: Function, data: any) {
  await dispatch(data);
}
