import { useAppState } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useIsDisqualifiedFromSeniorFacilityLeads from '@/components/hooks/useIsDisqualifiedFromSeniorFacilityLeads';

import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { SeniorLivingOptions } from '@/types/seeker';
import useIsDisqualifiedFromCaringLeads from './useIsDisqualifiedFromCaringLeads';

const getFacilityType = (recommendedHelp: SeniorLivingOptions | undefined) => {
  switch (recommendedHelp) {
    case SeniorLivingOptions.ASSISTED:
      return 'assisted living';
    case SeniorLivingOptions.INDEPENDENT:
      return 'independent living';
    case SeniorLivingOptions.MEMORY_CARE:
      return 'memory care living';
    default:
      return '';
  }
};

const useInFacilityAccountCreation = () => {
  const isDisqualifiedFromSeniorFacilityLeads = useIsDisqualifiedFromSeniorFacilityLeads();
  const { seeker: seekerState } = useAppState();
  const { assistedLivingCenterFacilityCount, caringFacilityCountNearBy, recommendedHelpType } =
    seekerState;
  const SALCFacilities = assistedLivingCenterFacilityCount ?? 0;

  const isDisqualifiedFromCaringLeads = useIsDisqualifiedFromCaringLeads();

  let numberOfFacilities = assistedLivingCenterFacilityCount;

  if (!assistedLivingCenterFacilityCount) {
    numberOfFacilities = caringFacilityCountNearBy;
  }

  // feature flags
  const featureFlags = useFeatureFlags();
  const recommendationFlowOptimizationVariant =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationFlowOptimizationVariant =
    recommendationFlowOptimizationVariant?.variationIndex === 1;
  const isRecommendationFlowOptimizationVariantWithInventory =
    isRecommendationFlowOptimizationVariant && numberOfFacilities! > 0;

  let redirectRoute = SEEKER_IN_FACILITY_ROUTES.OPTIONS;

  const isQualifiedForLeads =
    (SALCFacilities > 0 && !isDisqualifiedFromSeniorFacilityLeads) ||
    !isDisqualifiedFromCaringLeads;

  if (isRecommendationFlowOptimizationVariant && isQualifiedForLeads) {
    redirectRoute = SEEKER_IN_FACILITY_ROUTES.RELATIONSHIP;
  } else if (SALCFacilities > 0 && !isDisqualifiedFromSeniorFacilityLeads) {
    redirectRoute = SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST;
  } else if (!isDisqualifiedFromCaringLeads) {
    redirectRoute = SEEKER_IN_FACILITY_ROUTES.CARING_LEADS;
  }

  const minNumOfFacilitiesForDisplay = 4;
  const recFlowOptHeaderText = `We found ${
    numberOfFacilities! > minNumOfFacilitiesForDisplay ? numberOfFacilities : ' '
  } ${getFacilityType(recommendedHelpType)} communities in your area!`;

  const headerTextWithFacilities = !isRecommendationFlowOptimizationVariantWithInventory
    ? `There are ${
        numberOfFacilities! < 5 ? '' : `${numberOfFacilities} `
      }senior living communities near you!`
    : recFlowOptHeaderText;

  const headerTextUnhappyPath = 'Almost there! Please create a free account to continue.';
  let isUnhappyPath = redirectRoute === SEEKER_IN_FACILITY_ROUTES.OPTIONS;
  let headerText;

  if (
    isRecommendationFlowOptimizationVariant &&
    !isRecommendationFlowOptimizationVariantWithInventory
  )
    isUnhappyPath = true;

  if (
    redirectRoute === SEEKER_IN_FACILITY_ROUTES.OPTIONS &&
    isRecommendationFlowOptimizationVariant &&
    recommendedHelpType === 'NURSING_HOME'
  ) {
    headerText = 'Create an account to get more information about nursing homes.';
  } else if (isUnhappyPath) {
    headerText = headerTextUnhappyPath;
  } else {
    headerText = headerTextWithFacilities;
  }

  return { redirectRoute, headerText, isUnhappyPath };
};

export default useInFacilityAccountCreation;
