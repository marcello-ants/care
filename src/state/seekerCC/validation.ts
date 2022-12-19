import logger from '../../lib/clientLogger';
import { SeekerCCState } from '../../types/seekerCC';
import { FLOW_ROUTES_AND_STEP_NUMBERS, SEEKER_CHILD_CARE_ROUTES } from '../../constants';
import { AppState } from '../../types/app';

export function doesSeekerCCStateHaveDefaultKeys(state: SeekerCCState) {
  return (
    state &&
    'careDate' in state &&
    'careKind' in state &&
    'careExpecting' in state &&
    'careChildren' in state
  );
}

export function validate(state: AppState, pathName: string): boolean {
  const route = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE).find(
    (routeName) => routeName === pathName
  );

  if (!route) {
    return true;
  }

  if (!doesSeekerCCStateHaveDefaultKeys(state.seekerCC)) {
    logger.error({
      event: 'invalidSeekerStateDefaultKeysMissing',
      source: route,
      invalidState: state,
    });
    return false;
  }

  if (
    !state.seeker.zipcode &&
    [
      SEEKER_CHILD_CARE_ROUTES.CARE_DATE,
      SEEKER_CHILD_CARE_ROUTES.CARE_KIND,
      SEEKER_CHILD_CARE_ROUTES.CARE_WHO,
      SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT,
    ].includes(route)
  ) {
    logger.error({
      event: 'invalidSeekerZipCode',
      source: route,
      invalidState: state,
    });
    return false;
  }

  if (
    !state.seekerCC.careDate &&
    [
      SEEKER_CHILD_CARE_ROUTES.CARE_KIND,
      SEEKER_CHILD_CARE_ROUTES.CARE_WHO,
      SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT,
    ].includes(route)
  ) {
    logger.error({
      event: 'invalidChildCareDate',
      source: route,
      invalidState: state,
    });
    return false;
  }

  if (
    !state.seekerCC.careKind &&
    [SEEKER_CHILD_CARE_ROUTES.CARE_WHO, SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT].includes(route)
  ) {
    logger.error({
      event: 'invalidChildCareKind',
      source: route,
      invalidState: state,
    });
    return false;
  }

  if (
    (typeof state.seekerCC.careExpecting === 'undefined' ||
      !Array.isArray(state.seekerCC.careChildren)) &&
    [SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT].includes(route)
  ) {
    logger.error({
      event: 'invalidChildCareChildrenInfo',
      source: route,
      invalidState: state,
    });
    return false;
  }

  return true;
}
