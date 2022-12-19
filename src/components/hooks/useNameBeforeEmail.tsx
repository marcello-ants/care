import { useFlowState, useSeekerCCState } from '@/components/AppState';
import { isEligibleForNameBeforeEmail } from '@/utilities/isEligibleForNameBeforeEmail';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';

export const useIsEligibleForNameBeforeEmail = () => {
  const { careKind } = useSeekerCCState();
  const { flowName } = useFlowState();
  return isEligibleForNameBeforeEmail(careKind, flowName);
};

export const useIsEligibleAndTestVariantForNameBeforeEmail = () => {
  const featureFlags = useFeatureFlags();
  const nameBeforeEmailFlag = featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_NAME_BEFORE_EMAIL];
  return (
    useIsEligibleForNameBeforeEmail() &&
    typeof nameBeforeEmailFlag !== 'undefined' &&
    nameBeforeEmailFlag.variationIndex === 2
  );
};
