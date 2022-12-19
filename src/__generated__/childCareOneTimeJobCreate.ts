/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChildCareOneTimeJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: childCareOneTimeJobCreate
// ====================================================

export interface childCareOneTimeJobCreate_childCareOneTimeJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface childCareOneTimeJobCreate_childCareOneTimeJobCreate {
  __typename: "ChildCareOneTimeJobCreatePayload";
  /**
   * Job information
   */
  job: childCareOneTimeJobCreate_childCareOneTimeJobCreate_job;
}

export interface childCareOneTimeJobCreate {
  /**
   * Creates a one time child care job.
   */
  childCareOneTimeJobCreate: childCareOneTimeJobCreate_childCareOneTimeJobCreate;
}

export interface childCareOneTimeJobCreateVariables {
  input: ChildCareOneTimeJobCreateInput;
}
