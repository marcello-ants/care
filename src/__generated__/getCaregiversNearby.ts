/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType, SubServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getCaregiversNearby
// ====================================================

export interface getCaregiversNearby {
  /**
   * Get the number caregivers in the area near the user.
   */
  getCaregiversNearby: number;
}

export interface getCaregiversNearbyVariables {
  zipcode: string;
  serviceType: ServiceType;
  radius: number;
  subServiceType?: SubServiceType | null;
}
