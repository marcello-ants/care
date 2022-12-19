/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getInstantBookLocationEligible
// ====================================================

export interface getInstantBookLocationEligible_getInstantBookLocationEligible {
  __typename: "GetInstantBookLocationEligibleSuccess";
  /**
   * Boolean showing if zipcode is eligible for instant book
   */
  eligible: boolean;
}

export interface getInstantBookLocationEligible {
  /**
   * Determines if zipcode is eligible for instant book
   */
  getInstantBookLocationEligible: getInstantBookLocationEligible_getInstantBookLocationEligible;
}

export interface getInstantBookLocationEligibleVariables {
  zipcode: string;
}
