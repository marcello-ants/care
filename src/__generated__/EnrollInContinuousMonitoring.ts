/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EnrollInContinuousMonitoringInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EnrollInContinuousMonitoring
// ====================================================

export interface EnrollInContinuousMonitoring_enrollInContinuousMonitoring_EnrollInContinuousMonitoringError {
  __typename: "EnrollInContinuousMonitoringError";
}

export interface EnrollInContinuousMonitoring_enrollInContinuousMonitoring_EnrollInContinuousMonitoringSuccess {
  __typename: "EnrollInContinuousMonitoringSuccess";
  /**
   * Successful response for enrollment
   */
  success: boolean;
}

export type EnrollInContinuousMonitoring_enrollInContinuousMonitoring = EnrollInContinuousMonitoring_enrollInContinuousMonitoring_EnrollInContinuousMonitoringError | EnrollInContinuousMonitoring_enrollInContinuousMonitoring_EnrollInContinuousMonitoringSuccess;

export interface EnrollInContinuousMonitoring {
  /**
   * Enrolls in continuous monitoring
   */
  enrollInContinuousMonitoring: EnrollInContinuousMonitoring_enrollInContinuousMonitoring;
}

export interface EnrollInContinuousMonitoringVariables {
  input: EnrollInContinuousMonitoringInput;
}
