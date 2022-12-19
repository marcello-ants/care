/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChildCareTaxCreditSavingCalculationInput, SubServiceType } from "./globalTypes";

// ====================================================
// GraphQL query operation: calculateChildCareTaxCreditSaving
// ====================================================

export interface calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options_originalTotal {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options_discountedTotal {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options_savingAmount {
  __typename: "Money";
  /**
   * Amount of money
   */
  amount: globalScalarDecimal;
  /**
   * Type of currency
   */
  currencyCode: globalScalarCurrency;
}

export interface calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options {
  __typename: "TaxCreditSaving";
  /**
   * Total amount for child care subservice without tax credit
   */
  originalTotal: calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options_originalTotal;
  /**
   * Total amount for child care subservice including tax credit discount
   */
  discountedTotal: calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options_discountedTotal;
  /**
   * Percentage of saving that Seeker can get on child care subservice due to tax credit
   */
  savingPercentage: number;
  /**
   * Saving amount that Seeker can get on child care subservice due to tax credit
   */
  savingAmount: calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options_savingAmount;
  /**
   * Subservice type
   */
  subServiceType: SubServiceType;
}

export interface calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess {
  __typename: "ChildCareTaxCreditSavingCalculationSuccess";
  /**
   * List of Child Care subservices with possible tax credit saving info
   */
  options: calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess_options[];
}

export interface calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationError {
  __typename: "ChildCareTaxCreditSavingCalculationError";
  /**
   * Summary of the error.
   */
  message: string | null;
}

export type calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving = calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationSuccess | calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving_ChildCareTaxCreditSavingCalculationError;

export interface calculateChildCareTaxCreditSaving {
  /**
   * Calculate possible tax credit savings for Child Care subservices based on area, number of children and required number of hours per week
   */
  calculateChildCareTaxCreditSaving: calculateChildCareTaxCreditSaving_calculateChildCareTaxCreditSaving;
}

export interface calculateChildCareTaxCreditSavingVariables {
  input: ChildCareTaxCreditSavingCalculationInput;
}
