/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNewJobsForProvider
// ====================================================

export interface getNewJobsForProvider_getNewJobsForProvider_payRange_hourlyRateFrom {
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

export interface getNewJobsForProvider_getNewJobsForProvider_payRange_hourlyRateTo {
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

export interface getNewJobsForProvider_getNewJobsForProvider_payRange {
  __typename: "PayRange";
  /**
   * Min hourly rate amount
   */
  hourlyRateFrom: getNewJobsForProvider_getNewJobsForProvider_payRange_hourlyRateFrom;
  /**
   * Max hourly rate amount
   */
  hourlyRateTo: getNewJobsForProvider_getNewJobsForProvider_payRange_hourlyRateTo;
}

export interface getNewJobsForProvider_getNewJobsForProvider {
  __typename: "JobSummary";
  /**
   * Title of the job.
   */
  title: string | null;
  /**
   * State where the job is located.
   */
  state: string;
  /**
   * Description of the job.
   */
  description: string | null;
  /**
   * City where the job is located.
   */
  city: string;
  /**
   * The minimum and maximum hourly rate of the job.
   */
  payRange: getNewJobsForProvider_getNewJobsForProvider_payRange;
  /**
   * When the new job was posted
   */
  jobPostDate: globalScalarDateTime;
}

export interface getNewJobsForProvider {
  /**
   * Returns the new jobs that this provider is eligible for.
   */
  getNewJobsForProvider: getNewJobsForProvider_getNewJobsForProvider[];
}

export interface getNewJobsForProviderVariables {
  numResults: number;
}
