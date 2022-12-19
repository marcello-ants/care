import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@care/react-component-lib';
import {
  IconIllustrationLargeIndependent,
  IconIllustrationLargeAssisted,
  IconIllustrationLargeMemory,
  IconIllustrationLargeNursing,
} from '@care/react-icons';
import { useMediaQuery, useTheme } from '@material-ui/core';

import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { SeniorLivingOptions as RecommendedSeniorLivingOptions } from '@/types/seeker';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import SeniorLivingCard from './senior-living-card';
import useInFacilityAccountCreation from '../account-creation/useInFacilityAccountCreation';

const CARDS = [
  {
    image: <IconIllustrationLargeIndependent width="96px" height="80" />,
    title: 'Independent living',
    text: 'For those who are still able to live an active lifestyle on their own, but prefer more socialization and support than they would typically get at home.',
    type: RecommendedSeniorLivingOptions.INDEPENDENT,
  },
  {
    image: <IconIllustrationLargeAssisted width="96px" height="80" />,
    title: 'Assisted living',
    text: 'For those who need assistance with daily activities like meal prep, medication management, or getting around. Typically includes access to at least one medical professional.',
    type: RecommendedSeniorLivingOptions.ASSISTED,
  },
  {
    image: <IconIllustrationLargeMemory width="96px" height="80" />,
    title: 'Memory care',
    text: 'For those who have Alzheimer’s or dementia and require 24/7 supervision. Included specialized staff who provider personalized support depending on the residents’ level of memory loss.',
    type: RecommendedSeniorLivingOptions.MEMORY_CARE,
  },
];

const MEMORY_CARE_CARD = [
  {
    image: <IconIllustrationLargeNursing width="96px" height="80" />,
    title: 'Nursing home',
    text: 'For those needing more extensive support – whether in executing daily tasks or administrating medicine and care.  While we don’t have facility options, you can look for in-home help.',
    type: RecommendedSeniorLivingOptions.NURSING_HOME,
  },
];

const MEMORY_CARE_CARD_IN_FACILITY = [
  {
    image: <IconIllustrationLargeNursing width="96px" height="80" />,
    title: 'Nursing home',
    text: 'For those needing more extensive support – whether in executing daily tasks or administrating medicine and care.',
    type: RecommendedSeniorLivingOptions.NURSING_HOME,
  },
];

const SeniorLivingOptions = (props: WithPotentialMemberProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const { zipcode, recommendedHelpType } = useSeekerState();
  const dispatch = useAppDispatch();
  const { userHasAccount } = props;
  const { flags } = useFeatureFlags();

  const { isUnhappyPath } = useInFacilityAccountCreation();

  const recommendationOptimizationVariation =
    flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1 && !userHasAccount;

  useEffect(() => {
    if (userHasAccount) {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          lead_flow: 'mhp module',
          facility_recommendation: recommendedHelpType,
        },
      });
    } else {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {},
      });
    }
  }, []);

  const handleContinue = (livingType: RecommendedSeniorLivingOptions) => {
    const baseData = {
      cta_clicked:
        livingType === RecommendedSeniorLivingOptions.NURSING_HOME
          ? 'Find caregivers'
          : 'This sounds right to me',
      member_type: 'Seeker',
      facility_recommendation: livingType,
    };
    let leadCreateData;

    if (userHasAccount) {
      leadCreateData = {
        ...baseData,
        lead_step: 'list of options',
        lead_flow: 'mhp module',
      };
    }
    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data: userHasAccount ? leadCreateData : baseData,
    });

    if (isRecommendationOptimizationVariation) {
      dispatch({ type: 'setRecommendedHelpType', recommendedHelpType: livingType });
      if (isUnhappyPath) {
        router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
      } else {
        router.push(SEEKER_IN_FACILITY_ROUTES.AMENITIES);
      }
    } else if (
      userHasAccount &&
      livingType === RecommendedSeniorLivingOptions.NURSING_HOME &&
      zipcode
    ) {
      redirectToProviderSearch(zipcode, undefined, isDesktop);
    } else {
      dispatch({ type: 'setRecommendedHelpType', recommendedHelpType: livingType });
      router.push(SEEKER_IN_FACILITY_ROUTES.LOCATION);
    }
  };

  const sortedCards = useMemo(() => {
    const mergedCards = isRecommendationOptimizationVariation
      ? CARDS.concat(MEMORY_CARE_CARD_IN_FACILITY)
      : CARDS.concat(MEMORY_CARE_CARD);
    return [...mergedCards].sort((firstEl) => {
      let sortValue = 0;
      if (firstEl.type === recommendedHelpType) {
        sortValue = -1;
      }

      return sortValue;
    });
  }, [recommendedHelpType]);

  return (
    <>
      <Typography variant="h2">
        Choose the senior living option that sounds like the best fit.
      </Typography>
      {sortedCards.map((card) => (
        <SeniorLivingCard
          key={`${card.title}`}
          {...card}
          handleContinue={handleContinue}
          recommended={card.type === recommendedHelpType}
          flag={isRecommendationOptimizationVariation}
        />
      ))}
    </>
  );
};

SeniorLivingOptions.disableScreenViewed = true;

export default withPotentialMember(SeniorLivingOptions);
