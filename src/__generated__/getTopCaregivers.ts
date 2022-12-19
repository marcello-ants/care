/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType, JobRateInput, SeniorCareProviderQuality, SeniorCareServiceProvidedType, DistanceInput, DistanceUnit } from "./globalTypes";

// ====================================================
// GraphQL query operation: getTopCaregivers
// ====================================================

export interface getTopCaregivers_topCaregivers_caregiver_member_address {
  __typename: "Address";
  /**
   * City of the address.
   */
  city: string;
  /**
   * State for the address.
   */
  state: string;
}

export interface getTopCaregivers_topCaregivers_caregiver_member {
  __typename: "Member";
  /**
   * Address info of the member, this field will be only non-null when a provider is viewing their own profile, since seekers
   * are not able to see address of caregivers
   */
  address: getTopCaregivers_topCaregivers_caregiver_member_address | null;
  /**
   * Display name of member , should be shown before booking confirms
   */
  displayName: string;
  /**
   * First name of the member
   */
  firstName: string;
  /**
   * Uuid of the member
   */
  id: string;
  /**
   * Image Url can be null if member has not uploaded photo
   */
  imageURL: globalScalarURL | null;
  /**
   * Member id
   * This is required by CZEN in most APIs (rather than the UUID)
   */
  legacyId: string | null;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_commonCaregiverProfile {
  __typename: "CommonCaregiverProfile";
  /**
   * Service profile id
   */
  id: string;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_bio {
  __typename: "Bio";
  /**
   * Description of the caregiver's biography (experience, interests, and qualifications)
   */
  experienceSummary: string | null;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_qualities {
  __typename: "ChildCareCaregiverQualities";
  /**
   * If caregiver is qualified  Certified nursing assistant
   */
  certifiedNursingAssistant: boolean | null;
  /**
   * If caregiver is certified Registered Nurse
   */
  certifiedRegisterNurse: boolean | null;
  /**
   * If caregiver is qualified teacher
   */
  certifiedTeacher: boolean | null;
  /**
   * If caregiver is Child development associate
   */
  childDevelopmentAssociate: boolean | null;
  /**
   * If caregiver is comfortable with pets
   */
  comfortableWithPets: boolean | null;
  /**
   * If caregiver is CPR trained
   */
  cprTrained: boolean | null;
  /**
   * If caregiver is CRN Certified
   */
  crn: boolean | null;
  /**
   * If caregiver does not smoke
   */
  doesNotSmoke: boolean | null;
  /**
   * If caregiver is Doula certified
   */
  doula: boolean | null;
  /**
   * If caregiver is Early Child Development Coursework
   */
  earlyChildDevelopmentCoursework: boolean | null;
  /**
   * If caregiver is Early Childhood Education (ECE)
   */
  earlyChildhoodEducation: boolean | null;
  /**
   * If caregiver is First Aid Training
   */
  firstAidTraining: boolean | null;
  /**
   * If caregiver is NAFCC Certified
   */
  nafccCertified: boolean | null;
  /**
   * If caregiver owns a form of transportation
   */
  ownTransportation: boolean | null;
  /**
   * If caregiver is Special Needs Care
   */
  specialNeedsCare: boolean | null;
  /**
   * If caregiver is TrustLine Certified (CA only)
   */
  trustlineCertifiedCalifornia: boolean | null;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_supportedServices {
  __typename: "ChildCareCaregiverServices";
  /**
   * If caregiver help with car pooling
   */
  carpooling: boolean | null;
  /**
   * If caregiver provides craftAssistance
   */
  craftAssistance: boolean | null;
  /**
   * If caregiver help with any other errands
   */
  errands: boolean | null;
  /**
   * If caregiver will go grocery shopping
   */
  groceryShopping: boolean | null;
  /**
   * If caregiver will also do laundry
   */
  laundryAssistance: boolean | null;
  /**
   * If caregiver help with some house keeping
   */
  lightHousekeeping: boolean | null;
  /**
   * Meal Preparation service if supported by caregiver along with child care services
   */
  mealPreparation: boolean | null;
  /**
   * If caregiver will also provides swimmingSupervision
   */
  swimmingSupervision: boolean | null;
  /**
   * If caregiver help with travelling needs
   */
  travel: boolean | null;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_payRange_hourlyRateFrom {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_payRange_hourlyRateTo {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_payRange {
  __typename: "PayRange";
  /**
   * Min hourly rate amount
   */
  hourlyRateFrom: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_payRange_hourlyRateFrom;
  /**
   * Max hourly rate amount
   */
  hourlyRateTo: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_payRange_hourlyRateTo;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile {
  __typename: "ChildCareCaregiverProfile";
  /**
   * Description of the caregiver's biography (experience, interests, and qualifications)
   */
  bio: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_bio;
  /**
   * Caregiver child care qualities
   */
  qualities: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_qualities | null;
  /**
   * Supported Services
   */
  supportedServices: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_supportedServices | null;
  /**
   * The minimum and maximum hourly rate
   */
  payRange: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile_payRange | null;
}

export interface getTopCaregivers_topCaregivers_caregiver_profiles {
  __typename: "CaregiverProfiles";
  /**
   * Standardized common profile data
   */
  commonCaregiverProfile: getTopCaregivers_topCaregivers_caregiver_profiles_commonCaregiverProfile | null;
  /**
   * Standardized child care profile
   */
  childCareCaregiverProfile: getTopCaregivers_topCaregivers_caregiver_profiles_childCareCaregiverProfile | null;
}

export interface getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile_payRange_hourlyRateFrom {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile_payRange_hourlyRateTo {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile_payRange {
  __typename: "PayRange";
  /**
   * Min hourly rate amount
   */
  hourlyRateFrom: getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile_payRange_hourlyRateFrom;
  /**
   * Max hourly rate amount
   */
  hourlyRateTo: getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile_payRange_hourlyRateTo;
}

export interface getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile {
  __typename: "SeniorCareProviderProfile";
  /**
   * Description of the caregiver's biography (experience, interests, and qualifications)
   */
  bio: string | null;
  /**
   * Types of care services that is supplied
   */
  services: SeniorCareServiceProvidedType[] | null;
  /**
   * The minimum and maximum hourly rate
   */
  payRange: getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile_payRange | null;
  /**
   * Attribute qualities
   */
  qualities: SeniorCareProviderQuality[] | null;
}

export interface getTopCaregivers_topCaregivers_caregiver {
  __typename: "Caregiver";
  /**
   * URL to caregiver's seo profile
   */
  profileURL: globalScalarURL | null;
  /**
   * Average review rating for the caregiver. will be null
   * if there is no review rating for the provider
   */
  avgReviewRating: number | null;
  /**
   * Number of Reviews
   */
  numberOfReviews: number;
  /**
   * We expect that the top caregiver have some years of experience
   */
  yearsOfExperience: number;
  /**
   * Has active care check information
   */
  hasCareCheck: boolean;
  /**
   * ResponseTime for the caregiver in hours. Will be null if no response is observed
   */
  responseTime: number | null;
  /**
   * User/member information for this caregiver
   */
  member: getTopCaregivers_topCaregivers_caregiver_member;
  /**
   * Various vertical profiles
   */
  profiles: getTopCaregivers_topCaregivers_caregiver_profiles | null;
  /**
   * Senior care provider profile information
   */
  seniorCareProviderProfile: getTopCaregivers_topCaregivers_caregiver_seniorCareProviderProfile | null;
  /**
   * Caregiver account creation date
   */
  signUpDate: globalScalarDateTime | null;
}

export interface getTopCaregivers_topCaregivers_distanceFromRequestZip {
  __typename: "PreciseDistance";
  /**
   * Units used to measure a distance
   */
  unit: DistanceUnit;
  /**
   * Number of units
   */
  value: number;
}

export interface getTopCaregivers_topCaregivers {
  __typename: "TopCaregiver";
  /**
   * Caregiver information
   */
  caregiver: getTopCaregivers_topCaregivers_caregiver;
  /**
   * Distance from the request zipcode to the caregiver zipcode
   */
  distanceFromRequestZip: getTopCaregivers_topCaregivers_distanceFromRequestZip | null;
}

export interface getTopCaregivers {
  /**
   * Get the top caregivers in the area near the zipcode
   */
  topCaregivers: getTopCaregivers_topCaregivers[];
}

export interface getTopCaregiversVariables {
  zipcode: string;
  serviceID: ServiceType;
  numResults: number;
  hourlyRate?: JobRateInput | null;
  hasCareCheck?: boolean | null;
  qualities?: SeniorCareProviderQuality[] | null;
  services?: SeniorCareServiceProvidedType[] | null;
  maxDistanceFromSeeker?: DistanceInput | null;
  hasApprovedActivePhoto?: boolean | null;
  enableFuzzySearch?: boolean | null;
  daysSinceLastActive?: number | null;
  isActiveAccount?: boolean | null;
  minimumAvgReviewRating?: number | null;
  fullTime?: boolean | null;
}
