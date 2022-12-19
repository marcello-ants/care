/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */
import produce from 'immer';
import { JobAction } from '@/types/job';
import { DAYS } from '@/lib/DayFormats';
import { DayOfWeek, DEFAULT_JOB_END_TIME, DEFAULT_JOB_START_TIME } from '@/types/common';
import dayjs from 'dayjs';
import {
  calculateOneTimeStartDateOverrides,
  convertTimeToDateTime,
  mapCareTimes,
} from '../seeker/reducerHelpers';

// eslint-disable-next-line import/prefer-default-export
export const reducer = produce((draft: any, action: JobAction) => {
  switch (action.type) {
    case 'job_setFlexibleStartDate':
      draft.jobPost.recurring.flexibleStartDate = action.flexibleStartDate;
      return draft;
    case 'job_setScheduleMayVary':
      draft.jobPost.scheduleMayVary = action.scheduleMayVary;
      return draft;
    case 'job_setRateMinimum':
      draft.jobPost.rate.minimum = action.minimum;
      return draft;
    case 'job_setRateMaximum':
      draft.jobPost.rate.maximum = action.maximum;
      return draft;
    case 'job_setRateLegalMinimum':
      draft.jobPost.rate.legalMinimum = action.legalMinimum;
      return draft;
    case 'job_setJobStartDate': {
      draft.jobPost.jobDateTime.dates.startDate = action.date;
      const overrideTimes = calculateOneTimeStartDateOverrides(
        action,
        draft?.jobPost?.jobDateTime?.time?.startTime,
        draft?.jobPost?.jobDateTime?.time?.endTime
      );
      if (overrideTimes.startTime) {
        draft.jobPost.jobDateTime.time.startTime = overrideTimes.startTime;
      }
      if (overrideTimes.endTime) {
        draft.jobPost.jobDateTime.time.endTime = overrideTimes.endTime;
      }
      return draft;
    }
    case 'job_setJobEndDate':
      draft.jobPost.jobDateTime.dates.endDate = action.date;
      return draft;
    case 'job_removeDayBlock':
      if (!action.index) {
        // remove all blocks
        delete draft.jobPost.recurring.schedule[action.day];
      }
      return draft;
    case 'job_addDayBlock': {
      const { start, end } = mapCareTimes(draft.jobPost.recurring.careTimes);
      const daySchedule = draft.jobPost.recurring.schedule[action.day] ?? { blocks: [] };
      const { specificTimes, schedule } = draft.jobPost.recurring;
      // get last day time to be copied in the new day
      const prevDays = DAYS.slice(0, DAYS.indexOf(action.day));
      const [day] = prevDays.reverse().filter((key) => schedule[key]);
      const prevDay = schedule[day];
      if (specificTimes && prevDay) {
        // copy the previous schedule to the new day
        daySchedule.blocks = prevDay.blocks;
      } else if (start && end && specificTimes) {
        // set range time from Times pills
        daySchedule.blocks.push({ end, start });
      } else if (specificTimes) {
        daySchedule.blocks.push({ start: DEFAULT_JOB_START_TIME, end: DEFAULT_JOB_END_TIME });
      }
      draft.jobPost.recurring.timesAppliedToAllDays = false;
      draft.jobPost.recurring.schedule[action.day] = daySchedule;
      return draft;
    }
    case 'job_setPartsOfDay':
      draft.jobPost.recurring.careTimes = action.partsOfDay;
      return draft;
    case 'job_setSpecificTimes': {
      draft.jobPost.scheduleMayVary = false;
      draft.jobPost.recurring.specificTimes = action.isSpecificTimes;
      // if days are selected, pre-populate the blocks with the pill times or use default times
      const selectedDays = Object.keys(draft.jobPost.recurring.schedule) as DayOfWeek[];
      const { start = '', end = '' } =
        selectedDays.length > 0 ? mapCareTimes(draft.jobPost.recurring.careTimes) : {};
      selectedDays.forEach((day) => {
        const daySchedule = draft.jobPost.recurring.schedule[day] ?? { blocks: [] };
        if (start && end && daySchedule.blocks.length === 0) {
          daySchedule.blocks.push({ end, start });
        } else if (daySchedule.blocks.length === 0) {
          daySchedule.blocks.push({ start: DEFAULT_JOB_START_TIME, end: DEFAULT_JOB_END_TIME });
        }
      });
      // wipe out old careTimes configuration if present since we are going with specific times instead
      draft.jobPost.recurring.careTimes = {};
      return draft;
    }
    case 'job_setJobTimes': {
      draft.jobPost.jobDateTime.time.startTime = action.start;
      draft.jobPost.jobDateTime.time.endTime = action.end;

      const today = dayjs();
      const startTimeConverted = convertTimeToDateTime(today, action.start);
      const endTimeConverted = convertTimeToDateTime(today, action.end);

      // ensures endtime is 1 hr ahead of start time
      if (endTimeConverted.isSame(startTimeConverted)) {
        draft.jobPost.jobDateTime.time.endTime = startTimeConverted.add(1, 'hour').format('HH:mm');
      }
      return draft;
    }
    case 'job_setJobType':
      draft.jobPost.jobType = action.jobType;
      return draft;
    // check this
    case 'job_setJobSubmissionInfo':
      draft.jobPost.submissionInfo.submissionAttempted = action.submissionAttempted;
      draft.jobPost.submissionInfo.attempts = action.attempts;
      return draft;
    case 'job_setJobDescription':
      draft.jobPost.jobDescription = action.description;
      return draft;
    case 'job_setJobPostSuccessful':
      draft.jobPost.submissionInfo.jobPostSuccessful = action.jobSuccessful;
      return draft;
    case 'job_updateDayBlock': {
      const daySchedule = draft.jobPost.recurring.schedule[action.day];
      if (daySchedule) {
        daySchedule.blocks[action.index] = action.timeBlock;
        draft.jobPost.recurring.timesAppliedToAllDays = false;
      }

      return draft;
    }

    case 'job_applyTimesToAllDays': {
      const { schedule } = draft.jobPost.recurring;
      const daySchedule = schedule[action.day];
      if (daySchedule) {
        (Object.keys(schedule) as DayOfWeek[]).forEach((otherDay) => {
          if (otherDay !== action.day) {
            const otherSchedule = schedule[otherDay];
            if (otherSchedule) {
              otherSchedule.blocks = daySchedule.blocks;
            }
          }
        });
        draft.jobPost.recurring.timesAppliedToAllDays = true;
      }

      return draft;
    }
    default:
      return draft;
  }
});
