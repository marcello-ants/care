/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChildCareLeadCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: postChildCareLead
// ====================================================

export interface postChildCareLead_childCareLeadCreate {
  __typename: "ChildCareLeadCreateResponse";
  /**
   * Batch id of creation lead operation
   */
  batchId: string | null;
}

export interface postChildCareLead {
  /**
   * Creates a child care lead for list of providers
   */
  childCareLeadCreate: postChildCareLead_childCareLeadCreate;
}

export interface postChildCareLeadVariables {
  childCareLeadInput: ChildCareLeadCreateInput;
}
