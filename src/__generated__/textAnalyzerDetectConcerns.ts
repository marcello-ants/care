/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TextAnalyzerDetectConcernsCreator, TextConcernType } from "./globalTypes";

// ====================================================
// GraphQL query operation: textAnalyzerDetectConcerns
// ====================================================

export interface textAnalyzerDetectConcerns_bio_TextAnalyzerDetectConcernsSuccess_detectedConcerns {
  __typename: "DetectedEntity";
  /**
   * Match end
   */
  endIndex: number;
  /**
   * Match start
   */
  startIndex: number;
  /**
   * Entity
   */
  text: string;
  /**
   * Type of entity
   */
  type: TextConcernType;
}

export interface textAnalyzerDetectConcerns_bio_TextAnalyzerDetectConcernsSuccess {
  __typename: "TextAnalyzerDetectConcernsSuccess";
  /**
   * Array of all the concerns found in the text
   */
  detectedConcerns: textAnalyzerDetectConcerns_bio_TextAnalyzerDetectConcernsSuccess_detectedConcerns[];
  /**
   * Id to chain validation requests made in the same session together
   */
  validationId: string;
}

export interface textAnalyzerDetectConcerns_bio_TextAnalyzerDetectConcernsError {
  __typename: "TextAnalyzerDetectConcernsError";
  /**
   * An informative but opaque error message
   */
  message: string;
}

export type textAnalyzerDetectConcerns_bio = textAnalyzerDetectConcerns_bio_TextAnalyzerDetectConcernsSuccess | textAnalyzerDetectConcerns_bio_TextAnalyzerDetectConcernsError;

export interface textAnalyzerDetectConcerns_headline_TextAnalyzerDetectConcernsSuccess_detectedConcerns {
  __typename: "DetectedEntity";
  /**
   * Match end
   */
  endIndex: number;
  /**
   * Match start
   */
  startIndex: number;
  /**
   * Entity
   */
  text: string;
  /**
   * Type of entity
   */
  type: TextConcernType;
}

export interface textAnalyzerDetectConcerns_headline_TextAnalyzerDetectConcernsSuccess {
  __typename: "TextAnalyzerDetectConcernsSuccess";
  /**
   * Array of all the concerns found in the text
   */
  detectedConcerns: textAnalyzerDetectConcerns_headline_TextAnalyzerDetectConcernsSuccess_detectedConcerns[];
  /**
   * Id to chain validation requests made in the same session together
   */
  validationId: string;
}

export interface textAnalyzerDetectConcerns_headline_TextAnalyzerDetectConcernsError {
  __typename: "TextAnalyzerDetectConcernsError";
  /**
   * An informative but opaque error message
   */
  message: string;
}

export type textAnalyzerDetectConcerns_headline = textAnalyzerDetectConcerns_headline_TextAnalyzerDetectConcernsSuccess | textAnalyzerDetectConcerns_headline_TextAnalyzerDetectConcernsError;

export interface textAnalyzerDetectConcerns {
  /**
   * This query will
   * 1. detect all <AnalysisType> concerns in input text
   * 2. return all detected concerning text in an array
   * NOTE: the backend API will log this validation attempt for future analysis.
   */
  bio: textAnalyzerDetectConcerns_bio;
  /**
   * This query will
   * 1. detect all <AnalysisType> concerns in input text
   * 2. return all detected concerning text in an array
   * NOTE: the backend API will log this validation attempt for future analysis.
   */
  headline: textAnalyzerDetectConcerns_headline;
}

export interface textAnalyzerDetectConcernsVariables {
  bio: string;
  headline: string;
  textCreator: TextAnalyzerDetectConcernsCreator;
  validationId: string;
}
