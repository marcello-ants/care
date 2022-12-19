/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import { Language } from '@/__generated__/globalTypes';
import produce from 'immer';
import {
  DEFAULT_AVG_MAX,
  DEFAULT_AVG_MIN,
  DEFAULT_LEGAL_MIN,
  initialRecurringState,
  JobTypes,
} from '@/types/common';
import { ProviderAction, ProviderState } from '../../types/provider';

export const initialState: ProviderState = {
  city: '',
  state: '',
  zipcode: '',
  distance: 15,
  firstName: '',
  lastName: '',
  experienceLevel: '',
  rate: {
    minimum: DEFAULT_AVG_MIN,
    maximum: DEFAULT_AVG_MAX,
    legalMinimum: DEFAULT_LEGAL_MIN,
  },
  typeSpecific: [],
  jobTypes: [],
  jobTypesSchedules: {},
  additionalDetails: [],
  education: null,
  languages: [Language.ENGLISH],
  headline: '',
  bio: '',
  recurring: { ...initialRecurringState.recurring },
  photo: {
    url: '',
    thumbnailUrl: '',
  },
  initialAccountCreationAttempted: false,
  numberOfJobsNear: 0,
  visitorStartedFlow: false,
  covidVaccinated: '',
};

export const reducer = produce((draft: ProviderState, action: ProviderAction) => {
  switch (action.type) {
    case 'setProviderLocation':
      draft.zipcode = action.zipcode;
      draft.city = action.city;
      draft.state = action.state;
      return draft;

    case 'setProviderDistance':
      draft.distance = action.distance;
      return draft;

    case 'setProviderAccountInfo':
      draft.firstName = action.firstName;
      draft.lastName = action.lastName;
      return draft;

    case 'setExperienceLevel':
      draft.experienceLevel = action.experienceLevel;
      return draft;

    case 'setProviderRate':
      draft.rate = {
        ...draft.rate,
        ...action.rate,
      };
      return draft;

    case 'setTypeSpecific':
      draft.typeSpecific = [...action.typeSpecific];
      return draft;

    case 'setJobTypes':
      draft.jobTypes = [...action.jobTypes];

      // remove schedule for non selected options
      Object.keys(draft.jobTypesSchedules).forEach((key: string) => {
        if (!draft.jobTypes.includes(key as JobTypes)) {
          delete draft.jobTypesSchedules[key as JobTypes];
        }
      });
      return draft;

    case 'setJobTypesSchedule':
      draft.jobTypesSchedules = {
        ...draft.jobTypesSchedules,
        [action.name]: {
          ...draft.jobTypesSchedules[action.name],
          [action.key]: action.value,
        },
      };
      return draft;

    case 'setProviderRateRetrieved':
      draft.rate.rateRetrieved = action.rateRetrieved;
      return draft;

    case 'setAdditionalDetails':
      draft.additionalDetails = action.additionalDetails;
      return draft;

    case 'setHeadline':
      draft.headline = action.headline;
      return draft;

    case 'setBio':
      draft.bio = action.bio;
      return draft;

    case 'setProviderRecurringData':
      draft.recurring = action.data;
      return draft;

    case 'setProviderMemberPhoto':
      draft.photo = action.photo;
      return draft;

    case 'setProviderInitialAccountCreationAttempted':
      draft.initialAccountCreationAttempted = action.initialAccountCreationAttempted;
      return draft;

    case 'setProviderLanguages':
      draft.languages = action.languages;
      return draft;

    case 'setNumberOfJobsNear':
      draft.numberOfJobsNear = action.numberOfJobsNear;
      return draft;

    case 'setVisitorStartedSCProviderFlow':
      draft.visitorStartedFlow = action.visitorStartedFlow;
      return draft;

    case 'setEducation':
      draft.education = action.education;
      return draft;

    case 'setCovidVaccinated':
      draft.covidVaccinated = action.covidVaccinated;
      return draft;

    default:
      return draft;
  }
});
