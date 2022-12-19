import { SeekerVerticalType } from '@/types/seeker';
import { AppState } from '@/types/app';
import { SessionStorageHelper } from './SessionStorageHelper';
import {
  FLOWS,
  LOCAL_STORAGE_STATE_KEY,
  SHORT_ENROLLMENT_ROUTES,
  VERTICALS_NAMES,
} from '../constants';

// verticals markers
const childCareMarker = new RegExp(FLOWS.SEEKER_CHILD_CARE.path);
const childCareDaycareMarker = new RegExp(FLOWS.SEEKER_DAYCARE_CHILD_CARE.path);
const childCareProviderMarker = new RegExp(FLOWS.CHILD_CARE_PROVIDER.path);
const providerEnrollmentMarker = new RegExp('/landing/enrollment');
const housekeepingMarker = new RegExp(FLOWS.SEEKER_HOUSEKEEPING.path);
const petCareMarker = new RegExp(FLOWS.SEEKER_PET_CARE.path);
const tutoringMarker = new RegExp(FLOWS.SEEKER_TUTORING.path);
const instantBookMarker = new RegExp(FLOWS.SEEKER_INSTANT_BOOK.path);
const shortEnrollmentMarker = new RegExp(SHORT_ENROLLMENT_ROUTES.INDEX);

const getVerticalFromState = (): SeekerVerticalType => {
  try {
    const stateFromStorageJson = SessionStorageHelper.getItem(LOCAL_STORAGE_STATE_KEY);
    if (stateFromStorageJson) {
      const stateFromStorage = JSON.parse(stateFromStorageJson) as AppState;
      if (stateFromStorage?.seeker?.vertical) {
        return stateFromStorage.seeker.vertical;
      }
    }
  } catch (_e) {
    return null;
  }
  return null;
};

function getVertical(path?: string): string {
  if (!path) {
    // check vertical through URL check
    // eslint-disable-next-line no-param-reassign
    path = window.location.pathname;
  }

  // Childcare check up
  if (
    childCareMarker.test(path) ||
    childCareDaycareMarker.test(path) ||
    childCareProviderMarker.test(path)
  ) {
    return VERTICALS_NAMES.CHILD_CARE;
  }

  // Housekeeping check up
  if (housekeepingMarker.test(path)) {
    return VERTICALS_NAMES.HOUSEKEEPING;
  }

  // Petcare check up
  if (petCareMarker.test(path)) {
    return VERTICALS_NAMES.PET_CARE;
  }

  // Tutoring check up
  if (tutoringMarker.test(path)) {
    return VERTICALS_NAMES.TUTORING;
  }

  // Instant Booking check up
  if (instantBookMarker.test(path)) {
    return VERTICALS_NAMES.CHILD_CARE;
  }

  // Enrollment Form check up
  if (providerEnrollmentMarker.test(path)) {
    return '';
  }

  // Enrollment Form check up
  if (shortEnrollmentMarker.test(path)) {
    return getVerticalFromState() ?? '';
  }

  // default value - seniorcare
  return VERTICALS_NAMES.SENIOR_CARE;
}

export default getVertical;
