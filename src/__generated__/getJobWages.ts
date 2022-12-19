/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getJobWages
// ====================================================

export interface getJobWages_getJobWages_averages_average {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getJobWages_getJobWages_averages_minimum {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getJobWages_getJobWages_averages_maximum {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getJobWages_getJobWages_averages {
  __typename: "JobRate";
  /**
   * Job rate average
   */
  average: getJobWages_getJobWages_averages_average;
  /**
   * Job rate minimum
   */
  minimum: getJobWages_getJobWages_averages_minimum;
  /**
   * Job rate maximum
   */
  maximum: getJobWages_getJobWages_averages_maximum;
}

export interface getJobWages_getJobWages_legalMinimum {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
}

export interface getJobWages_getJobWages {
  __typename: "WagesPayload";
  /**
   * Rate averages
   */
  averages: getJobWages_getJobWages_averages;
  /**
   * Legal minimum rate
   */
  legalMinimum: getJobWages_getJobWages_legalMinimum;
}

export interface getJobWages {
  /**
   * Gets the wage data for a given zip code.
   */
  getJobWages: getJobWages_getJobWages;
}

export interface getJobWagesVariables {
  zipcode: string;
  serviceType: ServiceType;
}
