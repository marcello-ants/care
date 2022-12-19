/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PetCareRecurringJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: petCareRecurringJobCreate
// ====================================================

export interface petCareRecurringJobCreate_petCareRecurringJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface petCareRecurringJobCreate_petCareRecurringJobCreate {
  __typename: "PetCareRecurringJobCreatePayload";
  /**
   * Job information
   */
  job: petCareRecurringJobCreate_petCareRecurringJobCreate_job;
}

export interface petCareRecurringJobCreate {
  /**
   * Creates a recurring Pet Care job.
   */
  petCareRecurringJobCreate: petCareRecurringJobCreate_petCareRecurringJobCreate;
}

export interface petCareRecurringJobCreateVariables {
  input: PetCareRecurringJobCreateInput;
}
