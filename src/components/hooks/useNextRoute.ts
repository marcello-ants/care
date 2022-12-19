import { useRouter } from 'next/router';
import {
  FLOWS,
  FLOW_ROUTES_AND_STEP_NUMBERS,
  SEEKER_HOUSEKEEPING_ROUTES,
  SEEKER_PET_CARE_ROUTES,
  SEEKER_TUTORING_ROUTES,
} from '@/constants';
import useFlowHelper from './useFlowHelper';

function useNextRoute() {
  const { currentFlow } = useFlowHelper();
  const { asPath, push } = useRouter();
  const path = asPath.split('?')[0];
  const flow = currentFlow || 'SEEKER';
  const routes = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS[flow!]);
  let idx = routes.indexOf(path) + 1;
  let nextRoute = routes[idx];

  if (
    (currentFlow === FLOWS.SEEKER_HOUSEKEEPING.name && path === SEEKER_HOUSEKEEPING_ROUTES.INDEX) ||
    (currentFlow === FLOWS.SEEKER_PET_CARE.name && path === SEEKER_PET_CARE_ROUTES.INDEX) ||
    (currentFlow === FLOWS.SEEKER_TUTORING.name && path === SEEKER_TUTORING_ROUTES.INDEX)
  ) {
    idx += 1;
    nextRoute = routes[idx];
  }

  const pushNextRoute = () => push(nextRoute);
  return { pushNextRoute, nextRoute };
}

export default useNextRoute;
