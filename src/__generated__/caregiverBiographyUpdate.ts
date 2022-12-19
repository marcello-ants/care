/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CaregiverBiographyUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: caregiverBiographyUpdate
// ====================================================

export interface caregiverBiographyUpdate_caregiverBiographyUpdate_CaregiverBiographyUpdateSuccess {
  __typename: "CaregiverBiographyUpdateSuccess";
}

export interface caregiverBiographyUpdate_caregiverBiographyUpdate_CaregiverBiographyUpdateResultError_errors {
  __typename: "CaregiverBioExperienceSummaryUpdateError" | "CaregiverBioHeadlineUpdateError";
  /**
   * Bio update error message
   */
  message: string;
}

export interface caregiverBiographyUpdate_caregiverBiographyUpdate_CaregiverBiographyUpdateResultError {
  __typename: "CaregiverBiographyUpdateResultError";
  /**
   * Errors while updating caregiver's bio
   */
  errors: caregiverBiographyUpdate_caregiverBiographyUpdate_CaregiverBiographyUpdateResultError_errors[];
}

export type caregiverBiographyUpdate_caregiverBiographyUpdate = caregiverBiographyUpdate_caregiverBiographyUpdate_CaregiverBiographyUpdateSuccess | caregiverBiographyUpdate_caregiverBiographyUpdate_CaregiverBiographyUpdateResultError;

export interface caregiverBiographyUpdate {
  /**
   * Updates a caregiver with a given biography.
   */
  caregiverBiographyUpdate: caregiverBiographyUpdate_caregiverBiographyUpdate;
}

export interface caregiverBiographyUpdateVariables {
  input: CaregiverBiographyUpdateInput;
}
