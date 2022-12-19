/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNumberOfSeniorCareFacilitiesNearby
// ====================================================

export interface getNumberOfSeniorCareFacilitiesNearby_getNumberOfSeniorCareFacilitiesNearby {
  __typename: "GetNumberOfSeniorCareFacilitiesNearbySuccess";
  /**
   * The count of nearby facilities
   */
  count: number;
  /**
   * The count of Independent Living Facilities
   */
  countIndependentLivingFacilities: number;
  /**
   * The count of Assisted Living Facilities
   */
  countAssistedLivingFacilities: number;
  /**
   * The count of Memory Care Facilities
   */
  countMemoryCareFacilities: number;
}

export interface getNumberOfSeniorCareFacilitiesNearby {
  /**
   * Retrieves number of SeniorCare facilities within a radius of zipcode
   */
  getNumberOfSeniorCareFacilitiesNearby: getNumberOfSeniorCareFacilitiesNearby_getNumberOfSeniorCareFacilitiesNearby;
}

export interface getNumberOfSeniorCareFacilitiesNearbyVariables {
  zipcode: string;
  radius?: number | null;
  notSure: boolean;
  independentLivingFacilities: boolean;
  assistedLivingFacilities: boolean;
  memoryCareFacilities: boolean;
}
