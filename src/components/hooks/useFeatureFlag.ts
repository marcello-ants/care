import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { FeatureFlags, useFeatureFlags } from '../FeatureFlagsContext';

type ClientFeatureFlags = keyof typeof CLIENT_FEATURE_FLAGS;
export type FlagName = typeof CLIENT_FEATURE_FLAGS[ClientFeatureFlags];

export default function useFeatureFlag(flagName: FlagName): FeatureFlags[string] {
  const featureFlags = useFeatureFlags();
  return featureFlags.flags[flagName];
}
