import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { Banner } from '@care/react-component-lib';
import { Icon64BrandActionSuccess } from '@care/react-icons';

import { useFlowState, useSeekerState } from '@/components/AppState';

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(2),
  },
  icon: {
    marginLeft: '-6px',
    marginBottom: 10,
  },
  errorBannerContainer: {
    marginBottom: theme.spacing(3),
  },
  animatedImage: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    height: 104,

    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(2),
      textAlign: 'left',
    },
  },
  animationImage: {
    width: 104,
  },
}));

function PayoffFeedback() {
  const classes = useStyles();
  const state = useSeekerState();
  const flowState = useFlowState();
  const numberOfCommunities = state.SALCSavedFacilitiesIds.length;
  const numberOfCommunitiesLang =
    numberOfCommunities === 1 ? 'community has ' : 'communities have ';

  if (state.seniorCareFacilityLeadGenerateMutationError) {
    return (
      <>
        <div className={classes.errorBannerContainer}>
          <Banner type="warning" width="100%" roundCorners>
            <Typography variant="subtitle2">An error has occured</Typography>
          </Banner>
        </div>

        <Typography variant="h2" className={classes.header}>
          We were unable to load the content you were looking for.
        </Typography>
      </>
    );
  }

  if (state.SALCSeniorCareFacilityLeadsPublished) {
    return (
      <>
        <div className={classes.animatedImage}>
          <img
            src="/app/enrollment/success-animation-2x.gif"
            alt="Success animation"
            className={classes.animationImage}
          />
        </div>
        <Typography variant="h2" className={classes.header}>
          {!flowState.userHasAccount
            ? 'Thanks for using Care.com to connect with senior living communities!'
            : `${numberOfCommunities} ${numberOfCommunitiesLang} received your request and will be in touch soon!`}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Icon64BrandActionSuccess size="74px" className={classes.icon} />
      <Typography variant="h2" className={classes.header}>
        A senior care family advisor will contact you shortly!
      </Typography>
    </>
  );
}

export default PayoffFeedback;
