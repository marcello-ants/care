/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TextConcernType } from "./globalTypes";

// ====================================================
// GraphQL query operation: TextAnalyzerListPIIOrProfanity
// ====================================================

export interface TextAnalyzerListPIIOrProfanity_bio_TextAnalyzerListPIIOrProfanitySuccess_detectedEntities {
  __typename: "DetectedEntity";
  /**
   * Match start
   */
  startIndex: number;
  /**
   * Match end
   */
  endIndex: number;
  /**
   * Entity
   */
  text: string;
  /**
   * Type of entity
   */
  type: TextConcernType;
}

export interface TextAnalyzerListPIIOrProfanity_bio_TextAnalyzerListPIIOrProfanitySuccess {
  __typename: "TextAnalyzerListPIIOrProfanitySuccess";
  /**
   * The entities that were detected profane/PII and analysis type
   */
  detectedEntities: TextAnalyzerListPIIOrProfanity_bio_TextAnalyzerListPIIOrProfanitySuccess_detectedEntities[];
}

export interface TextAnalyzerListPIIOrProfanity_bio_TextAnalyzerListPIIOrProfanityError {
  __typename: "TextAnalyzerListPIIOrProfanityError";
  /**
   * The summary of the error.
   */
  message: string;
}

export type TextAnalyzerListPIIOrProfanity_bio = TextAnalyzerListPIIOrProfanity_bio_TextAnalyzerListPIIOrProfanitySuccess | TextAnalyzerListPIIOrProfanity_bio_TextAnalyzerListPIIOrProfanityError;

export interface TextAnalyzerListPIIOrProfanity_headline_TextAnalyzerListPIIOrProfanitySuccess_detectedEntities {
  __typename: "DetectedEntity";
  /**
   * Match start
   */
  startIndex: number;
  /**
   * Match end
   */
  endIndex: number;
  /**
   * Entity
   */
  text: string;
  /**
   * Type of entity
   */
  type: TextConcernType;
}

export interface TextAnalyzerListPIIOrProfanity_headline_TextAnalyzerListPIIOrProfanitySuccess {
  __typename: "TextAnalyzerListPIIOrProfanitySuccess";
  /**
   * The entities that were detected profane/PII and analysis type
   */
  detectedEntities: TextAnalyzerListPIIOrProfanity_headline_TextAnalyzerListPIIOrProfanitySuccess_detectedEntities[];
}

export interface TextAnalyzerListPIIOrProfanity_headline_TextAnalyzerListPIIOrProfanityError {
  __typename: "TextAnalyzerListPIIOrProfanityError";
  /**
   * The summary of the error.
   */
  message: string;
}

export type TextAnalyzerListPIIOrProfanity_headline = TextAnalyzerListPIIOrProfanity_headline_TextAnalyzerListPIIOrProfanitySuccess | TextAnalyzerListPIIOrProfanity_headline_TextAnalyzerListPIIOrProfanityError;

export interface TextAnalyzerListPIIOrProfanity {
  /**
   * The purpose of this query is to look for bad words and possible PII options in free text fields and return the words that were profane along with the type
   */
  bio: TextAnalyzerListPIIOrProfanity_bio;
  /**
   * The purpose of this query is to look for bad words and possible PII options in free text fields and return the words that were profane along with the type
   */
  headline: TextAnalyzerListPIIOrProfanity_headline;
}

export interface TextAnalyzerListPIIOrProfanityVariables {
  bio: string;
  headline: string;
}
