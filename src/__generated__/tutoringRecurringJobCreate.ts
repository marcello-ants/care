/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TutoringRecurringJobCreateInput, ServiceType, JobStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: tutoringRecurringJobCreate
// ====================================================

export interface tutoringRecurringJobCreate_tutoringRecurringJobCreate_job {
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

export interface tutoringRecurringJobCreate_tutoringRecurringJobCreate {
  __typename: "TutoringRecurringJobCreatePayload";
  /**
   * Job information
   */
  job: tutoringRecurringJobCreate_tutoringRecurringJobCreate_job;
}

export interface tutoringRecurringJobCreate {
  /**
   * Creates a recurring Tutoring job.
   */
  tutoringRecurringJobCreate: tutoringRecurringJobCreate_tutoringRecurringJobCreate;
}

export interface tutoringRecurringJobCreateVariables {
  input: TutoringRecurringJobCreateInput;
}
