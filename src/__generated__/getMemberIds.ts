/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { IdType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getMemberIds
// ====================================================

export interface getMemberIds_getMemberIds {
  __typename: "MemberIds";
  /**
   * UUID
   */
  uuid: string;
  /**
   * Czen specific id
   */
  memberId: string;
}

export interface getMemberIds {
  /**
   * Get member uuid for czen member id, or vice-versa based on idType provided in Input.
   */
  getMemberIds: getMemberIds_getMemberIds[];
}

export interface getMemberIdsVariables {
  ids: string[];
  idType: IdType;
}
