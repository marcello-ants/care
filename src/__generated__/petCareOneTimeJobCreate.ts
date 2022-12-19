/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PetCareOneTimeJobCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: petCareOneTimeJobCreate
// ====================================================

export interface petCareOneTimeJobCreate_petCareOneTimeJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
}

export interface petCareOneTimeJobCreate_petCareOneTimeJobCreate {
  __typename: "PetCareOneTimeJobCreatePayload";
  /**
   * Job information
   */
  job: petCareOneTimeJobCreate_petCareOneTimeJobCreate_job;
}

export interface petCareOneTimeJobCreate {
  /**
   * Creates a one time Pet Care job.
   */
  petCareOneTimeJobCreate: petCareOneTimeJobCreate_petCareOneTimeJobCreate;
}

export interface petCareOneTimeJobCreateVariables {
  input: PetCareOneTimeJobCreateInput;
}
