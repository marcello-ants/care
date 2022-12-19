/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */
import produce, { enableES5 } from 'immer';
import { CURRENT_STATE_VERSION, CURRENT_STATE_MAJOR_VERSION } from '../constants';
import { AppAction, AppState } from '../types/app';

import {
  SeekerAction,
  initialState as seekerInitialState,
  reducer as seekerReducer,
  validate as validateSeeker,
  doesSeekerStateHaveDefaultKeys,
} from './seeker';

import {
  SeekerCCAction,
  initialState as seekerCCInitialState,
  reducer as seekerCCReducer,
  validate as validateSeekerCC,
  doesSeekerCCStateHaveDefaultKeys,
} from './seekerCC';

import {
  ProviderAction,
  initialState as providerInitialState,
  reducer as providerReducer,
} from './provider';

import {
  ProviderCCAction,
  initialState as providerCCInitialState,
  reducer as providerCCReducer,
} from './providerCC';

import {
  SeekerHKAction,
  initialState as seekerHKInitialState,
  reducer as seekerHKReducer,
} from './seekerHK';

import {
  SeekerPCAction,
  initialState as seekerPCInitialState,
  reducer as seekerPCReducer,
} from './seekerPC';

import {
  SeekerTUAction,
  initialState as seekerTUInitialState,
  reducer as seekerTUReducer,
} from './seekerTU';

import { FlowAction, initialState as flowInitialState, reducer as flowReducer } from './flow';

import { LtcgAction, initialState as ltcgInitialState, reducer as ltcgReducer } from './ltcg';

// immer uses Proxy, but if that's not available the ES5 plugin needs to be enabled
/* istanbul ignore if */
if (typeof Proxy === 'undefined') {
  // thanks, IE 11
  enableES5();
}

export const initialAppState: AppState = {
  flow: flowInitialState,
  seeker: seekerInitialState,
  seekerCC: seekerCCInitialState,
  provider: providerInitialState,
  providerCC: providerCCInitialState,
  seekerHK: seekerHKInitialState,
  seekerPC: seekerPCInitialState,
  seekerTU: seekerTUInitialState,
  ltcg: ltcgInitialState,
  version: CURRENT_STATE_VERSION,
};

export const rootReducer = produce((draft: AppState, action: AppAction) => {
  draft.seeker = seekerReducer(draft.seeker, action as SeekerAction);
  draft.provider = providerReducer(draft.provider, action as ProviderAction);
  draft.providerCC = providerCCReducer(draft.providerCC, action as ProviderCCAction);
  draft.flow = flowReducer(draft.flow, action as FlowAction);
  draft.seekerCC = seekerCCReducer(draft.seekerCC, action as SeekerCCAction);
  draft.seekerHK = seekerHKReducer(draft.seekerHK, action as SeekerHKAction);
  draft.seekerPC = seekerPCReducer(draft.seekerPC, action as SeekerPCAction);
  draft.seekerTU = seekerTUReducer(draft.seekerTU, action as SeekerTUAction);
  draft.ltcg = ltcgReducer(draft.ltcg, action as LtcgAction);

  return draft;
});

export function validateState(state: AppState, pathName: string) {
  // TODO: call jobPost validation here instead of in AppState
  return validateSeeker(state, pathName) && validateSeekerCC(state, pathName);
}

export function isStateVersionCompatible(state: AppState) {
  if (state?.version) {
    const versionComponents = state.version.split('.');
    if (versionComponents.length === 3 && versionComponents[0] === CURRENT_STATE_MAJOR_VERSION) {
      return true;
    }
  }
  return false;
}

export function doesStateHaveDefaultKeys(state: AppState) {
  return (
    doesSeekerStateHaveDefaultKeys(state.seeker) && doesSeekerCCStateHaveDefaultKeys(state.seekerCC)
  );
}
