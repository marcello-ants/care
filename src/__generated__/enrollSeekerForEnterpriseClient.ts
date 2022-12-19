/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EnterpriseEmployeeEnrollmentDetails } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: enrollSeekerForEnterpriseClient
// ====================================================

export interface enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient_EnterpriseEmployeeEnrollmentSuccess {
  __typename: "EnterpriseEmployeeEnrollmentSuccess";
  /**
   * Auth token that can be used to make API requests on behalf of the user
   */
  authToken: string;
  /**
   * Member ID of the enrolled employee
   */
  memberId: string;
  /**
   * One time token for oidc proxy login
   */
  oneTimeToken: string | null;
}

export interface enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient_EnterpriseEnrollmentProcessFailure_errors {
  __typename: "EnterpriseEnrollmentProcessErrors";
  /**
   * The list of error messages
   */
  errorMessages: string[];
}

export interface enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient_EnterpriseEnrollmentProcessFailure {
  __typename: "EnterpriseEnrollmentProcessFailure";
  /**
   * List of errors
   */
  errors: enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient_EnterpriseEnrollmentProcessFailure_errors[];
}

export type enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient = enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient_EnterpriseEmployeeEnrollmentSuccess | enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient_EnterpriseEnrollmentProcessFailure;

export interface enrollSeekerForEnterpriseClient {
  /**
   * Enroll seeker into the enterprise client
   */
  enrollSeekerForEnterpriseClient: enrollSeekerForEnterpriseClient_enrollSeekerForEnterpriseClient;
}

export interface enrollSeekerForEnterpriseClientVariables {
  employeeEnrollmentDetails: EnterpriseEmployeeEnrollmentDetails;
}
