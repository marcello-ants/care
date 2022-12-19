/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCommunityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getSeniorFacilityMonthlyCost
// ====================================================

export interface getSeniorFacilityMonthlyCost_seniorFacilityMonthlyCost_amount {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface getSeniorFacilityMonthlyCost_seniorFacilityMonthlyCost {
  __typename: "SeniorFacilityMonthlyCostSuccess";
  /**
   * The average monthly cost for senior living communities
   */
  amount: getSeniorFacilityMonthlyCost_seniorFacilityMonthlyCost_amount | null;
}

export interface getSeniorFacilityMonthlyCost {
  /**
   * Get the average monthly cost for senior living communities
   */
  seniorFacilityMonthlyCost: getSeniorFacilityMonthlyCost_seniorFacilityMonthlyCost;
}

export interface getSeniorFacilityMonthlyCostVariables {
  zipcode: string;
  communityType?: SeniorCommunityType | null;
}
