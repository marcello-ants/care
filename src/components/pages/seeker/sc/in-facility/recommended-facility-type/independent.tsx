import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconIllustrationLargeIndependent } from '@care/react-icons';

import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { SeniorLivingOptions } from '@/types/seeker';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import BottomButtons from './bottom-buttons';
import RecommendedFacilityLayout from './layout';
import ProsAndConsList from './pros-cons';
import useInFacilityAccountCreation from '../account-creation/useInFacilityAccountCreation';

const AnalyticsData = {
  lead_step: 'facility recommendation',
  lead_flow: 'mhp module',
  member_type: 'Seeker',
  cta_clicked: '',
};

const Independent = () => {
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
      recommendedHelpType: SeniorLivingOptions.INDEPENDENT,
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
      icon={<IconIllustrationLargeIndependent height="167px" width="200px" />}
      header={`An independent living community may match your ${generateDynamicHeader(
        whoNeedsCare!,
        '',
        '',
        "'s"
      )} needs.`}>
      <>
        <ProsAndConsList
          pros={[
            'Great for seniors living an active lifestyle',
            'Helps seniors with day-to-day tasks like housekeeping',
            'Offers social and community interaction',
          ]}
          cons={[
            'Not a great fit for those needing hands-on (e.g. support with bathing, dressing or getting around) or full-time medical care',
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

export default Independent;
