import { isEmpty } from 'lodash-es';
import logger from '@/lib/clientLogger';
import { SEEKER_ROUTES, POST_A_JOB_ROUTES, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { SeekerState, SeekerPages, JobPostPages, SeekerInFacilityPages } from '@/types/seeker';
import { captureMessage, Severity } from '@sentry/nextjs';
import { AppState } from '@/types/app';

const seekerInFacilityPathnameMapping: { [key: string]: SeekerInFacilityPages } = {
  [SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST]: SeekerInFacilityPages.COMMUNITY_LIST,
  [SEEKER_IN_FACILITY_ROUTES.CARING_LEADS]: SeekerInFacilityPages.CARING_LEADS,
};

const seekerPathnameMapping: { [key: string]: SeekerPages } = {
  [SEEKER_ROUTES.LOCATION]: SeekerPages.LOCATION,
  [SEEKER_ROUTES.CARE_TYPE]: SeekerPages.CARE_TYPE,
  [SEEKER_ROUTES.HELP_TYPE]: SeekerPages.HELP_TYPE,
  [SEEKER_ROUTES.RECAP]: SeekerPages.RECAP,
  [SEEKER_ROUTES.ACCOUNT_CREATION]: SeekerPages.ACCOUNT_CREATION,
  [SEEKER_ROUTES.ACCOUNT_CREATION_NAME]: SeekerPages.ACCOUNT_CREATION_NAME,
};

// postAJobPage is not included in this mapping as that is a special case
// the initial page has no state, and needs to have its state checked only after query params are saved to state
const jobPathnameMapping: { [key: string]: JobPostPages } = {
  [POST_A_JOB_ROUTES.RECURRING]: JobPostPages.RECURRING,
  [POST_A_JOB_ROUTES.ONE_TIME]: JobPostPages.ONE_TIME,
  [POST_A_JOB_ROUTES.PAY_FOR_CARE]: JobPostPages.PAY_FOR_CARE,
  [POST_A_JOB_ROUTES.ABOUT_LOVED_ONE]: JobPostPages.ABOUT_LOVED_ONE,
  [POST_A_JOB_ROUTES.IDEAL_CAREGIVER]: JobPostPages.IDEAL_CAREGIVER,
};

export function doesSeekerStateHaveDefaultKeys(state: SeekerState) {
  return (
    state &&
    'city' in state &&
    'helpTypes' in state &&
    'state' in state &&
    'typeOfCare' in state &&
    'zipcode' in state &&
    // PAJ Keys
    'jobPost' in state &&
    'oneTime' in state.jobPost &&
    'recurring' in state.jobPost &&
    'idealCaregiver' in state.jobPost &&
    'rate' in state.jobPost &&
    'servicesNeeded' in state.jobPost &&
    'typeOfCare' in state.jobPost &&
    'lovedOne' in state.jobPost &&
    'jobPostSuccessful' in state.jobPost &&
    'initialLoggingDone' in state.jobPost
  );
}

export function validateSeekerPreAccount(state: SeekerState, pageSource: string): boolean {
  if (!doesSeekerStateHaveDefaultKeys(state)) {
    logger.error({
      event: 'invalidSeekerStateDefaultKeysMissing',
      source: pageSource,
      invalidState: state,
    });
    captureMessage('invalidSeekerStateDefaultKeysMissing', Severity.Error);
    return false;
  }

  if (
    pageSource === SeekerPages.RECAP ||
    pageSource === SeekerPages.ACCOUNT_CREATION ||
    pageSource === SeekerPages.ACCOUNT_CREATION_NAME
  ) {
    // check location page zipcode
    if (!state.zipcode) {
      logger.error({ event: 'invalidSeekerZipCode', source: pageSource, invalidState: state });
      captureMessage('invalidSeekerZipCode', Severity.Error);
      return false;
    }
  }

  if (
    pageSource === SeekerPages.HELP_TYPE ||
    pageSource === SeekerPages.RECAP ||
    pageSource === SeekerPages.ACCOUNT_CREATION ||
    pageSource === SeekerPages.ACCOUNT_CREATION_NAME
  ) {
    if (!state.typeOfCare) {
      logger.error({ event: 'invalidSeekerTypeOfCare', source: pageSource, invalidState: state });
      captureMessage('invalidSeekerTypeOfCare', Severity.Error);
      return false;
    }
  }

  if (
    pageSource === SeekerPages.RECAP ||
    pageSource === SeekerPages.ACCOUNT_CREATION ||
    pageSource === SeekerPages.ACCOUNT_CREATION_NAME
  ) {
    // checking help-type page
    if (!state.helpTypes) {
      logger.error({ event: 'invalidSeekerHelpTypes', source: pageSource, invalidState: state });
      captureMessage('invalidSeekerHelpTypes', Severity.Error);
      return false;
    }
  }

  return true;
}

export function validateJobPost(state: SeekerState, pageSource: string): boolean {
  const { jobPost } = state;

  if (!doesSeekerStateHaveDefaultKeys(state)) {
    logger.error({
      event: 'invalidSeekerStateDefaultKeysMissing',
      source: pageSource,
      invalidState: state,
    });
    captureMessage('invalidSeekerStateDefaultKeysMissing', Severity.Error);
    return false;
  }

  if (
    pageSource === JobPostPages.ONE_TIME ||
    pageSource === JobPostPages.RECURRING ||
    pageSource === JobPostPages.PAY_FOR_CARE ||
    pageSource === JobPostPages.ABOUT_LOVED_ONE ||
    pageSource === JobPostPages.IDEAL_CAREGIVER
  ) {
    // check what was set on post a job page is still present
    if (!jobPost.careFrequency) {
      logger.error({ event: 'invalidCareFrequency', source: pageSource, invalidState: state });
      captureMessage('invalidCareFrequency', Severity.Error);
      return false;
    }
  }

  if (
    pageSource === JobPostPages.PAY_FOR_CARE ||
    pageSource === JobPostPages.ABOUT_LOVED_ONE ||
    pageSource === JobPostPages.IDEAL_CAREGIVER
  ) {
    // check what was set in recurring or onetime page is still present
    if (jobPost.careFrequency === 'onetime') {
      if (
        !jobPost.oneTime.schedule ||
        !jobPost.oneTime.schedule.start ||
        !jobPost.oneTime.schedule.end ||
        !jobPost.oneTime.schedule.start.date ||
        !jobPost.oneTime.schedule.start.time ||
        !jobPost.oneTime.schedule.end.time
      ) {
        logger.error({ event: 'invalidOneTimeSchedule', source: pageSource, invalidState: state });
        captureMessage('invalidOneTimeSchedule', Severity.Error);
        return false;
      }
    } else if (isEmpty(jobPost.recurring.schedule) && isEmpty(jobPost.recurring.careTimes)) {
      logger.error({ event: 'invalidRecurringSchedule', source: pageSource, invalidState: state });
      captureMessage('invalidRecurringSchedule', Severity.Error);
      return false;
    }

    // check what as set on pay for care page is still present
    // we also check on the pay for care page itself since we have defaults in place
    if (
      !jobPost.rate ||
      !jobPost.rate.legalMinimum ||
      !jobPost.rate.minimum ||
      !jobPost.rate.maximum
    ) {
      logger.error({ event: 'invalidRate', source: pageSource, invalidState: state });
      captureMessage('invalidRate', Severity.Error);
      return false;
    }
  }

  if (pageSource === JobPostPages.IDEAL_CAREGIVER) {
    // check what as set on loved one page is still present
    if (
      !jobPost.lovedOne ||
      !jobPost.lovedOne.age ||
      !jobPost.lovedOne.gender ||
      !jobPost.lovedOne.whoNeedsCare
    ) {
      logger.error({ event: 'invalidLovedOneDetails', source: pageSource, invalidState: state });
      captureMessage('invalidLovedOneDetails', Severity.Error);
      return false;
    }
  }

  return true;
}

export function validateSeekerInFacility(state: AppState, pageSource: string): boolean {
  if (!doesSeekerStateHaveDefaultKeys(state.seeker)) {
    logger.error({
      event: 'invalidSeekerStateDefaultKeysMissing',
      source: pageSource,
      invalidState: state,
    });
    captureMessage('invalidSeekerStateDefaultKeysMissing', Severity.Error);
    return false;
  }

  if (
    pageSource === SeekerInFacilityPages.COMMUNITY_LIST ||
    pageSource === SeekerInFacilityPages.CARING_LEADS
  ) {
    if (!state.flow.memberId && !state.flow.userHasAccount) {
      logger.error({ event: 'userNotAuthenticated', source: pageSource, invalidState: state });
      captureMessage('userNotAuthenticated', Severity.Error);
      return false;
    }
  }

  return true;
}

export function validate(state: AppState, pathName: string): boolean {
  const pageSource: SeekerPages = seekerPathnameMapping[pathName];
  const jobPostPageSource: JobPostPages = jobPathnameMapping[pathName];
  const isInFacilitySource: SeekerInFacilityPages = seekerInFacilityPathnameMapping[pathName];

  if (isInFacilitySource) {
    return validateSeekerInFacility(state, isInFacilitySource);
  }

  if (pageSource) {
    return validateSeekerPreAccount(state.seeker, pageSource);
  }

  if (jobPostPageSource) {
    return validateJobPost(state.seeker, jobPostPageSource);
  }

  return true;
}
