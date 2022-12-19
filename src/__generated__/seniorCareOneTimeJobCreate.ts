/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareOneTimeJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareOneTimeJobCreate
// ====================================================

export interface seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreatePayload_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreatePayload {
  __typename: "SeniorCareOneTimeJobCreatePayload";
  /**
   * Job information
   */
  job: seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreatePayload_job;
}

export interface seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreateError_errors {
  __typename: "InappropriateLanguageInput";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreateError {
  __typename: "SeniorCareOneTimeJobCreateError";
  /**
   * Errors that occurred when executing the SeniorCareOneTimeJobCreate mutation.
   */
  errors: seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreateError_errors[];
}

export type seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate = seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreatePayload | seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreateError;

export interface seniorCareOneTimeJobCreate {
  /**
   * Creates a one time senior care job.
   */
  seniorCareOneTimeJobCreate: seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate;
}

export interface seniorCareOneTimeJobCreateVariables {
  input: SeniorCareOneTimeJobCreateInput;
}
