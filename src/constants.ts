export const SKIP_AUTH_CONTEXT_KEY = 'skipAuth';

// Sorted alphabetically to ease adding/removing/finding constants
export const CLIENT_FEATURE_FLAGS = Object.freeze({
  AMPLITUDE_USE_AMPLI: 'amplitude-taxonomy-enable-ampli-events',
  AUTH0_PASSWORD_RULES: 'auth0-password-rules',
  CC_DC_CONTACT_METHOD: 'cc-enrollment-mfe-daycare-contact-method',
  CC_DC_REMOVE_STEP_COUNTER: 'growth-cc-dc-enrollment-remove-step-counter',
  CC_OPTIONAL_PAJ: 'seeker-cc-mfe-optional-paj',
  CC_SEEKER_FB_SIGNUP: 'seeker-enrollment-mfe-facebook-signup',
  CSC_SESSION_COOKIE_FLOW: 'enrollment-mfe-csc-session-cookie-flow',
  COOKIE_FLOW_AUTH: 'enrollment-mfe-cookie-flow-auth',
  DAYCARE_AUTO_ACCEPT_BACKEND: 'enrollment-mfe-daycare-auto-accept-leads-backend',
  DAYCARE_DAYS_SELECTOR: 'growth-daycare-days-selector',
  DAYCARE_DISTANCE_SETTINGS: 'enrollment-mfe-daycare-distance-value',
  DAYCARE_HDYHAU: 'growth-dc-enrollment-hdyhau-removal',
  DAYCARE_JUST_BROWSING_VS_NO_RUSH: 'growth-dc-enrollment-just-browsing-vs-no-rush',
  DAYCARE_LEADS_REDIRECTION: 'growth-enrollment-mfe-daycare-leads-redirection',
  DISTANCE_LEARNING_REMOVAL: 'growth-cc-enrollment-distance-learning-removal',
  ENROLLMENT_MFE_AAA: 'enrollment-mfe-aaa',
  GROWTH_SC_TYPE_OF_CARE: 'growth-senior-care-type-of-care',
  GROWTH_CC_REMOVE_DC_OPTION: 'growth-childcare-dc-removal-test',
  HDYHAU: 'enrollment-mfe-seeker-hdyhau',
  PROVIDER_CC_ENROLLMENT_TEXT_ANALYZER: 'provider-cc-enrollment-text-analyzer',
  PROVIDER_CC_FREE_GATED_EXPERIENCE: 'provider-cc-free-gated-experience',
  PROVIDER_VACCINE_INDICATOR: 'provider-vaccine-indicator',
  PROVIDER_VACCINE_INDICATOR_SENIOR: 'provider-vaccine-indicator-senior',
  SEEKER_ENROLLMENT_MFE_DOB_CHILD: 'seeker-enrollment-mfe-dob-child',
  SEEKER_CC_REBRANDED_ENROLLMENT: 'seeker-cc-mfe-rebranded-enrollment',
  SEEKER_FB_SIGNUP_EMPHASIZED: 'seeker-enrollment-mfe-facebook-signup-emphasized',
  SEEKER_JOB_MFE_CC: 'seeker-job-mfe-revert-enrollment-cc',
  SEEKER_JOB_MFE_HK: 'seeker-job-mfe-revert-enrollment-hk',
  SEEKER_JOB_MFE_PC: 'seeker-job-mfe-revert-enrollment-pc',
  SEEKER_JOB_MFE_TU: 'seeker-job-mfe-revert-enrollment-tu',
  GLOBAL_HOLD_OUT: '2022-q1-hold-out-updated',
  LEAD_CONNECT_MFE_REDIRECT: 'lead-connect-mfe-redirect',
  LEAD_CONNECT_PROVIDER_NETWORK: 'sc-seeker-lc-pn-integration',
  LEAD_CONNECT_FIFTEEN_CAREGIVERS: 'lead-connect-fifteen-caregiver-max',
  SEEKER_CC_CONVERSATIONAL_LANGUAGE: 'growth-cc-enrollment-conversational-language',
  SPLIT_ACCOUNT_CREATION_DAYCARE: 'growth-enrollment-mfe-daycare-account-screen-split',
  SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION: 'growth-dc-enrollment-cta-iteration',
  LEAD_CONNECT_RECAP_SCREEN: 'enrollment-mfe-remove-lead-connect-recap-screen',
  LEAD_CONNECT_ACTION_RECORD_MUTATION: 'sc-leadConnectActionRecord-mutation',
  ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION:
    'enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations',
  INSTANT_BOOK_ENROLLMENT_M1: 'growth-cc-enrollment-instant-book-m1',
  INSTANT_BOOK_ENROLLMENT_DIRECT_TO_BOOKING: 'growth-cc-enrollment-direct-to-booking',
  INSTANT_BOOK_CARE_KIND_MERCHANDISING: 'growth-cc-enrollment-care-kind-ib-merchandising',
  SKIP_LOGIN_IN_RATECARD_REDIRECTION: 'skip-login-in-ratecard-redirection',
  BIRTHDATE_9_MONTHS_OUT: 'enrollment-birthdate-9-months-out',
  DAYCARE_DISTANCE_TRAVELED_SELECTION: 'daycare-distance-traveled-selection',
  PASSWORD_REQUIREMENTS_COPY: 'growth-all-enrollment-auth0-password-requirements-copy',
  SEEKER_CC_NAME_BEFORE_EMAIL: 'growth-cc-enrollment-name-before-email',
  SEEKER_NAME_SPECIAL_CHARS_VALIDATION: 'growth-cc-enrollment-names-validation',
  SEEKER_PRE_RATE_CARD: 'seeker-pre-ratecard',
  IB_SHORTENED_FLOW: 'growth-cc-enrollment-ib-shortened-flow',
  SESSION_STORAGE_RETRIEVAL_SUCCESS: 'growth-all-session-storage-retrieval-success',
} as const);

export const SERVER_FEATURE_FLAGS = Object.freeze({
  SPLUNK_RUM_EVAL: 'splunk-rum-eval',
  SENTRY_SESSION_REPLAY: 'sentry-session-replay',
  SENTRY_TRACE_TRANSACTION: 'sentry-trace-transaction-eval',
  GTM_ENABLED: 'gtm-enabled',
});

export const WINDOW_SENTRY_SESSION_REPLAY_KEY = 'SENTRY_SESSION_REPLAY';
export const WINDOW_SENTRY_TRACE_TRANSACTION_KEY = 'SENTRY_TRACE_TRANSACTION';
export const WINDOW_SPLUNK_TRACE_TRANSACTION_KEY = 'SPLUNK_TRACE_TRANSACTION';

export const TEALIUM_EVENTS = Object.freeze({
  DAYCARE_LEADS: 'DAYCARE_LEADS_SUBMITTED',
  SENIORCARE_LEADS_VIEW: 'SENIORCARE_LEADS_VIEW',
  SENIORCARE_LEADS_SUBMITTED: 'SENIORCARE_LEADS_SUBMITTED',
});

export const TEALIUM_SLOTS = Object.freeze({
  DAYCARE_LEADS_SUBMITTED: ['/us-marketplace/seniorcare/caring-leads-submitted/'],
  SENIORCARE_LEADS_VIEWED_NON_ENROLLMENT: [
    '/us-marketplace/segment/seeker/sc/internal-leads-viewed/non-enrollment',
  ],
  SENIORCARE_LEADS_SUBMITTED_NON_ENROLLMENT: [
    '/us-marketplace/conversion/seeker/sc/internal-lead/non-enrollment',
  ],
  SENIORCARE_LEADS_VIEWED_ENROLLMENT: [
    '/us-marketplace/segment/seeker/sc/internal-leads-viewed/enrollment',
  ],
  SENIORCARE_LEADS_SUBMITTED_ENROLLMENT: [
    '/us-marketplace/conversion/seeker/sc/internal-lead/enrollment',
  ],
});

export const LEAD_SOURCES = Object.freeze({
  ENROLLMENT: 'ENROLLMENT',
  NTH_DAY: 'NTH DAY',
});

export const POST_A_JOB_ROUTES = Object.freeze({
  POST_A_JOB: '/post-a-job',
  RECURRING: '/recurring',
  ONE_TIME: '/onetime',
  PAY_FOR_CARE: '/pay-for-care',
  ABOUT_LOVED_ONE: '/about-loved-one',
  IDEAL_CAREGIVER: '/ideal-caregiver',
  CAREGIVERS_NEAR_YOU: '/caregivers-near-you',
});
export const SEEKER_ROUTES = Object.freeze({
  INDEX: '/seeker/sc',
  LOCATION: '/seeker/sc/location',
  CARE_TYPE: '/seeker/sc/care-type',
  HELP_TYPE: '/seeker/sc/help-type',
  RECAP: '/seeker/sc/recap',
  ACCOUNT_CREATION: '/seeker/sc/account-creation',
  ACCOUNT_CREATION_NAME: '/seeker/sc/account-creation/name',
  ACCOUNT_CREATION_PASSWORD: '/seeker/sc/account-creation/password',
});
export const SEEKER_IN_FACILITY_ROUTES = Object.freeze({
  CARE_TRUST: '/seeker/sc/in-facility/care-trust',
  WHO_NEEDS_CARE: '/seeker/sc/in-facility/who-needs-care',
  DESCRIBE_LOVED_ONE: '/seeker/sc/in-facility/describe-loved-one',
  OPTIMIZED_DESCRIBE_LOVED_ONE: '/seeker/sc/in-facility/optimized-describe-loved-one',
  HELP_TYPE: '/seeker/sc/in-facility/help-type',
  LOCATION: '/seeker/sc/in-facility/location',
  LOCATION_OPTIMIZED_FLOW: '/seeker/sc/in-facility/location-optimized-flow',
  RECAP: '/seeker/sc/in-facility/recap',
  ONE_PAGE_ACCOUNT_CREATION: '/seeker/sc/in-facility/one-page-account-creation',
  ACCOUNT_CREATION: '/seeker/sc/in-facility/account-creation',
  ACCOUNT_CREATION_DETAILS: '/seeker/sc/in-facility/account-creation/details',
  ACCOUNT_CREATION_RELATIONSHIP: '/seeker/sc/in-facility/account-creation/relationship',
  ACCOUNT_CREATION_PASSWORD: '/seeker/sc/in-facility/account-creation/password',
  COMMUNITY_LIST: '/seeker/sc/in-facility/community-list',
  AMENITIES: '/seeker/sc/in-facility/amenities',
  PAYMENT_TYPE: '/seeker/sc/in-facility/payment-type',
  PAYMENT_QUESTIONNAIRE: '/seeker/sc/in-facility/payment-questionnaire',
  OPTIONS: '/seeker/sc/in-facility/options',
  CARING_LEADS: '/seeker/sc/in-facility/caring-leads',
  PAYOFF: '/seeker/sc/in-facility/payoff',
  URGENCY: '/seeker/sc/in-facility/urgency',
  // POST-ENROLLMENT flow routes
  NURSING_OPTIONS: '/seeker/sc/in-facility/nursing-options',
  RECOMMENDED_ASSISTED: '/seeker/sc/in-facility/recommended-facility-assisted',
  RECOMMENDED_INDEPENDENT: '/seeker/sc/in-facility/recommended-facility-independent',
  RECOMMENDED_MEMORY_CARE: '/seeker/sc/in-facility/recommended-facility-memory-care',
  RECOMMENDED_NURSING_HOME: '/seeker/sc/in-facility/recommended-facility-nursing-home',
  RECOMMENDED_NURSING_HOME_IN_FACILITY:
    '/seeker/sc/in-facility/recommended-facility-nursing-home-in-facility',
  NO_INVENTORY: '/seeker/sc/in-facility/no-inventory',
  NO_COMMUNITIES_BY_COVERING_COST: '/seeker/sc/in-facility/no-communities-by-covering-cost',
  SENIOR_LIVING_OPTIONS: '/seeker/sc/in-facility/senior-living-options',
  RELATIONSHIP: '/seeker/sc/in-facility/relationship',
});
export const SEEKER_LEAD_CONNECT_ROUTES = Object.freeze({
  CAREGIVER_PROFILE: '/seeker/sc/lc/caregiver-profile',
  RECAP: '/seeker/sc/lc/recap',
  UPGRADE_OR_SKIP: '/seeker/sc/lc/upgrade-or-skip',
  SKIP_FOR_NOW: '/seeker/sc/lc/skip-for-now',
  MESSAGE_SENT: '/seeker/sc/lc/message-sent',
});
export const SEEKER_CC_LEAD_CONNECT_ROUTES = Object.freeze({
  CAREGIVER_LIST: '/seeker/cc/lc/caregiver-list',
  SKIP_FOR_NOW: '/',
  UPGRADE_AND_MESSAGE: '/seeker/cc/lc/upgrade-and-message',
});
export const PROVIDER_ROUTES = Object.freeze({
  INDEX: '/provider/sc',
  ZIP: '/provider/sc/zip',
  ACCOUNT_CREATION: '/provider/sc/account-creation',
  ACCOUNT_CREATED: '/provider/sc/account-created',
  AGE_RESTRICTION: '/provider/sc/age-restriction',
  TYPE_SPECIFIC: '/provider/sc/type-specific',
  EXPERIENCE_LEVEL: '/provider/sc/experience-level',
  PROFILE: '/provider/sc/profile',
  PAY_RANGE: '/provider/sc/pay-range',
  JOB_TYPE: '/provider/sc/job-type',
  HEADLINE_BIO: '/provider/sc/headline-bio',
  PHOTO: '/provider/sc/photo',
  JOBS_MATCHING: '/provider/sc/jobs-matching',
  AVAILABILITY: '/provider/sc/availability',
});
export const PROVIDER_CHILD_CARE_ROUTES = Object.freeze({
  INDEX: '/provider/cc',
  PREFERENCES: '/provider/cc/preferences',
  STEPS: '/provider/cc/steps',
  JOBS_MATCHING: '/provider/cc/jobs-matching',
  JOB_TYPES: '/provider/cc/job-types',
  LOCATION: '/provider/cc/location',
  ACCOUNT: '/provider/cc/account',
  PHOTO: '/provider/cc/photo',
  JOBS: '/provider/cc/jobs',
  AVAILABILITY: '/provider/cc/availability',
  PROFILE: '/provider/cc/profile',
  BIO: '/provider/cc/bio',
  APP_DOWNLOAD: '/provider/cc/app-download',
  WELCOME_BACK: '/provider/cc/welcome-back',
});

export const SEEKER_CHILD_CARE_ROUTES = Object.freeze({
  INDEX: '/seeker/cc',
  CARE_LOCATION: '/seeker/cc/care-location',
  CARE_DATE: '/seeker/cc/v2/care-date',
  CARE_KIND: '/seeker/cc/v2/care-kind',
  CARE_WHO: '/seeker/cc/v2/care-who',
  ADDITIONAL_SUPPORT: '/seeker/cc/v2/additional-support',
  ACCOUNT_CREATION_EMAIL: '/seeker/cc/v2/account-creation/email',
  ACCOUNT_CREATION_NAME: '/seeker/cc/v2/account-creation/name',
  ACCOUNT_PASSWORD: '/seeker/cc/v2/account-creation/password',
  ACCOUNT_CREATION_CONFIRMATION: '/seeker/cc/account-confirmation',
  ACCOUNT_CREATION: '/seeker/cc/account-creation',
  ACCOUNT_CREATION_DETAILS: '/seeker/cc/account-creation/details',
  RECAP: '/seeker/cc/recap',
});

export const SEEKER_HOUSEKEEPING_ROUTES = Object.freeze({
  INDEX: '/seeker/hk',
  HOUSEKEEPING_DATE: '/seeker/hk/housekeeping-date',
  HOUSEKEEPER_WHAT: '/seeker/hk/housekeeper-what',
  ACCOUNT_CREATION_EMAIL: '/seeker/hk/account-creation/email',
  ACCOUNT_CREATION_NAME: '/seeker/hk/account-creation/name',
  ACCOUNT_PASSWORD: '/seeker/hk/account-creation/password',
  WHAT_TASKS: '/seeker/hk/what-tasks',
  JOB_SCHEDULE: '/seeker/hk/schedule',
  LAST_STEP: '/seeker/hk/last-step',
  RECAP: '/seeker/hk/recap',
  LOCATION: '/seeker/hk/location',
});

export const SEEKER_DAYCARE_CHILD_CARE_ROUTES = Object.freeze({
  LOCATION: '/seeker/cc/care-location',
  DATE: '/seeker/cc/care-date',
  KIND: '/seeker/cc/care-kind',
  WHO: '/seeker/dc/day-center-who-needs-care',
  FREQUENCY: '/seeker/dc/care-frequency',
  DATE_TIME: '/seeker/dc/care-day-time',
  START_DATE: '/seeker/dc/care-start-date',
  ADDITIONAL_INFORMATION: '/seeker/dc/additional-information',
  MATCH: '/seeker/dc/match-daycare',
  ACCOUNT_CREATION: '/seeker/dc/account-creation/daycare',
  ACCOUNT_PASSWORD: '/seeker/dc/account-creation/password',
  RECOMMENDATIONS: '/seeker/dc/recommendations',
  TOURS_REQUESTED: '/seeker/dc/tours-requested',
});

export const AUTH_ROUTES = Object.freeze({
  LOGOUT: (returnUrl: string) =>
    `/vis/auth/oidc/logout${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`,
  AUTHERROR: '/auth-error',
});

export const LTCG_ROUTES = Object.freeze({
  CONTACT_INFO: '/ltcg/contact-info',
  DETAILS_ABOUT_YOURSELF: '/ltcg/details-about-yourself',
  INSURANCE_CARRIER: '/ltcg/insurance-carrier',
  NO_INSURANCE: '/ltcg/no-insurance',
  ELIGIBLE_POLICY: '/ltcg/eligible-policy',
  POLICY_INELIGIBLE: '/ltcg/policy-ineligible',
  LOCATION_INELIGIBLE: '/ltcg/location-ineligible',
  WHERE: '/ltcg/where',
  WHEN: '/ltcg/when',
  SUCCESS: '/ltcg/success',
});

export const LTCG_INELIGIBLES_ACRONYM_STATES = Object.freeze({
  CA: 'CA',
  IL: 'IL',
  CO: 'CO',
  DE: 'DE',
  LA: 'LA',
  MA: 'MA',
  WI: 'WI',
  PR: 'PR',
});

export const SHORT_ENROLLMENT_ROUTES = Object.freeze({
  INDEX: '/short-enrollment',
  PASSWORD: '/short-enrollment/password',
});

export const FLOWS = Object.freeze({
  SEEKER_IN_FACILITY: {
    name: 'SEEKER_IN_FACILITY',
    path: '/seeker/sc/in-facility',
  },
  SEEKER: {
    name: 'SEEKER',
    path: '/seeker/sc',
  },
  SEEKER_INSTANT_BOOK_SHORT: {
    name: 'SEEKER_INSTANT_BOOK_SHORT',
    path: '/seeker/ib/short',
  },
  SEEKER_INSTANT_BOOK: {
    name: 'SEEKER_INSTANT_BOOK',
    path: '/seeker/ib',
  },
  SEEKER_CHILD_CARE: {
    name: 'SEEKER_CHILD_CARE',
    path: '/seeker/cc',
  },
  SEEKER_DAYCARE_CHILD_CARE: {
    name: 'SEEKER_DAYCARE_CHILD_CARE',
    path: '/seeker/dc',
  },
  PROVIDER: {
    name: 'PROVIDER',
    path: '/provider/sc',
  },
  CHILD_CARE_PROVIDER: {
    name: 'CHILD_CARE_PROVIDER',
    path: '/provider/cc',
  },
  SEEKER_HOUSEKEEPING: {
    name: 'SEEKER_HOUSEKEEPING',
    path: '/seeker/hk',
  },
  SEEKER_PET_CARE: {
    name: 'SEEKER_PET_CARE',
    path: '/seeker/pc',
  },
  SEEKER_TUTORING: {
    name: 'SEEKER_TUTORING',
    path: '/seeker/tu',
  },
  LTCG: {
    name: 'LTCG',
    path: '/ltcg',
  },
});

export const SEEKER_CHILD_CARE_PAJ_ROUTES = Object.freeze({
  JOB_SCHEDULE: '/seeker/cc/schedule',
  CAREGIVER_ATTRIBUTES: '/seeker/cc/attributes',
  IDEAL_CAREGIVER: '/seeker/cc/ideal-caregiver',
  LAST_STEP: '/seeker/cc/last-step',
  WHAT_NEXT: '/seeker/cc/what-next',
});

export const SEEKER_PET_CARE_ROUTES = Object.freeze({
  INDEX: '/seeker/pc',
  CARE_DATE: '/seeker/pc/care-date',
  ABOUT_PETS: '/seeker/pc/about-pets',
  SERVICE_TYPE: '/seeker/pc/service-type',
  LOCATION: '/seeker/pc/location',
  RECAP: '/seeker/pc/recap',
  ACCOUNT_CREATION_EMAIL: '/seeker/pc/account-creation/email',
  ACCOUNT_CREATION_NAME: '/seeker/pc/account-creation/name',
  ACCOUNT_PASSWORD: '/seeker/pc/account-creation/password',
});

export const SEEKER_PET_CARE_PAJ_ROUTES = Object.freeze({
  JOB_SCHEDULE: '/seeker/pc/schedule',
  LAST_STEP: '/seeker/pc/last-step',
});

export const SEEKER_TUTORING_ROUTES = Object.freeze({
  INDEX: '/seeker/tu',
  WHAT_LEVEL: '/seeker/tu/what-level',
  CARE_DATE: '/seeker/tu/care-date',
  WHICH_SUBJECTS: '/seeker/tu/which-subjects',
  LOCATION: '/seeker/tu/location',
  RECAP: '/seeker/tu/recap',
  VIRTUAL_OR_IN_PERSON: '/seeker/tu/virtual-or-in-person',
  ACCOUNT_CREATION_EMAIL: '/seeker/tu/account-creation/email',
  ACCOUNT_CREATION_NAME: '/seeker/tu/account-creation/name',
  ACCOUNT_PASSWORD: '/seeker/tu/account-creation/password',
});

export const SEEKER_TUTORING_PAJ_ROUTES = Object.freeze({
  JOB_SCHEDULE: '/seeker/tu/schedule',
  GOALS: '/seeker/tu/goals',
  LAST_STEP: '/seeker/tu/last-step',
});

export const SEEKER_SPLIT_ACCOUNT_DC = Object.freeze({
  EMAIL: '/seeker/dc/account-creation/email',
  NAME: '/seeker/dc/account-creation/name',
});

export const SEEKER_INSTANT_BOOK_ROUTES = Object.freeze({
  WHO: '/seeker/ib/care-who',
  WHAT_DAY_AND_TIME: '/seeker/ib/what-day-and-time',
  ADDRESS: '/seeker/ib/address',
  PAY_FOR_CARE: '/seeker/ib/pay-for-care',
  IS_HOME_ADDRESS: '/seeker/ib/is-home-address',
  HOME_ADDRESS: '/seeker/ib/home-address',
  NAME: '/seeker/ib/name',
  RECAP: '/seeker/ib/recap',
  LAST_STEP: '/seeker/ib/last-step',
});

export const SEEKER_INSTANT_BOOK_SHORT_ROUTES = Object.freeze({
  EMAIL: '/seeker/ib/short/email',
  NAME: '/seeker/ib/short/name',
});

// key values aligned with ServiceType values (from enrollment-mfe/src/__generated__/globalTypes.ts)
export const VERTICALS_NAMES = Object.freeze({
  CHILD_CARE: 'Childcare',
  SENIOR_CARE: 'Seniorcare',
  HOUSEKEEPING: 'Housekeeping',
  PET_CARE: 'Petcare',
  TUTORING: 'Tutoring',
});

export const VERTICALS_SELECT_LABELS = Object.freeze({
  CC: 'Child care',
  SC: 'Senior care',
  HK: 'Housekeeping',
  PC: 'Petcare',
  TU: 'Tutoring',
  DC: 'Daycare',
});

export const VERTICALS_NAMES_TO_ABBREVIATION = Object.freeze({
  [VERTICALS_NAMES.CHILD_CARE]: 'CC',
  [VERTICALS_NAMES.SENIOR_CARE]: 'SC',
  [VERTICALS_NAMES.HOUSEKEEPING]: 'HK',
  [VERTICALS_NAMES.PET_CARE]: 'PC',
  [VERTICALS_NAMES.TUTORING]: 'TU',
  Daycare: 'DC',
});

// TODO: Use generated types in SC-400
/**
 * Type of additional details about yourself
 * Provider profile
 */
export enum AdditionalDetails {
  DEMENTIA = 'DEMENTIA',
  HOSPICE_SERVICES = 'HOSPICE_SERVICES',
  CERTIFIED_HOME_HEALTH = 'CERTIFIED_HOME_HEALTH',
  CERTIFIED_NURSING_ASSISTANT = 'CERTIFIED_NURSING_ASSISTANT',
  REGISTERED_NURSE = 'REGISTERED_NURSE',
  CPR = 'CPR_TRAINING',
  NON_SMOKER = 'NON_SMOKER',
  HAVE_A_CAR = 'HAVE_A_CAR',
  CONFORTABLE_WITH_PETS = 'CONFORTABLE_WITH_PETS',
  COLLEGE_DEGREE = 'COLLEGE_DEGREE',
}

interface IFlowRoutes {
  [key: string]: {
    [key: string]: number;
  };
}

// order matters so keep these in order
export const FLOW_ROUTES_AND_STEP_NUMBERS: IFlowRoutes = {
  SEEKER: {
    [SEEKER_ROUTES.INDEX]: 1,
    [SEEKER_ROUTES.HELP_TYPE]: 2,
    [SEEKER_ROUTES.LOCATION]: 3,
    [SEEKER_ROUTES.RECAP]: 3,
    [SEEKER_ROUTES.ACCOUNT_CREATION]: 4,
    [SEEKER_ROUTES.ACCOUNT_CREATION_NAME]: 5,
    [SEEKER_ROUTES.ACCOUNT_CREATION_PASSWORD]: 6,
  },
  SEEKER_IN_FACILITY: {
    [SEEKER_ROUTES.INDEX]: 1,
    [SEEKER_IN_FACILITY_ROUTES.CARE_TRUST]: 1,
    [SEEKER_IN_FACILITY_ROUTES.LOCATION_OPTIMIZED_FLOW]: 1, // enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations
    [SEEKER_IN_FACILITY_ROUTES.WHO_NEEDS_CARE]: 2,
    [SEEKER_IN_FACILITY_ROUTES.URGENCY]: 2, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE]: 3,
    [SEEKER_IN_FACILITY_ROUTES.HELP_TYPE]: 4,
    [SEEKER_IN_FACILITY_ROUTES.NURSING_OPTIONS]: 4, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.LOCATION]: 5,
    [SEEKER_IN_FACILITY_ROUTES.OPTIMIZED_DESCRIBE_LOVED_ONE]: 5, // used in optimized-flow FF
    [SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED]: 5, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_INDEPENDENT]: 5, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_MEMORY_CARE]: 5, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME]: 5, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.SENIOR_LIVING_OPTIONS]: 5, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE]: 6,
    [SEEKER_IN_FACILITY_ROUTES.AMENITIES]: 6, // enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations
    [SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE]: 6,
    [SEEKER_IN_FACILITY_ROUTES.RELATIONSHIP]: 7, // used in enrollment-mfe-in-facility-flow-optimization
    [SEEKER_IN_FACILITY_ROUTES.RECAP]: 8,
    [SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION]: 9,
    [SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_DETAILS]: 10,
    [SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_RELATIONSHIP]: 11, // used in enrollment-mfe-in-facility-flow-optimization
    [SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_PASSWORD]: 12,
    [SEEKER_IN_FACILITY_ROUTES.OPTIONS]: 14,
    [SEEKER_IN_FACILITY_ROUTES.CARING_LEADS]: 15,
    [SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST]: 15,
    [SEEKER_IN_FACILITY_ROUTES.PAYOFF]: 16,
    [SEEKER_IN_FACILITY_ROUTES.NO_INVENTORY]: 17, // used in post-enrollment flow
    [SEEKER_IN_FACILITY_ROUTES.NO_COMMUNITIES_BY_COVERING_COST]: 17, // used in post-enrollment flow
  },

  SEEKER_INSTANT_BOOK_SHORT: {
    [SEEKER_INSTANT_BOOK_SHORT_ROUTES.EMAIL]: 4,
    [SEEKER_INSTANT_BOOK_SHORT_ROUTES.NAME]: 5,
  },

  SEEKER_INSTANT_BOOK: {
    [SEEKER_INSTANT_BOOK_ROUTES.WHO]: 4,
    [SEEKER_INSTANT_BOOK_ROUTES.WHAT_DAY_AND_TIME]: 5,
    [SEEKER_INSTANT_BOOK_ROUTES.PAY_FOR_CARE]: 6,
    [SEEKER_INSTANT_BOOK_ROUTES.ADDRESS]: 7,
    [SEEKER_INSTANT_BOOK_ROUTES.IS_HOME_ADDRESS]: 8,
    [SEEKER_INSTANT_BOOK_ROUTES.HOME_ADDRESS]: 9,
    [SEEKER_INSTANT_BOOK_ROUTES.NAME]: 9,
    [SEEKER_INSTANT_BOOK_ROUTES.LAST_STEP]: 10,
  },
  SEEKER_CHILD_CARE: {
    [SEEKER_CHILD_CARE_ROUTES.CARE_LOCATION]: 1,
    [SEEKER_CHILD_CARE_ROUTES.INDEX]: 1,
    [SEEKER_CHILD_CARE_ROUTES.CARE_DATE]: 2,
    [SEEKER_CHILD_CARE_ROUTES.CARE_KIND]: 3,
    [SEEKER_CHILD_CARE_ROUTES.CARE_WHO]: 4,
    [SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT]: 5,
    [SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL]: 6,
    [SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_NAME]: 7,
    [SEEKER_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD]: 8,
  },

  SEEKER_HOUSEKEEPING: {
    [SEEKER_HOUSEKEEPING_ROUTES.INDEX]: 1,
    [SEEKER_HOUSEKEEPING_ROUTES.HOUSEKEEPING_DATE]: 1,
    [SEEKER_HOUSEKEEPING_ROUTES.HOUSEKEEPER_WHAT]: 2,
    [SEEKER_HOUSEKEEPING_ROUTES.WHAT_TASKS]: 3,
    [SEEKER_HOUSEKEEPING_ROUTES.LOCATION]: 4,
    [SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_CREATION_EMAIL]: 5,
    [SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_CREATION_NAME]: 6,
    [SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_PASSWORD]: 7,
  },

  SEEKER_PET_CARE: {
    [SEEKER_PET_CARE_ROUTES.INDEX]: 1,
    [SEEKER_PET_CARE_ROUTES.CARE_DATE]: 1,
    [SEEKER_PET_CARE_ROUTES.ABOUT_PETS]: 2,
    [SEEKER_PET_CARE_ROUTES.SERVICE_TYPE]: 3,
    [SEEKER_PET_CARE_ROUTES.LOCATION]: 4,
    [SEEKER_PET_CARE_ROUTES.ACCOUNT_CREATION_EMAIL]: 5,
    [SEEKER_PET_CARE_ROUTES.ACCOUNT_CREATION_NAME]: 6,
    [SEEKER_PET_CARE_ROUTES.ACCOUNT_PASSWORD]: 7,
  },

  SEEKER_DAYCARE_CHILD_CARE: {
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.LOCATION]: 1,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.DATE]: 2,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.KIND]: 3,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.WHO]: 4,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.FREQUENCY]: 5,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.DATE_TIME]: 6,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.START_DATE]: 7,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.ADDITIONAL_INFORMATION]: 8,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.MATCH]: 9,
    [SEEKER_SPLIT_ACCOUNT_DC.EMAIL]: 10,
    [SEEKER_SPLIT_ACCOUNT_DC.NAME]: 11,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_CREATION]: 10,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD]: 11,
    [SEEKER_DAYCARE_CHILD_CARE_ROUTES.RECOMMENDATIONS]: 12,
  },
  SEEKER_TUTORING: {
    [SEEKER_TUTORING_ROUTES.INDEX]: 1,
    [SEEKER_TUTORING_ROUTES.WHAT_LEVEL]: 1,
    [SEEKER_TUTORING_ROUTES.CARE_DATE]: 2,
    [SEEKER_TUTORING_ROUTES.WHICH_SUBJECTS]: 3,
    [SEEKER_TUTORING_ROUTES.LOCATION]: 4,
    [SEEKER_TUTORING_ROUTES.VIRTUAL_OR_IN_PERSON]: 5,
    [SEEKER_TUTORING_ROUTES.ACCOUNT_CREATION_EMAIL]: 6,
    [SEEKER_TUTORING_ROUTES.ACCOUNT_CREATION_NAME]: 7,
    [SEEKER_TUTORING_ROUTES.ACCOUNT_PASSWORD]: 8,
  },
  PROVIDER_ACCOUNT_CREATION: {
    [PROVIDER_ROUTES.INDEX]: 1,
    // [PROVIDER_ROUTES.ZIP]: 2,
    [PROVIDER_ROUTES.ACCOUNT_CREATION]: 2,
    [PROVIDER_ROUTES.ACCOUNT_CREATED]: 3,
  },
  PROVIDER_PROFILE_DETAILS: {
    [PROVIDER_ROUTES.INDEX]: 1,
    [PROVIDER_ROUTES.TYPE_SPECIFIC]: 1,
    [PROVIDER_ROUTES.EXPERIENCE_LEVEL]: 2,
    [PROVIDER_ROUTES.PROFILE]: 3,
    [PROVIDER_ROUTES.PAY_RANGE]: 4,
    [PROVIDER_ROUTES.JOB_TYPE]: 5,
    [PROVIDER_ROUTES.AVAILABILITY]: 6,
    [PROVIDER_ROUTES.HEADLINE_BIO]: 7,
    [PROVIDER_ROUTES.PHOTO]: 8,
    [PROVIDER_ROUTES.JOBS_MATCHING]: 9,
  },
  PROVIDER_CC_INFORMATIONAL_STEPS: {
    [PROVIDER_CHILD_CARE_ROUTES.STEPS]: 1,
    [PROVIDER_CHILD_CARE_ROUTES.JOBS]: 2,
  },
  PROVIDER_CC_ACCOUNT_CREATION: {
    [PROVIDER_CHILD_CARE_ROUTES.INDEX]: 1,
    [PROVIDER_CHILD_CARE_ROUTES.LOCATION]: 2,
    [PROVIDER_CHILD_CARE_ROUTES.ACCOUNT]: 3,
  },
  PROVIDER_CC_PROFILE_DETAILS: {
    [PROVIDER_CHILD_CARE_ROUTES.JOB_TYPES]: 1,
    [PROVIDER_CHILD_CARE_ROUTES.PREFERENCES]: 1,
    [PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY]: 2,
    [PROVIDER_CHILD_CARE_ROUTES.PROFILE]: 3,
    [PROVIDER_CHILD_CARE_ROUTES.BIO]: 4,
    [PROVIDER_CHILD_CARE_ROUTES.PHOTO]: 5,
  },
  LTCG: {
    [LTCG_ROUTES.INSURANCE_CARRIER]: 1,
    [LTCG_ROUTES.NO_INSURANCE]: 1,
    [LTCG_ROUTES.ELIGIBLE_POLICY]: 2,
    [LTCG_ROUTES.POLICY_INELIGIBLE]: 2,
    [LTCG_ROUTES.WHERE]: 3,
    [LTCG_ROUTES.WHEN]: 4,
    [LTCG_ROUTES.LOCATION_INELIGIBLE]: 4,
    [LTCG_ROUTES.DETAILS_ABOUT_YOURSELF]: 5,
    [LTCG_ROUTES.CONTACT_INFO]: 6,
    [LTCG_ROUTES.SUCCESS]: 7,
  },
};

export const PROVIDER_CC_FLOW_NAMES = [
  'PROVIDER_CC_INFORMATIONAL_STEPS',
  'PROVIDER_CC_ACCOUNT_CREATION',
  'PROVIDER_CC_PROFILE_DETAILS',
];
export const CZEN_BASE_PATH = '/';
export const CZEN_MHP = '/member/myAccount.do';
export const CZEN_MW_UPGRADE_PATH = '/mobile/seeker/upgradeMembership.do';
export const CZEN_MW_ENROLL_FLOW = 'enrollFlow=true';
export const CZEN_BACKGROUND_CHECK = '/rmember/enroll/resumeProviderEnrollment?serviceId=SENIRCARE';
export const CZEN_BACKGROUND_CHECK_CC =
  '/rmember/enroll/resumeProviderEnrollment?serviceId=CHILDCARE';
export const CZEN_DESKTOP_UPGRADE_PATH = '/dwb/upgrade/viewPage';
export const CZEN_DESKTOP_ENROLL_SEEKER_PATH = (subService: string, zip: string) =>
  `/dwb/visitor/enrollSeeker?memberType=seeker&serviceId=CHILDCARE&subService=${subService}&comeFrom=costOfChildcare&zip=${zip}&numOfInfants=0&numOfToddlers=0&numOfPreSchoolers=1&numOfPreKindergarteners=0`;
export const CZEN_MOBILE_NTH_DAY_RATE_CARD_PATH = '/mwb/seeker/upgrade/pricingPlans';
export const CZEN_DESKTOP_NTH_DAY_RATE_CARD_PATH =
  '/seeker/upgradeMembershipPlanActual.do?pt=stepId%3D0%26flowId%3DSEEKER_UPGRADE_UNLIM_PREF_PLUS_BGC_NEW_DESIGN%26&progressBarState=2.0';
export const CZEN_MW_SC_PROVIDER_SEARCH_PATH = (zip: string) =>
  `/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=${zip}&overrideMfeRedirect=true`;
export const CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH = (zip: string, searchRadius: number) =>
  `/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=${zip}&milesFromZipCode=${searchRadius}&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true`;
export const CZEN_BLOCKLIST_PATH = '/visitor/bLMemberErrorPage.do';
export const CZEN_VISITOR_COOKIE_KEY = 'n_vis';
export const CZEN_SESSION_COOKIE_KEY = 'csc';
export const CZEN_JSESSIONID_COOKIE_KEY = 'JSESSIONID';
export const CZEN_SECURE_AUTH_COOKIE_KEY = 'acs';
export const CSC_SESSION_COOKIE_NAME = 'csc-session';
export const CZEN_MEMBER_VERIFY_COOKIE_KEY = 'mc_verify';
export const CZEN_MW_RATE_CARD = '/mwb/test/seeker/pricingSchemeTest';
export const LEAD_AND_CONNECT_EXTERNAL_ENTRY =
  '/seeker/sc/lc/caregiver-profile/routing-in-progress';
export const CZEN_MW_SKIP_RATE_CARD_SC = '/mwb/member/sitterSearchTest?serviceId=SENIRCARE';
export const CZEN_DESKTOP_SKIP_RATE_CARD_SC =
  '/visitor/captureSearchBar.do?sitterService=seniorCare';
export const LOCAL_STORAGE_ERROR_TAG = 'LocalStorageError';
export const LOCAL_STORAGE_STATE_KEY = 'enrollment-mfe-state';
export const LOCAL_STORAGE_VERIFICATION_KEY = 'LocalStorageVerification';
export const LOCAL_STORAGE_VERIFICATION_VALUE = 'Verified';
export const CLIENT_SIDE_ERROR_TAG = 'ClientSideError';
export const CURRENT_STATE_MAJOR_VERSION = '2';
export const CURRENT_STATE_MINOR_VERSION = '0';
export const CURRENT_STATE_PATCH_VERSION = '0';
export const CURRENT_STATE_VERSION = `${CURRENT_STATE_MAJOR_VERSION}.${CURRENT_STATE_MINOR_VERSION}.${CURRENT_STATE_PATCH_VERSION}`;
// This constant considers paddings and margins as calc(100vh - (56px header + 24 + 24 paddings))
export const HEIGHT_MINUS_TOOLBAR = 'calc(100vh - 104px)';
export const ENROLLMENT_SESSION_ID_COOKIE_NAME = 'enrollment-session-id';
export const EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR =
  "Please don't use your name or email address in your password.";
export const UPGRADE_MEMBERSHIP_PLAN = (zipcode: string) =>
  `https://www.care.com/seeker/upgradeMembershipPlanActual.do?pt=stepId%3D0%26flowId%3DSEEKER_UPGRADE_UNLIM_PREF_PLUS_BGC_NEW_DESIGN%26&progressBarState=2.0&comeFrom=GLOBAL_HEADER&zip=${zipcode}`;
export const FEATURE_FLAG_OVERRIDE_COOKIE_NAME = 'ffov';
export const GET_TOP_CAREGIVERS_NO_RESULTS_MSG = 'GetTopCaregiversNoProfilesReturned';
export const NUMBER_OF_CAREGIVERS_TO_DISPLAY_CAREGIVERS_NEAR_YOU = 6;
export const NUMBER_OF_LEAD_CONNECT_RESULTS = (getFifteenCaregivers: boolean) =>
  getFifteenCaregivers ? 15 : 10;
export const LEAD_CONNECT_CZEN_REDIRECT_MSG = 'LeadAndConnectCzenRedirect';
export const CC_PRE_RATE_CARD_PATH = (czenGeneral: string) =>
  `${czenGeneral}/vis/auth/login?forwardUrl=${encodeURIComponent(
    `${czenGeneral}/app/ratecard/childcare/pre-rate-card?enrollFlow=true`
  )}`;
export const CC_RATE_CARD_PATH = '/app/ratecard/childcare/rate-card?enrollFlow=true';
export const PC_PRE_RATE_CARD_PATH = (czenGeneral: string) =>
  `${czenGeneral}/vis/auth/login?forwardUrl=${encodeURIComponent(
    `${czenGeneral}/app/ratecard/petcare/pre-rate-card?enrollFlow=true`
  )}`;
export const HK_PRE_RATE_CARD_PATH = (czenGeneral: string) =>
  `${czenGeneral}/vis/auth/login?forwardUrl=${encodeURIComponent(
    `${czenGeneral}/app/ratecard/housekeeping/pre-rate-card?enrollFlow=true`
  )}`;
export const TUTORING_PRE_RATE_CARD_PATH = (czenGeneral: string) =>
  `${czenGeneral}/vis/auth/login?forwardUrl=${encodeURIComponent(
    `${czenGeneral}/app/ratecard/tutoring/pre-rate-card?enrollFlow=true`
  )}`;
export const AGE_RANGES = {
  newborn: 'NEWBORN',
  toddler: 'TODDLER',
  earlySchool: 'EARLY_SCHOOL',
  elementarySchool: 'ELEMENTARY_SCHOOL',
  teen: 'TEEN',
};
export const MHP_FAVORITES_PATH = '/ppr.do#3';
export const LEAD_CONNECT_ROUTING_STEP = 'routing-in-progress';
export const SIX_MONTHS_IN_DAYS = 180;
export const CAREGIVERS_NEAR_YOU_REDIRECTION_TIMEOUT = 2300;

export type VerticalsAbbreviation = 'SC' | 'CC' | 'HK' | 'PC' | 'TU' | 'DC' | 'IB';

export enum CARE_DATES {
  RIGHT_NOW = 'RIGHT_NOW',
  WITHIN_A_WEEK = 'WITHIN_A_WEEK',
  IN_1_2_MONTHS = 'IN_1_2_MONTHS',
  JUST_BROWSING = 'JUST_BROWSING',
}

export enum CARE_DATE_LABELS {
  RIGHT_NOW = 'Right now',
  WITHIN_A_WEEK = 'Within a week',
  IN_1_2_MONTHS = 'In 1-2 months',
  JUST_BROWSING = 'Just browsing',
}

export enum DAY_CARE_DATE_LABELS {
  IMMEDIATELY = 'Immediately',
  WITHIN_A_WEEK = 'Within a week',
  IN_1_2_MONTHS = 'In 1-2 months',
  NO_RUSH = 'No rush',
}

export const PASSWORD_RULES = [
  'At least 6 characters',
  'Can’t contain your first, last name or email',
  'Can’t be a sequence of a single value (e.g “aaaaaa”)',
  'Can’t be a repeatable sequence (e.g “abcabcabc”)',
];

export const CC_REBRANDED_PATHS = ['seeker/cc', 'seeker/dc'];

export const JOB_MFE_CC_PAJ = '/app/job/cc?flow=ENROLLMENT';
export const JOB_MFE_HK_PAJ = '/app/job/hk?flow=ENROLLMENT';
export const JOB_MFE_PC_PAJ = '/app/job/pc?flow=ENROLLMENT';
export const JOB_MFE_TU_PAJ = '/app/job/tu?flow=ENROLLMENT';
export const JOB_MFE_DC_PAJ_NTH_DAY = '/app/job/dc';
export const JOB_MFE_CC_PAJ_NTH_DAY = '/app/job/cc';

export const PAJ_NTH_DAY_PC = (zipcode: string) =>
  `/seeker/nthDayPAJPostJobV2.do?pt=stepId=0&serviceId=PETCAREXX&flowId=SEEKER_NTH_DAY_PAJ_API_TEST_FLOW&progressBarState=1.0&zip=${zipcode}&careGiverType=PCCGTYP001`;
export const PAJ_NTH_DAY_PC_MW = '/mwb/job/postController?serviceId=PETCAREXX';

export const PAJ_NTH_DAY_HK = (zipcode: string) =>
  `/seeker/nthDayPAJPostJobV2.do?pt=stepId=0&serviceId=HOUSEKEEP&flowId=SEEKER_NTH_DAY_PAJ_API_TEST_FLOW&progressBarState=1.0&zip=${zipcode}`;
export const PAJ_NTH_DAY_HK_MW = '/mwb/job/postController?serviceId=HOUSEKEEP';

export const PAJ_NTH_DAY_SC = (zipcode: string) =>
  `/seeker/nthDayPAJPostJobV2.do?pt=stepId=0&serviceId=SENIRCARE&flowId=SEEKER_NTH_DAY_PAJ_API_TEST_FLOW&progressBarState=1.0&zip=${zipcode}&careGiverType=SCCGTYP001`;
export const PAJ_NTH_DAY_SC_MW = '/mwb/job/postController?serviceId=SENIRCARE';

export const PAJ_NTH_DAY_TU = (zipcode: string) =>
  `/seeker/nthDayPAJPostJobV2.do?pt=stepId=0&serviceId=TUTORINGX&flowId=SEEKER_NTH_DAY_PAJ_API_TEST_FLOW&progressBarState=1.0&zip=${zipcode}`;
export const PAJ_NTH_DAY_TU_MW = '/mwb/job/postController?serviceId=TUTORINGX';

export const BOOKING_MFE_IB_ASSESSMENT = '/app/booking/otc/careNeeds';

export const COVID_VACCINATION_OPTIONS = [
  {
    indicator: 'Yes',
    label: '',
    value: 'yes',
  },
  {
    indicator: 'No',
    label: '',
    value: 'no',
  },
];

export const COOKIE_FLOW_LOG_TAG = 'CookieFlow';
export const TERMS_OF_USE_URL = 'https://www.care.com/terms-of-use-popup-p1030.html';
export const PRIVACY_POLICY_URL = 'https://www.care.com/privacy-policy-popup-p1031.html';

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const ISO_FORMAT = 'YYYY-MM-DD';

export const SEM_CHILDCARE = 'semChildcare';
