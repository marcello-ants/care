/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MemberChangePasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeMemberPassword
// ====================================================

export interface changeMemberPassword_memberChangePassword_MemberChangePasswordSuccess {
  __typename: "MemberChangePasswordSuccess";
  /**
   * Auth token that can be used to make API requests on behalf of the user.
   */
  authToken: string;
}

export interface changeMemberPassword_memberChangePassword_MemberChangePasswordError_errors {
  __typename: "MemberPasswordInvalidLength" | "MemberPasswordInvalidSequence" | "MemberPasswordInvalidTerms" | "MemberPasswordInvalid";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface changeMemberPassword_memberChangePassword_MemberChangePasswordError {
  __typename: "MemberChangePasswordError";
  /**
   * Errors that occurred when executing the memberChangePassword mutation.
   */
  errors: changeMemberPassword_memberChangePassword_MemberChangePasswordError_errors[];
}

export type changeMemberPassword_memberChangePassword = changeMemberPassword_memberChangePassword_MemberChangePasswordSuccess | changeMemberPassword_memberChangePassword_MemberChangePasswordError;

export interface changeMemberPassword {
  /**
   * Change member's password
   */
  memberChangePassword: changeMemberPassword_memberChangePassword;
}

export interface changeMemberPasswordVariables {
  passwordInput: MemberChangePasswordInput;
}
