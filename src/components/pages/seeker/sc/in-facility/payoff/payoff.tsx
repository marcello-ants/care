import React from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, useTheme, useMediaQuery } from '@material-ui/core';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useSeekerState, useAppDispatch, useFlowState } from '@/components/AppState';
import { IconIllustrationSmallPolaroids, IconIllustrationMediumChecklist } from '@care/react-icons';

import { Age } from '@/types/common';
import { helpTypesToServices } from '@/types/seeker';
import { POST_A_JOB_ROUTES } from '@/constants';
import IconCard, { IconCardProps } from '@/components/IconCard';
import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';

import PayoffFeedback from './PayoffFeedback';

const useStyles = makeStyles((theme) => ({
  subheader: {
    marginBottom: theme.spacing(4),
  },
}));

const fireAmplitudeEvent = (option: string) => {
  const data = {
    enrollment_step: 'payoff in facility sc',
    member_type: 'Seeker',
    cta_clicked: option,
  };
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data,
  });
};
function PayoffPage() {
  const classes = useStyles();
  const router = useRouter();
  const state = useSeekerState();
  const flowState = useFlowState();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleCardClick = () => {
    if (state.whoNeedsCareAge) {
      dispatch({
        type: 'setLovedOneAge',
        age: state.whoNeedsCareAge as Age,
      });
    }

    dispatch({
      type: 'setSeekerParams',
      servicesNeeded: helpTypesToServices(state.helpTypes),
      typeOfCare: state.typeOfCare,
      zip: state.zipcode,
    });
    fireAmplitudeEvent('Find a caregiver');

    if (flowState.userHasAccount) {
      redirectToProviderSearch(state.zipcode, undefined, isDesktop);
    } else {
      router.push(POST_A_JOB_ROUTES.POST_A_JOB);
    }
  };

  const handleCardClickLearnMore = () => {
    fireAmplitudeEvent('View articles and guides');
    window.location.assign(
      'https://www.care.com/c/stories/15645/questions-ask-assisted-living-facility/'
    );
  };

  const cards: Array<IconCardProps> = [
    {
      icon: <IconIllustrationSmallPolaroids size="64px" />,
      iconTitle: 'Need in-home care while you wait?',
      header: 'Need in-home care while you wait?',
      linkContent: 'Find a caregiver',
      onClick: handleCardClick,
    },
    {
      icon: <IconIllustrationMediumChecklist size="64px" />,
      iconTitle: 'Learn more about the senior care planning process',
      header: 'Learn more about the senior care planning process',
      linkContent: 'View articles and guides',
      onClick: handleCardClickLearnMore,
    },
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <PayoffFeedback />
        <Typography variant="body2" className={classes.subheader}>
          {!flowState.userHasAccount
            ? 'Here are a couple things you can do while you make your way through the process:'
            : 'In the meantime, you can explore in-home care options and resources by Care.com'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {cards.map((card) => (
          <div key={card.header}>
            <IconCard {...card} />
          </div>
        ))}
      </Grid>
    </Grid>
  );
}

export default PayoffPage;
