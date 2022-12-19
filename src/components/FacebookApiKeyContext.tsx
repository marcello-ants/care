import { createContext, useContext, ReactNode, useState } from 'react';

export type facebookApiKeyProviderState = {
  apiKey: string;
};

export type facebookApiKeyProviderProps = {
  children: ReactNode;
} & facebookApiKeyProviderState;

const initialState: facebookApiKeyProviderState = {
  apiKey: '',
};

const FacebookApiKeyContext = createContext<facebookApiKeyProviderState>(initialState);

export const FacebookApiKeyProvider = ({ apiKey, children }: facebookApiKeyProviderProps) => {
  const [state, setState] = useState<facebookApiKeyProviderState>({ apiKey });

  if (!state.apiKey) {
    setState({ apiKey });
  }
  return <FacebookApiKeyContext.Provider value={state}>{children}</FacebookApiKeyContext.Provider>;
};

FacebookApiKeyProvider.defaultProps = {
  apiKey: '',
};

export const useFacebookApiKey = () => useContext(FacebookApiKeyContext);
