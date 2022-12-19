/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareProviderAttributesUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareProviderAttributesUpdate
// ====================================================

export interface seniorCareProviderAttributesUpdate_seniorCareProviderAttributesUpdate {
  __typename: "SeniorCareProviderAttributesUpdateSuccess";
  /**
   * Dummy field
   */
  dummy: string | null;
}

export interface seniorCareProviderAttributesUpdate {
  /**
   * Updates a provider with given attributes.
   */
  seniorCareProviderAttributesUpdate: seniorCareProviderAttributesUpdate_seniorCareProviderAttributesUpdate;
}

export interface seniorCareProviderAttributesUpdateVariables {
  input: SeniorCareProviderAttributesUpdateInput;
}
