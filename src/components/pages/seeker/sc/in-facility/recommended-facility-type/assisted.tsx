import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconIllustrationLargeAssisted } from '@care/react-icons';

import { useSeekerState, useAppDispatch } from '@/components/AppState';
import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { SeniorLivingOptions } from '@/types/seeker';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';

import RecommendedFacilityLayout from './layout';
import ProsAndConsList from './pros-cons';
import BottomButtons from './bottom-buttons';
import useInFacilityAccountCreation from '../account-creation/useInFacilityAccountCreation';

const AnalyticsData = {
  lead_step: 'facility recommendation',
  lead_flow: 'mhp module',
  member_type: 'Seeker',
};

const Assisted = () => {
  const router = useRouter();
  const { whoNeedsCare } = useSeekerState();
  const dispatch = useAppDispatch();

  const { isUnhappyPath } = useInFacilityAccountCreation();

  // feature flags
  const featureFlags = useFeatureFlags();
  const recommendationFlowOptimizationVariant =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationFlowOptimizationVariant?.variationIndex === 1;

  useEffect(() => {
    dispatch({ type: 'setRecommendedHelpType', recommendedHelpType: SeniorLivingOptions.ASSISTED });
  }, []);

  const handleConfirm = () => {
    const data = {
      ...AnalyticsData,
      cta_clicked: 'Yes, continue',
    };

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data,
    });

    if (isRecommendationOptimizationVariation) {
      if (isUnhappyPath) {
        router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
      } else {
        router.push(SEEKER_IN_FACILITY_ROUTES.AMENITIES);
      }
    } else {
      router.push(SEEKER_IN_FACILITY_ROUTES.LOCATION);
    }
  };

  const handleOptionComparison = (event: any) => {
    const data = {
      ...AnalyticsData,
      cta_clicked: 'This doesn’t look right',
    };

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data,
    });
    event.preventDefault();
    router.push(SEEKER_IN_FACILITY_ROUTES.SENIOR_LIVING_OPTIONS);
  };

  return (
    <RecommendedFacilityLayout
      icon={<IconIllustrationLargeAssisted width="200px" height="167px" />}
      header={`An assisted living community may match your ${generateDynamicHeader(
        whoNeedsCare!,
        '',
        '',
        "'s"
      )} needs.`}>
      <>
        <ProsAndConsList
          pros={[
            'Good for seniors who need help with daily activities',
            'Residents typically have access to at least one medical professional',
            'Offers social and community interaction',
          ]}
          cons={[
            'Not a great fit for those who need around-the-clock medical care or are dealing with severe physical or mental conditions',
          ]}
        />
        <BottomButtons
          handleContinue={handleConfirm}
          handleOptionComparison={handleOptionComparison}
        />
      </>
    </RecommendedFacilityLayout>
  );
};

export default Assisted;
