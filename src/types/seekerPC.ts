import { CARE_DATES } from '@/constants';
import { JobPostData, OptionalReducerData } from './common';

export type Pets = {
  dogs: number;
  cats: number;
  other: number;
};

export enum ServiceTypes {
  SITTING = 'SITTING',
  BOARDING = 'BOARDING',
  WALKING = 'WALKING',
  GROOMING = 'GROOMING',
  TRAINING = 'TRAINING',
}

export const ServiceTypesLabels: { [key in ServiceTypes]: string } = {
  [ServiceTypes.SITTING]: 'Sitting (at your house)',
  [ServiceTypes.BOARDING]: "Boarding (at caregiver's house)",
  [ServiceTypes.WALKING]: 'Walking',
  [ServiceTypes.GROOMING]: 'Grooming',
  [ServiceTypes.TRAINING]: 'Training',
};

export const SERVICE_TYPES_OPTIONS = Object.freeze([
  {
    value: ServiceTypes.SITTING as string,
    label: ServiceTypesLabels[ServiceTypes.SITTING],
  },
  {
    value: ServiceTypes.BOARDING as string,
    label: ServiceTypesLabels[ServiceTypes.BOARDING],
  },
  {
    value: ServiceTypes.WALKING as string,
    label: ServiceTypesLabels[ServiceTypes.WALKING],
  },
  {
    value: ServiceTypes.GROOMING as string,
    label: ServiceTypesLabels[ServiceTypes.GROOMING],
  },
  {
    value: ServiceTypes.TRAINING as string,
    label: ServiceTypesLabels[ServiceTypes.TRAINING],
  },
]);

export type SeekerPCAction =
  | { type: 'setPetsNumber'; pets: Pets; reducer?: OptionalReducerData }
  | { type: 'setServiceType'; serviceType: ServiceTypes; reducer?: OptionalReducerData }
  | { type: 'setPetCareDate'; careDate: CARE_DATES; reducer?: OptionalReducerData }
  | {
      type: 'pc_setSeekerName';
      firstName: string;
      lastName: string;
      reducer?: OptionalReducerData;
    }
  | { type: 'pc_setEnrollmentSource'; value: string; reducer?: OptionalReducerData };

export type SeekerPCState = {
  careDate: CARE_DATES;
  pets: Pets;
  additionalServices: [];
  jobPost: JobPostData;
  firstName: string;
  lastName: string;
  serviceType: ServiceTypes | '';
  enrollmentSource: string;
};
