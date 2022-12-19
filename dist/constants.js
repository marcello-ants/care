"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CZEN_MEMBER_VERIFY_COOKIE_KEY = exports.CSC_SESSION_COOKIE_NAME = exports.CZEN_SECURE_AUTH_COOKIE_KEY = exports.CZEN_JSESSIONID_COOKIE_KEY = exports.CZEN_SESSION_COOKIE_KEY = exports.CZEN_VISITOR_COOKIE_KEY = exports.TEST_COOKIE_KEY = exports.CZEN_BLOCKLIST_PATH = exports.CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH = exports.CZEN_MW_SC_PROVIDER_SEARCH_PATH = exports.CZEN_DESKTOP_NTH_DAY_RATE_CARD_PATH = exports.CZEN_MOBILE_NTH_DAY_RATE_CARD_PATH = exports.CZEN_DESKTOP_ENROLL_SEEKER_PATH = exports.CZEN_DESKTOP_UPGRADE_PATH = exports.CZEN_BACKGROUND_CHECK_CC = exports.CZEN_BACKGROUND_CHECK = exports.CZEN_MW_ENROLL_FLOW = exports.CZEN_MW_UPGRADE_PATH = exports.CZEN_BASE_PATH = exports.PROVIDER_CC_FLOW_NAMES = exports.FLOW_ROUTES_AND_STEP_NUMBERS = exports.AdditionalDetails = exports.VERTICALS_NAMES = exports.ENROLLMENT_SOURCE = exports.SEEKER_TUTORING_PAJ_ROUTES = exports.SEEKER_TUTORING_ROUTES = exports.SEEKER_PET_CARE_PAJ_ROUTES = exports.SEEKER_PET_CARE_ROUTES = exports.SEEKER_CHILD_CARE_PAJ_ROUTES = exports.FLOWS = exports.LTCG_INELIGIBLES_ACRONYM_STATES = exports.LTCG_ROUTES = exports.AUTH_ROUTES = exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES = exports.SEEKER_HOUSEKEEPING_ROUTES = exports.SEEKER_CHILD_CARE_ROUTES = exports.PROVIDER_CHILD_CARE_ROUTES = exports.PROVIDER_ROUTES = exports.SEEKER_CC_LEAD_CONNECT_ROUTES = exports.SEEKER_LEAD_CONNECT_ROUTES = exports.SEEKER_IN_FACILITY_ROUTES = exports.SEEKER_ROUTES = exports.POST_A_JOB_ROUTES = exports.LEAD_SOURCES = exports.TEALIUM_SLOTS = exports.TEALIUM_EVENTS = exports.WINDOW_SENTRY_TRACE_TRANSACTION_KEY = exports.SERVER_FEATURE_FLAGS = exports.CLIENT_FEATURE_FLAGS = exports.SKIP_AUTH_CONTEXT_KEY = void 0;
exports.appDownloadLink = exports.ANDROID_APP_STORE_ID = exports.APP_STORE_ID = exports.LEAD_CONNECT_MFE_URL = exports.COVID_VACCINATION_OPTIONS = exports.JOB_MFE_TU_PAJ = exports.JOB_MFE_PC_PAJ = exports.JOB_MFE_HK_PAJ = exports.JOB_MFE_CC_PAJ = exports.CC_REBRANDED_PATHS = exports.PASSWORD_RULES = exports.CareDateLabels = exports.CareDate = exports.CAREGIVERS_NEAR_YOU_REDIRECTION_TIMEOUT = exports.SIX_MONTHS_IN_DAYS = exports.LEAD_CONNECT_ROUTING_STEP = exports.MHP_FAVORITES_PATH = exports.AGE_RANGES = exports.TUTORING_PRE_RATE_CARD_PATH = exports.HK_PRE_RATE_CARD_PATH = exports.PC_PRE_RATE_CARD_PATH = exports.CC_RATE_CARD_PATH = exports.CC_PRE_RATE_CARD_PATH = exports.SC_PRE_RATE_CARD_MFE_PATH = exports.LEAD_CONNECT_CZEN_REDIRECT_MSG = exports.NUMBER_OF_LEAD_CONNECT_RESULTS = exports.NUMBER_OF_CAREGIVERS_TO_DISPLAY_CAREGIVERS_NEAR_YOU = exports.GET_TOP_CAREGIVERS_NO_RESULTS_MSG = exports.FEATURE_FLAG_OVERRIDE_COOKIE_NAME = exports.UPGRADE_MEMBERSHIP_PLAN = exports.EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR = exports.ENROLLMENT_SESSION_ID_COOKIE_NAME = exports.HEIGHT_MINUS_TOOLBAR = exports.CURRENT_STATE_VERSION = exports.CURRENT_STATE_PATCH_VERSION = exports.CURRENT_STATE_MINOR_VERSION = exports.CURRENT_STATE_MAJOR_VERSION = exports.CLIENT_SIDE_ERROR_TAG = exports.LOCAL_STORAGE_VERIFICATION_VALUE = exports.LOCAL_STORAGE_VERIFICATION_KEY = exports.LOCAL_STORAGE_STATE_KEY = exports.LOCAL_STORAGE_ERROR_TAG = exports.CZEN_DESKTOP_SKIP_RATE_CARD_SC = exports.CZEN_MW_SKIP_RATE_CARD_SC = exports.LEAD_AND_CONNECT_EXTERNAL_ENTRY = exports.CZEN_MW_RATE_CARD = void 0;
exports.SKIP_AUTH_CONTEXT_KEY = 'skipAuth';
// Sorted alphabetically to ease adding/removing/finding constants
exports.CLIENT_FEATURE_FLAGS = Object.freeze({
    ACCOUNT_CREATION_CTAS: 'enrollment-mfe-account-creation-in-facility-cta-copy',
    CC_AUTOSKIP_TOP_CAREGIVERS: 'sc-enrollment-mfe-auto-skip-top-caregivers',
    CC_DAYCARE_IMAGES: 'cc-enrollment-mfe-daycare-images',
    CC_DC_CONTACT_METHOD: 'cc-enrollment-mfe-daycare-contact-method',
    CC_OPTIONAL_PAJ: 'seeker-cc-mfe-optional-paj',
    CC_SEEKER_FB_SIGNUP: 'seeker-enrollment-mfe-facebook-signup',
    DAYCARE_AUTO_ACCEPT_BACKEND: 'enrollment-mfe-daycare-auto-accept-leads-backend',
    DAYCARE_DAYS_SELECTOR: 'growth-daycare-days-selector',
    DAYCARE_DISTANCE_SETTINGS: 'enrollment-mfe-daycare-distance-value',
    DAYCARE_HDYHAU: 'growth-dc-enrollment-hdyhau-removal',
    ENROLLMENT_MFE_AAA: 'enrollment-mfe-aaa',
    GROWTH_SC_TYPE_OF_CARE: 'growth-senior-care-type-of-care',
    GROWTH_SC_AUTOSKIP_MW: 'growth-senior-care-autoskip-mw',
    HDYHAU: 'enrollment-mfe-seeker-hdyhau',
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
    LEAD_CONNECT_LIKE_VS_ADD_TO_LIST: 'lead-connect-like-vs-add-to-list',
    LEAD_CONNECT_MFE_REDIRECT: 'lead-connect-mfe-redirect',
    BUDGET_SOFTEN_LANGUAGE: 'enrollment-mfe-in-facility-budget-copy',
    LEAD_CONNECT_PROVIDER_NETWORK: 'sc-seeker-lc-pn-integration',
    LEAD_CONNECT_FIFTEEN_CAREGIVERS: 'lead-connect-fifteen-caregiver-max',
    SALC_AUTO_LEADS: 'enrollment-mfe-senior-care-auto-lead',
    OPTIMIZED_FLOW: 'enrollment-mfe-in-facility-flow-optimization',
    SEEKER_CC_CONVERSATIONAL_LANGUAGE: 'growth-cc-enrollment-conversational-language',
    LEAD_CONNECT_RECAP_SCREEN: 'enrollment-mfe-remove-lead-connect-recap-screen',
});
exports.SERVER_FEATURE_FLAGS = Object.freeze({
    SPLUNK_RUM_SDK: 'splunk-rum-sdk',
    SENTRY_TRACE_TRANSACTION: 'sentry-trace-transaction',
    GTM_ENABLED: 'gtm-enabled',
});
exports.WINDOW_SENTRY_TRACE_TRANSACTION_KEY = 'SENTRY_TRACE_TRANSACTION';
exports.TEALIUM_EVENTS = Object.freeze({
    DAYCARE_LEADS: 'DAYCARE_LEADS_SUBMITTED',
    SENIORCARE_LEADS_VIEW: 'SENIORCARE_LEADS_VIEW',
    SENIORCARE_LEADS_SUBMITTED: 'SENIORCARE_LEADS_SUBMITTED',
});
exports.TEALIUM_SLOTS = Object.freeze({
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
exports.LEAD_SOURCES = Object.freeze({
    ENROLLMENT: 'ENROLLMENT',
    NTH_DAY: 'NTH DAY',
});
exports.POST_A_JOB_ROUTES = Object.freeze({
    POST_A_JOB: '/post-a-job',
    RECURRING: '/recurring',
    ONE_TIME: '/onetime',
    PAY_FOR_CARE: '/pay-for-care',
    ABOUT_LOVED_ONE: '/about-loved-one',
    IDEAL_CAREGIVER: '/ideal-caregiver',
    CAREGIVERS_NEAR_YOU: '/caregivers-near-you',
});
exports.SEEKER_ROUTES = Object.freeze({
    INDEX: '/seeker/sc',
    LOCATION: '/seeker/sc/location',
    CARE_TYPE: '/seeker/sc/care-type',
    HELP_TYPE: '/seeker/sc/help-type',
    RECAP: '/seeker/sc/recap',
    ACCOUNT_CREATION: '/seeker/sc/account-creation',
    ACCOUNT_CREATION_NAME: '/seeker/sc/account-creation/name',
    ACCOUNT_CREATION_PASSWORD: '/seeker/sc/account-creation/password',
});
exports.SEEKER_IN_FACILITY_ROUTES = Object.freeze({
    CARE_TRUST: '/seeker/sc/in-facility/care-trust',
    WHO_NEEDS_CARE: '/seeker/sc/in-facility/who-needs-care',
    DESCRIBE_LOVED_ONE: '/seeker/sc/in-facility/describe-loved-one',
    OPTIMIZED_DESCRIBE_LOVED_ONE: '/seeker/sc/in-facility/optimized-describe-loved-one',
    HELP_TYPE: '/seeker/sc/in-facility/help-type',
    LOCATION: '/seeker/sc/in-facility/location',
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
    NO_INVENTORY: '/seeker/sc/in-facility/no-inventory',
    NO_COMMUNITIES_BY_COVERING_COST: '/seeker/sc/in-facility/no-communities-by-covering-cost',
    SENIOR_LIVING_OPTIONS: '/seeker/sc/in-facility/senior-living-options',
    BUDGET: '/seeker/sc/in-facility/budget',
    RELATIONSHIP: '/seeker/sc/in-facility/relationship',
});
exports.SEEKER_LEAD_CONNECT_ROUTES = Object.freeze({
    CAREGIVER_PROFILE: '/seeker/sc/lc/caregiver-profile',
    RECAP: '/seeker/sc/lc/recap',
    UPGRADE_OR_SKIP: '/seeker/sc/lc/upgrade-or-skip',
    SKIP_FOR_NOW: '/seeker/sc/lc/skip-for-now',
    MESSAGE_SENT: '/seeker/sc/lc/message-sent',
});
exports.SEEKER_CC_LEAD_CONNECT_ROUTES = Object.freeze({
    CAREGIVER_LIST: '/seeker/cc/lc/caregiver-list',
    SKIP_FOR_NOW: '/',
    UPGRADE_AND_MESSAGE: '/seeker/cc/lc/upgrade-and-message',
});
exports.PROVIDER_ROUTES = Object.freeze({
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
exports.PROVIDER_CHILD_CARE_ROUTES = Object.freeze({
    INDEX: '/provider/cc',
    PREFERENCES: '/provider/cc/preferences',
    STEPS: '/provider/cc/steps',
    HOURLY_RATE: '/provider/cc/hourly-rate',
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
});
exports.SEEKER_CHILD_CARE_ROUTES = Object.freeze({
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
exports.SEEKER_HOUSEKEEPING_ROUTES = Object.freeze({
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
exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES = Object.freeze({
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
exports.AUTH_ROUTES = Object.freeze({
    LOGOUT: (returnUrl) => `/vis/auth/oidc/logout${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`,
    AUTHERROR: '/auth-error',
});
exports.LTCG_ROUTES = Object.freeze({
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
exports.LTCG_INELIGIBLES_ACRONYM_STATES = Object.freeze({
    CA: 'CA',
    IL: 'IL',
    CO: 'CO',
    DE: 'DE',
    LA: 'LA',
    MA: 'MA',
    WI: 'WI',
    PR: 'PR',
});
exports.FLOWS = Object.freeze({
    SEEKER_IN_FACILITY: {
        name: 'SEEKER_IN_FACILITY',
        path: '/seeker/sc/in-facility',
    },
    SEEKER: {
        name: 'SEEKER',
        path: '/seeker/sc',
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
exports.SEEKER_CHILD_CARE_PAJ_ROUTES = Object.freeze({
    JOB_SCHEDULE: '/seeker/cc/schedule',
    CAREGIVER_ATTRIBUTES: '/seeker/cc/attributes',
    IDEAL_CAREGIVER: '/seeker/cc/ideal-caregiver',
    LAST_STEP: '/seeker/cc/last-step',
    WHAT_NEXT: '/seeker/cc/what-next',
});
exports.SEEKER_PET_CARE_ROUTES = Object.freeze({
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
exports.SEEKER_PET_CARE_PAJ_ROUTES = Object.freeze({
    JOB_SCHEDULE: '/seeker/pc/schedule',
    LAST_STEP: '/seeker/pc/last-step',
});
exports.SEEKER_TUTORING_ROUTES = Object.freeze({
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
exports.SEEKER_TUTORING_PAJ_ROUTES = Object.freeze({
    JOB_SCHEDULE: '/seeker/tu/schedule',
    GOALS: '/seeker/tu/goals',
    LAST_STEP: '/seeker/tu/last-step',
});
exports.ENROLLMENT_SOURCE = Object.freeze({
    MW_VHP: 'MW VHP',
    MW_SEO: 'MV SEO',
    MW_SEM: 'MV SEM',
    MW_COMMUNITY: 'MW COMMUNITY',
    DESKTOP_SEO: 'DT SEO',
    DESKTOP_COMMUNITY: 'DESKTOP COMMUNITY',
    DESKTOP_SCHWINGY: 'schwingy',
});
// key values aligned with ServiceType values (from enrollment-mfe/src/__generated__/globalTypes.ts)
exports.VERTICALS_NAMES = Object.freeze({
    CHILD_CARE: 'Childcare',
    SENIOR_CARE: 'Seniorcare',
    HOUSEKEEPING: 'Housekeeping',
    PET_CARE: 'Petcare',
    TUTORING: 'Tutoring',
});
// TODO: Use generated types in SC-400
/**
 * Type of additional details about yourself
 * Provider profile
 */
var AdditionalDetails;
(function (AdditionalDetails) {
    AdditionalDetails["DEMENTIA"] = "DEMENTIA";
    AdditionalDetails["HOSPICE_SERVICES"] = "HOSPICE_SERVICES";
    AdditionalDetails["CERTIFIED_HOME_HEALTH"] = "CERTIFIED_HOME_HEALTH";
    AdditionalDetails["CERTIFIED_NURSING_ASSISTANT"] = "CERTIFIED_NURSING_ASSISTANT";
    AdditionalDetails["REGISTERED_NURSE"] = "REGISTERED_NURSE";
    AdditionalDetails["CPR"] = "CPR_TRAINING";
    AdditionalDetails["NON_SMOKER"] = "NON_SMOKER";
    AdditionalDetails["HAVE_A_CAR"] = "HAVE_A_CAR";
    AdditionalDetails["CONFORTABLE_WITH_PETS"] = "CONFORTABLE_WITH_PETS";
    AdditionalDetails["COLLEGE_DEGREE"] = "COLLEGE_DEGREE";
})(AdditionalDetails = exports.AdditionalDetails || (exports.AdditionalDetails = {}));
// order matters so keep these in order
exports.FLOW_ROUTES_AND_STEP_NUMBERS = {
    SEEKER: {
        [exports.SEEKER_ROUTES.INDEX]: 1,
        [exports.SEEKER_ROUTES.HELP_TYPE]: 2,
        [exports.SEEKER_ROUTES.LOCATION]: 3,
        [exports.SEEKER_ROUTES.RECAP]: 3,
        [exports.SEEKER_ROUTES.ACCOUNT_CREATION]: 4,
        [exports.SEEKER_ROUTES.ACCOUNT_CREATION_NAME]: 5,
        [exports.SEEKER_ROUTES.ACCOUNT_CREATION_PASSWORD]: 6,
    },
    SEEKER_IN_FACILITY: {
        [exports.SEEKER_ROUTES.INDEX]: 1,
        [exports.SEEKER_IN_FACILITY_ROUTES.CARE_TRUST]: 1,
        [exports.SEEKER_IN_FACILITY_ROUTES.WHO_NEEDS_CARE]: 2,
        [exports.SEEKER_IN_FACILITY_ROUTES.URGENCY]: 2,
        [exports.SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE]: 3,
        [exports.SEEKER_IN_FACILITY_ROUTES.HELP_TYPE]: 4,
        [exports.SEEKER_IN_FACILITY_ROUTES.NURSING_OPTIONS]: 4,
        [exports.SEEKER_IN_FACILITY_ROUTES.OPTIMIZED_DESCRIBE_LOVED_ONE]: 5,
        [exports.SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED]: 5,
        [exports.SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_INDEPENDENT]: 5,
        [exports.SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_MEMORY_CARE]: 5,
        [exports.SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME]: 5,
        [exports.SEEKER_IN_FACILITY_ROUTES.SENIOR_LIVING_OPTIONS]: 5,
        [exports.SEEKER_IN_FACILITY_ROUTES.LOCATION]: 6,
        [exports.SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE]: 7,
        [exports.SEEKER_IN_FACILITY_ROUTES.BUDGET]: 7,
        [exports.SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE]: 7,
        [exports.SEEKER_IN_FACILITY_ROUTES.RELATIONSHIP]: 8,
        [exports.SEEKER_IN_FACILITY_ROUTES.RECAP]: 9,
        [exports.SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION]: 10,
        [exports.SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_DETAILS]: 11,
        [exports.SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_RELATIONSHIP]: 12,
        [exports.SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_PASSWORD]: 13,
        [exports.SEEKER_IN_FACILITY_ROUTES.AMENITIES]: 14,
        [exports.SEEKER_IN_FACILITY_ROUTES.OPTIONS]: 15,
        [exports.SEEKER_IN_FACILITY_ROUTES.CARING_LEADS]: 16,
        [exports.SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST]: 16,
        [exports.SEEKER_IN_FACILITY_ROUTES.PAYOFF]: 17,
        [exports.SEEKER_IN_FACILITY_ROUTES.NO_INVENTORY]: 18,
        [exports.SEEKER_IN_FACILITY_ROUTES.NO_COMMUNITIES_BY_COVERING_COST]: 18, // used in post-enrollment flow
    },
    SEEKER_CHILD_CARE: {
        [exports.SEEKER_CHILD_CARE_ROUTES.CARE_LOCATION]: 1,
        [exports.SEEKER_CHILD_CARE_ROUTES.INDEX]: 1,
        [exports.SEEKER_CHILD_CARE_ROUTES.CARE_DATE]: 2,
        [exports.SEEKER_CHILD_CARE_ROUTES.CARE_KIND]: 3,
        [exports.SEEKER_CHILD_CARE_ROUTES.CARE_WHO]: 4,
        [exports.SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT]: 5,
        [exports.SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL]: 6,
        [exports.SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_NAME]: 7,
        [exports.SEEKER_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD]: 8,
    },
    SEEKER_HOUSEKEEPING: {
        [exports.SEEKER_HOUSEKEEPING_ROUTES.INDEX]: 1,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.HOUSEKEEPING_DATE]: 1,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.HOUSEKEEPER_WHAT]: 2,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.WHAT_TASKS]: 3,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.LOCATION]: 4,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_CREATION_EMAIL]: 5,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_CREATION_NAME]: 6,
        [exports.SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_PASSWORD]: 7,
    },
    SEEKER_PET_CARE: {
        [exports.SEEKER_PET_CARE_ROUTES.INDEX]: 1,
        [exports.SEEKER_PET_CARE_ROUTES.CARE_DATE]: 1,
        [exports.SEEKER_PET_CARE_ROUTES.ABOUT_PETS]: 2,
        [exports.SEEKER_PET_CARE_ROUTES.SERVICE_TYPE]: 3,
        [exports.SEEKER_PET_CARE_ROUTES.LOCATION]: 4,
        [exports.SEEKER_PET_CARE_ROUTES.ACCOUNT_CREATION_EMAIL]: 5,
        [exports.SEEKER_PET_CARE_ROUTES.ACCOUNT_CREATION_NAME]: 6,
        [exports.SEEKER_PET_CARE_ROUTES.ACCOUNT_PASSWORD]: 7,
    },
    SEEKER_DAYCARE_CHILD_CARE: {
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.LOCATION]: 1,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.DATE]: 2,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.KIND]: 3,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.WHO]: 4,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.FREQUENCY]: 5,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.DATE_TIME]: 6,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.START_DATE]: 7,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.ADDITIONAL_INFORMATION]: 8,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.MATCH]: 9,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_CREATION]: 10,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD]: 11,
        [exports.SEEKER_DAYCARE_CHILD_CARE_ROUTES.RECOMMENDATIONS]: 12,
    },
    SEEKER_TUTORING: {
        [exports.SEEKER_TUTORING_ROUTES.INDEX]: 1,
        [exports.SEEKER_TUTORING_ROUTES.WHAT_LEVEL]: 1,
        [exports.SEEKER_TUTORING_ROUTES.CARE_DATE]: 2,
        [exports.SEEKER_TUTORING_ROUTES.WHICH_SUBJECTS]: 3,
        [exports.SEEKER_TUTORING_ROUTES.LOCATION]: 4,
        [exports.SEEKER_TUTORING_ROUTES.VIRTUAL_OR_IN_PERSON]: 5,
        [exports.SEEKER_TUTORING_ROUTES.ACCOUNT_CREATION_EMAIL]: 6,
        [exports.SEEKER_TUTORING_ROUTES.ACCOUNT_CREATION_NAME]: 7,
        [exports.SEEKER_TUTORING_ROUTES.ACCOUNT_PASSWORD]: 8,
    },
    PROVIDER_ACCOUNT_CREATION: {
        [exports.PROVIDER_ROUTES.INDEX]: 1,
        // [PROVIDER_ROUTES.ZIP]: 2,
        [exports.PROVIDER_ROUTES.ACCOUNT_CREATION]: 2,
        [exports.PROVIDER_ROUTES.ACCOUNT_CREATED]: 3,
    },
    PROVIDER_PROFILE_DETAILS: {
        [exports.PROVIDER_ROUTES.INDEX]: 1,
        [exports.PROVIDER_ROUTES.TYPE_SPECIFIC]: 1,
        [exports.PROVIDER_ROUTES.EXPERIENCE_LEVEL]: 2,
        [exports.PROVIDER_ROUTES.PROFILE]: 3,
        [exports.PROVIDER_ROUTES.PAY_RANGE]: 4,
        [exports.PROVIDER_ROUTES.JOB_TYPE]: 5,
        [exports.PROVIDER_ROUTES.AVAILABILITY]: 6,
        [exports.PROVIDER_ROUTES.HEADLINE_BIO]: 7,
        [exports.PROVIDER_ROUTES.PHOTO]: 8,
        [exports.PROVIDER_ROUTES.JOBS_MATCHING]: 9,
    },
    PROVIDER_CC_INFORMATIONAL_STEPS: {
        [exports.PROVIDER_CHILD_CARE_ROUTES.STEPS]: 1,
        [exports.PROVIDER_CHILD_CARE_ROUTES.JOBS]: 2,
    },
    PROVIDER_CC_ACCOUNT_CREACTION: {
        [exports.PROVIDER_CHILD_CARE_ROUTES.INDEX]: 1,
        [exports.PROVIDER_CHILD_CARE_ROUTES.LOCATION]: 2,
        [exports.PROVIDER_CHILD_CARE_ROUTES.ACCOUNT]: 3,
    },
    PROVIDER_CC_PROFILE_DETAILS: {
        [exports.PROVIDER_CHILD_CARE_ROUTES.JOB_TYPES]: 1,
        [exports.PROVIDER_CHILD_CARE_ROUTES.HOURLY_RATE]: 1,
        [exports.PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY]: 2,
        [exports.PROVIDER_CHILD_CARE_ROUTES.PROFILE]: 3,
        [exports.PROVIDER_CHILD_CARE_ROUTES.BIO]: 4,
        [exports.PROVIDER_CHILD_CARE_ROUTES.PHOTO]: 5,
    },
    LTCG: {
        [exports.LTCG_ROUTES.INSURANCE_CARRIER]: 1,
        [exports.LTCG_ROUTES.NO_INSURANCE]: 1,
        [exports.LTCG_ROUTES.ELIGIBLE_POLICY]: 2,
        [exports.LTCG_ROUTES.POLICY_INELIGIBLE]: 2,
        [exports.LTCG_ROUTES.WHERE]: 3,
        [exports.LTCG_ROUTES.WHEN]: 4,
        [exports.LTCG_ROUTES.LOCATION_INELIGIBLE]: 4,
        [exports.LTCG_ROUTES.DETAILS_ABOUT_YOURSELF]: 5,
        [exports.LTCG_ROUTES.CONTACT_INFO]: 6,
        [exports.LTCG_ROUTES.SUCCESS]: 7,
    },
};
exports.PROVIDER_CC_FLOW_NAMES = [
    'PROVIDER_CC_INFORMATIONAL_STEPS',
    'PROVIDER_CC_ACCOUNT_CREACTION',
    'PROVIDER_CC_PROFILE_DETAILS',
];
exports.CZEN_BASE_PATH = '/';
exports.CZEN_MW_UPGRADE_PATH = '/mobile/seeker/upgradeMembership.do';
exports.CZEN_MW_ENROLL_FLOW = 'enrollFlow=true';
exports.CZEN_BACKGROUND_CHECK = '/rmember/enroll/resumeProviderEnrollment?serviceId=SENIRCARE';
exports.CZEN_BACKGROUND_CHECK_CC = '/rmember/enroll/resumeProviderEnrollment?serviceId=CHILDCARE';
exports.CZEN_DESKTOP_UPGRADE_PATH = '/dwb/upgrade/viewPage';
const CZEN_DESKTOP_ENROLL_SEEKER_PATH = (subService, zip) => `/dwb/visitor/enrollSeeker?memberType=seeker&serviceId=CHILDCARE&subService=${subService}&comeFrom=costOfChildcare&zip=${zip}&numOfInfants=0&numOfToddlers=0&numOfPreSchoolers=1&numOfPreKindergarteners=0`;
exports.CZEN_DESKTOP_ENROLL_SEEKER_PATH = CZEN_DESKTOP_ENROLL_SEEKER_PATH;
exports.CZEN_MOBILE_NTH_DAY_RATE_CARD_PATH = '/mwb/seeker/upgrade/pricingPlans';
exports.CZEN_DESKTOP_NTH_DAY_RATE_CARD_PATH = '/seeker/upgradeMembershipPlanActual.do?pt=stepId%3D0%26flowId%3DSEEKER_UPGRADE_UNLIM_PREF_PLUS_BGC_NEW_DESIGN%26&progressBarState=2.0';
const CZEN_MW_SC_PROVIDER_SEARCH_PATH = (zip) => `/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=${zip}&overrideMfeRedirect=true`;
exports.CZEN_MW_SC_PROVIDER_SEARCH_PATH = CZEN_MW_SC_PROVIDER_SEARCH_PATH;
const CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH = (zip, searchRadius) => `/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=${zip}&milesFromZipCode=${searchRadius}&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true`;
exports.CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH = CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH;
exports.CZEN_BLOCKLIST_PATH = '/visitor/bLMemberErrorPage.do';
exports.TEST_COOKIE_KEY = 'n_tc';
exports.CZEN_VISITOR_COOKIE_KEY = 'n_vis';
exports.CZEN_SESSION_COOKIE_KEY = 'csc';
exports.CZEN_JSESSIONID_COOKIE_KEY = 'JSESSIONID';
exports.CZEN_SECURE_AUTH_COOKIE_KEY = 'acs';
exports.CSC_SESSION_COOKIE_NAME = 'csc-session';
exports.CZEN_MEMBER_VERIFY_COOKIE_KEY = 'mc_verify';
exports.CZEN_MW_RATE_CARD = '/mwb/test/seeker/pricingSchemeTest';
exports.LEAD_AND_CONNECT_EXTERNAL_ENTRY = '/seeker/sc/lc/caregiver-profile/routing-in-progress';
exports.CZEN_MW_SKIP_RATE_CARD_SC = '/mwb/member/sitterSearchTest?serviceId=SENIRCARE';
exports.CZEN_DESKTOP_SKIP_RATE_CARD_SC = '/visitor/captureSearchBar.do?sitterService=seniorCare';
exports.LOCAL_STORAGE_ERROR_TAG = 'LocalStorageError';
exports.LOCAL_STORAGE_STATE_KEY = 'enrollment-mfe-state';
exports.LOCAL_STORAGE_VERIFICATION_KEY = 'LocalStorageVerification';
exports.LOCAL_STORAGE_VERIFICATION_VALUE = 'Verified';
exports.CLIENT_SIDE_ERROR_TAG = 'ClientSideError';
exports.CURRENT_STATE_MAJOR_VERSION = '2';
exports.CURRENT_STATE_MINOR_VERSION = '0';
exports.CURRENT_STATE_PATCH_VERSION = '0';
exports.CURRENT_STATE_VERSION = `${exports.CURRENT_STATE_MAJOR_VERSION}.${exports.CURRENT_STATE_MINOR_VERSION}.${exports.CURRENT_STATE_PATCH_VERSION}`;
// This constant considers paddings and margins as calc(100vh - (56px header + 24 + 24 paddings))
exports.HEIGHT_MINUS_TOOLBAR = 'calc(100vh - 104px)';
exports.ENROLLMENT_SESSION_ID_COOKIE_NAME = 'enrollment-session-id';
exports.EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR = "Please don't use your name or email address in your password.";
const UPGRADE_MEMBERSHIP_PLAN = (zipcode) => `https://www.care.com/seeker/upgradeMembershipPlanActual.do?pt=stepId%3D0%26flowId%3DSEEKER_UPGRADE_UNLIM_PREF_PLUS_BGC_NEW_DESIGN%26&progressBarState=2.0&comeFrom=GLOBAL_HEADER&zip=${zipcode}`;
exports.UPGRADE_MEMBERSHIP_PLAN = UPGRADE_MEMBERSHIP_PLAN;
exports.FEATURE_FLAG_OVERRIDE_COOKIE_NAME = 'ffov';
exports.GET_TOP_CAREGIVERS_NO_RESULTS_MSG = 'GetTopCaregiversNoProfilesReturned';
exports.NUMBER_OF_CAREGIVERS_TO_DISPLAY_CAREGIVERS_NEAR_YOU = 6;
const NUMBER_OF_LEAD_CONNECT_RESULTS = (getFifteenCaregivers) => getFifteenCaregivers ? 15 : 10;
exports.NUMBER_OF_LEAD_CONNECT_RESULTS = NUMBER_OF_LEAD_CONNECT_RESULTS;
exports.LEAD_CONNECT_CZEN_REDIRECT_MSG = 'LeadAndConnectCzenRedirect';
const SC_PRE_RATE_CARD_MFE_PATH = (czenGeneral) => `${czenGeneral}/vis/auth/login?forwardUrl=${czenGeneral}/app/ratecard/seniorcare/pre-rate-card?enrollFlow=true`;
exports.SC_PRE_RATE_CARD_MFE_PATH = SC_PRE_RATE_CARD_MFE_PATH;
const CC_PRE_RATE_CARD_PATH = (czenGeneral) => `${czenGeneral}/vis/auth/login?forwardUrl=${czenGeneral}/app/ratecard/childcare/pre-rate-card?enrollFlow=true`;
exports.CC_PRE_RATE_CARD_PATH = CC_PRE_RATE_CARD_PATH;
exports.CC_RATE_CARD_PATH = '/app/ratecard/childcare/rate-card?enrollFlow=true';
const PC_PRE_RATE_CARD_PATH = (czenGeneral) => `${czenGeneral}/vis/auth/login?forwardUrl=${czenGeneral}/app/ratecard/petcare/pre-rate-card?enrollFlow=true`;
exports.PC_PRE_RATE_CARD_PATH = PC_PRE_RATE_CARD_PATH;
const HK_PRE_RATE_CARD_PATH = (czenGeneral) => `${czenGeneral}/vis/auth/login?forwardUrl=${czenGeneral}/app/ratecard/housekeeping/pre-rate-card?enrollFlow=true`;
exports.HK_PRE_RATE_CARD_PATH = HK_PRE_RATE_CARD_PATH;
const TUTORING_PRE_RATE_CARD_PATH = (czenGeneral) => `${czenGeneral}/vis/auth/login?forwardUrl=${czenGeneral}/app/ratecard/tutoring/pre-rate-card?enrollFlow=true`;
exports.TUTORING_PRE_RATE_CARD_PATH = TUTORING_PRE_RATE_CARD_PATH;
exports.AGE_RANGES = {
    newborn: 'NEWBORN',
    toddler: 'TODDLER',
    earlySchool: 'EARLY_SCHOOL',
    elementarySchool: 'ELEMENTARY_SCHOOL',
    teen: 'TEEN',
};
exports.MHP_FAVORITES_PATH = '/ppr.do#3';
exports.LEAD_CONNECT_ROUTING_STEP = 'routing-in-progress';
exports.SIX_MONTHS_IN_DAYS = 180;
exports.CAREGIVERS_NEAR_YOU_REDIRECTION_TIMEOUT = 2300;
var CareDate;
(function (CareDate) {
    CareDate["RIGHT_NOW"] = "RIGHT_NOW";
    CareDate["WITHIN_A_WEEK"] = "WITHIN_A_WEEK";
    CareDate["IN_1_2_MONTHS"] = "IN_1_2_MONTHS";
    CareDate["JUST_BROWSING"] = "JUST_BROWSING";
})(CareDate = exports.CareDate || (exports.CareDate = {}));
var CareDateLabels;
(function (CareDateLabels) {
    CareDateLabels["RIGHT_NOW"] = "Right now";
    CareDateLabels["WITHIN_A_WEEK"] = "Within a week";
    CareDateLabels["IN_1_2_MONTHS"] = "In 1-2 months";
    CareDateLabels["JUST_BROWSING"] = "Just browsing";
})(CareDateLabels = exports.CareDateLabels || (exports.CareDateLabels = {}));
exports.PASSWORD_RULES = [
    'At least 6 characters',
    'Can’t contain your first, last name or email',
    'Can’t be a sequence of a single value (e.g “aaaaaa”)',
    'Can’t be a repeatable sequence (e.g “abcabcabc”)',
];
exports.CC_REBRANDED_PATHS = ['seeker/cc', 'seeker/dc'];
exports.JOB_MFE_CC_PAJ = '/app/job/cc?flow=ENROLLMENT';
exports.JOB_MFE_HK_PAJ = '/app/job/hk?flow=ENROLLMENT';
exports.JOB_MFE_PC_PAJ = '/app/job/pc?flow=ENROLLMENT';
exports.JOB_MFE_TU_PAJ = '/app/job/tu?flow=ENROLLMENT';
exports.COVID_VACCINATION_OPTIONS = [
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
exports.LEAD_CONNECT_MFE_URL = '/app/lead-connect/sc/caregiver-profile';
exports.APP_STORE_ID = '1367528046';
exports.ANDROID_APP_STORE_ID = 'com.care.android.careview.providerapp';
exports.appDownloadLink = `https://d2k4k.app.goo.gl/?link=https://www.care.com/sitter/notificationCenter?%26dlsrc%3Dunsafe&apn=${exports.ANDROID_APP_STORE_ID}&ibi=com.care.provider&isi=${exports.APP_STORE_ID}&efr=1&ofl=https://play.google.com/store/apps/details?id=${exports.ANDROID_APP_STORE_ID}&hl=en_IN&gl=US`;
