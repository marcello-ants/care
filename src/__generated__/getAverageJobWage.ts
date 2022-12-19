/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getAverageJobWage
// ====================================================

export interface getAverageJobWage_getJobWages_averages_average {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getAverageJobWage_getJobWages_averages {
  __typename: "JobRate";
  /**
   * Job rate average
   */
  average: getAverageJobWage_getJobWages_averages_average;
}

export interface getAverageJobWage_getJobWages {
  __typename: "WagesPayload";
  /**
   * Rate averages
   */
  averages: getAverageJobWage_getJobWages_averages;
}

export interface getAverageJobWage {
  /**
   * Gets the wage data for a given zip code.
   */
  getJobWages: getAverageJobWage_getJobWages;
}

export interface getAverageJobWageVariables {
  zipcode: string;
  serviceType: ServiceType;
}
