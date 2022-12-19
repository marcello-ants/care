import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconIllustrationLargeNursing } from '@care/react-icons';

import { useAppDispatch } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { SeniorLivingOptions } from '@/types/seeker';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import RecommendedFacilityLayout from './layout';
import ProsAndConsList from './pros-cons';
import BottomButtons from './bottom-buttons';

const AnalyticsData = {
  lead_step: 'facility recommendation',
  lead_flow: 'mhp module',
  member_type: 'Seeker',
  cta_clicked: '',
};

const NursingHomeInfacility = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // feature flags
  const featureFlags = useFeatureFlags();
  const recommendationFlowOptimizationVariant =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationFlowOptimizationVariant =
    recommendationFlowOptimizationVariant?.variationIndex === 1;

  useEffect(() => {
    dispatch({
      type: 'setRecommendedHelpType',
      recommendedHelpType: SeniorLivingOptions.NURSING_HOME,
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
      router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
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
      icon={<IconIllustrationLargeNursing height="167px" width="200px" />}
      header="Based on what you’ve shared, a nursing home may match your needs.">
      <>
        <ProsAndConsList
          pros={[
            'Provides 24-hour nursing and personal care',
            `A licensed physician supervises each patient’s care and a nurse is always on the premises`,
            'Ideal for those with acute physical or cognitive health conditions',
          ]}
          cons={[`Not a great fit for those who don't need such a high level of care`]}
        />
        <BottomButtons
          handleContinue={handleContinue}
          handleOptionComparison={handleOptionComparison}
        />
      </>
    </RecommendedFacilityLayout>
  );
};

export default NursingHomeInfacility;
