/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HomePayProspectInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createHomePayProspect
// ====================================================

export interface createHomePayProspect_createHomePayProspect_CreateHomePayProspectError {
  __typename: "CreateHomePayProspectError";
}

export interface createHomePayProspect_createHomePayProspect_CreateHomePayProspectSuccess_prospect {
  __typename: "ProspectResult";
  /**
   * Prospect Id
   */
  prospectId: string;
}

export interface createHomePayProspect_createHomePayProspect_CreateHomePayProspectSuccess {
  __typename: "CreateHomePayProspectSuccess";
  /**
   * Summary of the created Prospect
   */
  prospect: createHomePayProspect_createHomePayProspect_CreateHomePayProspectSuccess_prospect;
}

export type createHomePayProspect_createHomePayProspect = createHomePayProspect_createHomePayProspect_CreateHomePayProspectError | createHomePayProspect_createHomePayProspect_CreateHomePayProspectSuccess;

export interface createHomePayProspect {
  /**
   * Create HomePay Prospect
   */
  createHomePayProspect: createHomePayProspect_createHomePayProspect;
}

export interface createHomePayProspectVariables {
  input: HomePayProspectInput;
}
