/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getCaregiver
// ====================================================

export interface getCaregiver_getCaregiver_member {
  __typename: "Member";
  /**
   * Display name of member , should be shown before booking confirms
   */
  displayName: string;
  /**
   * First name of the member
   */
  firstName: string;
  /**
   * Image Url can be null if member has not uploaded photo
   */
  imageURL: globalScalarURL | null;
  /**
   * Uuid of the member
   */
  id: string;
}

export interface getCaregiver_getCaregiver {
  __typename: "Caregiver";
  /**
   * User/member information for this caregiver
   */
  member: getCaregiver_getCaregiver_member;
}

export interface getCaregiver {
  /**
   * Get caregiver Details , We need to provider specific service type needed
   */
  getCaregiver: getCaregiver_getCaregiver;
}

export interface getCaregiverVariables {
  id: string;
  serviceId?: ServiceType | null;
}
