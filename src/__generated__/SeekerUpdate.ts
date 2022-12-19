/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeekerUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SeekerUpdate
// ====================================================

export interface SeekerUpdate_seekerUpdate {
  __typename: "SeekerUpdatePayload";
  /**
   * Boolean to signify success execution
   */
  success: boolean;
}

export interface SeekerUpdate {
  /**
   * Updates a Seeker
   */
  seekerUpdate: SeekerUpdate_seekerUpdate;
}

export interface SeekerUpdateVariables {
  input: SeekerUpdateInput;
}
