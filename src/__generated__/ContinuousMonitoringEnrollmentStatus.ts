/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContinuousMonitoringEnrollmentStatus
// ====================================================

export interface ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus_consentMessagesList {
  __typename: "ConsentMessage";
  /**
   * The id of the message presented
   */
  consentMessageId: string | null;
  /**
   * Message stating that consent is currently still required
   */
  message: string | null;
}

export interface ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus {
  __typename: "ContinuousMonitoringEnrollmentStatusSuccess";
  /**
   * Provider needs to give consent
   */
  needsConsent: boolean;
  /**
   * Consent message to agree to
   */
  consentMessagesList: (ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus_consentMessagesList | null)[];
}

export interface ContinuousMonitoringEnrollmentStatus {
  /**
   * Query for getting a provider's enrollment status
   */
  continuousMonitoringEnrollmentStatus: ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus;
}

export interface ContinuousMonitoringEnrollmentStatusVariables {
  memberId: string;
}
