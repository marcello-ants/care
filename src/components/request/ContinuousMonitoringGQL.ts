import { gql } from '@apollo/client';

export const GET_CONTINUOUS_MONITORING_ENROLLMENT_STATUS = gql`
  query ContinuousMonitoringEnrollmentStatus($memberId: ID!) {
    continuousMonitoringEnrollmentStatus(memberId: $memberId) {
      ... on ContinuousMonitoringEnrollmentStatusSuccess {
        needsConsent
        consentMessagesList {
          consentMessageId
          message
        }
      }
    }
  }
`;

export const ENROLL_IN_CONTINUOUS_MONITORING = gql`
  mutation EnrollInContinuousMonitoring($input: EnrollInContinuousMonitoringInput!) {
    enrollInContinuousMonitoring(input: $input) {
      ... on EnrollInContinuousMonitoringSuccess {
        success
      }
    }
  }
`;
