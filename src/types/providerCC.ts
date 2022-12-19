import { Language } from '@/__generated__/globalTypes';
import { Recurring, JobTypes, JobHours } from './common';

export interface ProviderCCState {
  city: string;
  state: string;
  zipcode: string;
  distance: number;
  photo?: { thumbnailUrl?: string };
  lat?: number | null;
  lng?: number | null;
  initialAccountCreationAttempted: boolean;
  caregiverPreferencesPersisted: boolean;
  firstName: string;
  lastName: string;
  headline: string;
  hourlyRate: number;
  bio: string;
  recurringJob: boolean;
  oneTime: boolean;
  defaultRatePerChild: Array<number>;
  defaultRecurringHourlyRate: Array<number>;
  min: string;
  max: string;
  hours: string;
  numberOfJobsNear: number;
  recurring: Recurring;
  jobTypes: Array<JobTypes>;
  jobTypesSchedules: Partial<{
    [key in JobTypes]: JobHours;
  }>;
  languages: Language[];
  selectedAboutMe: string[];
  selectedHelpWith: string[];
  selectedSkills: string[];
  education: string;
  experienceYears: number;
  numberOfChildren: number;
  ageGroups: string[];
  careForSickChild: boolean;
  covidVaccinated: string;
  freeGated: boolean;
  callFreeGatedMutation: boolean;
  callProviderNameUpdateMutation: boolean;
  textAnalysisValidationId: string;
}

export type ProviderCCAction =
  | {
      type: 'setProviderCCLocation';
      zipcode: string;
      city: string;
      state: string;
      lat?: number | null;
      lng?: number | null;
    }
  | { type: 'setProviderCCDistance'; distance: number }
  | { type: 'setProviderCCMemberPhoto'; photo: { url: string; thumbnailUrl: string } }
  | {
      type: 'setProviderCCInitialAccountCreationAttempted';
      initialAccountCreationAttempted: boolean;
    }
  | { type: 'setProviderCCCaregiverPreferencesPersisted'; caregiverPreferencesPersisted: boolean }
  | { type: 'setCCFirstName'; firstName: string }
  | { type: 'setCCLastName'; lastName: string }
  | { type: 'setCCHeadline'; headline: string }
  | { type: 'setCCHourlyRate'; hourlyRate: number }
  | { type: 'setCCBio'; bio: string }
  | { type: 'setRecurringJob'; recurringJob: boolean }
  | { type: 'setOneTime'; oneTime: boolean }
  | { type: 'setDefaultRatePerChild'; defaultRatePerChild: Array<number> }
  | { type: 'setDefaultRecurringHourlyRate'; defaultRecurringHourlyRate: Array<number> }
  | { type: 'setInputValuesForJobTypes'; min: string; max: string; hours: string }
  | { type: 'setProviderCCRecurringData'; data: Recurring }
  | { type: 'setJobTypes'; jobTypes: Array<JobTypes> }
  | { type: 'setJobTypesSchedule'; name: JobTypes; key: 'min' | 'max'; value: string }
  | { type: 'setNumberOfJobsNear'; numberOfJobsNear: number }
  | { type: 'setProviderCCSelectedAboutMe'; selectedAboutMe: string[] }
  | { type: 'setProviderCCSelectedHelpWith'; selectedHelpWith: string[] }
  | { type: 'setProviderCCSelectedSkills'; selectedSkills: string[] }
  | { type: 'setProviderCCEducation'; education: string }
  | { type: 'setProviderCCExperienceYears'; experienceYears: number }
  | { type: 'setProviderCCComfortableCaringFor'; numberOfChildren: number }
  | { type: 'setProviderCCAgegroups'; ageGroups: string[] }
  | { type: 'setCareForSickChild'; careForSickChild: boolean }
  | { type: 'setProviderCCLanguages'; languages: Language[] }
  | { type: 'setCovidVaccinated'; covidVaccinated: string }
  | { type: 'setFreeGated'; freeGated: boolean }
  | { type: 'setCallFreeGatedMutation'; callFreeGatedMutation: boolean }
  | { type: 'setCallProviderNameUpdateMutation'; callProviderNameUpdateMutation: boolean }
  | { type: 'setTextAnalysisValidationId'; textAnalysisValidationId: string };

export enum ProviderFreeGatedDefaultRates {
  MIN_RATE = 14,
  MAX_RATE = 40,
  MAX_CHILDREN = 4,
}
