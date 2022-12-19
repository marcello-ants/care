/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import produce from 'immer';
import dayjs from 'dayjs';

import {
  DEFAULT_AVG_MAX,
  DEFAULT_AVG_MIN,
  DEFAULT_JOB_END_TIME,
  DEFAULT_JOB_START_TIME,
  DEFAULT_LEGAL_MIN,
  DEFAULT_AGE,
  DEFAULT_GENDER,
  DEFAULT_WHO_NEEDS_CARE,
  DayOfWeek,
} from '@/types/common';
import {
  handsOnCare,
  companionCare,
  liveInCareType,
  SeekerAction,
  SeekerState,
  JobPostSeekerState,
  SeekerInfo,
  liveInCareFrequency,
  Service,
  handsOnServices,
} from '@/types/seeker';
import {
  SENIOR_CARE_TYPE,
  SeniorCareAgeRangeType,
  YesOrNoAnswer,
  DistanceUnit,
} from '@/__generated__/globalTypes';
import { DAYS } from '@/lib/DayFormats';

import { mapCareTimes, calculateTimes, convertTimeToDateTime } from './reducerHelpers';

export const jobPostInitialState: JobPostSeekerState = {
  careFrequency: undefined,
  oneTime: {
    schedule: {
      start: {
        date: null,
        time: DEFAULT_JOB_START_TIME,
      },
      end: {
        date: null,
        time: DEFAULT_JOB_END_TIME,
      },
    },
  },
  rate: {
    minimum: DEFAULT_AVG_MIN,
    maximum: DEFAULT_AVG_MAX,
    legalMinimum: DEFAULT_LEGAL_MIN,
  },
  recurring: {
    careTimes: {},
    schedule: {},
    scheduleMayVary: false,
    specificTimes: false,
    timesAppliedToAllDays: false,
  },
  selfNeedsCare: undefined,
  servicesNeeded: [],
  typeOfCare: companionCare,
  zip: undefined,
  intent: undefined,
  idealCaregiver: {
    gender: null,
    details: undefined,
    submissionAttempted: false,
    attempts: 0,
  },
  lovedOne: {
    whoNeedsCare: DEFAULT_WHO_NEEDS_CARE,
    gender: DEFAULT_GENDER,
    age: DEFAULT_AGE,
    details: undefined,
  },
  jobPostSuccessful: false,
  initialLoggingDone: false,
  comesFromFlow: false,
};

export const seekerInfoInitialState: SeekerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export const initialState: SeekerState = {
  city: '',
  helpTypes: [],
  state: '',
  typeOfCare: SENIOR_CARE_TYPE.NOT_SURE,
  zipcode: '',
  visitorStartedSACFlow: false,
  initialAccountCreationFailed: false,
  initialAccountCreationAttempted: false,
  caregiversNearbySearchRadius: undefined,
  whoNeedsCare: null,
  whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
  jobPost: jobPostInitialState,
  leadAndConnect: {
    acceptedProviders: [],
    maxDistanceFromSeeker: 10,
  },
  amenities: [],
  seekerInfo: seekerInfoInitialState,
  seniorCareFacilityLeadGenerateMutationError: false,
  fitsSALCBudget: YesOrNoAnswer.NOT_SURE,
  SALCSavedFacilitiesIds: [],
  SALCSeniorCareFacilityLeadsPublished: false,
  maxDistanceFromSeekerDayCare: {
    distance: 0,
    unit: DistanceUnit.MILES,
  },
  hdyhau: '',
  vertical: null,
};

export const reducer = produce((draft: SeekerState, action: SeekerAction) => {
  switch (action.type) {
    case 'setCityAndState':
      draft.city = action.city;
      draft.state = action.state;
      return draft;

    case 'setHelpTypes':
      draft.helpTypes = action.helpTypes;
      return draft;

    case 'setTypeOfCare':
      draft.typeOfCare = action.typeOfcare;
      return draft;

    case 'setZipcode':
      draft.zipcode = action.zipcode;
      return draft;

    case 'setVisitorStartedSACFlow':
      draft.visitorStartedSACFlow = action.visitorStartedSACFlow;
      return draft;

    case 'setInitialAccountCreationFailed':
      draft.initialAccountCreationFailed = action.initialAccountCreationFailed;
      return draft;

    case 'setInitialAccountCreationAttempted':
      draft.initialAccountCreationAttempted = action.initialAccountCreationAttempted;
      return draft;

    case 'setCaregiversNearbySearchRadius':
      draft.caregiversNearbySearchRadius = action.caregiversNearbySearchRadius;
      return draft;

    case 'setWhoNeedsCare':
      draft.whoNeedsCare = action.whoNeedsCare;
      return draft;

    case 'setWhenNeedsCare':
      draft.whenNeedsCare = action.whenNeedsCare;
      return draft;

    case 'setWhoNeedsCareAge':
      draft.whoNeedsCareAge = action.age;
      return draft;

    case 'setPaymentDetailTypes':
      draft.paymentDetailTypes = action.paymentDetailTypes;
      return draft;

    case 'setPaymentType':
      draft.paymentType = action.paymentType;
      return draft;

    case 'setFacilityBudgetQualification':
      draft.facilityBudgetQualification = action.facilityBudgetQualification;
      return draft;

    case 'setCondition':
      draft.condition = action.condition;
      return draft;

    case 'setNursingType':
      draft.nursingType = action.nursingType;
      return draft;

    case 'setAmenities':
      draft.amenities = action.amenities;
      return draft;

    case 'setSeekerInfo':
      draft.seekerInfo.firstName = action.firstName;
      draft.seekerInfo.lastName = action.lastName;
      draft.seekerInfo.email = action.email;
      draft.seekerInfo.phone = action.phone;
      return draft;

    case 'setSeniorCareFacilityLeadGenerateMutationError':
      draft.seniorCareFacilityLeadGenerateMutationError = action.value;
      return draft;

    case 'setFitsSALCBudget':
      draft.fitsSALCBudget = action.value;
      return draft;

    case 'setSALCSavedFacilitiesIds':
      draft.SALCSavedFacilitiesIds = action.SALCSavedFacilitiesIds;
      return draft;

    case 'setSALCTrackingId':
      draft.SALCTrackingId = action.SALCTrackingId;
      return draft;

    case 'setSALCCommunities':
      draft.SALCCommunities = action.SALCCommunities;
      return draft;

    case 'setSeniorAssistedLivingCenterFacilityCount':
      draft.assistedLivingCenterFacilityCount = action.assistedLivingCenterFacilityCount;
      return draft;

    case 'setCaringFacilityCountNearBy':
      draft.caringFacilityCountNearBy = action.caringFacilityCountNearBy;
      return draft;

    case 'setWhenLookingToMove':
      draft.whenLookingToMove = action.whenLookingToMove;
      return draft;

    case 'setRecommendedHelpType':
      draft.recommendedHelpType = action.recommendedHelpType;
      return draft;

    // PAJ
    case 'setCareFrequency':
      draft.jobPost.careFrequency = action.careFrequency;
      if (draft.jobPost.careFrequency === 'recurring' || draft.jobPost.careFrequency === 'livein') {
        draft.jobPost.oneTime.schedule.start.date = null;
        draft.jobPost.oneTime.schedule.end.date = null;
      }
      return draft;

    case 'setOneTimeTimes': {
      draft.jobPost.oneTime.schedule.start.time = action.start;
      draft.jobPost.oneTime.schedule.end.time = action.end;

      const today = dayjs();
      const startTimeConverted = convertTimeToDateTime(today, action.start);
      const endTimeConverted = convertTimeToDateTime(today, action.end);

      // ensures endtime is 1 hr ahead of start time
      if (endTimeConverted.isSameOrBefore(startTimeConverted.add(1, 'hour'))) {
        draft.jobPost.oneTime.schedule.end.time = startTimeConverted.add(1, 'hour').format('HH:mm');
      }

      return draft;
    }
    case 'setOneTimeStartDate': {
      draft.jobPost.oneTime.schedule.start.date = action.date;

      const { start, end } = calculateTimes(action.date);

      draft.jobPost.oneTime.schedule.start.time = start;
      draft.jobPost.oneTime.schedule.end.time = end;

      return draft;
    }

    case 'setOneTimeEndDate':
      draft.jobPost.oneTime.schedule.end.date = action.date;

      return draft;

    case 'setRateMinimum':
      draft.jobPost.rate.minimum = action.minimum;
      return draft;

    case 'setRateMaximum':
      draft.jobPost.rate.maximum = action.maximum;
      return draft;

    case 'setRateLegalMinimum':
      draft.jobPost.rate.legalMinimum = action.legalMinimum;
      return draft;

    case 'setRateRetrieved':
      draft.jobPost.rate.rateRetrieved = action.rateRetrieved;
      return draft;

    case 'setScheduleMayVary':
      draft.jobPost.recurring.scheduleMayVary = action.scheduleMayVary;
      return draft;

    case 'setPartsOfDay':
      draft.jobPost.recurring.careTimes = action.partsOfDay;
      return draft;

    case 'setLovedOneWhoNeedsCare':
      draft.jobPost.lovedOne.whoNeedsCare = action.whoNeedsCare;
      return draft;

    case 'setLovedOneGender':
      draft.jobPost.lovedOne.gender = action.gender;
      return draft;

    case 'setLovedOneAge':
      draft.jobPost.lovedOne.age = action.age;
      return draft;

    case 'setLovedOneDetails':
      draft.jobPost.lovedOne.details = action.details;
      return draft;

    case 'setSeekerParams': {
      draft.jobPost.selfNeedsCare = false;
      draft.jobPost.intent = 'UNDECIDED';
      draft.jobPost.comesFromFlow = true;
      draft.jobPost.servicesNeeded = action.servicesNeeded;
      draft.jobPost.zip = action.zip;

      return draft;
    }

    case 'setIdealCaregiverDetails':
      draft.jobPost.idealCaregiver.details = action.details;
      return draft;

    case 'setCareType':
      if (
        (action.servicesNeeded ?? []).some((specificService: Service) =>
          handsOnServices.includes(specificService)
        )
      ) {
        draft.jobPost.typeOfCare = handsOnCare;
      } else {
        draft.jobPost.typeOfCare = companionCare;
      }

      if (action.careFrequency === liveInCareFrequency) {
        draft.jobPost.typeOfCare = liveInCareType;
      }

      return draft;

    case 'setSpecificTimes': {
      draft.jobPost.recurring.specificTimes = action.isSpecificTimes;
      draft.jobPost.recurring.scheduleMayVary = false;

      // if days are selected, pre-populate the blocks with the pill times or use default times
      const selectedDays = Object.keys(draft.jobPost.recurring.schedule) as DayOfWeek[];
      const { start = '', end = '' } =
        selectedDays.length > 0 ? mapCareTimes(draft.jobPost.recurring.careTimes) : {};

      selectedDays.forEach((day) => {
        const daySchedule = draft.jobPost.recurring.schedule[day] ?? { blocks: [] };
        if (daySchedule.blocks.length === 0 && start && end) {
          daySchedule.blocks.push({ end, start });
        } else if (daySchedule.blocks.length === 0) {
          daySchedule.blocks.push({ end: DEFAULT_JOB_END_TIME, start: DEFAULT_JOB_START_TIME });
        }
      });

      // wipe out old careTimes configuration if present since we are going with specific times instead
      draft.jobPost.recurring.careTimes = {};

      return draft;
    }
    // It looks like this code should be refactor in the following story https://jira.infra.carezen.net/browse/SC-852
    // this code is duplicated on src/state/seekerCC/reducer.ts  and src/components/pages/availability.tsx
    case 'addDayBlock': {
      const { specificTimes, schedule } = draft.jobPost.recurring;
      const daySchedule = draft.jobPost.recurring.schedule[action.day] ?? { blocks: [] };
      const { start, end } = mapCareTimes(draft.jobPost.recurring.careTimes);

      // get last day time to be copied in the new day
      const prevDays = DAYS.slice(0, DAYS.indexOf(action.day));
      const [day] = prevDays.reverse().filter((key) => schedule[key]);
      const prevDay = schedule[day];

      if (specificTimes && prevDay) {
        // copy the previous schedule to the new day
        daySchedule.blocks = prevDay.blocks;
      } else if (specificTimes && start && end) {
        // set range time from Times pills
        daySchedule.blocks.push({ end, start });
      } else if (specificTimes) {
        daySchedule.blocks.push({ end: DEFAULT_JOB_END_TIME, start: DEFAULT_JOB_START_TIME });
      }
      draft.jobPost.recurring.schedule[action.day] = daySchedule;
      draft.jobPost.recurring.timesAppliedToAllDays = false;

      return draft;
    }

    case 'removeDayBlock':
      if (!action.index) {
        // remove all blocks
        delete draft.jobPost.recurring.schedule[action.day];
      }

      return draft;

    case 'updateDayBlock': {
      const daySchedule = draft.jobPost.recurring.schedule[action.day];
      if (daySchedule) {
        daySchedule.blocks[action.index] = action.timeBlock;
        draft.jobPost.recurring.timesAppliedToAllDays = false;
      }

      return draft;
    }

    case 'applyTimesToAllDays': {
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

    case 'setSubmissionAttempted':
      draft.jobPost.idealCaregiver.submissionAttempted = action.submissionAttempted;
      draft.jobPost.idealCaregiver.attempts = action.attempts;
      return draft;

    case 'setJobStatus':
      draft.jobPost.jobPostSuccessful = action.jobSuccessful;
      return draft;

    case 'setJobId':
      draft.jobPost.jobId = action.jobId;
      return draft;

    case 'setInitialLoggingDone':
      draft.jobPost.initialLoggingDone = action.initialLoggingDone;
      return draft;

    // Lead and connect
    case 'setAcceptedProviders':
      draft.leadAndConnect.acceptedProviders = action.acceptedProviders;
      return draft;

    case 'setSkippedCount':
      draft.leadAndConnect.skippedCount = action.skippedCount;
      return draft;

    case 'setInitialProviderSeen':
      draft.leadAndConnect.initialProviderSeen = action.initialProviderSeen;
      return draft;

    case 'setMaxDistanceFromSeeker':
      draft.leadAndConnect.maxDistanceFromSeeker = action.maxDistanceFromSeeker;
      return draft;

    case 'setMessageSentAttempts':
      draft.leadAndConnect.messageSentAttempts = action.messageSentAttempts;
      return draft;

    case 'setFailedMessageSentProviderIds':
      draft.leadAndConnect.failedMessageSentProviderIds = action.failedMessageSentProviderIds;
      return draft;

    case 'setMessage':
      draft.leadAndConnect.message = action.message;
      return draft;

    case 'setActionedProviders':
      draft.leadAndConnect.actionedProviders = action.actionedProviders;
      return draft;

    case 'setSALCSeniorCareFacilityLeadsPublished':
      draft.SALCSeniorCareFacilityLeadsPublished = action.SALCSeniorCareFacilityLeadsPublished;
      return draft;

    case 'setMaxDistanceFromSeekerDayCare':
      draft.maxDistanceFromSeekerDayCare = { distance: action.distance, unit: action.unit };
      return draft;

    case 'setHdyhau':
      draft.hdyhau = action.hdyhau;
      return draft;

    case 'setVertical':
      draft.vertical = action.vertical;
      return draft;

    default:
      return draft;
  }
});
