/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */
import produce from 'immer';
import {
  CareKind,
  SeekerCCAction,
  SeekerCCState,
  ServiceIdsForMember,
  TimeIntent,
  DayCareFrequencyOptions,
  CareDayTime,
  DefaultCareKind,
} from '@/types/seekerCC';
import { initialJobState, DEFAULT_AVG_MIN, DEFAULT_AVG, AVG_TO_MAX_FACTOR } from '@/types/common';

import { reducer as jobReducer } from '@/state/job';
import { JobAction } from '@/types/job';
import { CARE_DATES } from '@/constants';

const careKindServiceIdMap = {
  [ServiceIdsForMember.nanny]: DefaultCareKind.NANNIES_RECURRING_BABYSITTERS,
  [ServiceIdsForMember.babysitter]: DefaultCareKind.ONE_TIME_BABYSITTERS,
  [ServiceIdsForMember.dayCare]: DefaultCareKind.DAY_CARE_CENTERS,
};

const careDateIntentMap = {
  [TimeIntent.in1to2Months]: CARE_DATES.IN_1_2_MONTHS,
  [TimeIntent.justBrowsing]: CARE_DATES.JUST_BROWSING,
  [TimeIntent.rightNow]: CARE_DATES.RIGHT_NOW,
  [TimeIntent.withinOneWeek]: CARE_DATES.WITHIN_A_WEEK,
};

export const initialState: SeekerCCState = {
  careDate: CARE_DATES.WITHIN_A_WEEK,
  careKind: DefaultCareKind.NANNIES_RECURRING_BABYSITTERS,
  careExpecting: false,
  careChildren: [],
  careChildrenDOB: [],
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  jobPost: initialJobState,
  distanceLearning: false,
  enrollmentSource: '',
  dayCare: {
    recommendationsTrackingId: '',
    careFrequency: {
      careType: DayCareFrequencyOptions.FULL_TIME,
      specifcDays: [],
    },
    startMonth: '',
    childrenDateOfBirth: [],
    dayTime: CareDayTime.ALLDAY,
    additionalInformation: '',
    recommendations: [],
    submissionCompleted: false,
    shouldShowMap: true,
    autoSubmit: {
      startTime: null,
      attempts: 0,
      submitted: false,
    },
  },
  isSendLeadEnabled: true,
  isPixelFired: false,
  lcProviders: [],
  lcFavoritedProviders: [],
  instantBook: {
    isHomeAddress: true,
    eligibleLocation: false,
    payRange: {
      minimum: {
        amount: DEFAULT_AVG_MIN,
        currencyCode: 'USD',
      },
      maximum: {
        amount: Math.round(AVG_TO_MAX_FACTOR * DEFAULT_AVG),
        currencyCode: 'USD',
      },
    },
    distanceLearning: false,
    children: [],
    timeBlock: {
      start: '',
      end: '',
    },
    address: {
      addressLine1: '',
      city: '',
      state: '',
      zip: '',
    },
    homeAddress: {
      addressLine1: '',
      city: '',
      state: '',
      zip: '',
    },
    displayAddress: {
      bookingAddress: '',
      homeAddress: '',
    },
  },
};

export const seekerCCReducer = produce((draft: SeekerCCState, action: SeekerCCAction) => {
  switch (action.type) {
    case 'setCzenServiceIdForMember': {
      const careKind = careKindServiceIdMap[action.serviceIdForMember];
      if (careKind) {
        draft.czenServiceIdForMember = action.serviceIdForMember;
        draft.careKind = careKind as CareKind;
      } else {
        draft.czenServiceIdForMember = undefined;
        draft.careKind = initialState.careKind;
      }

      return draft;
    }
    case 'setCzenIntent': {
      const careDate = careDateIntentMap[action.intent];

      if (careDate) {
        draft.czenTimeIntent = action.intent;
        draft.careDate = careDate;
      } else {
        draft.czenTimeIntent = undefined;
        draft.careDate = initialState.careDate;
      }

      return draft;
    }
    case 'setCareDate':
      draft.careDate = action.careDate;
      return draft;
    case 'setCareKind':
      draft.careKind = action.careKind;
      return draft;
    case 'setIdealCaregiverQualities':
      draft.jobPost.idealCaregiverQualities = action.value;
      return draft;
    case 'setPersonalityCustomContentTwo':
      draft.jobPost.personalityCustomContentTwo = action.personalityCustomContentTwo;
      return draft;
    case 'setCargiverAttributes':
      draft.jobPost.cargiverAttributes = action.value;
      return draft;
    case 'setNeedHelpWith':
      draft.jobPost.needHelpWith = action.value;
      return draft;
    case 'setCareChildren':
      draft.careChildren = action.careChildren;
      draft.careExpecting = action.careExpecting;
      draft.distanceLearning = action.distanceLearning;
      return draft;
    case 'setCareChildrenDOB':
      draft.careChildrenDOB = action.careChildrenDOB;
      draft.careExpecting = action.careExpecting;
      draft.distanceLearning = action.distanceLearning;
      return draft;
    case 'cc_setEnrollmentSource':
      draft.enrollmentSource = action.value;
      return draft;
    case 'setDayCareFrequency':
      draft.dayCare.careFrequency.careType = action.careType;
      return draft;
    case 'setDayCareSpecificDays':
      draft.dayCare.careFrequency.specifcDays = action.specifcDays;
      return draft;
    case 'setDayCareStartMonth':
      draft.dayCare.startMonth = action.month;
      return draft;
    case 'setDayCareChildrenDateOfBirth':
      draft.dayCare.childrenDateOfBirth = action.childrenDateOfBirth;
      return draft;
    case 'cc_setDayCareDayTime':
      draft.dayCare.dayTime = action.dayTime;
      return draft;
    case 'setAdditionalInformation':
      draft.dayCare.additionalInformation = action.additionalInformation;
      return draft;
    case 'cc_setSeekerName':
      draft.firstName = action.firstName;
      draft.lastName = action.lastName;
      return draft;
    case 'cc_setSeekerPhoneNumber':
      draft.phoneNumber = action.phoneNumber;
      return draft;
    case 'cc_setSeekerEmail':
      draft.email = action.email;
      return draft;
    case 'cc_setSeekerContactMethod':
      draft.dayCare.contactMethod = action.contactMethod;
      return draft;
    /* istanbul ignore next */
    case 'cc_setDayCareRecommendations':
      draft.dayCare.recommendations = action.dayCareRecommendations;
      return draft;
    case 'cc_setDayCareRecommendationsSelectections':
      draft.dayCare.recommendations = draft.dayCare.recommendations.map((daycare) => {
        const match = action.dayCareIds.find((id) => daycare.id === id);
        return { ...daycare, selected: Boolean(match) };
      });

      return draft;
    case 'cc_setDayCareRecommendationsSubmissionInfo':
      draft.dayCare.submissionCompleted = action.completed;

      return draft;
    case 'cc_autoSubmitDayCares':
      draft.dayCare.submissionCompleted = true;
      draft.dayCare.autoSubmit.submitted = true;
      draft.dayCare.recommendations = draft.dayCare.recommendations.map((daycare) => {
        return { ...daycare, selected: true };
      });

      return draft;
    case 'cc_startDayCareAutoSubmitCountdown':
      draft.dayCare.autoSubmit.startTime = new Date().toISOString();
      return draft;
    case 'cc_increaseDayCareAutoSubmitAttempt':
      draft.dayCare.autoSubmit.attempts += 1;
      return draft;
    case 'cc_setDayCareRecommendationsShouldShowMap':
      draft.dayCare.shouldShowMap = action.shouldShowMap;
      return draft;
    case 'cc_setDayCareRecommendationsTrackingId':
      draft.dayCare.recommendationsTrackingId = action.trackingId;
      return draft;
    case 'cc_setIsSendLeadEnabled':
      draft.isSendLeadEnabled = action.isSendLeadEnabled;
      return draft;
    case 'setIsPixelFired':
      draft.isPixelFired = action.isPixelFired;
      return draft;
    case 'cc_setLCProviders':
      draft.lcProviders = action.providers;
      return draft;
    case 'cc_setLCFavoritedProviders':
      draft.lcFavoritedProviders = action.favoritedProviders;
      return draft;
    case 'cc_setLCReviewedProviders':
      draft.lcReviewedProviders = action.lcReviewedProvidersIds;
      return draft;
    case 'cc_setIbEligibleLocation':
      draft.instantBook.eligibleLocation = action.eligible;
      return draft;
    case 'cc_setIbChildrenDOB':
      draft.instantBook.children = action.children;
      draft.instantBook.distanceLearning = action.distanceLearning;
      return draft;
    case 'cc_setInstantBookStartTime':
      draft.instantBook.timeBlock.start = action.start;
      return draft;
    case 'cc_setInstantBookEndTime':
      draft.instantBook.timeBlock.end = action.end;
      return draft;
    case 'cc_setIbAddress':
      draft.instantBook.address = action.address;
      return draft;
    case 'cc_setIbDisplayBookingAddress':
      draft.instantBook.displayAddress.bookingAddress = action.displayAddress;
      return draft;
    case 'cc_setIbHomeAddress':
      draft.instantBook.homeAddress = action.address;
      return draft;
    case 'cc_setIbDisplayHomeAddress':
      draft.instantBook.displayAddress.homeAddress = action.displayAddress;
      return draft;
    case 'cc_setIbRateMinimum':
      draft.instantBook.payRange.minimum.amount = action.minimum;
      return draft;
    case 'cc_setIbRateMaxiumum':
      draft.instantBook.payRange.maximum.amount = action.maximum;
      return draft;
    case 'cc_setIbIsHomeAddress':
      draft.instantBook.isHomeAddress = action.isHomeAddress;
      return draft;
    default:
      return draft;
  }
});

export const reducer = (state: SeekerCCState, action: SeekerCCAction | JobAction) => {
  // @ts-ignore
  if (action.reducer?.type === 'job_reducer' && action.reducer?.prefix === 'cc') {
    return jobReducer(state, action as JobAction);
  }
  return seekerCCReducer(state, action as SeekerCCAction);
};
