import useFeatureFlag, { FlagName } from '@/components/hooks/useFeatureFlag';
import { CLIENT_FEATURE_FLAGS, VerticalsAbbreviation } from '@/constants';
import { HDYHAU_VERTICALS_ALLOWANCE } from '@/components/pages/seeker/three-step-account-creation/constants';

export default function useHDYHAU({ vertical }: { vertical: VerticalsAbbreviation }) {
  let flagName = CLIENT_FEATURE_FLAGS.HDYHAU as FlagName;
  let hdyhauFlagEvaluation = useFeatureFlag(flagName);

  let showHDYHAU =
    HDYHAU_VERTICALS_ALLOWANCE.includes(vertical) || hdyhauFlagEvaluation?.variationIndex === 1;

  if (vertical === 'DC') {
    flagName = CLIENT_FEATURE_FLAGS.DAYCARE_HDYHAU;
    hdyhauFlagEvaluation = useFeatureFlag(flagName);
    showHDYHAU = hdyhauFlagEvaluation?.value !== 2;
  }

  return { showHDYHAU, hdyhauFlagEvaluation, flagName };
}
