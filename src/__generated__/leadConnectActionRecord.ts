/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LeadConnectActionRecordInput, ActorType, ActionType, ServiceType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: leadConnectActionRecord
// ====================================================

export interface leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordPayload_impression {
  __typename: "Impression";
  /**
   * Requested user ID
   */
  actorId: string;
  /**
   * Target ID
   */
  targetId: string;
  /**
   * Actor type
   */
  actorType: ActorType | null;
  /**
   * Action type
   */
  actionType: ActionType | null;
  /**
   * Type of service
   */
  vertical: ServiceType;
}

export interface leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordPayload {
  __typename: "LeadConnectActionRecordPayload";
  /**
   * Recorded interaction *impression*
   */
  impression: leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordPayload_impression;
}

export interface leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordError_errors {
  __typename: "LeadConnectActionRecordSpecificError";
  /**
   * Summary of error
   */
  message: string;
}

export interface leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordError {
  __typename: "LeadConnectActionRecordError";
  /**
   * Errors that occurred when executing the recordLeadConnectAction mutation.
   */
  errors: leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordError_errors[];
}

export type leadConnectActionRecord_leadConnectActionRecord = leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordPayload | leadConnectActionRecord_leadConnectActionRecord_LeadConnectActionRecordError;

export interface leadConnectActionRecord {
  /**
   * Records Seeker Action
   */
  leadConnectActionRecord: leadConnectActionRecord_leadConnectActionRecord;
}

export interface leadConnectActionRecordVariables {
  input: LeadConnectActionRecordInput;
}
