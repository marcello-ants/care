/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignedUrlInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: providerPhotoSet
// ====================================================

export interface providerPhotoSet_providerPhotoSet_ProviderPhotoSetSuccess {
  __typename: "ProviderPhotoSetSuccess";
  /**
   * The processed photo's publicly-accessible URL.
   */
  url: globalScalarURL;
  /**
   * The processed photo's publicly accessible thumbnail URL.
   */
  thumbnailUrl: globalScalarURL;
}

export interface providerPhotoSet_providerPhotoSet_ProviderPhotoSetError_errors {
  __typename: "MemberPhotoDimensionsTooSmall" | "MemberPhotoFileSizeTooLarge" | "MemberPhotoInvalidFormat" | "MemberPhotoInvalidSource" | "MemberPhotoQualityTooLow";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export interface providerPhotoSet_providerPhotoSet_ProviderPhotoSetError {
  __typename: "ProviderPhotoSetError";
  /**
   * Errors that occurred when executing the providerPhotoSet mutation.
   */
  errors: providerPhotoSet_providerPhotoSet_ProviderPhotoSetError_errors[];
}

export type providerPhotoSet_providerPhotoSet = providerPhotoSet_providerPhotoSet_ProviderPhotoSetSuccess | providerPhotoSet_providerPhotoSet_ProviderPhotoSetError;

export interface providerPhotoSet {
  /**
   * Set provider member photo after successful upload.
   */
  providerPhotoSet: providerPhotoSet_providerPhotoSet;
}

export interface providerPhotoSetVariables {
  input: SignedUrlInput;
}
