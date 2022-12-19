import React, { useEffect } from 'react';
import { useMediaQuery, useTheme } from '@material-ui/core';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useSeekerState } from '@/components/AppState';
import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';
import UnhappyScreenLayout, {
  UnhappyCardProps,
} from '@/components/pages/seeker/sc/in-facility/unhappy-screen/UnhappyScreenLayout';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { LEAD_SOURCES } from '@/constants';

const AnalyticsData = {
  lead_step: 'payment source government funding',
  lead_flow: 'mhp module',
  member_type: 'Seeker',
  cta_clicked: '',
};

function GovHealthInsurance(props: WithPotentialMemberProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { zipcode } = useSeekerState();
  const { userHasAccount } = props;

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        source: userHasAccount ? LEAD_SOURCES.NTH_DAY : LEAD_SOURCES.ENROLLMENT,
      },
    });
  }, []);

  const handleInHomeCardClick = () => {
    AnalyticsData.cta_clicked = 'Find a caregiver';

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data: AnalyticsData,
    });

    redirectToProviderSearch(zipcode, undefined, isDesktop);
  };

  const handleLearningCardClick = () => {
    AnalyticsData.cta_clicked = 'View articles and guides';

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data: AnalyticsData,
    });

    window.location.assign(
      'https://www.care.com/c/stories/15645/questions-ask-assisted-living-facility/'
    );
  };

  const inHomeCard: UnhappyCardProps = {
    iconTitle: 'Find in-home care near you',
    header: 'Find in-home care near you',
    linkContent: 'Find a caregiver',
    onClickHandler: handleInHomeCardClick,
  };

  const learningCard = {
    iconTitle: 'Learn more about the senior care planning process',
    header: 'Learn more about the senior care planning process',
    linkContent: 'View articles and guides',
    onClickHandler: handleLearningCardClick,
  };

  return (
    <UnhappyScreenLayout
      headerText="Unfortunately, no communities on Care.com match with how you’re thinking of covering the cost"
      descriptionText="While you continue your senior living community search, Care.com is here to help:"
      inHomeCard={inHomeCard}
      learningCard={learningCard}
    />
  );
}

GovHealthInsurance.disableScreenViewed = true;

export default withPotentialMember(GovHealthInsurance);
