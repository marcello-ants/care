import dayjs from 'dayjs';
import {
  DailyScheduleInput,
  LocalTimeBlockInput,
  WeeklyScheduleInput,
  SeniorCareRecipientRelationshipType,
  AddressInput,
} from '@/__generated__/globalTypes';

export type JobTypes = 'recurring' | 'onetime' | 'livein';

export type JobHours = {
  min: string;
  max: string;
};

export interface StateCheckingResponse {
  redirectCalled: boolean;
  readableMessage?: string;
}

type DateTime = {
  date: string | null;
  time: string;
};

export type DateTimeBlock = {
  start: DateTime;
  end: DateTime;
};

export type OneTimeCare = {
  schedule: DateTimeBlock;
};

export type Rate = {
  minimum: number;
  maximum: number;
  legalMinimum: number;
  rateRetrieved?: boolean;
  average?: number;
};

export type IbChildren = {
  dateOfBirth: string;
  childURI: string;
};

type IbPayRange = {
  minimum: {
    amount: number;
    currencyCode: globalScalarCurrency;
  };
  maximum: {
    amount: number;
    currencyCode: globalScalarCurrency;
  };
};

export type InstantBook = {
  eligibleLocation: boolean;
  isHomeAddress: boolean;
  payRange: IbPayRange;
  distanceLearning: boolean;
  children: IbChildren[];
  timeBlock: {
    start: string;
    end: string;
  };
  address: AddressInput;
  homeAddress: AddressInput;
  displayAddress: {
    bookingAddress: string;
    homeAddress: string;
  };
};

export type DailySchedule = DailyScheduleInput;

export type TimeBlock = LocalTimeBlockInput;

export type Member = {
  displayName: string;
  imageURL: string;
};
export type Caregiver = {
  member: Member;
  avgReviewRating: number;
  yearsOfExperience: number;
};

export type DayOfWeek = keyof WeeklyScheduleInput;
export type WeeklySchedule = WeeklyScheduleInput;

export interface PartsOfDay {
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
  overnight?: boolean;
}

// will probably rename this to Availability once implementation gets carried over to post a job
export type Recurring = {
  careTimes: PartsOfDay;
  schedule: WeeklySchedule;
  scheduleMayVary: boolean;
  specificTimes: boolean;
  timesAppliedToAllDays: boolean;
  start: string;
  end: string | null;
};

export type Age =
  | 'THIRTIES'
  | 'FORTIES'
  | 'FIFTIES'
  | 'SIXTIES'
  | 'SEVENTIES'
  | 'EIGHTIES'
  | 'NINETIES'
  | 'HUNDREDS';

const intentions = ['NOW', 'WEEK', 'MONTH', 'UNDECIDED'] as const;
export type Intent = typeof intentions[number];

export type Gender = 'FEMALE' | 'MALE';

export type LovedOne = {
  whoNeedsCare: SeniorCareRecipientRelationshipType | null;
  age: Age;
  gender: Gender;
  details: string | undefined;
};

export type IdealCaregiver = {
  gender: Gender | null;
  details: string | undefined;
  submissionAttempted: boolean;
  attempts: number;
};

export type AvailabilityAction =
  | { type: 'setStartDate'; date: string | null }
  | { type: 'setEndDate'; date: string | null }
  | { type: 'setPartsOfDay'; partsOfDay: PartsOfDay }
  | { type: 'setSpecificTimes'; isSpecificTimes: boolean }
  | { type: 'addDayBlock'; day: DayOfWeek }
  | { type: 'removeDayBlock'; day: DayOfWeek; index?: number }
  | { type: 'updateDayBlock'; day: DayOfWeek; index: number; timeBlock: TimeBlock }
  | { type: 'applyTimesToAllDays'; day: DayOfWeek }
  | { type: 'addTimeBlock'; day: DayOfWeek; index?: number }
  | { type: 'removeTimeBlock'; day: DayOfWeek; index: number };

export const DEFAULT_JOB_START_TIME = '09:00';
export const DEFAULT_JOB_END_TIME = '17:00';

export const DEFAULT_START_TIME = '08:00';
export const DEFAULT_END_TIME = '18:00';

// Federal minimum wage default rounded up
export const DEFAULT_LEGAL_MIN = 8;
export const DEFAULT_AVG_MIN = 14;
export const DEFAULT_AVG_MAX = 22;
export const DEFAULT_AVG = (DEFAULT_AVG_MIN + DEFAULT_AVG_MAX) / 2;
export const AVG_TO_MAX_FACTOR = 1.2;

export const DEFAULT_GENDER = 'FEMALE';
export const DEFAULT_WHO_NEEDS_CARE = 'PARENT' as SeniorCareRecipientRelationshipType;
export const DEFAULT_AGE = 'EIGHTIES';

export const initialRecurringState = {
  recurring: {
    careTimes: {},
    schedule: {},
    scheduleMayVary: false,
    specificTimes: false,
    timesAppliedToAllDays: false,
    start: dayjs().format('YYYY-MM-DD'),
    end: null,
  },
};

export interface MemberPhoto {
  thumbnailUrl: string;
  url: string;
}

export interface Location {
  zipcode: string;
  city: string;
  state: string;
  lat?: number | null;
  lng?: number | null;
}

export type DateBlock = {
  startDate: string | null;
  endDate: string | null;
};

export type TimesBlocks = {
  startTime: string;
  endTime: string;
};

export type JobSchedule = {
  dates: DateBlock;
  time: TimesBlocks;
};

export type JobSubmissionDetails = {
  jobPostSuccessful: boolean;
  submissionAttempted: boolean;
  attempts: number;
};

export type RecurringSchedule = {
  flexibleStartDate: boolean;
  schedule: WeeklySchedule;
  specificTimes: boolean;
  timesAppliedToAllDays: boolean;
  careTimes: PartsOfDay;
};

export enum PCCaregiverAttributes {
  COLLEGE_DEGREE = 'COLLEGE_DEGREE',
  OWN_TRANSPORTATION = 'OWN_TRANSPORTATION',
  DOES_NOT_SMOKE = 'DOES_NOT_SMOKE',
}

export enum CCCaregiverAttributes {
  COLLEGE_DEGREE = 'COLLEGE_DEGREE',
  OWN_TRANSPORTATION = 'OWN_TRANSPORTATION',
  DOES_NOT_SMOKE = 'DOES_NOT_SMOKE',
  CPR_TRAINED = 'CPR_TRAINED',
  COMFORTABLE_WITH_PETS = 'COMFORTABLE_WITH_PETS',
}

export type OptionalReducerData = {
  type: string;
  prefix: string;
};

export type JobPostData = {
  jobType: string;
  recurring: RecurringSchedule;
  jobDateTime: JobSchedule;
  scheduleMayVary: boolean;
  rate: Rate;
  needHelpWith: Array<string>;
  cargiverAttributes: Array<string>;
  idealCaregiverQualities: Array<string>;
  personalityCustomContentTwo: string;
  jobDescription: string;
  submissionInfo: JobSubmissionDetails;
};

export const initialJobState = {
  jobType: 'recurring',
  recurring: {
    flexibleStartDate: false,
    careTimes: {},
    schedule: {},

    specificTimes: false,
    timesAppliedToAllDays: false,
  },
  jobDateTime: {
    dates: {
      startDate: null,
      endDate: null,
    },
    time: {
      startTime: DEFAULT_JOB_START_TIME,
      endTime: DEFAULT_JOB_END_TIME,
    },
  },
  scheduleMayVary: false,
  rate: {
    minimum: DEFAULT_AVG_MIN,
    maximum: DEFAULT_AVG_MAX,
    legalMinimum: DEFAULT_LEGAL_MIN,
    average: (DEFAULT_AVG_MAX + DEFAULT_AVG_MIN) / 2,
  },
  needHelpWith: [],
  cargiverAttributes: [],
  idealCaregiverQualities: [],
  personalityCustomContentTwo: '',
  jobDescription: '',
  submissionInfo: {
    jobPostSuccessful: false,
    submissionAttempted: false,
    attempts: 0,
  },
};
