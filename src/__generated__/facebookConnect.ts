/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FacebookConnectInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: facebookConnect
// ====================================================

export interface facebookConnect_facebookConnect_FacebookConnectError {
  __typename: "FacebookConnectError";
}

export interface facebookConnect_facebookConnect_FacebookConnectSuccess {
  __typename: "FacebookConnectSuccess";
  /**
   * Facebook's user id connected to the member
   */
  facebookUserId: string;
}

export type facebookConnect_facebookConnect = facebookConnect_facebookConnect_FacebookConnectError | facebookConnect_facebookConnect_FacebookConnectSuccess;

export interface facebookConnect {
  /**
   * Connects a Facebook user to a member with a matching email adress or fb_user_id
   */
  facebookConnect: facebookConnect_facebookConnect;
}

export interface facebookConnectVariables {
  input: FacebookConnectInput;
}
