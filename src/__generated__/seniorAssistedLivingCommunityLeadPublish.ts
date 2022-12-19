/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorAssistedLivingCommunityLeadPublishInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorAssistedLivingCommunityLeadPublish
// ====================================================

export interface seniorAssistedLivingCommunityLeadPublish_seniorAssistedLivingCommunityLeadPublish {
  __typename: "SeniorAssistedLivingCommunityLeadPublishResponse";
  /**
   * Batch id of creation lead operation
   */
  batchId: string | null;
}

export interface seniorAssistedLivingCommunityLeadPublish {
  /**
   * Publish senior assisted living community lead.
   */
  seniorAssistedLivingCommunityLeadPublish: seniorAssistedLivingCommunityLeadPublish_seniorAssistedLivingCommunityLeadPublish | null;
}

export interface seniorAssistedLivingCommunityLeadPublishVariables {
  input: SeniorAssistedLivingCommunityLeadPublishInput;
}
