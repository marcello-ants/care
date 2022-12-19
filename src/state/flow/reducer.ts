/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import produce from 'immer';
import { FlowAction, FlowState } from '../../types/flow';

export const initialState: FlowState = {
  flowName: '',
  memberId: undefined,
  czenJSessionId: undefined,
  referrerCookie: undefined,
  facebookData: {
    accessToken: '',
  },
  memberUuid: undefined,
};

export const reducer = produce((draft: FlowState, action: FlowAction) => {
  switch (action.type) {
    case 'setFlowName':
      draft.flowName = action.flowName;
      return draft;
    case 'setMemberId':
      draft.memberId = action.memberId;
      return draft;
    case 'setFbAccessToken':
      draft.facebookData.accessToken = action.accessToken;
      return draft;
    default:
      return draft;
  }
});
