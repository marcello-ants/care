/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProviderAvailabilityUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: providerAvailabilityUpdate
// ====================================================

export interface providerAvailabilityUpdate_providerAvailabilityUpdate {
  __typename: "ProviderAvailabilityUpdateSuccess";
  /**
   * Dummy field
   */
  dummy: string | null;
}

export interface providerAvailabilityUpdate {
  /**
   * Updates a provider with a given availability.
   */
  providerAvailabilityUpdate: providerAvailabilityUpdate_providerAvailabilityUpdate;
}

export interface providerAvailabilityUpdateVariables {
  input: ProviderAvailabilityUpdateInput;
}
