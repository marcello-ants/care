/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType, DistanceInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getNumberOfNewJobsNearby
// ====================================================

export interface getNumberOfNewJobsNearby {
  /**
   * Get the number of new jobs in the zipcode of the user.
   */
  getNumberOfNewJobsNearby: number;
}

export interface getNumberOfNewJobsNearbyVariables {
  zipcode: string;
  serviceType: ServiceType;
  radius?: DistanceInput | null;
}
