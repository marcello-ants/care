/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getZipcodeSummary
// ====================================================

export interface getZipcodeSummary_getZipcodeSummary_ZipcodeSummary {
  __typename: "ZipcodeSummary";
  /**
   * The zipcode's city.
   */
  city: string;
  /**
   * The zipcode's state.
   */
  state: string;
  /**
   * The zipcode itself.
   */
  zipcode: string;
  /**
   * Latitude of zipcode
   */
  latitude: number | null;
  /**
   * Longitude of zipcode
   */
  longitude: number | null;
}

export interface getZipcodeSummary_getZipcodeSummary_InvalidZipcodeError {
  __typename: "InvalidZipcodeError";
  /**
   * Summary of the error.
   */
  message: string;
}

export type getZipcodeSummary_getZipcodeSummary = getZipcodeSummary_getZipcodeSummary_ZipcodeSummary | getZipcodeSummary_getZipcodeSummary_InvalidZipcodeError;

export interface getZipcodeSummary {
  /**
   * Returns a summary of the city and state associated with the zipcode or IP address
   */
  getZipcodeSummary: getZipcodeSummary_getZipcodeSummary;
}

export interface getZipcodeSummaryVariables {
  zipcode?: string | null;
}
