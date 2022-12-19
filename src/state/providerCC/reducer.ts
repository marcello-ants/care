/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */
import produce from 'immer';
import { Language } from '@/__generated__/globalTypes';
import { initialRecurringState } from '@/types/common';
import {
  ProviderCCAction,
  ProviderCCState,
  ProviderFreeGatedDefaultRates,
} from '../../types/providerCC';

export const initialState: ProviderCCState = {
  city: '',
  state: '',
  zipcode: '',
  distance: 15,
  lat: null,
  lng: null,
  initialAccountCreationAttempted: false,
  caregiverPreferencesPersisted: false,
  firstName: '',
  lastName: '',
  headline: '',
  hourlyRate: ProviderFreeGatedDefaultRates.MIN_RATE,
  bio: '',
  recurringJob: false,
  oneTime: false,
  defaultRatePerChild: [0],
  defaultRecurringHourlyRate: [0, 0],
  min: '',
  max: '',
  hours: '',
  numberOfJobsNear: 0,
  jobTypes: [],
  jobTypesSchedules: {},
  recurring: { ...initialRecurringState.recurring },
  languages: [Language.ENGLISH],
  education: '',
  selectedAboutMe: ['smokes'],
  selectedHelpWith: [],
  selectedSkills: [],
  experienceYears: 1,
  numberOfChildren: 1,
  ageGroups: [],
  careForSickChild: false,
  covidVaccinated: '',
  freeGated: false,
  callFreeGatedMutation: true,
  callProviderNameUpdateMutation: true,
  textAnalysisValidationId: '',
};

export const reducer = produce((draft: ProviderCCState, action: ProviderCCAction) => {
  switch (action.type) {
    case 'setProviderCCLocation':
      draft.zipcode = action.zipcode;
      draft.city = action.city;
      draft.state = action.state;
      draft.lat = action.lat;
      draft.lng = action.lng;
      return draft;

    case 'setProviderCCDistance':
      draft.distance = action.distance;
      return draft;

    case 'setProviderCCInitialAccountCreationAttempted':
      draft.initialAccountCreationAttempted = action.initialAccountCreationAttempted;
      return draft;

    case 'setProviderCCCaregiverPreferencesPersisted':
      draft.caregiverPreferencesPersisted = action.caregiverPreferencesPersisted;
      return draft;

    case 'setRecurringJob':
      draft.recurringJob = action.recurringJob;
      return draft;

    case 'setOneTime':
      draft.oneTime = action.oneTime;
      return draft;

    case 'setDefaultRatePerChild':
      draft.defaultRatePerChild = action.defaultRatePerChild;
      return draft;

    case 'setDefaultRecurringHourlyRate':
      draft.defaultRecurringHourlyRate = action.defaultRecurringHourlyRate;
      return draft;

    case 'setProviderCCRecurringData':
      draft.recurring = action.data;
      return draft;

    case 'setInputValuesForJobTypes':
      draft.min = action.min;
      draft.max = action.max;
      draft.hours = action.hours;
      return draft;

    case 'setCCFirstName':
      draft.firstName = action.firstName;
      return draft;

    case 'setCCLastName':
      draft.lastName = action.lastName;
      return draft;

    case 'setCCHeadline':
      draft.headline = action.headline;
      return draft;

    case 'setCCBio':
      draft.bio = action.bio;
      return draft;

    case 'setCCHourlyRate':
      draft.hourlyRate = action.hourlyRate;
      return draft;

    case 'setNumberOfJobsNear':
      draft.numberOfJobsNear = action.numberOfJobsNear;
      return draft;

    case 'setProviderCCLanguages':
      draft.languages = action.languages;
      return draft;

    case 'setProviderCCEducation':
      draft.education = action.education;
      return draft;

    case 'setProviderCCSelectedAboutMe':
      draft.selectedAboutMe = action.selectedAboutMe;
      return draft;

    case 'setProviderCCSelectedHelpWith':
      draft.selectedHelpWith = action.selectedHelpWith;
      return draft;

    case 'setProviderCCSelectedSkills':
      draft.selectedSkills = action.selectedSkills;
      return draft;

    case 'setProviderCCExperienceYears':
      draft.experienceYears = action.experienceYears;
      return draft;

    case 'setProviderCCAgegroups':
      draft.ageGroups = action.ageGroups;
      return draft;

    case 'setProviderCCComfortableCaringFor':
      draft.numberOfChildren = action.numberOfChildren;
      return draft;

    case 'setCareForSickChild':
      draft.careForSickChild = action.careForSickChild;
      return draft;

    case 'setCovidVaccinated':
      draft.covidVaccinated = action.covidVaccinated;
      return draft;

    case 'setFreeGated':
      draft.freeGated = action.freeGated;
      return draft;

    case 'setCallFreeGatedMutation':
      draft.callFreeGatedMutation = action.callFreeGatedMutation;
      return draft;

    case 'setCallProviderNameUpdateMutation':
      draft.callProviderNameUpdateMutation = action.callProviderNameUpdateMutation;
      return draft;

    case 'setTextAnalysisValidationId':
      draft.textAnalysisValidationId = action.textAnalysisValidationId;
      return draft;

    default:
      return draft;
  }
});
