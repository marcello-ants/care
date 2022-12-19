import { createContext, useContext, ReactNode, useState } from 'react';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';

interface FeatureFlagsProviderProps {
  children: ReactNode;
  flags: FeatureFlags;
}

export type featureFlagsState = {
  flags: FeatureFlags;
};

export type FeatureFlags = Record<string, LDEvaluationDetail | undefined>;

const initialState: featureFlagsState = {
  flags: {},
};

const FeatureFlagsContext = createContext<featureFlagsState>(initialState);

export const FeatureFlagsProvider = ({ children, flags }: FeatureFlagsProviderProps) => {
  const [state] = useState({ flags });
  return <FeatureFlagsContext.Provider value={state}>{children}</FeatureFlagsContext.Provider>;
};

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
