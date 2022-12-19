import { GeneralProviderProfile } from '@/types/seeker';

export interface ProviderProfile extends GeneralProviderProfile {
  numberOfReviews: number;
  qualities?: ProviderQualities;
  services?: ProviderServices;
  firstName: string;
}

export interface ProviderQualities {
  certifiedNursingAssistant?: boolean;
  certifiedRegisterNurse?: boolean;
  certifiedTeacher?: boolean;
  childDevelopmentAssociate?: boolean;
  comfortableWithPets?: boolean;
  cprTrained?: boolean;
  crn?: boolean;
  doesNotSmoke?: boolean;
  doula?: boolean;
  earlyChildDevelopmentCoursework?: boolean;
  earlyChildhoodEducation?: boolean;
  firstAidTraining?: boolean;
  nafccCertified?: boolean;
  ownTransportation?: boolean;
  specialNeedsCare?: boolean;
  trustlineCertifiedCalifornia?: boolean;
}

export interface ProviderServices {
  carpooling?: boolean;
  craftAssistance?: boolean;
  errands?: boolean;
  groceryShopping?: boolean;
  laundryAssistance?: boolean;
  lightHousekeeping?: boolean;
  mealPreparation?: boolean;
  swimmingSupervision?: boolean;
  travel?: boolean;
}
