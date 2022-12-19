/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareRecurringJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareRecurringJobCreate
// ====================================================

export interface seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreatePayload_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreatePayload {
  __typename: "SeniorCareRecurringJobCreatePayload";
  /**
   * Job information
   */
  job: seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreatePayload_job;
}

export interface seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreateError_errors {
  __typename: "InappropriateLanguageInput";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreateError {
  __typename: "SeniorCareRecurringJobCreateError";
  /**
   * Errors that occurred when executing the SeniorCareRecurringJobCreate mutation.
   */
  errors: seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreateError_errors[];
}

export type seniorCareRecurringJobCreate_seniorCareRecurringJobCreate = seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreatePayload | seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreateError;

export interface seniorCareRecurringJobCreate {
  /**
   * Creates a recurring senior care job.
   */
  seniorCareRecurringJobCreate: seniorCareRecurringJobCreate_seniorCareRecurringJobCreate;
}

export interface seniorCareRecurringJobCreateVariables {
  input: SeniorCareRecurringJobCreateInput;
}
