/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: providerFreeGatedCreate
// ====================================================

export interface providerFreeGatedCreate_providerFreeGatedCreate_ProviderFreeGatedCreateSuccess {
  __typename: "ProviderFreeGatedCreateSuccess";
  /**
   * Flag to denote the user as free gated
   */
  freeGated: boolean;
}

export interface providerFreeGatedCreate_providerFreeGatedCreate_ProviderFreeGatedCreateError {
  __typename: "ProviderFreeGatedCreateError";
}

export type providerFreeGatedCreate_providerFreeGatedCreate = providerFreeGatedCreate_providerFreeGatedCreate_ProviderFreeGatedCreateSuccess | providerFreeGatedCreate_providerFreeGatedCreate_ProviderFreeGatedCreateError;

export interface providerFreeGatedCreate {
  /**
   * Creates a new free gated provider account.
   */
  providerFreeGatedCreate: providerFreeGatedCreate_providerFreeGatedCreate;
}
