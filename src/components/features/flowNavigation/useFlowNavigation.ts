import { useRouter } from 'next/router';
import { useCallback } from 'react';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import {
  CLIENT_FEATURE_FLAGS,
  FLOWS,
  FLOW_ROUTES_AND_STEP_NUMBERS,
  SEEKER_INSTANT_BOOK_ROUTES,
  SEEKER_CHILD_CARE_ROUTES,
  SEEKER_DAYCARE_CHILD_CARE_ROUTES,
  SEEKER_SPLIT_ACCOUNT_DC,
} from '@/constants';
import { useFlowState, useSeekerState, useSeekerCCState } from '@/components/AppState';

function useFlowNavigation() {
  const { flowName } = useFlowState();
  const { zipcode } = useSeekerState();
  const { pathname, push } = useRouter();
  const { czenServiceIdForMember, czenTimeIntent } = useSeekerCCState();
  const splitAccCreationDC = useFeatureFlag(CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE);

  const goNext = useCallback(() => {
    const flow = FLOW_ROUTES_AND_STEP_NUMBERS[flowName];

    if (!flow) {
      return;
    }

    const paths = Object.keys(flow);
    let index = 1 + paths.findIndex((route) => route === pathname);
    let nextRoute = paths[index];

    if (flowName === FLOWS.SEEKER_CHILD_CARE.name) {
      if (czenTimeIntent && nextRoute === SEEKER_CHILD_CARE_ROUTES.CARE_DATE) {
        index += 1;
        nextRoute = paths[index];
      }

      if (pathname === SEEKER_CHILD_CARE_ROUTES.CARE_LOCATION) {
        const newFlowPaths = Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS.SEEKER_CHILD_CARE);
        index += 1;
        nextRoute = newFlowPaths[index];
      }
    }

    if (pathname.indexOf('care-who') !== -1) {
      nextRoute =
        pathname.indexOf('/ib/') !== -1
          ? SEEKER_INSTANT_BOOK_ROUTES.WHAT_DAY_AND_TIME
          : SEEKER_CHILD_CARE_ROUTES.RECAP;
    }

    if (pathname === SEEKER_DAYCARE_CHILD_CARE_ROUTES.MATCH) {
      nextRoute =
        splitAccCreationDC?.value === 2 || splitAccCreationDC?.value === 3
          ? SEEKER_SPLIT_ACCOUNT_DC.EMAIL
          : SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_CREATION;
    }

    if (!nextRoute) {
      return;
    }

    push(nextRoute);
  }, [push, pathname, flowName, czenServiceIdForMember, czenTimeIntent, zipcode]);

  return { goNext };
}

export default useFlowNavigation;
