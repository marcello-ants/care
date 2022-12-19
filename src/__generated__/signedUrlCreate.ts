/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignedUrlCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: signedUrlCreate
// ====================================================

export interface signedUrlCreate_signedUrlCreate {
  __typename: "SignedUrlCreateResult";
  /**
   * Signature
   */
  signature: string;
  /**
   * Signed url
   */
  url: globalScalarURL;
}

export interface signedUrlCreate {
  /**
   * Creates a signed url
   */
  signedUrlCreate: signedUrlCreate_signedUrlCreate;
}

export interface signedUrlCreateVariables {
  input: SignedUrlCreateInput;
}
