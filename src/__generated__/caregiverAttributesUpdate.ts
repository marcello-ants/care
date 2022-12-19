/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CaregiverAttributesUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: caregiverAttributesUpdate
// ====================================================

export interface caregiverAttributesUpdate_caregiverAttributesUpdate {
  __typename: "CaregiverAttributesUpdateSuccess";
  /**
   * Dummy field
   */
  dummy: string | null;
}

export interface caregiverAttributesUpdate {
  /**
   * # Updates caregiver attributes
   */
  caregiverAttributesUpdate: caregiverAttributesUpdate_caregiverAttributesUpdate;
}

export interface caregiverAttributesUpdateVariables {
  input: CaregiverAttributesUpdateInput;
}
