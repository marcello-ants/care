/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SeniorCareFacilityLeadGenerateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: seniorCareFacilityLeadGenerate
// ====================================================

export interface seniorCareFacilityLeadGenerate_seniorCareFacilityLeadGenerate_SeniorCareFacilityLeadGenerateError {
  __typename: "SeniorCareFacilityLeadGenerateError";
}

export interface seniorCareFacilityLeadGenerate_seniorCareFacilityLeadGenerate_SeniorCareFacilityLeadGenerateSuccess {
  __typename: "SeniorCareFacilityLeadGenerateSuccess";
  /**
   * Unused placeholder field to make this type valid
   */
  dummy: string | null;
}

export type seniorCareFacilityLeadGenerate_seniorCareFacilityLeadGenerate = seniorCareFacilityLeadGenerate_seniorCareFacilityLeadGenerate_SeniorCareFacilityLeadGenerateError | seniorCareFacilityLeadGenerate_seniorCareFacilityLeadGenerate_SeniorCareFacilityLeadGenerateSuccess;

export interface seniorCareFacilityLeadGenerate {
  /**
   * Generates a lead for facilities that are providing senior care services
   */
  seniorCareFacilityLeadGenerate: seniorCareFacilityLeadGenerate_seniorCareFacilityLeadGenerate;
}

export interface seniorCareFacilityLeadGenerateVariables {
  input: SeniorCareFacilityLeadGenerateInput;
}
