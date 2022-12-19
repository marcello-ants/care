/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: validateMemberEmail
// ====================================================

export interface validateMemberEmail_validateMemberEmail_errors {
  __typename: "MemberEmailAlreadyRegistered" | "MemberEmailInvalid" | "MemberEmailInvalidFormat" | "MemberEmailInvalidLength";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface validateMemberEmail_validateMemberEmail {
  __typename: "ValidateMemberEmailPayload";
  /**
   * Array of email validation errors.  The array will be empty when no validation errors were found.
   */
  errors: validateMemberEmail_validateMemberEmail_errors[];
}

export interface validateMemberEmail {
  /**
   * Validates a member's email address.
   */
  validateMemberEmail: validateMemberEmail_validateMemberEmail;
}

export interface validateMemberEmailVariables {
  email: string;
}
