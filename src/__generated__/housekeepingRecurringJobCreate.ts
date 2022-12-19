/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HousekeepingRecurringJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: housekeepingRecurringJobCreate
// ====================================================

export interface housekeepingRecurringJobCreate_housekeepingRecurringJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface housekeepingRecurringJobCreate_housekeepingRecurringJobCreate {
  __typename: "HousekeepingRecurringJobCreatePayload";
  /**
   * Job information
   */
  job: housekeepingRecurringJobCreate_housekeepingRecurringJobCreate_job;
}

export interface housekeepingRecurringJobCreate {
  /**
   * Creates a recurring housekeeping job.
   */
  housekeepingRecurringJobCreate: housekeepingRecurringJobCreate_housekeepingRecurringJobCreate;
}

export interface housekeepingRecurringJobCreateVariables {
  input: HousekeepingRecurringJobCreateInput;
}
