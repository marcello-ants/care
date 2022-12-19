/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProviderJobInterestUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: providerJobInterestUpdate
// ====================================================

export interface providerJobInterestUpdate_providerJobInterestUpdate {
  __typename: "ProviderJobInterestUpdateSuccess";
  /**
   * Dummy field
   */
  dummy: string | null;
}

export interface providerJobInterestUpdate {
  /**
   * Updates a provider with job interest data
   */
  providerJobInterestUpdate: providerJobInterestUpdate_providerJobInterestUpdate;
}

export interface providerJobInterestUpdateVariables {
  input: ProviderJobInterestUpdateInput;
}
