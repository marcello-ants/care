/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CzenCrmEventLeadsSubmittedInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: czenCrmEventCreateSALCLeadsSubmitted
// ====================================================

export interface czenCrmEventCreateSALCLeadsSubmitted_czenCrmEventCreateLeadsSubmitted {
  __typename: "CzenCrmEventResponse";
  /**
   * The success of the mutation.
   */
  success: boolean;
}

export interface czenCrmEventCreateSALCLeadsSubmitted {
  /**
   * Creates a Leads Submitted CRM (Customer Relationship Management) event
   */
  czenCrmEventCreateLeadsSubmitted: czenCrmEventCreateSALCLeadsSubmitted_czenCrmEventCreateLeadsSubmitted;
}

export interface czenCrmEventCreateSALCLeadsSubmittedVariables {
  input: CzenCrmEventLeadsSubmittedInput;
}
