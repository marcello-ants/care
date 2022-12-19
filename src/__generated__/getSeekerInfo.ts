/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSeekerInfo
// ====================================================

export interface getSeekerInfo_getSeeker_member_contact {
  __typename: "MemberContact";
  /**
   * Member's primary phone number
   */
  primaryPhone: string | null;
}

export interface getSeekerInfo_getSeeker_member {
  __typename: "Member";
  /**
   * Member id
   * This is required by CZEN in most APIs (rather than the UUID)
   */
  legacyId: string | null;
  /**
   * Email of the member
   */
  email: string | null;
  /**
   * First name of the member
   */
  firstName: string;
  /**
   * Last name of the member
   */
  lastName: string;
  /**
   * Member's contact information
   */
  contact: getSeekerInfo_getSeeker_member_contact | null;
}

export interface getSeekerInfo_getSeeker {
  __typename: "Seeker";
  /**
   * Basic Information about the User/Member
   */
  member: getSeekerInfo_getSeeker_member;
}

export interface getSeekerInfo {
  /**
   * Get seeker details
   */
  getSeeker: getSeekerInfo_getSeeker;
}

export interface getSeekerInfoVariables {
  memberId: string;
}
