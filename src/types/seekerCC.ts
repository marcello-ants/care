import { ReactNode } from 'react';
// eslint-disable-next-line camelcase
import { findChildCareProviders_findChildCareProviders_ProviderSearchSuccess_providers } from '@/__generated__/findChildCareProviders';
import { AddressInput, SubServiceType } from '@/__generated__/globalTypes';
import { CARE_DATES } from '@/constants';
import { ProviderProfile } from '@/components/pages/seeker/lc/types';
import {
  CCCaregiverAttributes,
  DayOfWeek,
  Location,
  JobPostData,
  OptionalReducerData,
  InstantBook,
  IbChildren,
} from './common';
import { ServiceIds } from './seeker';

// Daycare Kinds
export enum DayCareKind {
  DAY_CARE_CENTERS = 'DAY_CARE_CENTERS',
  PRESCHOOL_CENTERS = 'PRESCHOOL_CENTERS',
  AFTER_SCHOOL_CENTERS = 'AFTER_SCHOOL_CENTERS',
}

export const DayCareKindLabels: { [key in DayCareKind]: string } = {
  [DayCareKind.DAY_CARE_CENTERS]: 'Daycare centers',
  [DayCareKind.PRESCHOOL_CENTERS]: 'Preschool centers',
  [DayCareKind.AFTER_SCHOOL_CENTERS]: 'After school care',
};
// End Daycare Kinds

// Default Care Kinds
export enum DefaultCareKind {
  NANNIES_RECURRING_BABYSITTERS = 'NANNIES_RECURRING_BABYSITTERS',
  ONE_TIME_BABYSITTERS = 'ONE_TIME_BABYSITTERS',
  DAY_CARE_CENTERS = 'DAY_CARE_CENTERS',
}

export const CareKindLabels: { [key in DefaultCareKind]: string } = {
  [DefaultCareKind.NANNIES_RECURRING_BABYSITTERS]: 'Nannies / recurring sitters',
  [DefaultCareKind.ONE_TIME_BABYSITTERS]: 'One-time sitters',
  [DefaultCareKind.DAY_CARE_CENTERS]: 'Daycare centers',
};

export const CareKindDescriptions: { [key in DefaultCareKind]: string } = {
  [DefaultCareKind.NANNIES_RECURRING_BABYSITTERS]:
    'Hire for regular hours, ongoing care, full or part-time',
  [DefaultCareKind.ONE_TIME_BABYSITTERS]:
    'Instantly book for events, occasional plans or backup care',
  [DefaultCareKind.DAY_CARE_CENTERS]: 'Find daycares, learning centers, or pre-schools near you',
};

export const CareKindToSubServiceType: { [key in CareKind]: SubServiceType } = {
  [DefaultCareKind.NANNIES_RECURRING_BABYSITTERS]: SubServiceType.NANNY_OR_BABYSITTER,
  [DefaultCareKind.ONE_TIME_BABYSITTERS]: SubServiceType.ONE_TIME_BABYSITTER,
  [DefaultCareKind.DAY_CARE_CENTERS]: SubServiceType.DAY_CARE,
  [DayCareKind.PRESCHOOL_CENTERS]: SubServiceType.DAY_CARE,
  [DayCareKind.AFTER_SCHOOL_CENTERS]: SubServiceType.DAY_CARE,
};
// End Default Care Kinds

export type CareKind = DefaultCareKind | DayCareKind;

export enum CareDayTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  ALLDAY = 'ALLDAY',
}

export const CareDayTimeLabels: { [key in CareDayTime]: string } = {
  [CareDayTime.MORNING]: 'Morning',
  [CareDayTime.AFTERNOON]: 'Afternoon',
  [CareDayTime.ALLDAY]: 'All day',
};

export enum IdealCaregiver {
  PATIENT = 'PATIENT',
  ENERGETIC = 'ENERGETIC',
  LOVING = 'LOVING',
  RELIABLE = 'RELIABLE',
  CARING = 'CARING',
  RESPONSIBLE = 'RESPONSIBLE',
}

export const IdealCaregiverLabels: { [key in IdealCaregiver]: string } = {
  [IdealCaregiver.PATIENT]: 'Patient',
  [IdealCaregiver.ENERGETIC]: 'Energetic',
  [IdealCaregiver.LOVING]: 'Loving',
  [IdealCaregiver.RELIABLE]: 'Reliable',
  [IdealCaregiver.CARING]: 'Caring',
  [IdealCaregiver.RESPONSIBLE]: 'Responsible',
};

export enum NeedHelpWith {
  HOMEWORK_HELP = 'HOMEWORK_HELP',
  STRUCTURED_ACTIVITIES = 'STRUCTURED_ACTIVITIES',
  LIGHT_HOUSEKEEPING = 'LIGHT_HOUSEKEEPING',
}

export const NeedHelpWithLabels: { [key in NeedHelpWith]: string } = {
  [NeedHelpWith.HOMEWORK_HELP]: 'Homework or curriculum help',
  [NeedHelpWith.STRUCTURED_ACTIVITIES]: 'Structuring activities',
  [NeedHelpWith.LIGHT_HOUSEKEEPING]: 'Light housekeeping / meal prep',
};

export const CaregiverAttributesLabels: { [key in CCCaregiverAttributes]: string } = {
  [CCCaregiverAttributes.CPR_TRAINED]: 'CPR / First Aid trained',
  [CCCaregiverAttributes.COMFORTABLE_WITH_PETS]: 'Comfortable with pets',
  [CCCaregiverAttributes.COLLEGE_DEGREE]: 'College educated',
  [CCCaregiverAttributes.OWN_TRANSPORTATION]: 'Has a reliable car',
  [CCCaregiverAttributes.DOES_NOT_SMOKE]: 'Non-smoker',
};

export enum IsHomeAddressOptions {
  YES = 'YES',
  NO = 'NO',
}

export interface Child {
  id?: string | null;
  ageRange: string;
  gender?: string | null;
  approximateDoB?: string | null;
}

export type ChildDOB = string | null;

export interface ChildDateOfBirth {
  month: string;
  year: string;
}

export const DayCareFrequencyOptions = {
  PART_TIME: 'part-time',
  FULL_TIME: 'full-time',
};

type CareDays = {
  careType: string;
  specifcDays: DayOfWeek[];
};

interface DayCareAutoSubmit {
  startTime: string | null;
  attempts: number;
  submitted: boolean;
}

export type SeekerContactMethod = 'MAIL' | 'PHONE';

type DayCareData = {
  careFrequency: CareDays;
  startMonth: string | null;
  childrenDateOfBirth: ChildDateOfBirth[];
  dayTime: CareDayTime;
  additionalInformation: string;
  recommendationsTrackingId: string;
  recommendations: DaycareProviderProfile[];
  submissionCompleted: boolean;
  shouldShowMap: boolean;
  autoSubmit: DayCareAutoSubmit;
  contactMethod?: SeekerContactMethod;
};

export enum DaycareProviderLicenseType {
  fullPermit,
  // TODO other types...
}

export interface DaycareProviderProfile
  // eslint-disable-next-line camelcase
  extends findChildCareProviders_findChildCareProviders_ProviderSearchSuccess_providers {
  avgReviewRating: number;
  selected: boolean;
  hasCoordinates: boolean;
}

export interface SeekerCCState {
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  czenTimeIntent?: TimeIntent;
  czenServiceIdForMember?: ServiceIdsForMember;
  careDate: CARE_DATES;
  careKind: CareKind;
  careChildren: Child[];
  careChildrenDOB: ChildDOB[];
  careExpecting: boolean;
  distanceLearning: boolean;
  jobPost: JobPostData;
  enrollmentSource: string;
  dayCare: DayCareData;
  isSendLeadEnabled: boolean;
  isPixelFired: boolean;
  lcProviders: ProviderProfile[];
  lcFavoritedProviders: ProviderProfile[];
  lcReviewedProviders?: string[];
  instantBook: InstantBook;
}

export enum ServiceIdsForMember {
  babysitter = 'babysitter',
  nanny = 'nanny',
  dayCare = 'dayCare',
}

export enum TimeIntent {
  rightNow = 'RightNow',
  withinOneWeek = 'WithinaWeek',
  in1to2Months = 'In1-2Months',
  justBrowsing = 'Just+browsing',
}

export interface CzenIntent {
  serviceId: ServiceIds;
  serviceIdForMember: ServiceIdsForMember;
  intent?: TimeIntent;
}

export const Months = [
  { value: 'JANUARY', label: 'January' },
  { value: 'FEBRUARY', label: 'February' },
  { value: 'MARCH', label: 'March' },
  { value: 'APRIL', label: 'April' },
  { value: 'MAY', label: 'May' },
  { value: 'JUNE', label: 'June' },
  { value: 'JULY', label: 'July' },
  { value: 'AUGUST', label: 'August' },
  { value: 'SEPTEMBER', label: 'September' },
  { value: 'OCTOBER', label: 'October' },
  { value: 'NOVEMBER', label: 'November' },
  { value: 'DECEMBER', label: 'December' },
];

export type SeekerCCAction =
  | { type: 'setCzenIntent'; intent: TimeIntent; reducer?: OptionalReducerData }
  | {
      type: 'setCzenServiceIdForMember';
      serviceIdForMember: ServiceIdsForMember;
      reducer?: OptionalReducerData;
    }
  | { type: 'setCareDate'; careDate: CARE_DATES; reducer?: OptionalReducerData }
  | { type: 'setCareKind'; careKind: CareKind; reducer?: OptionalReducerData }
  | { type: 'setIdealCaregiverQualities'; value: Array<string>; reducer?: OptionalReducerData }
  | {
      type: 'setPersonalityCustomContentTwo';
      personalityCustomContentTwo: string;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'setCargiverAttributes';
      value: Array<string>;
      reducer?: OptionalReducerData;
    }
  | { type: 'setNeedHelpWith'; value: Array<string>; reducer?: OptionalReducerData }
  | {
      type: 'setCareChildren';
      careChildren: Child[];
      careExpecting: boolean;
      distanceLearning: boolean;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'setCareChildrenDOB';
      careChildrenDOB: ChildDOB[];
      careExpecting: boolean;
      distanceLearning: boolean;
      reducer?: OptionalReducerData;
    }
  | { type: 'cc_setEnrollmentSource'; value: string; reducer?: OptionalReducerData }
  | { type: 'cc_setDayCareDayTime'; dayTime: CareDayTime; reducer?: OptionalReducerData }
  | { type: 'cc_setSeekerName'; firstName: string; lastName: string; reducer?: OptionalReducerData }
  | { type: 'cc_setSeekerPhoneNumber'; phoneNumber: string; reducer?: OptionalReducerData }
  | { type: 'cc_setSeekerEmail'; email: string; reducer?: OptionalReducerData }
  | {
      type: 'cc_setSeekerContactMethod';
      contactMethod?: SeekerContactMethod;
      reducer?: OptionalReducerData;
    }
  | { type: 'setDayCareFrequency'; careType: string; reducer?: OptionalReducerData }
  | { type: 'setDayCareSpecificDays'; specifcDays: DayOfWeek[]; reducer?: OptionalReducerData }
  | { type: 'setDayCareStartMonth'; month: string | null; reducer?: OptionalReducerData }
  | {
      type: 'setDayCareChildrenDateOfBirth';
      childrenDateOfBirth: ChildDateOfBirth[];
      reducer?: OptionalReducerData;
    }
  | {
      type: 'setAdditionalInformation';
      additionalInformation: string;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setDayCareRecommendations';
      dayCareRecommendations: DaycareProviderProfile[];
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setDayCareRecommendationsSelectections';
      dayCareIds: string[];
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setDayCareRecommendationsSubmissionInfo';
      completed: boolean;
      reducer?: OptionalReducerData;
    }
  | { type: 'cc_startDayCareAutoSubmitCountdown'; reducer?: OptionalReducerData }
  | { type: 'cc_increaseDayCareAutoSubmitAttempt'; reducer?: OptionalReducerData }
  | { type: 'cc_autoSubmitDayCares'; reducer?: OptionalReducerData }
  | { type: 'setEnrollmentVariant'; variant: string; reducer?: OptionalReducerData }
  | {
      type: 'cc_setDayCareRecommendationsShouldShowMap';
      shouldShowMap: boolean;
      reducer?: OptionalReducerData;
    }
  | { type: 'cc_setIsSendLeadEnabled'; isSendLeadEnabled: boolean; reducer?: OptionalReducerData }
  | {
      type: 'cc_setDayCareRecommendationsTrackingId';
      trackingId: string;
      reducer?: OptionalReducerData;
    }
  | { type: 'setIsPixelFired'; isPixelFired: boolean; reducer?: OptionalReducerData }
  | {
      type: 'cc_setLCProviders';
      providers: ProviderProfile[];
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setLCFavoritedProviders';
      favoritedProviders: ProviderProfile[];
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setLCReviewedProviders';
      lcReviewedProvidersIds: string[];
      reducer?: OptionalReducerData;
    }
  | { type: 'cc_setIbRateMinimum'; minimum: number; reducer?: OptionalReducerData }
  | { type: 'cc_setIbRateMaxiumum'; maximum: number; reducer?: OptionalReducerData }
  | {
      type: 'cc_setIbEligibleLocation';
      eligible: boolean;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setInstantBookStartTime';
      start: string;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setInstantBookEndTime';
      end: string;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setIbChildrenDOB';
      children: IbChildren[];
      distanceLearning: boolean;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setIbAddress';
      address: AddressInput;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setIbHomeAddress';
      address: AddressInput;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setIbIsHomeAddress';
      isHomeAddress: boolean;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setIbDisplayBookingAddress';
      displayAddress: string;
      reducer?: OptionalReducerData;
    }
  | {
      type: 'cc_setIbDisplayHomeAddress';
      displayAddress: string;
      reducer?: OptionalReducerData;
    };

export type GenderOptions = { label: string; value: string }[];

// Tax calculator page
export type UserInfoTaxCalculator = {
  location: Location;
  kidsNumber: number;
  hoursNumber: number;
};

export type CardDetailsTaxCalculator = {
  key: string;
  title: string;
  icon: ReactNode;
  link: string;
}[];

export type Money = {
  amount: string;
  currencyCode: string;
};

export type CardsDataTaxCalculator = {
  originalTotal: Money;
  discountedTotal: Money;
  savingPercentage: number;
  savingAmount: Money;
  subServiceType: string;
}[];
