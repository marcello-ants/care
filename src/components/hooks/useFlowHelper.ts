import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { uniq } from 'lodash-es';
import {
  FLOW_ROUTES_AND_STEP_NUMBERS,
  FLOWS,
  SEEKER_CHILD_CARE_ROUTES,
  SEEKER_ROUTES,
  CLIENT_FEATURE_FLAGS,
  SEEKER_INSTANT_BOOK_ROUTES,
} from '@/constants';
import { SeekerCCState } from '@/types/seekerCC';
import { useFlowState, useSeekerCCState, useSeekerState } from '@/components/AppState';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { isEligibleAndTestVariantForNameBeforeEmail } from '@/utilities/isEligibleForNameBeforeEmail';
import { FeatureFlags, useFeatureFlags } from '../FeatureFlagsContext';

const findCurrentFlow = (path: string) =>
  Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS).find((flow) =>
    Object.keys(FLOW_ROUTES_AND_STEP_NUMBERS[flow]).includes(path)
  );
const getStepsLength = (seekerCCState: SeekerCCState, flowName: string) => {
  let count = uniq(Object.values(FLOW_ROUTES_AND_STEP_NUMBERS[flowName])).length;

  if (
    flowName === FLOWS.SEEKER_CHILD_CARE.name ||
    flowName === FLOWS.SEEKER_DAYCARE_CHILD_CARE.name
  ) {
    if (seekerCCState.czenServiceIdForMember) count -= 1;
    if (seekerCCState.czenTimeIntent) count -= 1;
  }

  return count;
};
const getStepNumber = (
  seekerCCState: SeekerCCState,
  flowName: string,
  path: string,
  flags: FeatureFlags
) => {
  const flow = FLOW_ROUTES_AND_STEP_NUMBERS[flowName];
  let number = flow[path];

  if (flowName === FLOWS.SEEKER_CHILD_CARE.name) {
    const steps = Object.keys(flow);
    const dateIndex = steps.findIndex((route) => route === SEEKER_CHILD_CARE_ROUTES.CARE_DATE);
    const kindIndex = steps.findIndex((route) => route === SEEKER_CHILD_CARE_ROUTES.CARE_KIND);
    const currentIndex = steps.findIndex((route) => route === path);

    if (seekerCCState.czenTimeIntent && currentIndex > dateIndex) number -= 1;
    if (seekerCCState.czenServiceIdForMember && currentIndex > kindIndex) number -= 1;
    if (isEligibleAndTestVariantForNameBeforeEmail(seekerCCState.careKind, flowName, flags)) {
      if (path === SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_NAME) {
        number -= 1;
      } else if (path === SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL) {
        number += 1;
      }
    }
  } else if (flowName === FLOWS.SEEKER_DAYCARE_CHILD_CARE.name) {
    if (seekerCCState.czenTimeIntent) number -= 1;
    if (seekerCCState.czenServiceIdForMember) number -= 1;
  } else if (flowName === FLOWS.SEEKER_INSTANT_BOOK.name) {
    if (
      !seekerCCState.instantBook.isHomeAddress &&
      (path === SEEKER_INSTANT_BOOK_ROUTES.NAME || path === SEEKER_INSTANT_BOOK_ROUTES.LAST_STEP)
    ) {
      number += 1;
    }
  }
  return number;
};

const useFlowHelper = () => {
  const { asPath } = useRouter();
  const seekerCCState = useSeekerCCState();
  const { typeOfCare } = useSeekerState();
  const path = asPath.split('?')[0];
  const { flowName } = useFlowState();
  const { flags } = useFeatureFlags();

  let currentFlow = useMemo(() => findCurrentFlow(path), [path]);

  if (path === SEEKER_CHILD_CARE_ROUTES.INDEX) {
    currentFlow = flowName;
  }

  if (typeOfCare === SENIOR_CARE_TYPE.IN_FACILITY && currentFlow === 'SEEKER') {
    currentFlow = FLOWS.SEEKER_IN_FACILITY.name;
  }

  const totalSteps = useMemo(
    () => (currentFlow ? getStepsLength(seekerCCState, currentFlow) : 0),
    [currentFlow, seekerCCState]
  );
  const stepNumber = currentFlow ? getStepNumber(seekerCCState, currentFlow, path, flags) : 0;

  // For Remove Step Counter in Enrollment (CC + DC) Test
  // https://carecom.atlassian.net/browse/GROW-3178
  const isCcOrDcFlow =
    flowName === FLOWS.SEEKER_CHILD_CARE.name || flowName === FLOWS.SEEKER_DAYCARE_CHILD_CARE.name;

  const isRemoveStepCounterTest =
    isCcOrDcFlow && flags?.[CLIENT_FEATURE_FLAGS.CC_DC_REMOVE_STEP_COUNTER]?.value === 2;

  if (isCcOrDcFlow) {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.CC_DC_REMOVE_STEP_COUNTER,
      flags?.[CLIENT_FEATURE_FLAGS.CC_DC_REMOVE_STEP_COUNTER]
    );
  }

  const hideStepNumber =
    path.indexOf(FLOWS.PROVIDER.path) >= 0 ||
    path === SEEKER_ROUTES.INDEX ||
    path.indexOf(FLOWS.SEEKER_IN_FACILITY.path) >= 0 ||
    currentFlow === FLOWS.SEEKER_IN_FACILITY.name ||
    currentFlow === FLOWS.LTCG.name ||
    path.includes('recap') ||
    isRemoveStepCounterTest;

  const hideProgressIndicator =
    path === SEEKER_ROUTES.INDEX || (!path.includes('in-facility') && path.includes('recap'));

  const showBottomBorder = path.includes('/ib/recap');

  return {
    currentFlow,
    totalSteps,
    stepNumber,
    hideStepNumber,
    hideProgressIndicator,
    showBottomBorder,
  };
};

export default useFlowHelper;
