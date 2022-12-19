/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CzenCrmEventLeadsSubmittedInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: czenCrmEventCreateLeadsSubmitted
// ====================================================

export interface czenCrmEventCreateLeadsSubmitted_czenCrmEventCreateLeadsSubmitted {
  __typename: "CzenCrmEventResponse";
  /**
   * The success of the mutation.
   */
  success: boolean;
}

export interface czenCrmEventCreateLeadsSubmitted {
  /**
   * Creates a Leads Submitted CRM (Customer Relationship Management) event
   */
  czenCrmEventCreateLeadsSubmitted: czenCrmEventCreateLeadsSubmitted_czenCrmEventCreateLeadsSubmitted;
}

export interface czenCrmEventCreateLeadsSubmittedVariables {
  input: CzenCrmEventLeadsSubmittedInput;
}
