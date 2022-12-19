/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSeekerZipCode
// ====================================================

export interface getSeekerZipCode_getSeeker_member_address {
  __typename: "Address";
  /**
   * Zip of the address.
   */
  zip: string;
}

export interface getSeekerZipCode_getSeeker_member {
  __typename: "Member";
  /**
   * Address info of the member, this field will be only non-null when a provider is viewing their own profile, since seekers
   * are not able to see address of caregivers
   */
  address: getSeekerZipCode_getSeeker_member_address | null;
}

export interface getSeekerZipCode_getSeeker {
  __typename: "Seeker";
  /**
   * Basic Information about the User/Member
   */
  member: getSeekerZipCode_getSeeker_member;
}

export interface getSeekerZipCode {
  /**
   * Get seeker details
   */
  getSeeker: getSeekerZipCode_getSeeker;
}

export interface getSeekerZipCodeVariables {
  memberId: string;
}
