/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HousekeepingOneTimeJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: housekeepingOneTimeJobCreate
// ====================================================

export interface housekeepingOneTimeJobCreate_housekeepingOneTimeJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface housekeepingOneTimeJobCreate_housekeepingOneTimeJobCreate {
  __typename: "HousekeepingOneTimeJobCreatePayload";
  /**
   * Job information
   */
  job: housekeepingOneTimeJobCreate_housekeepingOneTimeJobCreate_job;
}

export interface housekeepingOneTimeJobCreate {
  /**
   * Creates a one time housekeeping job.
   */
  housekeepingOneTimeJobCreate: housekeepingOneTimeJobCreate_housekeepingOneTimeJobCreate;
}

export interface housekeepingOneTimeJobCreateVariables {
  input: HousekeepingOneTimeJobCreateInput;
}
