import {
  EducationLevel,
  Language,
  SeniorCareProviderQuality,
  SeniorCareServiceProvidedType,
} from '@/__generated__/globalTypes';
import { Rate, Recurring, MemberPhoto, JobTypes, JobHours } from './common';
import { HelpType } from './seeker';

export { HELP_TYPE_OPTIONS, HelpType } from './seeker';

export interface ProviderState {
  city: string;
  state: string;
  zipcode: string;
  distance: number;
  firstName: string;
  lastName: string;
  experienceLevel: string;
  rate: Rate;
  typeSpecific: HelpType[];
  jobTypes: Array<JobTypes>;
  jobTypesSchedules: Partial<{
    [key in JobTypes]: JobHours;
  }>;
  additionalDetails: SeniorCareProviderQuality[];
  education: EducationLevel | null;
  languages: Language[];
  headline: string;
  bio: string;
  recurring: Recurring;
  photo: MemberPhoto;
  initialAccountCreationAttempted: boolean;
  numberOfJobsNear: number;
  visitorStartedFlow: boolean;
  covidVaccinated: string;
}

export type ProviderAction =
  | { type: 'setProviderLocation'; zipcode: string; city: string; state: string }
  | { type: 'setProviderDistance'; distance: number }
  | { type: 'setProviderAccountInfo'; firstName: string; lastName: string }
  | { type: 'setExperienceLevel'; experienceLevel: string }
  | { type: 'setProviderRate'; rate: Partial<Rate> }
  | { type: 'setTypeSpecific'; typeSpecific: HelpType[] }
  | { type: 'setJobTypes'; jobTypes: Array<JobTypes> }
  | { type: 'setJobTypesSchedule'; name: JobTypes; key: 'min' | 'max'; value: string }
  | { type: 'setProviderRateRetrieved'; rateRetrieved: boolean }
  | { type: 'setAdditionalDetails'; additionalDetails: SeniorCareProviderQuality[] }
  | { type: 'setHeadline'; headline: string }
  | { type: 'setBio'; bio: string }
  | { type: 'setProviderRecurringData'; data: Recurring }
  | { type: 'setProviderMemberPhoto'; photo: MemberPhoto }
  | {
      type: 'setProviderInitialAccountCreationAttempted';
      initialAccountCreationAttempted: boolean;
    }
  | { type: 'setProviderLanguages'; languages: Language[] }
  | { type: 'setNumberOfJobsNear'; numberOfJobsNear: number }
  | { type: 'setVisitorStartedSCProviderFlow'; visitorStartedFlow: boolean }
  | { type: 'setEducation'; education: EducationLevel | null }
  | { type: 'setCovidVaccinated'; covidVaccinated: string };

export const LevelOfExperienceLabels: { [key: string]: string } = {
  YEARS_1: '1-2 years',
  YEARS_3: '3-4 years',
  YEARS_5: '5-9 years',
  YEARS_10: '10+ years',
  YEARS_0: 'I am seeking my first senior care job',
};

export function helpTypesToServices(helpTypes: HelpType[]) {
  const services: SeniorCareServiceProvidedType[] = [];

  if (helpTypes.includes(HelpType.TRANSPORTATION)) {
    services.push(SeniorCareServiceProvidedType.TRANSPORTATION);
  }
  if (helpTypes.includes(HelpType.HOUSEHOLD)) {
    services.push(SeniorCareServiceProvidedType.MEAL_PREPARATION);
    services.push(SeniorCareServiceProvidedType.ERRANDS);
    services.push(SeniorCareServiceProvidedType.LIGHT_HOUSECLEANING);
  }
  if (helpTypes.includes(HelpType.COMPANIONSHIP)) {
    services.push(SeniorCareServiceProvidedType.COMPANIONSHIP);
  }
  if (helpTypes.includes(HelpType.PERSONAL)) {
    services.push(SeniorCareServiceProvidedType.FEEDING);
    services.push(SeniorCareServiceProvidedType.BATHING);
    services.push(SeniorCareServiceProvidedType.PERSONAL_CARE);
  }
  if (helpTypes.includes(HelpType.MOBILITY)) {
    services.push(SeniorCareServiceProvidedType.MOBILITY_ASSISTANCE);
  }

  if (helpTypes.includes(HelpType.SPECIALIZED)) {
    services.push(SeniorCareServiceProvidedType.SPECIALIZED_CARE);
  }

  return services;
}
