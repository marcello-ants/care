import { CareKind, DefaultCareKind } from '@/types/seekerCC';
import { CLIENT_FEATURE_FLAGS, FLOWS } from '@/constants';
import { FeatureFlags } from '@/components/FeatureFlagsContext';

export const isEligibleForNameBeforeEmail = (careKind: CareKind, flowName: string) => {
  return (
    flowName === FLOWS.SEEKER_CHILD_CARE.name && careKind !== DefaultCareKind.ONE_TIME_BABYSITTERS
  );
};

export const isEligibleAndTestVariantForNameBeforeEmail = (
  careKind: CareKind,
  flowName: string,
  flags: FeatureFlags
) => {
  const nameBeforeEmailFlag = flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_NAME_BEFORE_EMAIL];
  return (
    isEligibleForNameBeforeEmail(careKind, flowName) &&
    typeof nameBeforeEmailFlag !== 'undefined' &&
    nameBeforeEmailFlag.variationIndex === 2
  );
};
