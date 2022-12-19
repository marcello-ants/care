export interface FlowState {
  flowName: string;
  memberId: string | undefined;
  czenJSessionId: string | undefined;
  referrerCookie: string | null | undefined;
  facebookData: {
    accessToken: string;
  };
  userHasAccount?: boolean;
  memberUuid: string | undefined;
}

export type FlowAction =
  | { type: 'setFlowName'; flowName: string }
  | { type: 'setMemberId'; memberId: string }
  | { type: 'setFbAccessToken'; accessToken: string };
