import { gql } from '@apollo/client';

const GET_DEFAULT_JOB_WAGES = gql`
  query getDefaultJobWages($zipcode: String!, $serviceType: ServiceType!) {
    getJobWages(zipcode: $zipcode, serviceType: $serviceType) {
      legalMinimum {
        amount
        __typename
      }
      defaultMaxWage {
        amount
        __typename
      }
      defaultMinWage {
        amount
        __typename
      }
      maxAllowed {
        amount
        __typename
      }
      __typename
    }
  }
`;

const PROVIDER_NAME_UPDATE = gql`
  mutation providerNameUpdate($input: ProviderNameUpdateInput!) {
    providerNameUpdate(input: $input) {
      __typename

      ... on ProviderNameUpdateSuccess {
        dummy
      }
    }
  }
`;

const CAREGIVER_ATTRIBUTES_UPDATE = gql`
  mutation caregiverAttributesUpdate($input: CaregiverAttributesUpdateInput!) {
    caregiverAttributesUpdate(input: $input) {
      __typename

      ... on CaregiverAttributesUpdateSuccess {
        dummy
      }
    }
  }
`;

const PROVIDER_JOB_INTEREST_UPDATE = gql`
  mutation providerJobInterestUpdate($input: ProviderJobInterestUpdateInput!) {
    providerJobInterestUpdate(input: $input) {
      __typename
      ... on ProviderJobInterestUpdateSuccess {
        dummy
        __typename
      }
    }
  }
`;

const PROVIDER_AVAILABILITY_UPDATE = gql`
  mutation providerAvailabilityUpdate($input: ProviderAvailabilityUpdateInput!) {
    providerAvailabilityUpdate(input: $input) {
      __typename
      ... on ProviderAvailabilityUpdateSuccess {
        dummy
        __typename
      }
    }
  }
`;

const GET_JOB_WAGES = gql`
  query getJobWages($zipcode: String!, $serviceType: ServiceType!) {
    getJobWages(zipcode: $zipcode, serviceType: $serviceType) {
      averages {
        average {
          amount
        }
        minimum {
          amount
        }
        maximum {
          amount
        }
      }
      legalMinimum {
        amount
      }
    }
  }
`;

const GET_AVERAGE_JOB_WAGE = gql`
  query getAverageJobWage($zipcode: String!, $serviceType: ServiceType!) {
    getJobWages(zipcode: $zipcode, serviceType: $serviceType) {
      averages {
        average {
          amount
        }
      }
    }
  }
`;

const GET_NUMBER_OF_JOBS_NEARBY = gql`
  query getNumberOfNewJobsNearby(
    $zipcode: String!
    $serviceType: ServiceType!
    $radius: DistanceInput
  ) {
    getNumberOfNewJobsNearby(zipcode: $zipcode, serviceType: $serviceType, radius: $radius)
  }
`;

const GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY = gql`
  query getNumberOfSeniorCareFacilitiesNearby(
    $zipcode: String!
    $radius: Int
    $notSure: Boolean!
    $independentLivingFacilities: Boolean!
    $assistedLivingFacilities: Boolean!
    $memoryCareFacilities: Boolean!
  ) {
    getNumberOfSeniorCareFacilitiesNearby(zipcode: $zipcode, radius: $radius) {
      __typename

      ... on GetNumberOfSeniorCareFacilitiesNearbySuccess {
        count @include(if: $notSure)
        countIndependentLivingFacilities @include(if: $independentLivingFacilities)
        countAssistedLivingFacilities @include(if: $assistedLivingFacilities)
        countMemoryCareFacilities @include(if: $memoryCareFacilities)
      }
    }
  }
`;

const ONE_TIME_JOB_CREATE = gql`
  mutation seniorCareOneTimeJobCreate($input: SeniorCareOneTimeJobCreateInput!) {
    seniorCareOneTimeJobCreate(input: $input) {
      ... on SeniorCareOneTimeJobCreatePayload {
        job {
          id
        }
      }
      ... on SeniorCareOneTimeJobCreateError {
        errors {
          __typename
          message
        }
      }
    }
  }
`;

const SENIOR_CARE_RECURRING_JOB_CREATE = gql`
  mutation seniorCareRecurringJobCreate($input: SeniorCareRecurringJobCreateInput!) {
    seniorCareRecurringJobCreate(input: $input) {
      ... on SeniorCareRecurringJobCreatePayload {
        job {
          id
        }
      }
      ... on SeniorCareRecurringJobCreateError {
        errors {
          __typename
          message
        }
      }
    }
  }
`;

const SENIOR_CARE_PROVIDER_CREATE = gql`
  mutation seniorCareProviderCreate($input: SeniorCareProviderCreateInput!) {
    seniorCareProviderCreate(input: $input) {
      __typename

      ... on SeniorCareProviderCreateSuccess {
        authToken
        memberId
        oneTimeToken
      }

      ... on SeniorCareProviderCreateError {
        errors {
          __typename
          message
        }
      }
    }
  }
`;

const PROVIDER_FREE_GATED_CREATE = gql`
  mutation providerFreeGatedCreate {
    providerFreeGatedCreate {
      __typename

      ... on ProviderFreeGatedCreateSuccess {
        __typename
        freeGated
      }

      ... on ProviderFreeGatedCreateError {
        __typename
      }
    }
  }
`;

const PROVIDER_CREATE = gql`
  mutation providerCreate($input: ProviderCreateInput!) {
    providerCreate(input: $input) {
      __typename

      ... on ProviderCreateSuccess {
        authToken
        memberId
        oneTimeToken
        __typename
      }

      ... on ProviderCreateError {
        errors {
          __typename
          message
        }
        __typename
      }
    }
  }
`;

const SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE = gql`
  mutation seniorCareProviderAvailabilityUpdate(
    $input: SeniorCareProviderAvailabilityUpdateInput!
  ) {
    seniorCareProviderAvailabilityUpdate(input: $input) {
      __typename
      ... on SeniorCareProviderAvailabilityUpdateSuccess {
        dummy
      }
    }
  }
`;

const SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE = gql`
  mutation seniorCareProviderAttributesUpdate($input: SeniorCareProviderAttributesUpdateInput!) {
    seniorCareProviderAttributesUpdate(input: $input) {
      __typename
      ... on SeniorCareProviderAttributesUpdateSuccess {
        dummy
      }
    }
  }
`;

const SENIOR_CARE_SEEKER_CREATE = gql`
  mutation seniorCareSeekerCreate($input: SeniorCareSeekerCreateInput!) {
    seniorCareSeekerCreate(input: $input) {
      ... on SeniorCareSeekerCreateSuccess {
        authToken
        memberId
        oneTimeToken
      }

      ... on SeniorCareSeekerCreateError {
        errors {
          message
        }
      }
    }
  }
`;

const SENIOR_CARE_SEEKER_ATTRIBUTES_UPDATE = gql`
  mutation seniorCareSeekerAttributesUpdate($input: SeniorCareSeekerAttributesUpdateInput!) {
    seniorCareSeekerAttributesUpdate(input: $input) {
      __typename

      ... on SeniorCareSeekerAttributesUpdateSuccess {
        success
      }
    }
  }
`;

const FAVORITE_PROVIDER = gql`
  mutation favoriteProvider($input: FavoriteProviderInput!) {
    favoriteProvider(input: $input) {
      __typename

      ... on FavoriteCaregiverPayload {
        favorite {
          favoriteStatus
          id
        }
      }
      ... on FavoriteProviderInvalidServiceProfile {
        message
      }
    }
  }
`;

const LEAD_CONNECT_ACTION_RECORD = gql`
  mutation leadConnectActionRecord($input: LeadConnectActionRecordInput!) {
    leadConnectActionRecord(input: $input) {
      __typename

      ... on LeadConnectActionRecordPayload {
        impression {
          actorId
          targetId
          actorType
          actionType
          vertical
        }
      }
      ... on LeadConnectActionRecordError {
        errors {
          message
        }
      }
    }
  }
`;

const GET_ZIP_CODE_SUMMARY = gql`
  query getZipcodeSummary($zipcode: String) {
    getZipcodeSummary(zipcode: $zipcode) {
      ... on ZipcodeSummary {
        city
        state
        zipcode
        latitude
        longitude
      }

      ... on InvalidZipcodeError {
        message
      }
    }
  }
`;

const GET_INSTANT_BOOK_LOCATION_ELIGIBLE = gql`
  query getInstantBookLocationEligible($zipcode: String!) {
    getInstantBookLocationEligible(zipcode: $zipcode) {
      ... on GetInstantBookLocationEligibleSuccess {
        eligible
      }
    }
  }
`;

const GET_CAREGIVERS_NEARBY = gql`
  query getCaregiversNearby(
    $zipcode: String!
    $serviceType: ServiceType!
    $radius: Int!
    $subServiceType: SubServiceType
  ) {
    getCaregiversNearby(
      zipcode: $zipcode
      serviceType: $serviceType
      radius: $radius
      subServiceType: $subServiceType
    )
  }
`;

const GET_CAREGIVER_COUNT_FOR_JOB = gql`
  query getCaregiverCountForJob(
    $zipcode: String!
    $serviceType: ServiceType!
    $childCareSearchCriteria: ChildCareSearchCriteria
  ) {
    getCaregiverCountForJob(
      zipcode: $zipcode
      serviceType: $serviceType
      childCareSearchCriteria: $childCareSearchCriteria
    ) {
      count
    }
  }
`;

const VALIDATE_MEMBER_EMAIL = gql`
  query validateMemberEmail($email: String!) {
    validateMemberEmail(email: $email) {
      errors {
        __typename
        message
      }
    }
  }
`;

const VALIDATE_MEMBER_PASSWORD = gql`
  query validateMemberPassword($password: String!) {
    validateMemberPassword(password: $password) {
      errors {
        __typename
        message
      }
    }
  }
`;

const SEEKER_CREATE = gql`
  mutation seekerCreate($input: SeekerCreateInput!) {
    seekerCreate(input: $input) {
      __typename

      ... on SeekerCreateSuccess {
        authToken
        memberId
      }

      ... on SeekerCreateError {
        errors {
          __typename
          message
        }
      }
    }
  }
`;

const CHILD_CARE_ONE_TIME_JOB_CREATE = gql`
  mutation childCareOneTimeJobCreate($input: ChildCareOneTimeJobCreateInput!) {
    childCareOneTimeJobCreate(input: $input) {
      job {
        id
      }
    }
  }
`;

const CHILD_CARE_RECURRING_JOB_CREATE = gql`
  mutation childCareRecurringJobCreate($input: ChildCareRecurringJobCreateInput!) {
    childCareRecurringJobCreate(input: $input) {
      job {
        id
      }
    }
  }
`;

const SIGNED_URL_CREATE = gql`
  mutation signedUrlCreate($input: SignedUrlCreateInput!) {
    signedUrlCreate(input: $input) {
      signature
      url
    }
  }
`;

const PROVIDER_PHOTO_SET = gql`
  mutation providerPhotoSet($input: SignedUrlInput!) {
    providerPhotoSet(input: $input) {
      __typename

      ... on ProviderPhotoSetSuccess {
        url
        thumbnailUrl
      }

      ... on ProviderPhotoSetError {
        errors {
          __typename
          message
        }
      }
    }
  }
`;

const GET_NEW_JOBS_PROVIDER = gql`
  query getNewJobsForProvider($numResults: Int!) {
    getNewJobsForProvider(numResults: $numResults) {
      title
      state
      description
      city
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
      jobPostDate
    }
  }
`;

const GET_CAREGIVER_ENROLLMENT_STATUS = gql`
  query getCaregiverProfileCompleteness($serviceType: ServiceType!) {
    getCaregiverProfileCompleteness(serviceType: $serviceType) {
      ... on CaregiverProfileCompletenessStatus {
        additionalInfo
        availability
        bio
        education
        jobInterest
        languages
        overallStatus
        qualities
        photo
        services
        subscriptionPlanViewed
        freeGated {
          appDownload
          hourlyRate
          welcomeBack
        }
        firstName
        lastName
      }
    }
  }
`;

const CAREGIVER_BIOGRAPHY_UPDATE = gql`
  mutation caregiverBiographyUpdate($input: CaregiverBiographyUpdateInput!) {
    caregiverBiographyUpdate(input: $input) {
      __typename
      ... on CaregiverBiographyUpdateResultError {
        errors {
          ... on CaregiverBiographyUpdateError {
            message
            __typename
          }
        }
      }
    }
  }
`;

const CHANGE_MEMBER_PASSWORD = gql`
  mutation changeMemberPassword($passwordInput: MemberChangePasswordInput!) {
    memberChangePassword(input: $passwordInput) {
      __typename
      ... on MemberChangePasswordSuccess {
        authToken
      }
      ... on MemberChangePasswordError {
        errors {
          __typename
          message
        }
      }
    }
  }
`;

const CHILD_CARE_PROVIDER = gql`
  query findChildCareProviders(
    $zipcode: String!
    $childrenDoB: [LocalDate!]!
    $source: String!
    $careStartDate: LocalDate
    $distanceWillingToTravel: DistanceInput
  ) {
    findChildCareProviders(
      zipcode: $zipcode
      source: $source
      childrenDoB: $childrenDoB
      careStartDate: $careStartDate
      distanceWillingToTravel: $distanceWillingToTravel
    ) {
      __typename
      ... on ProviderSearchSuccess {
        trackingId
        providers {
          id
          description
          name
          centerType
          logo {
            urlOriginal
          }
          images {
            urlOriginal
          }
          address {
            addressLine1
            addressLine2
            city
            latitude
            longitude
            state
            zip
          }
          reviews {
            text
            date
            rating
            reviewer {
              firstName
              lastName
            }
          }
          license {
            name
            verifiedDate
            certified
            externalUrl
            administrativeArea
          }
        }
      }
      ... on ProviderSearchError {
        __typename
        message
      }
    }
  }
`;

const POST_CHILD_CARE_LEAD = gql`
  mutation postChildCareLead($childCareLeadInput: ChildCareLeadCreateInput!) {
    childCareLeadCreate(input: $childCareLeadInput) {
      __typename
      batchId
    }
  }
`;

const POST_AUTO_ACCEPT_CHILD_CARE_LEAD = gql`
  mutation autoAcceptChildCareLeadPublish(
    $autoAcceptChildCareLeadPublishInput: AutoAcceptChildCareLeadPublishInput!
  ) {
    autoAcceptChildCareLeadPublish(input: $autoAcceptChildCareLeadPublishInput) {
      batchId
    }
  }
`;

// it's not ready yet
const GET_TAX_CALCULATOR_PRICING = gql`
  query calculateChildCareTaxCreditSaving($input: ChildCareTaxCreditSavingCalculationInput!) {
    calculateChildCareTaxCreditSaving(input: $input) {
      __typename
      ... on ChildCareTaxCreditSavingCalculationSuccess {
        options {
          originalTotal {
            amount
            currencyCode
          }
          discountedTotal {
            amount
            currencyCode
          }
          savingPercentage
          savingAmount {
            amount
            currencyCode
          }
          subServiceType
        }
      }
      ... on ChildCareTaxCreditSavingCalculationError {
        message
      }
    }
  }
`;

const SEND_MESSAGE_TO_PROVIDER = gql`
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      __typename

      ... on SendMessageSuccess {
        dummy
      }

      ... on SendMessageError {
        __typename
        failedRecipientIds
      }
    }
  }
`;

const SENIOR_CARE_FACILITY_LEAD_GENERATE = gql`
  mutation seniorCareFacilityLeadGenerate($input: SeniorCareFacilityLeadGenerateInput!) {
    seniorCareFacilityLeadGenerate(input: $input) {
      __typename
      ... on SeniorCareFacilityLeadGenerateSuccess {
        dummy
      }
    }
  }
`;

const FACEBOOK_CONNECT = gql`
  mutation facebookConnect($input: FacebookConnectInput!) {
    facebookConnect(input: $input) {
      __typename
      ... on FacebookConnectSuccess {
        facebookUserId
      }
    }
  }
`;

const PETCARE_ONE_TIME_JOB_CREATE = gql`
  mutation petCareOneTimeJobCreate($input: PetCareOneTimeJobCreateInput!) {
    petCareOneTimeJobCreate(input: $input) {
      job {
        id
      }
    }
  }
`;

const HOUSEKEEPING_ONE_TIME_JOB_CREATE = gql`
  mutation housekeepingOneTimeJobCreate($input: HousekeepingOneTimeJobCreateInput!) {
    housekeepingOneTimeJobCreate(input: $input) {
      job {
        id
      }
    }
  }
`;

const TUTORING_ONE_TIME_JOB_CREATE = gql`
  mutation tutoringOneTimeJobCreate($input: TutoringOneTimeJobCreateInput!) {
    tutoringOneTimeJobCreate(input: $input) {
      job {
        id
        serviceType
        startDate
        status
        title
      }
    }
  }
`;

const PETCARE_RECURRING_JOB_CREATE = gql`
  mutation petCareRecurringJobCreate($input: PetCareRecurringJobCreateInput!) {
    petCareRecurringJobCreate(input: $input) {
      job {
        id
      }
    }
  }
`;

const HOUSEKEEPING_RECURRING_JOB_CREATE = gql`
  mutation housekeepingRecurringJobCreate($input: HousekeepingRecurringJobCreateInput!) {
    housekeepingRecurringJobCreate(input: $input) {
      job {
        id
      }
    }
  }
`;

const TUTORING_RECURRING_JOB_CREATE = gql`
  mutation tutoringRecurringJobCreate($input: TutoringRecurringJobCreateInput!) {
    tutoringRecurringJobCreate(input: $input) {
      job {
        id
        serviceType
        startDate
        status
        title
      }
    }
  }
`;

const HIRED_CAREGIVER_CRM_EVENT_CREATE = gql`
  mutation CzenCrmEventHiredCaregiverCreate($input: CzenCrmEventHiredCaregiverInput!) {
    czenCrmEventHiredCaregiverCreate(input: $input) {
      ... on CzenCrmEventResponse {
        success
      }
    }
  }
`;

const DAYCARE_CRM_EVENT_CREATE = gql`
  mutation czenCrmEventCreateLeadsSubmitted($input: CzenCrmEventLeadsSubmittedInput!) {
    czenCrmEventCreateLeadsSubmitted(input: $input) {
      success
    }
  }
`;

const SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD = gql`
  mutation seniorAssistedLivingCommunityLeadPublish(
    $input: SeniorAssistedLivingCommunityLeadPublishInput!
  ) {
    seniorAssistedLivingCommunityLeadPublish(input: $input) {
      __typename
      ... on SeniorAssistedLivingCommunityLeadPublishResponse {
        batchId
      }
    }
  }
`;

const SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD_CRM_EVENT_CREATE = gql`
  mutation czenCrmEventCreateSALCLeadsSubmitted($input: CzenCrmEventLeadsSubmittedInput!) {
    czenCrmEventCreateLeadsSubmitted(input: $input) {
      success
    }
  }
`;

const SENIOR_CARE_ASSISTED_LIVING_PROVIDERS = gql`
  query seniorCareAssistedLivingProviders(
    $zipcode: String!
    $source: String!
    $maxNumberOfResults: Int
    $facilityType: SeniorCommunityType
  ) {
    seniorCareAssistedLivingProviders(
      zipcode: $zipcode
      source: $source
      maxNumberOfResults: $maxNumberOfResults
      facilityType: $facilityType
    ) {
      __typename
      ... on ProviderSearchSuccess {
        __typename
        trackingId
        providerSearchResults {
          distanceFromSearchCenter {
            unit
            value
          }
          provider {
            name
            description
            id
            centerType
            images {
              urlSmall
              urlMedium
            }
            address {
              addressLine1
              city
              state
              latitude
              longitude
              zip
            }
            license {
              certified
            }
            seniorAssistedLivingCenter {
              attributes {
                careServices {
                  alsCare
                  callSystemTwentyFourHours
                  dailyLivingAssistance
                  diabetesCare
                  healthCareProviderCoordination
                  hospiceCare
                  insulinInjections
                  mealPreparationAndService
                  medicationManagement
                  memoryCare
                  mentalWellnessCare
                  mildCognitiveImpairmentCare
                  nursingTwelveToSixteenHours
                  nursingTwentyFourHours
                  parkinsonsCare
                  physicalTherapy
                  preventativeHealthScreenings
                  rehabilitationProgram
                  transportationArrangement
                  transportationArrangementMedical
                  respiteCare
                  strokeCare
                  supervisionTwentyFourHours
                }
                communityTypes {
                  assistedLiving
                  continuingCare
                  independentLiving
                  memoryCare
                }
                facilityAmenities {
                  barberOrBeautySalon
                  cafeOrBistro
                  computerCenter
                  diningRoom
                  fitnessRoom
                  gameRoom
                  garden
                  library
                  marketOnSite
                  outdoorPatio
                  outdoorSpace
                  privateDiningRooms
                  religiousOrMeditationCenter
                  swimmingPool
                  spaOrJacuzzi
                  wellnessCenter
                }
                foodAmenities {
                  allMealsProvided
                  anytimeDining
                  diabetic
                  glutenFree
                  guestMeals
                  halaal
                  kosher
                  lowOrNoSodium
                  noSugar
                  professionalChef
                  roomService
                  someMealsProvided
                  specialDietaryRestrictions
                  vegan
                  vegetarian
                }
                onSiteServices {
                  beautician
                  concierge
                  familyEducationAndSupport
                  housekeeping
                  laundryOrDryCleaning
                  moveInCoordination
                }
              }
              offerings {
                monthlyRent {
                  amount
                  currencyCode
                }
                communityType
              }
            }
          }
        }
      }
      ... on ProviderSearchError {
        __typename
        message
      }
    }
  }
`;

const UPDATE_SEEKER_FAVORITE_LIST = gql`
  mutation updateSeekerFavoriteList($input: FavoriteRequestInput!) {
    updateSeekerFavoriteList(favoriteRequestInput: $input) {
      __typename
      favorite {
        id
        favoriteStatus
      }
    }
  }
`;

const ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT = gql`
  mutation enrollSeekerForEnterpriseClient(
    $employeeEnrollmentDetails: EnterpriseEmployeeEnrollmentDetails!
  ) {
    enrollSeekerForEnterpriseClient(employeeEnrollmentDetails: $employeeEnrollmentDetails) {
      ... on EnterpriseEmployeeEnrollmentSuccess {
        authToken
        memberId
        oneTimeToken
      }

      ... on EnterpriseEnrollmentProcessFailure {
        errors {
          errorMessages
        }
      }
    }
  }
`;

const CREATE_HOME_PAY_PROSPECT = gql`
  mutation createHomePayProspect($input: HomePayProspectInput!) {
    createHomePayProspect(input: $input) {
      __typename
      ... on CreateHomePayProspectSuccess {
        prospect {
          prospectId
        }
      }
    }
  }
`;

const GET_MEMBER_IDS = gql`
  query getMemberIds($ids: [ID!]!, $idType: IdType!) {
    getMemberIds(ids: $ids, idType: $idType) {
      uuid
      memberId
    }
  }
`;

const GET_SEEKER_ZIP_CODE = gql`
  query getSeekerZipCode($memberId: ID!) {
    getSeeker(id: $memberId) {
      member {
        address {
          zip
        }
      }
    }
  }
`;

const GET_SEEKER_INFO = gql`
  query getSeekerInfo($memberId: ID!) {
    getSeeker(id: $memberId) {
      member {
        legacyId
        email
        firstName
        lastName
        contact {
          primaryPhone
        }
      }
    }
  }
`;

const GET_SITTER_INFO = gql`
  query getCaregiver($id: ID!, $serviceId: ServiceType) {
    getCaregiver(id: $id, serviceId: $serviceId) {
      member {
        displayName
        firstName
        imageURL
        id
      }
    }
  }
`;

const GET_SENIOR_FACILITY_COST = gql`
  query getSeniorFacilityMonthlyCost($zipcode: String!, $communityType: SeniorCommunityType) {
    seniorFacilityMonthlyCost(zipcode: $zipcode, communityType: $communityType) {
      __typename
      ... on SeniorFacilityMonthlyCostSuccess {
        amount {
          amount
          currencyCode
        }
      }
    }
  }
`;

const UPDATE_SEEKER_ATTRIBUTE = gql`
  mutation SeekerUpdate($input: SeekerUpdateInput!) {
    seekerUpdate(input: $input) {
      success
    }
  }
`;

export {
  PROVIDER_JOB_INTEREST_UPDATE,
  CAREGIVER_ATTRIBUTES_UPDATE,
  PROVIDER_NAME_UPDATE,
  GET_DEFAULT_JOB_WAGES,
  PROVIDER_AVAILABILITY_UPDATE,
  FAVORITE_PROVIDER,
  GET_JOB_WAGES,
  GET_AVERAGE_JOB_WAGE,
  PROVIDER_CREATE,
  PROVIDER_FREE_GATED_CREATE,
  GET_NUMBER_OF_JOBS_NEARBY,
  GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
  ONE_TIME_JOB_CREATE,
  SENIOR_CARE_RECURRING_JOB_CREATE,
  SENIOR_CARE_PROVIDER_CREATE,
  SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE,
  SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
  CAREGIVER_BIOGRAPHY_UPDATE,
  GET_CAREGIVER_ENROLLMENT_STATUS,
  SENIOR_CARE_SEEKER_CREATE,
  GET_ZIP_CODE_SUMMARY,
  GET_CAREGIVERS_NEARBY,
  GET_CAREGIVER_COUNT_FOR_JOB,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
  SEEKER_CREATE,
  CHILD_CARE_ONE_TIME_JOB_CREATE,
  CHILD_CARE_RECURRING_JOB_CREATE,
  SIGNED_URL_CREATE,
  PROVIDER_PHOTO_SET,
  GET_NEW_JOBS_PROVIDER,
  CHANGE_MEMBER_PASSWORD,
  SENIOR_CARE_SEEKER_ATTRIBUTES_UPDATE,
  CHILD_CARE_PROVIDER,
  POST_CHILD_CARE_LEAD,
  POST_AUTO_ACCEPT_CHILD_CARE_LEAD,
  GET_TAX_CALCULATOR_PRICING,
  SEND_MESSAGE_TO_PROVIDER,
  SENIOR_CARE_FACILITY_LEAD_GENERATE,
  FACEBOOK_CONNECT,
  PETCARE_ONE_TIME_JOB_CREATE,
  PETCARE_RECURRING_JOB_CREATE,
  HOUSEKEEPING_ONE_TIME_JOB_CREATE,
  HOUSEKEEPING_RECURRING_JOB_CREATE,
  HIRED_CAREGIVER_CRM_EVENT_CREATE,
  DAYCARE_CRM_EVENT_CREATE,
  SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD,
  SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
  TUTORING_ONE_TIME_JOB_CREATE,
  TUTORING_RECURRING_JOB_CREATE,
  UPDATE_SEEKER_FAVORITE_LIST,
  ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT,
  CREATE_HOME_PAY_PROSPECT,
  GET_MEMBER_IDS,
  GET_SEEKER_ZIP_CODE,
  GET_SEEKER_INFO,
  GET_SITTER_INFO,
  GET_SENIOR_FACILITY_COST,
  UPDATE_SEEKER_ATTRIBUTE,
  LEAD_CONNECT_ACTION_RECORD,
  SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD_CRM_EVENT_CREATE,
  GET_INSTANT_BOOK_LOCATION_ELIGIBLE,
};
