import { gql } from '@apollo/client';

// apollo client breaks if this query uses union type inside fragments and silently drops detectedConcerns from results
const TEXT_DETECT_CONCERNS = gql`
  query textAnalyzerDetectConcerns(
    $bio: String!
    $headline: String!
    $textCreator: TextAnalyzerDetectConcernsCreator!
    $validationId: String!
  ) {
    bio: textAnalyzerDetectConcerns(
      textToAnalyze: { text: $bio }
      textCreator: $textCreator
      validationId: $validationId
    ) {
      ... on TextAnalyzerDetectConcernsSuccess {
        __typename
        detectedConcerns {
          endIndex
          startIndex
          text
          type
        }
        validationId
      }
      ... on TextAnalyzerDetectConcernsError {
        __typename
        message
      }
    }
    headline: textAnalyzerDetectConcerns(
      textToAnalyze: { text: $headline }
      textCreator: $textCreator
      validationId: $validationId
    ) {
      ... on TextAnalyzerDetectConcernsSuccess {
        __typename
        detectedConcerns {
          endIndex
          startIndex
          text
          type
        }
        validationId
      }
      ... on TextAnalyzerDetectConcernsError {
        __typename
        message
      }
    }
  }
`;

export { TEXT_DETECT_CONCERNS };
