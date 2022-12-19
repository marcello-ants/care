/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CzenCrmEventHiredCaregiverInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CzenCrmEventHiredCaregiverCreate
// ====================================================

export interface CzenCrmEventHiredCaregiverCreate_czenCrmEventHiredCaregiverCreate {
  __typename: "CzenCrmEventResponse";
  /**
   * The success of the mutation.
   */
  success: boolean;
}

export interface CzenCrmEventHiredCaregiverCreate {
  /**
   * Creates a Hired Caregiver CRM (Customer Relationship Management) event
   */
  czenCrmEventHiredCaregiverCreate: CzenCrmEventHiredCaregiverCreate_czenCrmEventHiredCaregiverCreate;
}

export interface CzenCrmEventHiredCaregiverCreateVariables {
  input: CzenCrmEventHiredCaregiverInput;
}
