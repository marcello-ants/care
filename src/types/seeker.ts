import { VERTICALS_NAMES } from '@/constants';
import {
  SeniorCareRecipientRelationshipType,
  SeniorCareServiceNeededType,
  SENIOR_CARE_TYPE,
  SeniorCareAgeRangeType,
  YesOrNoAnswer,
  SeniorCareFacilityAmenity,
  SeniorCarePaymentSource,
  DistanceUnit,
  CenterType,
} from '@/__generated__/globalTypes';

import {
  // PAJ Types
  OneTimeCare,
  Rate,
  Intent,
  IdealCaregiver,
  LovedOne,
  PartsOfDay,
  Age,
  Gender,
  DayOfWeek,
  TimeBlock,
  WeeklySchedule,
} from './common';

export const liveInCareFrequency = 'livein' as const;
type TypeOfLiveInCareFrequency = typeof liveInCareFrequency;
export type CareFrequency = 'recurring' | 'onetime' | TypeOfLiveInCareFrequency;

export enum JobPostPages {
  POST_A_JOB = 'postAJob',
  ONE_TIME = 'onetime',
  RECURRING = 'recurring',
  PAY_FOR_CARE = 'payForCare',
  ABOUT_LOVED_ONE = 'aboutLovedOne',
  IDEAL_CAREGIVER = 'idealCaregiver',
}

export type RecurringCare = {
  careTimes: PartsOfDay; // is there a better place to put these two fields so they are further from the actual fields to be sent to GQL?
  schedule: WeeklySchedule;
  scheduleMayVary: boolean;
  specificTimes: boolean;
  timesAppliedToAllDays: boolean;
};

const handsOnServicesMapping: { [key: string]: { [key: string]: string } } = {
  SENIOR_CARE_MEDICATION: { MEDICATION: 'medication prompting' },
  SENIOR_CARE_MOBILITY_ASSISTANCE: { MOBILITY_ASSISTANCE: 'mobility assistance' },
  SENIOR_CARE_HELP_STAYING_PHYSICALLY_ACTIVE: {
    HELP_STAYING_PHYSICALLY_ACTIVE: 'help staying physically active',
  },
  SENIOR_CARE_FEEDING: { FEEDING: 'feeding' },
  SENIOR_CARE_BATHING: { BATHING: 'bathing / dressing' },
};

export const handsOnServices = Object.values(handsOnServicesMapping).map(
  (innerMap) => Object.keys(innerMap)[0]
);

export const servicesMapping: { [key: string]: { [key: string]: string } } = {
  ...handsOnServicesMapping,
  SENIOR_CARE_COMPANIONSHIP: { COMPANIONSHIP: 'companionship' },
  SENIOR_CARE_MEAL_PREPARATION: { MEAL_PREPARATION: 'meal preparation' },
  SENIOR_CARE_TRANSPORTATION: { TRANSPORTATION: 'transportation' },
  SENIOR_CARE_SERVICES_NEEDED_ERRANDS: { ERRANDS: 'errands / shopping' },
  SENIOR_CARE_LIGHT_HOUSECLEANING: { LIGHT_HOUSECLEANING: 'light housekeeping' },
} as const;

const services = Object.values(servicesMapping).map((innerMap) => Object.keys(innerMap)[0]);

export type Service = typeof services[number];

const descriptionReducer = (
  accumulator: { [key: string]: string },
  currentValue: { [key: string]: string }
) => ({ ...accumulator, ...currentValue });

export const serviceDescriptionMapping = Object.values(servicesMapping).reduce(descriptionReducer);

export const companionCare = 'COMPANION' as const;
export const handsOnCare = 'HANDS_ON' as const;
export const liveInCareType = 'LIVE_IN' as const;
const CareTypes = [companionCare, handsOnCare, liveInCareType, 'RESPITE'] as const;
export type TypeOfCare = typeof CareTypes[number];

export enum WhenLookingToMoveIntoCommunity {
  IMMEDIATELY = 'IMMEDIATELY',
  SIX_MONTHS = '6_MONTHS',
  TWELVE_MONTHS = '12_MONTHS',
  JUST_BROWSING = 'JUST_BROWSING',
}

export enum ServiceIds {
  childCare = 'CHILDCARE',
  seniorCare = 'SENIRCARE',
}

export enum SeekerPages {
  INDEX = 'INDEX',
  LOCATION = 'LOCATION',
  CARE_TYPE = 'CARE_TYPE',
  HELP_TYPE = 'HELP_TYPE',
  RECAP = 'RECAP',
  ACCOUNT_CREATION = 'ACCOUNT_CREATION',
  ACCOUNT_CREATION_NAME = 'ACCOUNT_CREATION_NAME',
}

export enum SeekerInFacilityPages {
  COMMUNITY_LIST = 'COMMUNITY_LIST',
  CARING_LEADS = 'CARING_LEADS',
}

export enum HelpType {
  HOUSEHOLD = 'houseHoldTasks',
  PERSONAL = 'personalCare',
  COMPANIONSHIP = 'companionship',
  TRANSPORTATION = 'transportation',
  SPECIALIZED = 'specializedCare',
  MOBILITY = 'mobilityAssistance',
  MEMORY_CARE = 'memoryCare',
}

export enum PaymentDetailType {
  PRIVATE_PAY = SeniorCarePaymentSource.PRIVATE_PAY,
  GOVERNMENT_HEALTH_PROGRAM = SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM,
  LONG_TERM_INSURANCE = SeniorCarePaymentSource.LONG_TERM_CARE_INSURANCE,
  OWNED_HOME = SeniorCarePaymentSource.HOME_EQUITY,
  VETERAN_BENEFIT = SeniorCarePaymentSource.VETERANS_BENEFITS,
  OTHER = SeniorCarePaymentSource.OTHER,
}

export const PaymentDetailTypeLabels: { [key in PaymentDetailType]: string } = {
  [PaymentDetailType.PRIVATE_PAY]: 'Private pay',
  [PaymentDetailType.GOVERNMENT_HEALTH_PROGRAM]: 'Medicaid',
  [PaymentDetailType.LONG_TERM_INSURANCE]: 'Long-term care insurance',
  [PaymentDetailType.OWNED_HOME]: 'A home they own',
  [PaymentDetailType.VETERAN_BENEFIT]: "Veteran's benefits",
  [PaymentDetailType.OTHER]: 'None of the above',
};

export const HelpTypeLabels: { [key in HelpType]: string } = {
  [HelpType.HOUSEHOLD]: 'Household tasks',
  [HelpType.PERSONAL]: 'Personal care',
  [HelpType.COMPANIONSHIP]: 'Companionship',
  [HelpType.TRANSPORTATION]: 'Transportation',
  [HelpType.SPECIALIZED]: 'Specialized care',
  [HelpType.MOBILITY]: 'Mobility assistance',
  [HelpType.MEMORY_CARE]: 'Memory care',
};

export const HELP_TYPE_OPTIONS = Object.freeze([
  {
    value: HelpType.HOUSEHOLD as string,
    label: HelpTypeLabels[HelpType.HOUSEHOLD],
    description: 'Errands, housekeeping and meal prep.',
  },
  {
    value: HelpType.PERSONAL as string,
    label: HelpTypeLabels[HelpType.PERSONAL],
    description: 'Bathing, dressing and feeding.',
  },
  {
    value: HelpType.COMPANIONSHIP as string,
    label: HelpTypeLabels[HelpType.COMPANIONSHIP],
    description: 'Sharing hobbies and lending an ear.',
  },
  {
    value: HelpType.TRANSPORTATION as string,
    label: HelpTypeLabels[HelpType.TRANSPORTATION],
    description: 'Trips to appointments and errands.',
  },
  {
    value: HelpType.SPECIALIZED as string,
    label: HelpTypeLabels[HelpType.SPECIALIZED],
    description: 'Memory care, use of special equipment.',
  },
  {
    value: HelpType.MOBILITY as string,
    label: HelpTypeLabels[HelpType.MOBILITY],
    description: 'Lift, transfers, physical activity, etc.',
  },
  {
    value: HelpType.MEMORY_CARE as string,
    label: HelpTypeLabels[HelpType.MEMORY_CARE],
    description: 'Alzheimer’s, dementia or memory care.',
  },
]);

export const PAYMENT_DETAIL_TYPE_OPTIONS = Object.freeze([
  {
    value: PaymentDetailType.PRIVATE_PAY,
    label: PaymentDetailTypeLabels[PaymentDetailType.PRIVATE_PAY],
    description: 'Savings, retirement, pension, etc.',
  },
  {
    value: PaymentDetailType.GOVERNMENT_HEALTH_PROGRAM,
    label: PaymentDetailTypeLabels[PaymentDetailType.GOVERNMENT_HEALTH_PROGRAM],
    description: 'Typically for those with monthly income and assets less than ~$2,500',
  },
  {
    value: PaymentDetailType.LONG_TERM_INSURANCE,
    label: PaymentDetailTypeLabels[PaymentDetailType.LONG_TERM_INSURANCE],
  },
  {
    value: PaymentDetailType.OWNED_HOME,
    label: PaymentDetailTypeLabels[PaymentDetailType.OWNED_HOME],
  },
  {
    value: PaymentDetailType.VETERAN_BENEFIT,
    label: PaymentDetailTypeLabels[PaymentDetailType.VETERAN_BENEFIT],
  },
  {
    value: PaymentDetailType.OTHER,
    label: PaymentDetailTypeLabels[PaymentDetailType.OTHER],
  },
]);

export function helpTypesToServices(helpTypes: HelpType[]) {
  const helpServices: SeniorCareServiceNeededType[] = [];

  if (helpTypes.includes(HelpType.TRANSPORTATION)) {
    helpServices.push(SeniorCareServiceNeededType.TRANSPORTATION);
  }
  if (helpTypes.includes(HelpType.HOUSEHOLD)) {
    helpServices.push(SeniorCareServiceNeededType.MEAL_PREPARATION);
    helpServices.push(SeniorCareServiceNeededType.ERRANDS);
    helpServices.push(SeniorCareServiceNeededType.LIGHT_HOUSECLEANING);
  }
  if (helpTypes.includes(HelpType.COMPANIONSHIP)) {
    helpServices.push(SeniorCareServiceNeededType.COMPANIONSHIP);
  }
  if (helpTypes.includes(HelpType.PERSONAL)) {
    helpServices.push(SeniorCareServiceNeededType.FEEDING);
    helpServices.push(SeniorCareServiceNeededType.BATHING);
  }
  if (helpTypes.includes(HelpType.MOBILITY)) {
    helpServices.push(SeniorCareServiceNeededType.MOBILITY_ASSISTANCE);
  }

  return helpServices;
}

export enum WhoNeedsCareOptions {
  SELF = 'SELF',
  OTHER = 'OTHER',
}

export enum WhenNeedsCareOptions {
  ASAP = 'ASAP',
  WITHIN_6_MONTHS = 'WITHIN_6_MONTHS',
  FUTURE = 'FUTURE',
}

export enum PaymentTypeOptions {
  PRIVATE = SeniorCarePaymentSource.PRIVATE_PAY,
  GOVERNMENT = SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM,
  HELP = SeniorCarePaymentSource.OTHER,
}

export enum FacilityBudgetQualification {
  ABLE_TO_AFFORD = YesOrNoAnswer.YES,
  NOT_ABLE_TO_AFFORD = YesOrNoAnswer.NO,
  NOT_SURE = YesOrNoAnswer.NOT_SURE,
}

// this will get removed once graphql types are generated
export enum SeniorCareRecipientCondition {
  INDEPENDENT = 'INDEPENDENT',
  MONITORING_OR_EXTRA_HELP_NEEDED = 'MONITORING_OR_EXTRA_HELP_NEEDED',
  CONSTANT_SUPERVISION_NEEDED = 'CONSTANT_SUPERVISION_NEEDED',
  NOT_SURE = 'NOT_SURE',
}

export enum SeniorCareNursingOptions {
  LITTLE = 'LITTLE_TO_NO_HELP',
  MINIMAL = 'MINIMAL_ASSISTANCE_GETTING_UP',
  EXTENSIVE = 'EXTENSIVE_SUPPORT',
}

export enum SeniorLivingOptions {
  INDEPENDENT = 'INDEPENDENT',
  ASSISTED = 'ASSISTED',
  MEMORY_CARE = 'MEMORY_CARE',
  NURSING_HOME = 'NURSING_HOME',
  NURSING_OPTIONS = 'NURSING_OPTIONS',
}

export type MinimalProviderProfile = {
  memberId: string;
  memberUUID: string;
  imgSource: string;
  displayName: string;
  averageRating?: number;
  numberReviews: number;
  yearsOfExperience: number;
  signUpDate?: Date;
};

export enum SeniorCareAttributeTags {
  nursingAssistant = 'Certified Nursing Assistant',
  healthAide = 'Certified Home Health Aide',
  registeredNurse = 'Registered Nurse',
  cprTrained = 'CPR trained',
  nonSmoker = 'Non-smoker',
}

export type SeekerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type GeneralProviderProfile = {
  memberId: string;
  memberUUID: string;
  imgSource: string;
  displayName: string;
  cityAndState?: string;
  distanceFromSeeker?: number;
  averageRating?: number;
  yearsOfExperience: number;
  minRate?: string;
  maxRate?: string;
  biography: string;
  hasCareCheck?: boolean;
  responseTime?: number;
  careRank?: number;
  seoProfileId?: string | undefined;
  signUpDate?: Date;
};

export type SeniorCareProviderProfile = GeneralProviderProfile & {
  numberReviews: number;
  attributeTags: SeniorCareAttributeTags[];
  listedAttributes: SeniorCareListedAttributes[];
};

export enum SeniorCareListedAttributes {
  respiteCare = 'Respite care',
  liveInCare = 'Live-in home care',
  transportation = 'Transportation',
  hospiceServices = 'Hospice services',
  errandsOrShopping = 'Errands',
  personalCare = 'Personal care',
  lightHousecleaning = 'Housekeeping',
  mealPreparation = 'Meal prep',
  dementia = 'Memory care',
  medicalManagement = 'Medical management',
  bathingAndDressing = 'Bathing and dressing',
  companionship = 'Companionship',
  feeding = 'Feeding',
  mobilityAssistance = 'Mobility assistance',
  helpPhysicallyActive = 'Help with staying physically active',
  heavyLifting = 'Heavy lifting',
  specializedCare = 'Specialized care',
}

export type LeadAndConnectState = {
  acceptedProviders: MinimalProviderProfile[];
  skippedCount?: number;
  initialProviderSeen?: boolean;
  maxDistanceFromSeeker: number;
  messageSentAttempts?: number;
  failedMessageSentProviderIds?: string[];
  message?: string;
  actionedProviders?: string[];
};
export interface JobPostSeekerState {
  careFrequency: CareFrequency | undefined;
  oneTime: OneTimeCare;
  rate: Rate;
  recurring: RecurringCare;
  selfNeedsCare: boolean | undefined;
  servicesNeeded: Service[];
  typeOfCare: TypeOfCare;
  zip: string | undefined;
  intent: Intent | undefined;
  idealCaregiver: IdealCaregiver;
  lovedOne: LovedOne;
  jobPostSuccessful: boolean;
  jobId?: string;
  initialLoggingDone: boolean;
  comesFromFlow: boolean | undefined;
}

export type CommunityTypeDetail = { title: string; available: boolean };

type ImageDetail = { small: string; medium: string };
export type CommunityDetail = {
  id: string;
  name?: string;
  location?: string;
  baseCost?: number;
  images?: ImageDetail[];
  careServices?: string[];
  onSiteServices?: string[];
  facilityAmenities?: string[];
  foodAmenities?: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
  communityTypes?: CommunityTypeDetail[];
  distanceFromSearchCenter?: string;
  centerType?: CenterType;
  city?: string;
  state?: string;
  address?: string;
  zip?: string;
};
export type CommunityDetails = CommunityDetail[];

interface MaxDistanceFromSeekerDayCare {
  distance: number;
  unit: DistanceUnit;
}

type VerticalKeys = keyof typeof VERTICALS_NAMES;
export type SeekerVerticalType = typeof VERTICALS_NAMES[VerticalKeys] | 'Daycare' | null;

export interface SeekerState {
  city: string;
  helpTypes: HelpType[];
  state: string;
  typeOfCare: SENIOR_CARE_TYPE;
  zipcode: string;
  visitorStartedSACFlow: boolean;
  initialAccountCreationFailed: boolean;
  initialAccountCreationAttempted: boolean;
  caregiversNearbySearchRadius: number | undefined;
  whoNeedsCare: SeniorCareRecipientRelationshipType | null;
  whoNeedsCareAge?: SeniorCareAgeRangeType;
  whenNeedsCare?: WhenNeedsCareOptions;
  paymentDetailTypes?: SeniorCarePaymentSource[];
  paymentType?: PaymentTypeOptions;
  facilityBudgetQualification?: FacilityBudgetQualification;
  condition?: SeniorCareRecipientCondition;
  nursingType?: SeniorCareNursingOptions;
  jobPost: JobPostSeekerState;
  leadAndConnect: LeadAndConnectState;
  amenities: SeniorCareFacilityAmenity[];
  seekerInfo: SeekerInfo;
  seniorCareFacilityLeadGenerateMutationError: boolean;
  fitsSALCBudget: YesOrNoAnswer;
  SALCSavedFacilitiesIds: string[];
  SALCSeniorCareFacilityLeadsPublished: boolean;
  SALCTrackingId?: string;
  SALCCommunities?: CommunityDetails;
  assistedLivingCenterFacilityCount?: number;
  caringFacilityCountNearBy?: number;
  whenLookingToMove?: WhenLookingToMoveIntoCommunity;
  maxDistanceFromSeekerDayCare: MaxDistanceFromSeekerDayCare;
  recommendedHelpType?: SeniorLivingOptions;
  hdyhau: string;
  vertical?: SeekerVerticalType;
}

export type SeekerAction =
  | { type: 'setCityAndState'; city: string; state: string }
  | { type: 'setHelpTypes'; helpTypes: HelpType[] }
  | { type: 'setTypeOfCare'; typeOfcare: SENIOR_CARE_TYPE }
  | { type: 'setZipcode'; zipcode: string }
  | { type: 'setVisitorStartedSACFlow'; visitorStartedSACFlow: boolean }
  | { type: 'setInitialAccountCreationFailed'; initialAccountCreationFailed: boolean }
  | { type: 'setInitialAccountCreationAttempted'; initialAccountCreationAttempted: boolean }
  | { type: 'setCaregiversNearbySearchRadius'; caregiversNearbySearchRadius: number }
  | { type: 'setWhoNeedsCare'; whoNeedsCare: SeniorCareRecipientRelationshipType | null }
  | { type: 'setWhoNeedsCareAge'; age: SeniorCareAgeRangeType }
  | { type: 'setWhenNeedsCare'; whenNeedsCare: WhenNeedsCareOptions }
  | { type: 'setPaymentDetailTypes'; paymentDetailTypes: SeniorCarePaymentSource[] }
  | { type: 'setPaymentType'; paymentType: PaymentTypeOptions }
  | {
      type: 'setFacilityBudgetQualification';
      facilityBudgetQualification: FacilityBudgetQualification;
    }
  | { type: 'setCondition'; condition: SeniorCareRecipientCondition }
  | { type: 'setNursingType'; nursingType: SeniorCareNursingOptions }
  | { type: 'setAmenities'; amenities: SeniorCareFacilityAmenity[] }
  | { type: 'setSeekerInfo'; firstName: string; lastName: string; email: string; phone: string }
  | { type: 'setSeniorCareFacilityLeadGenerateMutationError'; value: boolean }
  | { type: 'setFitsSALCBudget'; value: YesOrNoAnswer }
  | { type: 'setSALCSavedFacilitiesIds'; SALCSavedFacilitiesIds: string[] }
  | { type: 'setSALCTrackingId'; SALCTrackingId: string }
  | { type: 'setSALCCommunities'; SALCCommunities: CommunityDetails }
  | {
      type: 'setSeniorAssistedLivingCenterFacilityCount';
      assistedLivingCenterFacilityCount: number;
    }
  | {
      type: 'setSALCSeniorCareFacilityLeadsPublished';
      SALCSeniorCareFacilityLeadsPublished: boolean;
    }
  | { type: 'setCaringFacilityCountNearBy'; caringFacilityCountNearBy: number }
  | { type: 'setWhenLookingToMove'; whenLookingToMove: WhenLookingToMoveIntoCommunity }
  | { type: 'setRecommendedHelpType'; recommendedHelpType: SeniorLivingOptions }
  // PAJ Actions
  | { type: 'setCareFrequency'; careFrequency: CareFrequency }
  | { type: 'setOneTimeTimes'; start: string; end: string }
  | { type: 'setOneTimeStartDate'; date: string | null }
  | { type: 'setOneTimeEndDate'; date: string | null }
  | { type: 'setRateMinimum'; minimum: number }
  | { type: 'setRateMaximum'; maximum: number }
  | { type: 'setRateLegalMinimum'; legalMinimum: number }
  | { type: 'setRateRetrieved'; rateRetrieved: boolean }
  | { type: 'setScheduleMayVary'; scheduleMayVary: boolean }
  | { type: 'setPartsOfDay'; partsOfDay: PartsOfDay }
  | { type: 'setIdealCaregiverDetails'; details: string | undefined }
  | { type: 'setLovedOneWhoNeedsCare'; whoNeedsCare: SeniorCareRecipientRelationshipType | null }
  | { type: 'setLovedOneGender'; gender: Gender }
  | { type: 'setLovedOneAge'; age: Age }
  | { type: 'setLovedOneDetails'; details: string | undefined }
  | {
      type: 'setCareType';
      careFrequency: CareFrequency | undefined;
      servicesNeeded: Service[] | undefined;
    }
  | { type: 'setSpecificTimes'; isSpecificTimes: boolean }
  | { type: 'addDayBlock'; day: DayOfWeek }
  | { type: 'removeDayBlock'; day: DayOfWeek; index?: number }
  | { type: 'updateDayBlock'; day: DayOfWeek; index: number; timeBlock: TimeBlock }
  | { type: 'applyTimesToAllDays'; day: DayOfWeek }
  | { type: 'setSubmissionAttempted'; submissionAttempted: boolean; attempts: number }
  | { type: 'setJobStatus'; jobSuccessful: boolean }
  | { type: 'setJobId'; jobId: string }
  | { type: 'setInitialLoggingDone'; initialLoggingDone: boolean }
  | {
      type: 'setSeekerParams';
      zip: string;
      servicesNeeded: Service[];
      typeOfCare: SENIOR_CARE_TYPE;
    }
  // Lead+Connect Actions
  | { type: 'setAcceptedProviders'; acceptedProviders: MinimalProviderProfile[] }
  | { type: 'setSkippedCount'; skippedCount: number }
  | { type: 'setInitialProviderSeen'; initialProviderSeen: boolean }
  | { type: 'setMaxDistanceFromSeeker'; maxDistanceFromSeeker: number }
  | {
      type: 'setMaxDistanceFromSeekerDayCare';
      distance: number;
      unit: DistanceUnit;
    }
  | { type: 'setMessageSentAttempts'; messageSentAttempts: number }
  | { type: 'setFailedMessageSentProviderIds'; failedMessageSentProviderIds: string[] }
  | { type: 'setMessage'; message: string }
  | { type: 'setActionedProviders'; actionedProviders: string[] }
  | { type: 'setHdyhau'; hdyhau: string }
  | { type: 'setVertical'; vertical: SeekerVerticalType };
