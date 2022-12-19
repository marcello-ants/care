/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProviderCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: providerCreate
// ====================================================

export interface providerCreate_providerCreate_ProviderCreateSuccess {
  __typename: "ProviderCreateSuccess";
  /**
   * Auth token that can be used to make API requests on behalf of the user.
   */
  authToken: string;
  /**
   * MemberId of the newly created provider
   */
  memberId: string;
  /**
   * A one time auth token, to be used to establish a logged in auth cookie.
   */
  oneTimeToken: string;
}

export interface providerCreate_providerCreate_ProviderCreateError_errors {
  __typename: "MemberBlocklistedError" | "MemberEmailAlreadyRegistered" | "MemberEmailInvalid" | "MemberEmailInvalidFormat" | "MemberEmailInvalidLength" | "MemberFirstNameInvalid" | "MemberFirstNameInvalidCharacters" | "MemberFirstNameInvalidLength" | "MemberLastNameInvalid" | "MemberLastNameInvalidCharacters" | "MemberLastNameInvalidLength" | "MemberPasswordInvalid" | "MemberPasswordInvalidLength" | "MemberPasswordInvalidSequence" | "MemberPasswordInvalidTerms" | "MemberZipcodeInvalid";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface providerCreate_providerCreate_ProviderCreateError {
  __typename: "ProviderCreateError";
  /**
   * Errors that occurred when executing the providerCreate mutation.
   */
  errors: providerCreate_providerCreate_ProviderCreateError_errors[];
}

export type providerCreate_providerCreate = providerCreate_providerCreate_ProviderCreateSuccess | providerCreate_providerCreate_ProviderCreateError;

export interface providerCreate {
  /**
   * Creates a new provider account.
   */
  providerCreate: providerCreate_providerCreate;
}

export interface providerCreateVariables {
  input: ProviderCreateInput;
}
