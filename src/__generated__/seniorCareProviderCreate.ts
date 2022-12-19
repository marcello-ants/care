/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareProviderCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareProviderCreate
// ====================================================

export interface seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateSuccess {
  __typename: "SeniorCareProviderCreateSuccess";
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

export interface seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateError_errors {
  __typename: "MemberBlocklistedError" | "MemberEmailAlreadyRegistered" | "MemberEmailInvalid" | "MemberEmailInvalidFormat" | "MemberEmailInvalidLength" | "MemberFirstNameInvalid" | "MemberFirstNameInvalidCharacters" | "MemberFirstNameInvalidLength" | "MemberLastNameInvalid" | "MemberLastNameInvalidCharacters" | "MemberLastNameInvalidLength" | "MemberPasswordInvalid" | "MemberPasswordInvalidLength" | "MemberPasswordInvalidSequence" | "MemberPasswordInvalidTerms" | "MemberZipcodeInvalid";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateError {
  __typename: "SeniorCareProviderCreateError";
  /**
   * Errors that occurred when executing the seniorCareProviderCreate mutation.
   */
  errors: seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateError_errors[];
}

export type seniorCareProviderCreate_seniorCareProviderCreate = seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateSuccess | seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateError;

export interface seniorCareProviderCreate {
  /**
   * Creates a new provider account.
   */
  seniorCareProviderCreate: seniorCareProviderCreate_seniorCareProviderCreate;
}

export interface seniorCareProviderCreateVariables {
  input: SeniorCareProviderCreateInput;
}
