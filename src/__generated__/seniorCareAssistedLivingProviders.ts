/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCommunityType, DistanceUnit, CenterType } from "./globalTypes";

// ====================================================
// GraphQL query operation: seniorCareAssistedLivingProviders
// ====================================================

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_distanceFromSearchCenter {
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

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_images {
  __typename: "ProfileImage";
  /**
   * Represent size of 750px
   */
  urlSmall: globalScalarURL | null;
  /**
   * Represent size of 1080px
   */
  urlMedium: globalScalarURL | null;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_address {
  __typename: "Address";
  /**
   * Address line one containing house number
   */
  addressLine1: string;
  /**
   * City of the address.
   */
  city: string;
  /**
   * State for the address.
   */
  state: string;
  /**
   * Latitude
   */
  latitude: number | null;
  /**
   * Longitude
   */
  longitude: number | null;
  /**
   * Zip of the address.
   */
  zip: string;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_license {
  __typename: "License";
  /**
   * Indicate if  Provider certified to provide required service
   */
  certified: boolean | null;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_careServices {
  __typename: "SeniorAssistedLivingCenterCareServices";
  /**
   * The center provides care for those with Amyotrophic lateral sclerosis (ALS)
   */
  alsCare: boolean;
  /**
   * The center has a call system for assistance twenty-four hours a day
   */
  callSystemTwentyFourHours: boolean;
  /**
   * The center provides assistance with tasks associated with everyday living
   */
  dailyLivingAssistance: boolean;
  /**
   * The center provides care for those with diabetes
   */
  diabetesCare: boolean;
  /**
   * The center coordinates with health care providers
   */
  healthCareProviderCoordination: boolean;
  /**
   * The center provides hospice care on-site
   */
  hospiceCare: boolean;
  /**
   * The center assists with insulin injections
   */
  insulinInjections: boolean;
  /**
   * The center provides meal preparation and service
   */
  mealPreparationAndService: boolean;
  /**
   * The center provides medication management
   */
  medicationManagement: boolean;
  /**
   * The center has specialized memory care program
   */
  memoryCare: boolean;
  /**
   * The center provides a mental wellness program
   */
  mentalWellnessCare: boolean;
  /**
   * The center cares for those with mild cognitive impairments
   */
  mildCognitiveImpairmentCare: boolean;
  /**
   * The center has nurses on staff twelve to sixteen hours per day
   */
  nursingTwelveToSixteenHours: boolean;
  /**
   * The center has nurses on staff twenty-four hours per day
   */
  nursingTwentyFourHours: boolean;
  /**
   * The center provides care for those with Parkinson's Disease
   */
  parkinsonsCare: boolean;
  /**
   * The center provides physical therapy
   */
  physicalTherapy: boolean;
  /**
   * The center provides screenings for preventative health
   */
  preventativeHealthScreenings: boolean;
  /**
   * The center provides rehabilitation programs
   */
  rehabilitationProgram: boolean;
  /**
   * The center provides transportation arrangement
   */
  transportationArrangement: boolean;
  /**
   * The center provides medical transportation arrangement
   */
  transportationArrangementMedical: boolean;
  /**
   * The center has a short-term program those seeking respite care
   */
  respiteCare: boolean;
  /**
   * The center provides stroke care
   */
  strokeCare: boolean;
  /**
   * The center provides twenty-four hour supervision
   */
  supervisionTwentyFourHours: boolean;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_communityTypes {
  __typename: "LivingCenterCommunityTypes";
  /**
   * The facility supports residents who need support with activities of daily
   * living
   */
  assistedLiving: boolean;
  /**
   * The facility supports continuing care, where residents can transition
   * between different levels of care need without needing to relocate
   */
  continuingCare: boolean;
  /**
   * The facility supports residents who can live virtually independently and
   * need little or no assistance with activity of daily living
   */
  independentLiving: boolean;
  /**
   * The facility supports residents with memory loss, including Alzheimer's and
   * dementia
   */
  memoryCare: boolean;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_facilityAmenities {
  __typename: "SeniorAssistedLivingCenterFacilityAmenities";
  /**
   * The center has a barber or beauty salon
   */
  barberOrBeautySalon: boolean;
  /**
   * The center has a cafe or bistro
   */
  cafeOrBistro: boolean;
  /**
   * The center has a computer center
   */
  computerCenter: boolean;
  /**
   * The center has a dining room
   */
  diningRoom: boolean;
  /**
   * The center has a fitness room
   */
  fitnessRoom: boolean;
  /**
   * The center has a game room
   */
  gameRoom: boolean;
  /**
   * The center has a garden
   */
  garden: boolean;
  /**
   * The center has a library
   */
  library: boolean;
  /**
   * The center has an on-site market
   */
  marketOnSite: boolean;
  /**
   * The center has an outdoor patio for residents
   */
  outdoorPatio: boolean;
  /**
   * The center has outdoor space for residents
   */
  outdoorSpace: boolean;
  /**
   * The center has private dining rooms
   */
  privateDiningRooms: boolean;
  /**
   * The center has a religious or meditation center
   */
  religiousOrMeditationCenter: boolean;
  /**
   * The center has a swimming pool
   */
  swimmingPool: boolean;
  /**
   * The center has a spa or jacuzzi
   */
  spaOrJacuzzi: boolean;
  /**
   * The center has a wellness center
   */
  wellnessCenter: boolean;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_foodAmenities {
  __typename: "SeniorAssistedLivingCenterFoodAmenities";
  /**
   * All meals are provided
   */
  allMealsProvided: boolean;
  /**
   * Residents can dine anytime
   */
  anytimeDining: boolean;
  /**
   * Diabetic food restrictions accommodated
   */
  diabetic: boolean;
  /**
   * Gluten free dietary restrictions accommodated
   */
  glutenFree: boolean;
  /**
   * Guests can eat at the center
   */
  guestMeals: boolean;
  /**
   * Halaal dietary restrictions accommodated
   */
  halaal: boolean;
  /**
   * Kosher dietary restrictions accommodated
   */
  kosher: boolean;
  /**
   * Low or no sodium dietary restrictions accommodated
   */
  lowOrNoSodium: boolean;
  /**
   * No sugar dietary restrictions accommodated
   */
  noSugar: boolean;
  /**
   * The center has a professional chef on-site
   */
  professionalChef: boolean;
  /**
   * Meals can be delivered to the care recipient's room
   */
  roomService: boolean;
  /**
   * Some meals are provided
   */
  someMealsProvided: boolean;
  /**
   * Center accommodates special dietary restrictions
   */
  specialDietaryRestrictions: boolean;
  /**
   * Vegan dietary restrictions accommodated
   */
  vegan: boolean;
  /**
   * Vegetarian dietary restrictions accommodated
   */
  vegetarian: boolean;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_onSiteServices {
  __typename: "SeniorAssistedLivingCenterOnSiteServices";
  /**
   * The center has a beautician on site
   */
  beautician: boolean;
  /**
   * The center has a concierge
   */
  concierge: boolean;
  /**
   * The center has family education and support
   */
  familyEducationAndSupport: boolean;
  /**
   * The center has housekeeping services
   */
  housekeeping: boolean;
  /**
   * The center has laundry or dry cleaning services
   */
  laundryOrDryCleaning: boolean;
  /**
   * The center has move-in coordination staff
   */
  moveInCoordination: boolean;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes {
  __typename: "AssistedLivingCenterAttributes";
  /**
   * Different kinds of care that the facility provides
   */
  careServices: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_careServices;
  /**
   * The types of care supported by this center
   */
  communityTypes: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_communityTypes;
  /**
   * The amenities provided at the facility
   */
  facilityAmenities: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_facilityAmenities;
  /**
   * The food amenities available at this center
   */
  foodAmenities: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_foodAmenities;
  /**
   * Services that are available onsite
   */
  onSiteServices: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_onSiteServices;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings_monthlyRent {
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

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings {
  __typename: "SeniorCareOffering";
  /**
   * Rent amount
   */
  monthlyRent: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings_monthlyRent | null;
  /**
   * The community type that the offering represents
   */
  communityType: SeniorCommunityType | null;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter {
  __typename: "SeniorAssistedLivingCenter";
  /**
   * Attributes for an assisted living center
   */
  attributes: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes;
  /**
   * Different offerings for types of communities and their cost
   */
  offerings: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings[];
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider {
  __typename: "Provider";
  /**
   * Provider name
   */
  name: string | null;
  /**
   * Description of provider to be showed to Seeker
   */
  description: string | null;
  /**
   * Provider id
   */
  id: string;
  /**
   * Different types of centers
   */
  centerType: CenterType | null;
  /**
   * Provider images like photo, logo, etc
   */
  images: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_images[] | null;
  /**
   * Provider address
   */
  address: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_address | null;
  /**
   * Provider license, can be optional for individual providers
   */
  license: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_license | null;
  /**
   * The senior care information for this provider
   */
  seniorAssistedLivingCenter: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter | null;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults {
  __typename: "ProviderResult";
  /**
   * The distance this result is from the center of the search
   */
  distanceFromSearchCenter: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_distanceFromSearchCenter | null;
  /**
   * A provider of care, potentially an employer of caregivers
   */
  provider: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider;
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess {
  __typename: "ProviderSearchSuccess";
  /**
   * ID generated by search engine to connect search request with future manipulations with Providers in result
   */
  trackingId: string;
  /**
   * List of provider search results with supplemental info per-result
   */
  providerSearchResults: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults[];
}

export interface seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchError {
  __typename: "ProviderSearchError";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export type seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders = seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchError;

export interface seniorCareAssistedLivingProviders {
  /**
   * Get list of Senior Care Center Providers in specific area by zipcode
   */
  seniorCareAssistedLivingProviders: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders;
}

export interface seniorCareAssistedLivingProvidersVariables {
  zipcode: string;
  source: string;
  maxNumberOfResults?: number | null;
  facilityType?: SeniorCommunityType | null;
}
