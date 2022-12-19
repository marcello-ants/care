import { gql } from '@apollo/client';

const GET_TOP_CAREGIVERS = gql`
  query getTopCaregivers(
    $zipcode: String!
    $serviceID: ServiceType!
    $numResults: Int!
    $hourlyRate: JobRateInput
    $hasCareCheck: Boolean
    $qualities: [SeniorCareProviderQuality!]
    $services: [SeniorCareServiceProvidedType!]
    $maxDistanceFromSeeker: DistanceInput
    $hasApprovedActivePhoto: Boolean
    $enableFuzzySearch: Boolean
    $daysSinceLastActive: Int
    $isActiveAccount: Boolean
    $minimumAvgReviewRating: Float
    $fullTime: Boolean
  ) {
    topCaregivers: getTopCaregivers(
      zipcode: $zipcode
      numResults: $numResults
      serviceType: $serviceID
      hourlyRate: $hourlyRate
      hasCareCheck: $hasCareCheck
      qualities: $qualities
      services: $services
      maxDistanceFromSeeker: $maxDistanceFromSeeker
      hasApprovedActivePhoto: $hasApprovedActivePhoto
      enableFuzzySearch: $enableFuzzySearch
      daysSinceLastActive: $daysSinceLastActive
      isActiveAccount: $isActiveAccount
      minimumAvgReviewRating: $minimumAvgReviewRating
      fullTime: $fullTime
    ) {
      caregiver {
        profileURL
        avgReviewRating
        numberOfReviews
        yearsOfExperience
        hasCareCheck
        responseTime
        member {
          address {
            city
            state
          }
          displayName
          firstName
          id
          imageURL
          legacyId
        }
        profiles {
          commonCaregiverProfile {
            id
          }
          childCareCaregiverProfile {
            bio {
              experienceSummary
            }
            qualities {
              certifiedNursingAssistant
              certifiedRegisterNurse
              certifiedTeacher
              childDevelopmentAssociate
              comfortableWithPets
              cprTrained
              crn
              doesNotSmoke
              doula
              earlyChildDevelopmentCoursework
              earlyChildhoodEducation
              firstAidTraining
              nafccCertified
              ownTransportation
              specialNeedsCare
              trustlineCertifiedCalifornia
            }
            supportedServices {
              carpooling
              craftAssistance
              errands
              groceryShopping
              laundryAssistance
              lightHousekeeping
              mealPreparation
              swimmingSupervision
              travel
            }
            payRange {
              hourlyRateFrom {
                amount
                currencyCode
              }
              hourlyRateTo {
                amount
                currencyCode
              }
            }
          }
        }
        seniorCareProviderProfile {
          bio
          services
          payRange {
            hourlyRateFrom {
              amount
              currencyCode
            }
            hourlyRateTo {
              amount
              currencyCode
            }
          }
          qualities
        }
        signUpDate
      }
      distanceFromRequestZip {
        unit
        value
      }
    }
  }
`;

export default GET_TOP_CAREGIVERS;
