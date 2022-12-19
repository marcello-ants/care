/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getDefaultJobWages
// ====================================================

export interface getDefaultJobWages_getJobWages_legalMinimum {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getDefaultJobWages_getJobWages_defaultMaxWage {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getDefaultJobWages_getJobWages_defaultMinWage {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getDefaultJobWages_getJobWages_maxAllowed {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getDefaultJobWages_getJobWages {
  __typename: "WagesPayload";
  /**
   * Legal minimum rate
   */
  legalMinimum: getDefaultJobWages_getJobWages_legalMinimum;
  /**
   * Default Max Wage
   */
  defaultMaxWage: getDefaultJobWages_getJobWages_defaultMaxWage;
  /**
   * Default Min Wage
   */
  defaultMinWage: getDefaultJobWages_getJobWages_defaultMinWage;
  /**
   * Max wage user can choose
   */
  maxAllowed: getDefaultJobWages_getJobWages_maxAllowed;
}

export interface getDefaultJobWages {
  /**
   * Gets the wage data for a given zip code.
   */
  getJobWages: getDefaultJobWages_getJobWages;
}

export interface getDefaultJobWagesVariables {
  zipcode: string;
  serviceType: ServiceType;
}
