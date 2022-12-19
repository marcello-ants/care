/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType, ChildCareSearchCriteria } from "./globalTypes";

// ====================================================
// GraphQL query operation: getCaregiverCountForJob
// ====================================================

export interface getCaregiverCountForJob_getCaregiverCountForJob {
  __typename: "CaregiverCountPayload";
  /**
   * Caregiver Count
   */
  count: number | null;
}

export interface getCaregiverCountForJob {
  /**
   * Gets caregiver count for a job search
   */
  getCaregiverCountForJob: getCaregiverCountForJob_getCaregiverCountForJob;
}

export interface getCaregiverCountForJobVariables {
  zipcode: string;
  serviceType: ServiceType;
  childCareSearchCriteria?: ChildCareSearchCriteria | null;
}
