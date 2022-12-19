/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AutoAcceptChildCareLeadPublishInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: autoAcceptChildCareLeadPublish
// ====================================================

export interface autoAcceptChildCareLeadPublish_autoAcceptChildCareLeadPublish {
  __typename: "AutoAcceptChildCareLeadPublishResponse";
  /**
   * Batch id of creation lead operation
   */
  batchId: string | null;
}

export interface autoAcceptChildCareLeadPublish {
  /**
   * Creates an auto-accept lead
   */
  autoAcceptChildCareLeadPublish: autoAcceptChildCareLeadPublish_autoAcceptChildCareLeadPublish;
}

export interface autoAcceptChildCareLeadPublishVariables {
  autoAcceptChildCareLeadPublishInput: AutoAcceptChildCareLeadPublishInput;
}
