/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareProviderAvailabilityUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareProviderAvailabilityUpdate
// ====================================================

export interface seniorCareProviderAvailabilityUpdate_seniorCareProviderAvailabilityUpdate {
  __typename: "SeniorCareProviderAvailabilityUpdateSuccess";
  /**
   * Dummy field
   */
  dummy: string | null;
}

export interface seniorCareProviderAvailabilityUpdate {
  /**
   * Updates a provider with a given availability.
   */
  seniorCareProviderAvailabilityUpdate: seniorCareProviderAvailabilityUpdate_seniorCareProviderAvailabilityUpdate;
}

export interface seniorCareProviderAvailabilityUpdateVariables {
  input: SeniorCareProviderAvailabilityUpdateInput;
}
