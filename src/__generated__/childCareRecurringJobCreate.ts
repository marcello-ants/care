/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChildCareRecurringJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: childCareRecurringJobCreate
// ====================================================

export interface childCareRecurringJobCreate_childCareRecurringJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface childCareRecurringJobCreate_childCareRecurringJobCreate {
  __typename: "ChildCareRecurringJobCreatePayload";
  /**
   * Job information
   */
  job: childCareRecurringJobCreate_childCareRecurringJobCreate_job;
}

export interface childCareRecurringJobCreate {
  /**
   * Creates a recurring child care job.
   */
  childCareRecurringJobCreate: childCareRecurringJobCreate_childCareRecurringJobCreate;
}

export interface childCareRecurringJobCreateVariables {
  input: ChildCareRecurringJobCreateInput;
}
