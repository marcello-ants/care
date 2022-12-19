/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType, CaregiverOverallStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getCaregiverProfileCompleteness
// ====================================================

export interface getCaregiverProfileCompleteness_getCaregiverProfileCompleteness_freeGated {
  __typename: "CaregiverFreeGatedProfileCompletenessStatus";
  /**
   * Caregiver has visited the app download page
   */
  appDownload: boolean | null;
  /**
   * Caregiver has completed the hourly rates page
   */
  hourlyRate: boolean | null;
  /**
   * Caregiver is returning after completing the entire flow
   */
  welcomeBack: boolean | null;
}

export interface getCaregiverProfileCompleteness_getCaregiverProfileCompleteness {
  __typename: "CaregiverProfileCompletenessStatus";
  /**
   * Caregiver has provided details like Have a Car, Comfortable WithPets, etc
   */
  additionalInfo: boolean | null;
  /**
   * Caregiver's availability is provided
   */
  availability: boolean | null;
  /**
   * Caregiver's experience summary for the service type is submitted
   */
  bio: boolean | null;
  /**
   * Caregiver's education details are submitted
   */
  education: boolean | null;
  /**
   * Caregiver's job interests are submitted
   */
  jobInterest: boolean | null;
  /**
   * Caregiver's languages preferences are saved
   */
  languages: boolean | null;
  /**
   * Caregiver's enrollment status
   */
  overallStatus: CaregiverOverallStatus;
  /**
   * Caregiver's additional qualifications are saved
   */
  qualities: boolean | null;
  /**
   * Caregiver has uploaded profile photo
   */
  photo: boolean | null;
  /**
   * Caregiver service interests are stored
   */
  services: boolean | null;
  /**
   * Caregiver has seen subscription page
   */
  subscriptionPlanViewed: boolean | null;
  /**
   * Caregiver is free gated and is going through the modified flow
   */
  freeGated: getCaregiverProfileCompleteness_getCaregiverProfileCompleteness_freeGated | null;
  /**
   * Caregiver's first name
   */
  firstName: string | null;
  /**
   * Caregiver's last name
   */
  lastName: string | null;
}

export interface getCaregiverProfileCompleteness {
  /**
   * Get caregiver enrollment completeness status for a given service type
   */
  getCaregiverProfileCompleteness: getCaregiverProfileCompleteness_getCaregiverProfileCompleteness;
}

export interface getCaregiverProfileCompletenessVariables {
  serviceType: ServiceType;
}
