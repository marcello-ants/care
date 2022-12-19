import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconIllustrationLargeMemory } from '@care/react-icons';

import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { SeniorLivingOptions } from '@/types/seeker';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import RecommendedFacilityLayout from './layout';
import ProsAndConsList from './pros-cons';
import BottomButtons from './bottom-buttons';
import useInFacilityAccountCreation from '../account-creation/useInFacilityAccountCreation';

const AnalyticsData = {
  lead_step: 'facility recommendation',
  lead_flow: 'mhp module',
  member_type: 'Seeker',
  cta_clicked: '',
};

const MemoryCare = () => {
  const router = useRouter();
  const { whoNeedsCare } = useSeekerState();
  const dispatch = useAppDispatch();

  const { isUnhappyPath } = useInFacilityAccountCreation();

  // feature flags
  const featureFlags = useFeatureFlags();
  const recommendationFlowOptimizationVariant =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationFlowOptimizationVariant =
    recommendationFlowOptimizationVariant?.variationIndex === 1;

  useEffect(() => {
    dispatch({
      type: 'setRecommendedHelpType',
      recommendedHelpType: SeniorLivingOptions.MEMORY_CARE,
    });
  }, []);

  const handleContinue = () => {
    const data = {
      ...AnalyticsData,
      cta_clicked: 'Yes, continue',
    };

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data,
    });
    if (isRecommendationFlowOptimizationVariant) {
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
      icon={<IconIllustrationLargeMemory height="167px" width="200px" />}
      header={`A specialized memory care community may match your ${generateDynamicHeader(
        whoNeedsCare!,
        '',
        '',
        "'s"
      )} needs.`}>
      <>
        <ProsAndConsList
          pros={[
            'Protective, 24-hour supervision to prevent wandering',
            `Specialized staff providing personalized support based on residents' stage of memory loss`,
            'Activities tailored to an appropriate level of stimulation',
            'Environment designed to reduce confusion, disorientation, and other dementia symptoms',
          ]}
          cons={[
            `Doesn't provide support for those who are bedridden or in need of skilled nursing care`,
          ]}
        />
        <BottomButtons
          handleContinue={handleContinue}
          handleOptionComparison={handleOptionComparison}
        />
      </>
    </RecommendedFacilityLayout>
  );
};

export default MemoryCare;
