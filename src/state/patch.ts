/* istanbul ignore file */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */
import { merge } from 'lodash-es';
import produce from 'immer';
import { AppState } from '../types/app';
import { initialState as initialSeekerCCState } from './seekerCC/reducer';
import { initialState as initialSeekerHKState } from './seekerHK/reducer';
import { initialState as initialSeekerPCState } from './seekerPC/reducer';
import { initialState as initialSeekerTUState } from './seekerTU/reducer';
import { initialState as initialProviderCCState } from './providerCC/reducer';
import { seekerInfoInitialState } from './seeker/reducer';

/**
 * Makes any necessary changes to ensure the provided app state is compatible with the app
 * @param state app state (typically a version retrieved from local storage)
 */
export default function patchAppState(state: AppState, defaultState: AppState) {
  return produce(state, (draft) => {
    draft.flow = merge({}, defaultState.flow, state.flow);

    if (!state.seekerCC) {
      draft.seekerCC = initialSeekerCCState;
    } else {
      // apply defaults that might be missing in case of a change in shape of state from one version to another
      draft.seekerCC = merge({}, initialSeekerCCState, draft.seekerCC);
    }

    if (!state.providerCC) {
      draft.providerCC = initialProviderCCState;
    } else {
      draft.providerCC = merge({}, initialProviderCCState, draft.providerCC);
    }

    if (!state.seekerHK) {
      draft.seekerHK = initialSeekerHKState;
    } else {
      draft.seekerHK = merge({}, initialSeekerHKState, draft.seekerHK);
    }

    if (!state.seekerPC) {
      draft.seekerPC = initialSeekerPCState;
    } else {
      draft.seekerPC = merge({}, initialSeekerPCState, draft.seekerPC);
    }

    if (!state.seekerTU) {
      draft.seekerTU = initialSeekerTUState;
    } else {
      draft.seekerTU = merge({}, initialSeekerTUState, draft.seekerTU);
    }

    if (!state?.seeker?.jobPost) {
      draft.seeker = state.seeker || {};
      // @ts-ignore
      draft.seeker.jobPost = draft.jobPost;
    }

    if (!state.seeker?.leadAndConnect) {
      draft.seeker.leadAndConnect = { acceptedProviders: [], maxDistanceFromSeeker: 10 };
    } else if (!state.seeker.leadAndConnect.maxDistanceFromSeeker) {
      draft.seeker.leadAndConnect.maxDistanceFromSeeker = 10;
    }

    if (!state.seeker?.seekerInfo) {
      draft.seeker = state.seeker || {};
      draft.seeker.seekerInfo = seekerInfoInitialState;
    }

    return draft;
  });
}
