/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TutoringOneTimeJobCreateInput, ServiceType, JobStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: tutoringOneTimeJobCreate
// ====================================================

export interface tutoringOneTimeJobCreate_tutoringOneTimeJobCreate_job {
  __typename: "Job";
  /**
   * ID of the job.
   */
  id: string;
  /**
   * The job service type
   */
  serviceType: ServiceType;
  /**
   * The job start date
   */
  startDate: globalScalarLocalDate;
  /**
   * The job status
   */
  status: JobStatus;
  /**
   * The title of the job advertisement
   */
  title: string;
}

export interface tutoringOneTimeJobCreate_tutoringOneTimeJobCreate {
  __typename: "TutoringOneTimeJobCreatePayload";
  /**
   * Job information
   */
  job: tutoringOneTimeJobCreate_tutoringOneTimeJobCreate_job;
}

export interface tutoringOneTimeJobCreate {
  /**
   * Creates a one time Tutoring job.
   */
  tutoringOneTimeJobCreate: tutoringOneTimeJobCreate_tutoringOneTimeJobCreate;
}

export interface tutoringOneTimeJobCreateVariables {
  input: TutoringOneTimeJobCreateInput;
}
