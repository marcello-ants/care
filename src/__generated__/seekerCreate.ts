/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeekerCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seekerCreate
// ====================================================

export interface seekerCreate_seekerCreate_SeekerCreateSuccess {
  __typename: "SeekerCreateSuccess";
  /**
   * Auth token that can be used to make API requests on behalf of the user.
   */
  authToken: string;
  /**
   * MemberId
   */
  memberId: string;
}

export interface seekerCreate_seekerCreate_SeekerCreateError_errors {
  __typename: "MemberBlocklistedError" | "MemberEmailAlreadyRegistered" | "MemberEmailInvalid" | "MemberEmailInvalidFormat" | "MemberEmailInvalidLength" | "MemberFirstNameInvalid" | "MemberFirstNameInvalidCharacters" | "MemberFirstNameInvalidLength" | "MemberLastNameInvalid" | "MemberLastNameInvalidCharacters" | "MemberLastNameInvalidLength" | "MemberPasswordInvalid" | "MemberPasswordInvalidLength" | "MemberPasswordInvalidSequence" | "MemberPasswordInvalidTerms" | "MemberZipcodeInvalid";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface seekerCreate_seekerCreate_SeekerCreateError {
  __typename: "SeekerCreateError";
  /**
   * Errors that occurred when executing the seeker creation mutation.
   */
  errors: seekerCreate_seekerCreate_SeekerCreateError_errors[];
}

export type seekerCreate_seekerCreate = seekerCreate_seekerCreate_SeekerCreateSuccess | seekerCreate_seekerCreate_SeekerCreateError;

export interface seekerCreate {
  /**
   * Creates a new seeker account
   */
  seekerCreate: seekerCreate_seekerCreate;
}

export interface seekerCreateVariables {
  input: SeekerCreateInput;
}
