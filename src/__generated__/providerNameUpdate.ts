/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProviderNameUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: providerNameUpdate
// ====================================================

export interface providerNameUpdate_providerNameUpdate_ProviderNameUpdateError {
  __typename: "ProviderNameUpdateError";
}

export interface providerNameUpdate_providerNameUpdate_ProviderNameUpdateSuccess {
  __typename: "ProviderNameUpdateSuccess";
  /**
   * Unused placeholder field to make this type valid
   */
  dummy: string | null;
}

export type providerNameUpdate_providerNameUpdate = providerNameUpdate_providerNameUpdate_ProviderNameUpdateError | providerNameUpdate_providerNameUpdate_ProviderNameUpdateSuccess;

export interface providerNameUpdate {
  /**
   * Updates a provider's name
   */
  providerNameUpdate: providerNameUpdate_providerNameUpdate;
}

export interface providerNameUpdateVariables {
  input: ProviderNameUpdateInput;
}
