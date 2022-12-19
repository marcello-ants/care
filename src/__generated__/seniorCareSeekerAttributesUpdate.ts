/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareSeekerAttributesUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareSeekerAttributesUpdate
// ====================================================

export interface seniorCareSeekerAttributesUpdate_seniorCareSeekerAttributesUpdate {
  __typename: "SeniorCareSeekerAttributesUpdateSuccess";
  /**
   * The success of the attribute update mutation.
   */
  success: boolean | null;
}

export interface seniorCareSeekerAttributesUpdate {
  /**
   * Updates senior care seeker attributes such as memory care, care recipient condition, etc.
   */
  seniorCareSeekerAttributesUpdate: seniorCareSeekerAttributesUpdate_seniorCareSeekerAttributesUpdate;
}

export interface seniorCareSeekerAttributesUpdateVariables {
  input: SeniorCareSeekerAttributesUpdateInput;
}
