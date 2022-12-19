/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareSeekerCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareSeekerCreate
// ====================================================

export interface seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateSuccess {
  __typename: "SeniorCareSeekerCreateSuccess";
  /**
   * Auth token that can be used to make API requests on behalf of the user.
   */
  authToken: string;
  /**
   * MemberId
   */
  memberId: string;
  /**
   * A one time auth token, to be used to establish a logged in auth cookie.
   */
  oneTimeToken: string;
}

export interface seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateError_errors {
  __typename: "MemberBlocklistedError" | "MemberEmailAlreadyRegistered" | "MemberEmailInvalid" | "MemberEmailInvalidFormat" | "MemberEmailInvalidLength" | "MemberFirstNameInvalid" | "MemberFirstNameInvalidCharacters" | "MemberFirstNameInvalidLength" | "MemberLastNameInvalid" | "MemberLastNameInvalidCharacters" | "MemberLastNameInvalidLength" | "MemberPasswordInvalid" | "MemberPasswordInvalidLength" | "MemberPasswordInvalidSequence" | "MemberPasswordInvalidTerms" | "MemberZipcodeInvalid";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateError {
  __typename: "SeniorCareSeekerCreateError";
  /**
   * Errors that occurred when executing the seniorCareSeekerCreate mutation.
   */
  errors: seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateError_errors[];
}

export type seniorCareSeekerCreate_seniorCareSeekerCreate = seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateSuccess | seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateError;

export interface seniorCareSeekerCreate {
  /**
   * Creates a new senior care seeker account.
   */
  seniorCareSeekerCreate: seniorCareSeekerCreate_seniorCareSeekerCreate;
}

export interface seniorCareSeekerCreateVariables {
  input: SeniorCareSeekerCreateInput;
}
