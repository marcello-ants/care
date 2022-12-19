import { DayOfWeek, PartsOfDay, OptionalReducerData, TimeBlock } from '@/types/common';

export type JobAction =
  | { type: 'job_setFlexibleStartDate'; flexibleStartDate: boolean; reducer?: OptionalReducerData }
  | { type: 'job_setScheduleMayVary'; scheduleMayVary: boolean; reducer?: OptionalReducerData }
  | { type: 'job_setRateMinimum'; minimum: number; reducer?: OptionalReducerData }
  | { type: 'job_setRateMaximum'; maximum: number; reducer?: OptionalReducerData }
  | { type: 'job_setRateLegalMinimum'; legalMinimum: number; reducer?: OptionalReducerData }
  | { type: 'job_setJobStartDate'; date: string | null; reducer?: OptionalReducerData }
  | { type: 'job_setJobEndDate'; date: string | null; reducer?: OptionalReducerData }
  | { type: 'job_removeDayBlock'; day: DayOfWeek; index?: number; reducer?: OptionalReducerData }
  | { type: 'job_addDayBlock'; day: DayOfWeek; reducer?: OptionalReducerData }
  | { type: 'job_setPartsOfDay'; partsOfDay: PartsOfDay; reducer?: OptionalReducerData }
  | { type: 'job_setSpecificTimes'; isSpecificTimes: boolean; reducer?: OptionalReducerData }
  | { type: 'job_setJobTimes'; start: string; end: string; reducer?: OptionalReducerData }
  | { type: 'job_setJobType'; jobType: string; reducer?: OptionalReducerData }
  | {
      type: 'job_setJobSubmissionInfo';
      submissionAttempted: boolean;
      attempts: number;
      reducer?: OptionalReducerData;
    }
  | { type: 'job_setJobDescription'; description: string; reducer?: OptionalReducerData }
  | { type: 'job_setJobPostSuccessful'; jobSuccessful: boolean; reducer?: OptionalReducerData }
  | {
      type: 'job_updateDayBlock';
      day: DayOfWeek;
      index: number;
      timeBlock: TimeBlock;
      reducer?: OptionalReducerData;
    }
  | { type: 'job_applyTimesToAllDays'; day: DayOfWeek; reducer?: OptionalReducerData };
