/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Type of action that is taking place
 */
export enum ActionType {
  ADD = "ADD",
  PASS = "PASS",
  SHOWN = "SHOWN",
}

/**
 * Type of user that is taking the action
 */
export enum ActorType {
  PROVIDER = "PROVIDER",
  SEEKER = "SEEKER",
}

/**
 * Approximate care date
 */
export enum CareDate {
  JUST_BROWSING = "JUST_BROWSING",
  RIGHT_NOW = "RIGHT_NOW",
  WITHIN_A_MONTH = "WITHIN_A_MONTH",
  WITHIN_A_WEEK = "WITHIN_A_WEEK",
}

/**
 * Member overall status
 */
export enum CaregiverOverallStatus {
  ACTIVE = "ACTIVE",
  ACTIVE_FEATURED = "ACTIVE_FEATURED",
  ACTIVE_GROUPIE = "ACTIVE_GROUPIE",
  ACTIVE_LITE = "ACTIVE_LITE",
  CLOSED = "CLOSED",
  INACTIVE = "INACTIVE",
  INCOMPLETE = "INCOMPLETE",
  NEW = "NEW",
  PENDING_CLOSE = "PENDING_CLOSE",
  STALE = "STALE",
  TRIAL_PREMIUM = "TRIAL_PREMIUM",
}

/**
 * Possible center types
 */
export enum CenterType {
  FCC = "FCC",
  INVALID = "INVALID",
  NATIONAL_ACCOUNT = "NATIONAL_ACCOUNT",
  SMALL_MEDIUM_BUSINESS = "SMALL_MEDIUM_BUSINESS",
}

/**
 * Caregiver personality characteristics
 */
export enum ChidCareProviderCharacteristic {
  ARTSY = "ARTSY",
  BRAINY = "BRAINY",
  ENERGETIC = "ENERGETIC",
  FUNNY = "FUNNY",
  OUTGOING = "OUTGOING",
  PATIENT = "PATIENT",
  PLAYFUL = "PLAYFUL",
  RELAXED = "RELAXED",
  SPORTY = "SPORTY",
}

/**
 * # Age groups child care caregiver can serve 
 */
export enum ChildCareAgeGroups {
  EARLY_SCHOOL = "EARLY_SCHOOL",
  ELEMENTARY_SCHOOL = "ELEMENTARY_SCHOOL",
  NEWBORN = "NEWBORN",
  TEEN = "TEEN",
  TODDLER = "TODDLER",
}

/**
 * Age range of the child care recipient.
 */
export enum ChildCareAgeRangeType {
  EARLY_SCHOOL = "EARLY_SCHOOL",
  ELEMENTARY_SCHOOL = "ELEMENTARY_SCHOOL",
  NEWBORN = "NEWBORN",
  TEEN = "TEEN",
  TODDLER = "TODDLER",
}

/**
 * The preferred contact method specified by the seeker
 */
export enum ChildCareLeadContactMethod {
  MAIL = "MAIL",
  PHONE = "PHONE",
}

/**
 * The way how Child Care Lead(s) were submitted
 */
export enum ChildCareLeadsSubmissionMethod {
  AUTO = "AUTO",
  MANUAL = "MANUAL",
}

/**
 * Child Caregiver's qualities
 */
export enum ChildCareProviderQuality {
  COLLEGE_DEGREE = "COLLEGE_DEGREE",
  COMFORTABLE_WITH_PETS = "COMFORTABLE_WITH_PETS",
  CPR_TRAINED = "CPR_TRAINED",
  DOES_NOT_SMOKE = "DOES_NOT_SMOKE",
  OWN_TRANSPORTATION = "OWN_TRANSPORTATION",
}

/**
 * Care services that may be required as part of job
 */
export enum ChildCareService {
  DROP_PICKUP_CHILDREN = "DROP_PICKUP_CHILDREN",
  GROCERY_SHOPPING = "GROCERY_SHOPPING",
  HOMEWORK_HELP = "HOMEWORK_HELP",
  LAUNDRY = "LAUNDRY",
  LIGHT_HOUSEKEEPING = "LIGHT_HOUSEKEEPING",
  MEAL_PREPARATION = "MEAL_PREPARATION",
  REMOTE_LEARNING_ASSISTANCE = "REMOTE_LEARNING_ASSISTANCE",
  SPECIAL_NEEDS = "SPECIAL_NEEDS",
  STRUCTURED_ACTIVITIES = "STRUCTURED_ACTIVITIES",
}

/**
 * Child Care Day Care - Time of Day
 */
export enum DayCareTimeOfDay {
  AFTERNOON = "AFTERNOON",
  ALLDAY = "ALLDAY",
  MORNING = "MORNING",
}

/**
 * Measures of distance
 */
export enum DistanceUnit {
  KILOMETERS = "KILOMETERS",
  MILES = "MILES",
}

/**
 * Education level of provider
 */
export enum EducationLevel {
  COLLEGE = "COLLEGE",
  COLLEGE_DEGREE = "COLLEGE_DEGREE",
  GED = "GED",
  GRADUATE = "GRADUATE",
  GRADUATE_DEGREE = "GRADUATE_DEGREE",
  HIGH_SCHOOL = "HIGH_SCHOOL",
  HIGH_SCHOOL_DEGREE = "HIGH_SCHOOL_DEGREE",
  HIGH_SCHOOL_DIPLOMA = "HIGH_SCHOOL_DIPLOMA",
  SOME_COLLEGE = "SOME_COLLEGE",
  SOME_GRADUATE_SCHOOL = "SOME_GRADUATE_SCHOOL",
  SOME_HIGH_SCHOOL = "SOME_HIGH_SCHOOL",
}

/**
 * Approximate care date
 */
export enum EnrollmentSource {
  INSTANT_BOOK = "INSTANT_BOOK",
}

/**
 * The gender of an individual
 */
export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

/**
 * Answer to "How did you hear about Care.com?"
 */
export enum HOW_DID_YOU_HEAR_ABOUT_US {
  BANNER_AD = "BANNER_AD",
  BILLBOARD = "BILLBOARD",
  FACEBOOK = "FACEBOOK",
  FRIENDS_OR_FAMILY = "FRIENDS_OR_FAMILY",
  INFLUENCER = "INFLUENCER",
  ONLINE_VIDEO = "ONLINE_VIDEO",
  OTHER = "OTHER",
  OTHER_SOCIAL_MEDIA = "OTHER_SOCIAL_MEDIA",
  PARENTING_GROUP = "PARENTING_GROUP",
  PRESS_COVERAGE = "PRESS_COVERAGE",
  RADIO_AUDIO_AD = "RADIO_AUDIO_AD",
  SEARCH_ENGINE = "SEARCH_ENGINE",
  TV_AD = "TV_AD",
  YOUTUBE = "YOUTUBE",
}

/**
 * Timeframes expected
 */
export enum HomePayExpectedHireTimeFrame {
  AS_SOON_AS_POSSIBLE = "AS_SOON_AS_POSSIBLE",
  TWO_PLUS_MONTHS = "TWO_PLUS_MONTHS",
  WITHIN_A_MONTH = "WITHIN_A_MONTH",
}

/**
 * Types of Caregiver
 */
export enum HomepayCaregiverType {
  CHILD_CARE = "CHILD_CARE",
  HOUSEKEEPING = "HOUSEKEEPING",
  OTHER = "OTHER",
  SENIOR_CARE = "SENIOR_CARE",
}

/**
 * Housekeeping square footage.
 */
export enum HouseKeepingSquareFootage {
  FIFTEEN_HUNDRED_ONE_TO_TWO_THOUSAND = "FIFTEEN_HUNDRED_ONE_TO_TWO_THOUSAND",
  GREATER_THAN_THIRTY_FIVE_HUNDRED = "GREATER_THAN_THIRTY_FIVE_HUNDRED",
  LESS_THAN_ONE_THOUSAND = "LESS_THAN_ONE_THOUSAND",
  ONE_THOUSAND_ONE_TO_FIFTEEN_HUNDRED = "ONE_THOUSAND_ONE_TO_FIFTEEN_HUNDRED",
  THREE_THOUSAND_ONE_TO_THIRTY_FIVE_HUNDRED = "THREE_THOUSAND_ONE_TO_THIRTY_FIVE_HUNDRED",
  TWENTY_FIVE_HUNDRED_ONE_TO_THREE_THOUSAND = "TWENTY_FIVE_HUNDRED_ONE_TO_THREE_THOUSAND",
  TWO_THOUSAND_ONE_TO_TWENTY_FIVE_HUNDRED = "TWO_THOUSAND_ONE_TO_TWENTY_FIVE_HUNDRED",
}

/**
 * Housekeeping Frequency
 */
export enum HousekeepingFrequency {
  EVERY_TWO_MONTHS = "EVERY_TWO_MONTHS",
  EVERY_TWO_WEEKS = "EVERY_TWO_WEEKS",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
}

/**
 * Housekeeping services
 */
export enum HousekeepingService {
  ATTIC_CLEANING = "ATTIC_CLEANING",
  BASEMENT_CLEANING = "BASEMENT_CLEANING",
  BATHROOM_CLEANING = "BATHROOM_CLEANING",
  CABINET_CLEANING = "CABINET_CLEANING",
  CARPET_CLEANING = "CARPET_CLEANING",
  CHANGING_BED_LINENS = "CHANGING_BED_LINENS",
  DISHES = "DISHES",
  DUSTING = "DUSTING",
  FURNITURE_TREATMENT = "FURNITURE_TREATMENT",
  GENERAL_ROOM_CLEANING = "GENERAL_ROOM_CLEANING",
  HOUSE_SITTING = "HOUSE_SITTING",
  KITCHEN_CLEANING = "KITCHEN_CLEANING",
  LAUNDRY = "LAUNDRY",
  MOVE_OUT_CLEANING = "MOVE_OUT_CLEANING",
  ORGANIZATION = "ORGANIZATION",
  OVEN_CLEANING = "OVEN_CLEANING",
  PACKING_AND_UNPACKING = "PACKING_AND_UNPACKING",
  PET_WASTE_CLEANUP = "PET_WASTE_CLEANUP",
  PLANT_CARE = "PLANT_CARE",
  REFRIGERATOR_CLEANING = "REFRIGERATOR_CLEANING",
  SURFACE_POLISHING = "SURFACE_POLISHING",
  VACUUMING_MOPPING = "VACUUMING_MOPPING",
  WALL_WASHING = "WALL_WASHING",
  WINDOW_WASHING = "WINDOW_WASHING",
}

/**
 * How soon is care needed for this care recipient?
 */
export enum HowSoonIsCareNeeded {
  AS_SOON_AS_POSSIBLE = "AS_SOON_AS_POSSIBLE",
  PLANNING_FOR_FUTURE = "PLANNING_FOR_FUTURE",
  WITHIN_SIX_MONTHS = "WITHIN_SIX_MONTHS",
}

/**
 * What type of Id client is passing
 */
export enum IdType {
  MEMBER_ID = "MEMBER_ID",
  UUID = "UUID",
}

/**
 * Measures of job hours
 */
export enum JobHoursUnit {
  PER_JOB = "PER_JOB",
  PER_WEEK = "PER_WEEK",
}

/**
 * Source of provider job interests update
 */
export enum JobInterestUpdateSource {
  ENROLLMENT = "ENROLLMENT",
  NTH_DAY = "NTH_DAY",
}

/**
 * The step in our funnel from where the job is being created.  e.g., enrollment, member homepage, etc...
 */
export enum JobSource {
  ENROLLMENT = "ENROLLMENT",
  OTHER = "OTHER",
}

/**
 * The status of the job
 */
export enum JobStatus {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  SUPPRESSED = "SUPPRESSED",
}

/**
 * The subset of languages currently supported by the native app
 */
export enum Language {
  ARABIC = "ARABIC",
  CHINESE = "CHINESE",
  DUTCH = "DUTCH",
  ENGLISH = "ENGLISH",
  FINNISH = "FINNISH",
  FRENCH = "FRENCH",
  GERMAN = "GERMAN",
  HEBREW = "HEBREW",
  PORTUGUESE = "PORTUGUESE",
  RUSSIAN = "RUSSIAN",
  SIGN_LANGUAGE_ASL = "SIGN_LANGUAGE_ASL",
  SPANISH = "SPANISH",
  TAGALOG = "TAGALOG",
}

/**
 * Additional Services for Pet Care
 */
export enum PetCareAdditionalService {
  BOARDING = "BOARDING",
  FEEDING = "FEEDING",
  GROOMING = "GROOMING",
  MEDICINE_ADMINISTRATION = "MEDICINE_ADMINISTRATION",
  OVERNIGHT_CARE = "OVERNIGHT_CARE",
  PLAY_AND_EXERCISE = "PLAY_AND_EXERCISE",
  TRAINING = "TRAINING",
  WALKING = "WALKING",
  WASTE_CLEANUP = "WASTE_CLEANUP",
}

/**
 * Animal Types for Pet Care
 */
export enum PetCareAnimalType {
  AMPHIBIAN = "AMPHIBIAN",
  BIRD = "BIRD",
  CAT = "CAT",
  DOG = "DOG",
  EXOTIC = "EXOTIC",
  FARM_ANIMAL = "FARM_ANIMAL",
  FISH = "FISH",
  HORSE = "HORSE",
  MAMMAL = "MAMMAL",
  OTHER = "OTHER",
}

/**
 * Pet Care Provider Quality
 */
export enum PetCareProviderQuality {
  COLLEGE_DEGREE = "COLLEGE_DEGREE",
  DOES_NOT_SMOKE = "DOES_NOT_SMOKE",
  OWN_TRANSPORTATION = "OWN_TRANSPORTATION",
}

/**
 * Pet Care Service Type
 */
export enum PetCareServiceType {
  BOARDING = "BOARDING",
  GROOMING = "GROOMING",
  SITTING = "SITTING",
  TRAINING = "TRAINING",
  WALKING = "WALKING",
}

/**
 * Seeker care type
 */
export enum SENIOR_CARE_TYPE {
  IN_FACILITY = "IN_FACILITY",
  IN_HOME = "IN_HOME",
  NOT_SURE = "NOT_SURE",
}

/**
 * Age range of the senior care recipient.
 */
export enum SeniorCareAgeRangeType {
  EIGHTIES = "EIGHTIES",
  FIFTIES = "FIFTIES",
  FORTIES = "FORTIES",
  HUNDREDS = "HUNDREDS",
  NINETIES = "NINETIES",
  SEVENTIES = "SEVENTIES",
  SIXTIES = "SIXTIES",
  THIRTIES = "THIRTIES",
}

/**
 * Specific amenities that are offered by the senior care facility
 */
export enum SeniorCareFacilityAmenity {
  ART_CLASSES = "ART_CLASSES",
  BEAUTY_SALON = "BEAUTY_SALON",
  COMMUNITY_DINING = "COMMUNITY_DINING",
  EXERCISE_GROUPS = "EXERCISE_GROUPS",
  LIBRARY = "LIBRARY",
  PET_FRIENDLY = "PET_FRIENDLY",
}

/**
 * Qualities for an ideal SeniorCare Caregiver
 */
export enum SeniorCareIdealCaregiverQuality {
  COLLEGE_DEGREE = "COLLEGE_DEGREE",
  COMFORTABLE_WITH_PETS = "COMFORTABLE_WITH_PETS",
  COVID_VACCINATED = "COVID_VACCINATED",
  CPR_TRAINED = "CPR_TRAINED",
  DOES_NOT_SMOKE = "DOES_NOT_SMOKE",
  EXPERIENCE_ALZHEIMER_OR_DEMENTIA = "EXPERIENCE_ALZHEIMER_OR_DEMENTIA",
  EXPERIENCE_OPERATING_HOYER_LIFT = "EXPERIENCE_OPERATING_HOYER_LIFT",
  OWN_TRANSPORTATION = "OWN_TRANSPORTATION",
}

/**
 * The available sources of payment for care.
 */
export enum SeniorCarePaymentSource {
  GOVERNMENT_HEALTH_PROGRAM = "GOVERNMENT_HEALTH_PROGRAM",
  HOME_EQUITY = "HOME_EQUITY",
  LONG_TERM_CARE_INSURANCE = "LONG_TERM_CARE_INSURANCE",
  OTHER = "OTHER",
  PRIVATE_PAY = "PRIVATE_PAY",
  VETERANS_BENEFITS = "VETERANS_BENEFITS",
}

/**
 * Types of provider qualities and qualifications.
 */
export enum SeniorCareProviderQuality {
  ALZHEIMERS_OR_DEMENTIA_EXPERIENCE = "ALZHEIMERS_OR_DEMENTIA_EXPERIENCE",
  CERTIFIED_NURSING_ASSISTANT = "CERTIFIED_NURSING_ASSISTANT",
  COMFORTABLE_WITH_PETS = "COMFORTABLE_WITH_PETS",
  CPR_TRAINED = "CPR_TRAINED",
  DOES_NOT_SMOKE = "DOES_NOT_SMOKE",
  HOME_HEALTH_AIDE_EXPERIENCE = "HOME_HEALTH_AIDE_EXPERIENCE",
  HOSPICE_EXPERIENCE = "HOSPICE_EXPERIENCE",
  OWN_TRANSPORTATION = "OWN_TRANSPORTATION",
  REGISTERED_NURSE = "REGISTERED_NURSE",
}

/**
 * The condition of the care recipient.
 */
export enum SeniorCareRecipientCondition {
  CONSTANT_SUPERVISION_NEEDED = "CONSTANT_SUPERVISION_NEEDED",
  INDEPENDENT = "INDEPENDENT",
  MONITORING_OR_EXTRA_HELP_NEEDED = "MONITORING_OR_EXTRA_HELP_NEEDED",
  NOT_SURE = "NOT_SURE",
}

/**
 * The care recipient's relationship to the seeker.
 */
export enum SeniorCareRecipientRelationshipType {
  GRANDPARENT = "GRANDPARENT",
  OTHER = "OTHER",
  PARENT = "PARENT",
  SELF = "SELF",
  SPOUSE = "SPOUSE",
}

/**
 * Specific services needed by the senior care recipient.
 */
export enum SeniorCareServiceNeededType {
  BATHING = "BATHING",
  COMPANIONSHIP = "COMPANIONSHIP",
  ERRANDS = "ERRANDS",
  FEEDING = "FEEDING",
  HEAVY_LIFTING = "HEAVY_LIFTING",
  HELP_STAYING_PHYSICALLY_ACTIVE = "HELP_STAYING_PHYSICALLY_ACTIVE",
  LIGHT_HOUSECLEANING = "LIGHT_HOUSECLEANING",
  MEAL_PREPARATION = "MEAL_PREPARATION",
  MEDICATION = "MEDICATION",
  MOBILITY_ASSISTANCE = "MOBILITY_ASSISTANCE",
  TRANSPORTATION = "TRANSPORTATION",
  WOUND_CARE = "WOUND_CARE",
}

/**
 * Specific services needed by the senior care recipient.
 * This enum set is *mostly* analogous to what we have in job/seniorSchema.graphql, however some values do not match up,
 * which is the reason for maintaining a separate set of enums.
 */
export enum SeniorCareServiceProvidedType {
  BATHING = "BATHING",
  COMPANIONSHIP = "COMPANIONSHIP",
  ERRANDS = "ERRANDS",
  FEEDING = "FEEDING",
  HEAVY_LIFTING = "HEAVY_LIFTING",
  HELP_STAYING_PHYSICALLY_ACTIVE = "HELP_STAYING_PHYSICALLY_ACTIVE",
  LIGHT_HOUSECLEANING = "LIGHT_HOUSECLEANING",
  LIVE_IN_HOME_CARE = "LIVE_IN_HOME_CARE",
  MEAL_PREPARATION = "MEAL_PREPARATION",
  MOBILITY_ASSISTANCE = "MOBILITY_ASSISTANCE",
  PERSONAL_CARE = "PERSONAL_CARE",
  SPECIALIZED_CARE = "SPECIALIZED_CARE",
  TRANSPORTATION = "TRANSPORTATION",
}

/**
 * The general type of senior care needed.
 */
export enum SeniorCaregiverType {
  COMPANION = "COMPANION",
  HANDS_ON = "HANDS_ON",
  LIVE_IN = "LIVE_IN",
  RESPITE = "RESPITE",
}

/**
 * The type of senior care community
 */
export enum SeniorCommunityType {
  ASSISTED_LIVING = "ASSISTED_LIVING",
  CONTINUING_CARE = "CONTINUING_CARE",
  INDEPENDENT_LIVING = "INDEPENDENT_LIVING",
  MEMORY_CARE = "MEMORY_CARE",
}

/**
 * type of service provided by the caregiver
 * will be adding more services as required
 */
export enum ServiceType {
  AU_PAIR = "AU_PAIR",
  CARE_GIGS = "CARE_GIGS",
  CHILD_CARE = "CHILD_CARE",
  GENERIC = "GENERIC",
  HOUSEKEEPING = "HOUSEKEEPING",
  PET_CARE = "PET_CARE",
  SENIOR_CARE = "SENIOR_CARE",
  SPECIAL_NEEDS = "SPECIAL_NEEDS",
  TUTORING = "TUTORING",
}

/**
 * Type of sub service for service provided
 * will be adding more as per requirement
 */
export enum SubServiceType {
  BABYSITTER = "BABYSITTER",
  CHILDMINDER = "CHILDMINDER",
  DAY_CARE = "DAY_CARE",
  FAMILY_CARE = "FAMILY_CARE",
  NANNY = "NANNY",
  NANNY_OR_BABYSITTER = "NANNY_OR_BABYSITTER",
  NANNY_SHARE = "NANNY_SHARE",
  ONE_TIME_BABYSITTER = "ONE_TIME_BABYSITTER",
}

/**
 * The type of analysis that is performed on the given string
 */
export enum TextConcernType {
  PII = "PII",
  PROFANITY = "PROFANITY",
  UNKNOWN = "UNKNOWN",
}

/**
 * Tutoring Caregiver Quality
 */
export enum TutoringCaregiverQuality {
  COLLEGE_DEGREE = "COLLEGE_DEGREE",
  COMFORTABLE_WITH_PETS = "COMFORTABLE_WITH_PETS",
  DOES_NOT_SMOKE = "DOES_NOT_SMOKE",
  OWN_TRANSPORTATION = "OWN_TRANSPORTATION",
}

/**
 * Tutoring education level
 */
export enum TutoringEducationLevel {
  ADULT = "ADULT",
  COLLEGE = "COLLEGE",
  ELEMENTARY = "ELEMENTARY",
  HIGH_SCHOOL = "HIGH_SCHOOL",
  MIDDLE_SCHOOL = "MIDDLE_SCHOOL",
}

/**
 * Tutoring goals
 */
export enum TutoringGoals {
  BOOST_TEST_SCORES = "BOOST_TEST_SCORES",
  BUILD_CONFIDENCE = "BUILD_CONFIDENCE",
  HOMEWORK_HELP = "HOMEWORK_HELP",
  IMPROVE_GRADES = "IMPROVE_GRADES",
  OTHER = "OTHER",
  SUPPORT_FOR_PROBLEM_AREAS = "SUPPORT_FOR_PROBLEM_AREAS",
}

/**
 * Tutoring mode
 */
export enum TutoringMode {
  EITHER = "EITHER",
  IN_PERSON = "IN_PERSON",
  ONLINE = "ONLINE",
}

/**
 * Care services that may be required as part of job
 */
export enum TutoringService {
  DROP_PICKUP_CHILDREN = "DROP_PICKUP_CHILDREN",
  REMOTE_LEARNING_ASSISTANCE = "REMOTE_LEARNING_ASSISTANCE",
}

/**
 * Subject Types for Tutoring
 */
export enum TutoringSubjectType {
  ART = "ART",
  ARTS_AND_MUSIC = "ARTS_AND_MUSIC",
  BUSINESS = "BUSINESS",
  COMPUTERS = "COMPUTERS",
  DANCE = "DANCE",
  ENGLISH = "ENGLISH",
  FOREIGN_LANGUAGE = "FOREIGN_LANGUAGE",
  MATH = "MATH",
  MUSICAL_INSTRUMENTS = "MUSICAL_INSTRUMENTS",
  MUSIC_AND_DRAMA = "MUSIC_AND_DRAMA",
  OTHER = "OTHER",
  SCIENCE = "SCIENCE",
  SPECIAL_EDUCATION = "SPECIAL_EDUCATION",
  SPORTS_AND_FITNESS = "SPORTS_AND_FITNESS",
  TEST_PREP = "TEST_PREP",
}

/**
 * U.S. State Codes
 */
export enum UsStateCode {
  AK = "AK",
  AL = "AL",
  AR = "AR",
  AZ = "AZ",
  CA = "CA",
  CO = "CO",
  CT = "CT",
  DC = "DC",
  DE = "DE",
  FE = "FE",
  FL = "FL",
  GA = "GA",
  HI = "HI",
  IA = "IA",
  ID = "ID",
  IL = "IL",
  IN = "IN",
  KS = "KS",
  KY = "KY",
  LA = "LA",
  MA = "MA",
  MD = "MD",
  ME = "ME",
  MI = "MI",
  MN = "MN",
  MO = "MO",
  MS = "MS",
  MT = "MT",
  NC = "NC",
  ND = "ND",
  NE = "NE",
  NH = "NH",
  NJ = "NJ",
  NM = "NM",
  NV = "NV",
  NY = "NY",
  OH = "OH",
  OK = "OK",
  OR = "OR",
  PA = "PA",
  PR = "PR",
  RI = "RI",
  SC = "SC",
  SD = "SD",
  TN = "TN",
  TX = "TX",
  UT = "UT",
  VA = "VA",
  VT = "VT",
  WA = "WA",
  WI = "WI",
  WV = "WV",
  WY = "WY",
}

/**
 * The answer to a yes or no question.
 */
export enum YesOrNoAnswer {
  NO = "NO",
  NOT_SURE = "NOT_SURE",
  YES = "YES",
}

/**
 * Address details for the bookings.
 */
export interface AddressInput {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  state: string;
  zip: string;
}

/**
 * Input fields for an auto-accept lead.
 */
export interface AutoAcceptChildCareLeadPublishInput {
  acceptableDistance?: DistanceInput | null;
  attendingDays?: DayCareAttendingDays | null;
  careExpectations?: string | null;
  childrenDatesOfBirth: globalScalarLocalDate[];
  contactMethod?: ChildCareLeadContactMethod | null;
  justBrowsing: boolean;
  providerIds: string[];
  seekerInfo: SeekerInfo;
  source: string;
  startDate?: globalScalarLocalDate | null;
  timeOfDay?: DayCareTimeOfDay | null;
  trackingId: string;
  zipcode: string;
}

/**
 * # Attributes of caregiver
 */
export interface CaregiverAttributesInput {
  comfortableWithPets?: boolean | null;
  covidVaccinated?: boolean | null;
  education?: EducationLevel | null;
  languages?: Language[] | null;
  ownTransportation?: boolean | null;
  smokes?: boolean | null;
  yearsOfExperience?: number | null;
}

/**
 * # Input type for updating caregiver attributes
 */
export interface CaregiverAttributesUpdateInput {
  caregiver?: CaregiverAttributesInput | null;
  childcare?: ChildcareCaregiverAttributesInput | null;
  serviceType: ServiceType;
}

/**
 * Input values for updating a caregiver's biography.
 */
export interface CaregiverBiographyUpdateInput {
  bio: string;
  firstName?: string | null;
  headline?: string | null;
  lastName?: string | null;
}

/**
 * Count of childs for age groups
 */
export interface ChildCareAgeGroupsCount {
  count: number;
  group: ChildCareAgeGroups;
}

/**
 * Input fields for a Child Care Lead creation.
 */
export interface ChildCareLeadCreateInput {
  attendingDays?: DayCareAttendingDays | null;
  childCareExpectations?: string | null;
  childrenDatesOfBirth: globalScalarLocalDate[];
  contactMethod?: ChildCareLeadContactMethod | null;
  providerIds: string[];
  seekerInfo: SeekerInfo;
  source: string;
  startDate?: globalScalarLocalDate | null;
  submissionMethod: ChildCareLeadsSubmissionMethod;
  timeOfDay?: DayCareTimeOfDay | null;
  trackingId: string;
  zipcode: string;
}

/**
 * Input fields for a one time child care job.
 */
export interface ChildCareOneTimeJobCreateInput {
  careRecipients: ChildCareRecipientInput[];
  characteristics?: ChidCareProviderCharacteristic[] | null;
  description?: string | null;
  qualities?: ChildCareProviderQuality[] | null;
  rate: JobRateInput;
  schedule: LocalDateTimeBlockInput;
  scheduleMayVary: boolean;
  servicesNeeded?: ChildCareService[] | null;
  source: JobSource;
  title?: string | null;
  zipcode: string;
}

/**
 * A child care recipient (Input)
 */
export interface ChildCareRecipientInput {
  ageRange: ChildCareAgeRangeType;
  approximateDoB?: globalScalarLocalDate | null;
  gender?: Gender | null;
  id?: string | null;
}

/**
 * Input fields for a recurring child care job.
 */
export interface ChildCareRecurringJobCreateInput {
  careRecipients: ChildCareRecipientInput[];
  characteristics?: ChidCareProviderCharacteristic[] | null;
  description?: string | null;
  endDate?: globalScalarLocalDate | null;
  qualities?: ChildCareProviderQuality[] | null;
  rate: JobRateInput;
  schedule: WeeklyScheduleInput;
  scheduleMayVary: boolean;
  servicesNeeded?: ChildCareService[] | null;
  source: JobSource;
  startDate: globalScalarLocalDate;
  title?: string | null;
  zipcode: string;
}

/**
 * Child Care Search Criteria
 */
export interface ChildCareSearchCriteria {
  ageGroups?: ChildCareAgeGroupsCount[] | null;
  qualities?: ChildCareProviderQuality[] | null;
  services?: ChildCareService[] | null;
  yearsOfExperience?: number | null;
}

/**
 * Input for calculation of possible tax credit savings on child care
 */
export interface ChildCareTaxCreditSavingCalculationInput {
  numberOfChildren: number;
  weeklyHours: number;
  zipcode: string;
}

/**
 * # Childcare attributes of caregiver
 */
export interface ChildcareCaregiverAttributesInput {
  ageGroups?: ChildCareAgeGroups[] | null;
  careForSickChild?: boolean | null;
  carpooling?: boolean | null;
  certifiedNursingAssistant?: boolean | null;
  certifiedRegistedNurse?: boolean | null;
  certifiedTeacher?: boolean | null;
  childDevelopmentAssociate?: boolean | null;
  cprTrained?: boolean | null;
  craftAssistance?: boolean | null;
  doula?: boolean | null;
  earlyChildDevelopmentCoursework?: boolean | null;
  earlyChildhoodEducation?: boolean | null;
  errands?: boolean | null;
  expSpecialNeedsChildren?: boolean | null;
  experienceWithTwins?: boolean | null;
  firstAidTraining?: boolean | null;
  groceryShopping?: boolean | null;
  laundryAssistance?: boolean | null;
  lightHousekeeping?: boolean | null;
  mealPreparation?: boolean | null;
  nafccCertified?: boolean | null;
  numberOfChildren?: number | null;
  remoteLearningAssistance?: boolean | null;
  swimmingSupervision?: boolean | null;
  travel?: boolean | null;
  trustlineCertifiedCalifornia?: boolean | null;
}

/**
 * Hired Caregiver Event information
 */
export interface CzenCrmEventHiredCaregiver {
  isEnrollment: boolean;
  vertical: ServiceType;
}

/**
 * Input fields for creating a Caregiver Hired event.
 */
export interface CzenCrmEventHiredCaregiverInput {
  czenCrmEventHiredCaregiver: CzenCrmEventHiredCaregiver;
  userId: string;
}

/**
 * Leads Submitted Event Type
 */
export interface CzenCrmEventLeadsSubmitted {
  autoAccept: boolean;
  enrollment: boolean;
  leadCount: number;
  leads: CzenCrmLeadInput[];
  subVertical: SubServiceType;
  vertical: ServiceType;
}

/**
 * Input fields for creating Leads Submitted crm events.
 */
export interface CzenCrmEventLeadsSubmittedInput {
  czenCrmEventLeadsSubmitted: CzenCrmEventLeadsSubmitted;
  userId: string;
}

/**
 * Lead Input
 */
export interface CzenCrmLeadInput {
  address: AddressInput;
  businessName: string;
  phoneNumber?: globalScalarPhoneNumber | null;
}

/**
 * A collection of non-overlapping time blocks for a single day
 */
export interface DailyScheduleInput {
  blocks: LocalTimeBlockInput[];
}

/**
 * Child Care Day Care - Attending Days
 */
export interface DayCareAttendingDays {
  friday?: boolean | null;
  monday?: boolean | null;
  saturday?: boolean | null;
  sunday?: boolean | null;
  thursday?: boolean | null;
  tuesday?: boolean | null;
  wednesday?: boolean | null;
}

/**
 * Input values for Distance
 */
export interface DistanceInput {
  unit: DistanceUnit;
  value: number;
}

/**
 * Input for enrolling in continuous monitoring
 */
export interface EnrollInContinuousMonitoringInput {
  consentGivenMessageIds: string[];
  memberId: string;
}

/**
 * Input for EligibilityVerification
 */
export interface EnterpriseEmployeeEnrollmentDetails {
  employeeInformation: EnterpriseEmployeeInformation;
  group: string;
}

/**
 * Input for the Employee releated Information for enterprise enrollment
 */
export interface EnterpriseEmployeeInformation {
  address: string;
  dateOfBirth: globalScalarLocalDate;
  email?: string | null;
  employeeId?: string | null;
  firstName: string;
  googleAuthIdToken?: string | null;
  lastName: string;
  lifeCareMemberId?: string | null;
  optForEmail?: boolean | null;
  password?: string | null;
  phoneNumber?: globalScalarPhoneNumber | null;
  primaryService?: ServiceType | null;
  role?: string | null;
  zip: string;
}

/**
 * The input for facebookConnect mutation.
 */
export interface FacebookConnectInput {
  accessToken: string;
}

/**
 * The input type to favorite providers.
 */
export interface FavoriteProviderInput {
  memberId: string;
  serviceType: ServiceType;
}

/**
 * Input values for FavoriteRequest
 */
export interface FavoriteRequestInput {
  favoriteStatus: boolean;
  serviceProfileId: string;
}

/**
 * Input for HomePay Prospect
 */
export interface HomePayProspectInput {
  address: MailingAddressInput;
  caregiverType?: HomepayCaregiverType | null;
  email: string;
  expectedHireTimeFrame?: HomePayExpectedHireTimeFrame | null;
  firstName: string;
  hasHired?: boolean | null;
  lastName: string;
  partnerId?: string | null;
  phoneNumber: string;
  planId?: string | null;
  prospectLabel?: string | null;
  referringSite?: string | null;
}

/**
 * House Details (Input)
 */
export interface HouseDetails {
  numberOfBathrooms: number;
  numberOfBedrooms: number;
}

/**
 * Input fields for a one time housekeeping job.
 */
export interface HousekeepingOneTimeJobCreateInput {
  comfortableWithPets?: boolean | null;
  description?: string | null;
  flexibleStart?: boolean | null;
  houseDetails: HouseDetails;
  provideOwnEquipments: boolean;
  provideOwnSupplies: boolean;
  rate: JobRateInput;
  schedule: LocalDateTimeBlockInput;
  scheduleMayVary: boolean;
  services?: HousekeepingService[] | null;
  source: JobSource;
  squareFootage?: HouseKeepingSquareFootage | null;
  title?: string | null;
  zipcode: string;
}

/**
 * Input fields for a recurring housekeeping job.
 */
export interface HousekeepingRecurringJobCreateInput {
  comfortableWithPets?: boolean | null;
  description?: string | null;
  endDate?: globalScalarLocalDate | null;
  flexibleStart?: boolean | null;
  frequency?: HousekeepingFrequency | null;
  houseDetails: HouseDetails;
  provideOwnEquipments: boolean;
  provideOwnSupplies: boolean;
  rate: JobRateInput;
  schedule: WeeklyScheduleInput;
  scheduleMayVary: boolean;
  services?: HousekeepingService[] | null;
  source: JobSource;
  squareFootage?: HouseKeepingSquareFootage | null;
  startDate: globalScalarLocalDate;
  title?: string | null;
  zipcode: string;
}

/**
 * Hourly limits for schedules
 */
export interface JobHoursInput {
  maximum?: number | null;
  minimum: number;
  unit: JobHoursUnit;
}

/**
 * The minimum and maximum hourly pay rate associated with a job
 */
export interface JobRateInput {
  maximum: MoneyInput;
  minimum: MoneyInput;
}

/**
 * Input for mutation leadConnectActionRecord
 */
export interface LeadConnectActionRecordInput {
  action: ActionType;
  actorType: ActorType;
  targetId: string;
  vertical: ServiceType;
}

/**
 * A block of time represented by start and end dates and times
 */
export interface LocalDateTimeBlockInput {
  end: LocalDateTimeInput;
  start: LocalDateTimeInput;
}

/**
 * A local date and time
 */
export interface LocalDateTimeInput {
  date: globalScalarLocalDate;
  time: globalScalarLocalTime;
}

/**
 * A block of time represented by a start and end time
 */
export interface LocalTimeBlockInput {
  end: globalScalarLocalTime;
  start: globalScalarLocalTime;
}

/**
 * Input for mailing address
 */
export interface MailingAddressInput {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: UsStateCode;
  zip: string;
}

/**
 * Input fields for change member's password.
 */
export interface MemberChangePasswordInput {
  password: string;
}

/**
 * Money input to fetch monetary value
 */
export interface MoneyInput {
  amount: globalScalarDecimal;
  currencyCode: globalScalarCurrency;
}

/**
 * Structure to hold number of children and service rates based on that
 */
export interface OneTimeChildCareRatesInput {
  hourlyRate: MoneyInput;
  numberOfChildren: number;
}

/**
 * One time job interest details
 */
export interface OneTimeJobInterestInput {
  childCareJobRates: OneTimeChildCareRatesInput[];
  jobHours?: JobHoursInput | null;
}

/**
 * Count of animal types for Pet Care (Input)
 */
export interface PetCareAnimalTypeCount {
  animalType: PetCareAnimalType;
  count: number;
}

/**
 * Input fields for a one time Pet Care job.
 */
export interface PetCareOneTimeJobCreateInput {
  additionalServices?: PetCareAdditionalService[] | null;
  animalTypes: PetCareAnimalTypeCount[];
  description?: string | null;
  flexibleStart?: boolean | null;
  qualities?: PetCareProviderQuality[] | null;
  rate: JobRateInput;
  schedule: LocalDateTimeBlockInput;
  scheduleMayVary: boolean;
  serviceType: PetCareServiceType;
  source: JobSource;
  title?: string | null;
  zipcode: string;
}

/**
 * Input fields for a recurring Pet Care job.
 */
export interface PetCareRecurringJobCreateInput {
  additionalServices?: PetCareAdditionalService[] | null;
  animalTypes: PetCareAnimalTypeCount[];
  description?: string | null;
  endDate?: globalScalarLocalDate | null;
  flexibleStart?: boolean | null;
  qualities?: PetCareProviderQuality[] | null;
  rate: JobRateInput;
  schedule: WeeklyScheduleInput;
  scheduleMayVary: boolean;
  serviceType: PetCareServiceType;
  source: JobSource;
  startDate: globalScalarLocalDate;
  title?: string | null;
  zipcode: string;
}

/**
 * Input values for updating a provider's availability.
 */
export interface ProviderAvailabilityUpdateInput {
  endDate?: globalScalarLocalDate | null;
  liveInLimits?: SchedulingLimits | null;
  oneTimeLimits?: SchedulingLimits | null;
  recurringLimits?: SchedulingLimits | null;
  schedule: WeeklyScheduleInput;
  serviceType?: ServiceType | null;
  startDate: globalScalarLocalDate;
}

/**
 * Input to create a provider account
 */
export interface ProviderCreateInput {
  distanceWillingToTravel?: DistanceInput | null;
  email: string;
  howDidYouHearAboutUs?: HOW_DID_YOU_HEAR_ABOUT_US | null;
  password: string;
  referrerCookie?: string | null;
  serviceType: ServiceType;
  zipcode: string;
}

/**
 * Input values to update provider job interests
 */
export interface ProviderJobInterestUpdateInput {
  oneTimeJobInterest?: OneTimeJobInterestInput | null;
  recurringJobInterest?: RecurringJobInterestInput | null;
  serviceType: ServiceType;
  source?: JobInterestUpdateSource | null;
}

/**
 * Input values to update provider name
 */
export interface ProviderNameUpdateInput {
  firstName: string;
  lastName: string;
}

/**
 * Recurring job interest details
 */
export interface RecurringJobInterestInput {
  jobHours?: JobHoursInput | null;
  jobRate: JobRateInput;
}

/**
 * Hourly limits for schedules
 */
export interface SchedulingLimits {
  maximumHours?: number | null;
  minimumHours?: number | null;
}

/**
 * Input values for seekerUpdate mutation
 */
export interface SeekerAttributesInput {
  daycareInterest?: boolean | null;
}

/**
 * Input fields for creating a new care seeker
 */
export interface SeekerCreateInput {
  addressLine1?: string | null;
  careDate?: CareDate | null;
  email: string;
  enrollmentSource?: EnrollmentSource | null;
  firstName: string;
  howDidYouHearAboutUs?: HOW_DID_YOU_HEAR_ABOUT_US | null;
  lastName: string;
  password?: string | null;
  referrerCookie?: string | null;
  serviceType: ServiceType;
  subServiceType?: SubServiceType | null;
  zipcode: string;
}

/**
 * Input information about Seeker for Lead
 */
export interface SeekerInfo {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  phoneNumber: string;
}

/**
 * Input values for seekerUpdate mutation
 */
export interface SeekerUpdateInput {
  attributes?: SeekerAttributesInput | null;
}

/**
 * Input values for sending a 1:many messages between at least two premium members
 */
export interface SendMessageInput {
  message: string;
  recipientMemberIds: string[];
  relatedJobId?: string | null;
  subject?: string | null;
}

/**
 * Input fields for senior assisted living community lead
 */
export interface SeniorAssistedLivingCommunityLeadPublishInput {
  careRecipientInfo?: SeniorFacilityCareRecipientInput | null;
  providerIds: string[];
  seekerInfo: SeekerInfo;
  source?: string | null;
  trackingId: string;
  zipcode: string;
}

/**
 * Input values to generate a senior care facility lead
 */
export interface SeniorCareFacilityLeadGenerateInput {
  acceptedCaringTermsOfUse: boolean;
  ageRange?: SeniorCareAgeRangeType | null;
  amenities?: SeniorCareFacilityAmenity[] | null;
  careRecipientCondition?: SeniorCareRecipientCondition | null;
  email: string;
  firstName: string;
  lastName: string;
  memoryCareFacilityNeeded?: YesOrNoAnswer | null;
  paymentSources?: SeniorCarePaymentSource[] | null;
  phone: string;
  relationship?: SeniorCareRecipientRelationshipType | null;
  serviceNeeded?: SeniorCareServiceNeededType[] | null;
  zipcode?: string | null;
}

/**
 * Input fields for a one time senior care job.
 */
export interface SeniorCareOneTimeJobCreateInput {
  alzheimersOrDementiaRecipient?: boolean | null;
  careRecipients: SeniorCareRecipientInput[];
  caregiverType: SeniorCaregiverType;
  description?: string | null;
  idealCaregiverQualities?: SeniorCareIdealCaregiverQuality[] | null;
  rate: JobRateInput;
  schedule: LocalDateTimeBlockInput;
  scheduleMayVary?: boolean | null;
  servicesNeeded: SeniorCareServiceNeededType[];
  source: JobSource;
  title?: string | null;
  zipcode: string;
}

/**
 * Input values for updating a senior care provider's attributes.
 */
export interface SeniorCareProviderAttributesUpdateInput {
  careTypeToProvide?: SeniorCareServiceProvidedType[] | null;
  education?: EducationLevel | null;
  jobRate?: JobRateInput | null;
  languages?: Language[] | null;
  qualities?: SeniorCareProviderQuality[] | null;
  vaccinated?: boolean | null;
  yearsOfExperience?: number | null;
}

/**
 * Input values for updating a senior care provider's availability.
 */
export interface SeniorCareProviderAvailabilityUpdateInput {
  endDate?: globalScalarLocalDate | null;
  liveInLimits?: SchedulingLimits | null;
  oneTimeLimits?: SchedulingLimits | null;
  recurringLimits?: SchedulingLimits | null;
  schedule: WeeklyScheduleInput;
  startDate: globalScalarLocalDate;
}

/**
 * Input to create a provider account
 */
export interface SeniorCareProviderCreateInput {
  email: string;
  howDidYouHearAboutUs?: HOW_DID_YOU_HEAR_ABOUT_US | null;
  milesWillingToTravel?: number | null;
  password: string;
  referrerCookie?: string | null;
  zipcode: string;
}

/**
 * A senior care recipient.
 */
export interface SeniorCareRecipientInput {
  ageRange: SeniorCareAgeRangeType;
  gender: Gender;
  relationship: SeniorCareRecipientRelationshipType;
}

/**
 * Input fields for a recurring senior care job.
 */
export interface SeniorCareRecurringJobCreateInput {
  alzheimersOrDementiaRecipient?: boolean | null;
  careRecipients: SeniorCareRecipientInput[];
  caregiverType: SeniorCaregiverType;
  description?: string | null;
  endDate?: globalScalarLocalDate | null;
  idealCaregiverQualities?: SeniorCareIdealCaregiverQuality[] | null;
  rate: JobRateInput;
  schedule: WeeklyScheduleInput;
  scheduleMayVary: boolean;
  servicesNeeded: SeniorCareServiceNeededType[];
  source: JobSource;
  startDate: globalScalarLocalDate;
  title?: string | null;
  zipcode: string;
}

/**
 * The input for updating senior care seeker attributes.
 */
export interface SeniorCareSeekerAttributesUpdateInput {
  ageRange?: SeniorCareAgeRangeType | null;
  careRecipientCondition?: SeniorCareRecipientCondition | null;
  howSoonIsCareNeeded?: HowSoonIsCareNeeded | null;
  memoryCareFacilityNeeded?: YesOrNoAnswer | null;
  paymentSources?: SeniorCarePaymentSource[] | null;
}

/**
 * Input fields for creating a new senior care seeker.
 */
export interface SeniorCareSeekerCreateInput {
  careType?: SENIOR_CARE_TYPE | null;
  email: string;
  firstName: string;
  howDidYouHearAboutUs?: HOW_DID_YOU_HEAR_ABOUT_US | null;
  lastName: string;
  password: string;
  referrerCookie?: string | null;
  zipcode: string;
}

/**
 * Senior care input for the person receiving care with pertinent
 * information for in-facility care
 */
export interface SeniorFacilityCareRecipientInput {
  ageRange?: SeniorCareAgeRangeType | null;
  facilityType: SeniorCommunityType;
  relationship: SeniorCareRecipientRelationshipType;
}

/**
 * Signed url create input
 */
export interface SignedUrlCreateInput {
  fileName: string;
}

/**
 * Input for mutations that use a signed url as input
 */
export interface SignedUrlInput {
  etag: string;
  signature: string;
  url: globalScalarURL;
}

/**
 * Input type of the text creator and their session associated with a requested text analysis
 */
export interface TextAnalyzerDetectConcernsCreator {
  email?: string | null;
  givenName?: string | null;
  memberId: string;
  sessionId: string;
}

/**
 * Input fields for a one time Tutoring job.
 */
export interface TutoringOneTimeJobCreateInput {
  allowAgencies?: boolean | null;
  description?: string | null;
  educationLevel: TutoringEducationLevel;
  flexibleStart?: boolean | null;
  goals?: TutoringGoals[] | null;
  mode: TutoringMode;
  qualities?: TutoringCaregiverQuality[] | null;
  rate: JobRateInput;
  schedule: LocalDateTimeBlockInput;
  scheduleMayVary: boolean;
  serviceType: ServiceType;
  servicesNeeded?: TutoringService[] | null;
  source: JobSource;
  subjects: TutoringSubjectType[];
  title?: string | null;
  zipcode: string;
}

/**
 * Input fields for a recurring Tutoring job.
 */
export interface TutoringRecurringJobCreateInput {
  allowAgencies?: boolean | null;
  description?: string | null;
  educationLevel: TutoringEducationLevel;
  endDate?: globalScalarLocalDate | null;
  flexibleStart?: boolean | null;
  goals?: TutoringGoals[] | null;
  mode: TutoringMode;
  qualities?: TutoringCaregiverQuality[] | null;
  rate: JobRateInput;
  schedule: WeeklyScheduleInput;
  scheduleMayVary: boolean;
  serviceType: ServiceType;
  servicesNeeded?: TutoringService[] | null;
  source: JobSource;
  startDate: globalScalarLocalDate;
  subjects: TutoringSubjectType[];
  title?: string | null;
  zipcode: string;
}

/**
 * A map of daily schedules for every day of the week
 */
export interface WeeklyScheduleInput {
  monday?: DailyScheduleInput | null;
  tuesday?: DailyScheduleInput | null;
  wednesday?: DailyScheduleInput | null;
  thursday?: DailyScheduleInput | null;
  friday?: DailyScheduleInput | null;
  saturday?: DailyScheduleInput | null;
  sunday?: DailyScheduleInput | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
