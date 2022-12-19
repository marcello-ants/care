/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: validateMemberPassword
// ====================================================

export interface validateMemberPassword_validateMemberPassword_errors {
  __typename: "MemberPasswordInvalid" | "MemberPasswordInvalidLength" | "MemberPasswordInvalidSequence" | "MemberPasswordInvalidTerms";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface validateMemberPassword_validateMemberPassword {
  __typename: "ValidateMemberPasswordPayload";
  /**
   * Array of password validation errors.  The array will be empty when no validation errors were found.
   */
  errors: validateMemberPassword_validateMemberPassword_errors[];
}

export interface validateMemberPassword {
  /**
   * Validates a member's password.
   */
  validateMemberPassword: validateMemberPassword_validateMemberPassword;
}

export interface validateMemberPasswordVariables {
  password: string;
}
