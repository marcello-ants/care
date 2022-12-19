import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Grid, MobileStepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconIllustrationLargeAssisted,
  IconIllustrationLargeMemory,
  IconIllustrationLargeIndependent,
  IconIllustrationLargeNursing,
  Icon24InfoSuccessFilled,
} from '@care/react-icons';
import { Typography } from '@care/react-component-lib';
import useTimer from '@/components/hooks/useTimer';
import Header from '@/components/Header';

import { useSeekerState, useFlowState } from '@/components/AppState';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { HelpType, SeniorLivingOptions } from '@/types/seeker';
import { CareType } from '@/components/features/caregiversPreview/CareTypeCard';
import SeniorLivingPreview from '@/components/features/caregiversPreview/SeniorLivingPreview';

import { whoNeedsCareAgeMap, helpTypesMap } from '@/components/pages/seeker/sc/recap/recap';
import useInFacilityAccountCreation from '@/components/pages/seeker/sc/in-facility/account-creation/useInFacilityAccountCreation';
import { recommendedSeniorCareLivingOption } from '@/utilities/senior-care-facility-utility';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
    paddingBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing(4),
    paddingTop: theme.spacing(1),
  },
  progress: {
    height: theme.spacing(1),
    width: 267,
    margin: '0 auto',
    borderRadius: 5,
    marginTop: 5,
    '& div': {
      borderRadius: 5,
    },
  },
  thanksForSharingText: {
    color: theme.palette.care.grey[600],
    paddingBottom: 8,
  },
}));
const formatHelpType = (ht: HelpType) => helpTypesMap[ht];
const TRANSITION_TIME_MS = 1400;

function Recap() {
  const classes = useStyles();
  const router = useRouter();
  const {
    city,
    state,
    condition,
    helpTypes,
    whoNeedsCareAge,
    recommendedHelpType: recommendedHelpTypeFromState,
  } = useSeekerState();
  const { userHasAccount } = useFlowState();
  const cityAndStateText = city === '' ? 'you' : `${city}, ${state}`;
  const cityAndStateBullet = city === '' ? 'your area' : `${city}, ${state}`;
  const recommendedHelp =
    recommendedHelpTypeFromState ?? recommendedSeniorCareLivingOption(condition, helpTypes);
  const { redirectRoute } = useInFacilityAccountCreation();

  // Feature flags
  const featureFlags = useFeatureFlags();
  const recommendationFlowOptimizationEvaluation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isInRecommendationFlowOptimizationVariation =
    recommendationFlowOptimizationEvaluation?.variationIndex === 1;

  const HELP_TYPES = helpTypes.map((ht) => ht && formatHelpType(ht));
  const seniorLivingTypes: CareType[] = [
    {
      description: `Senior in their ${whoNeedsCareAgeMap[whoNeedsCareAge!]}`,
      icon: <Icon24InfoSuccessFilled />,
    },
    {
      description: `In ${cityAndStateBullet}`,
      icon: <Icon24InfoSuccessFilled />,
    },
  ];

  if (HELP_TYPES.length) {
    seniorLivingTypes.push({
      description: `Looking for help with ${HELP_TYPES.join(', ')}`,
      icon: <Icon24InfoSuccessFilled />,
    });
  }

  let seniorLivingCommunityType;
  let Ilustration;

  switch (recommendedHelp) {
    case SeniorLivingOptions.MEMORY_CARE:
      seniorLivingCommunityType = 'memory care';
      Ilustration = IconIllustrationLargeMemory;
      break;
    case SeniorLivingOptions.INDEPENDENT:
      seniorLivingCommunityType = 'independent living';
      Ilustration = IconIllustrationLargeIndependent;
      break;
    case SeniorLivingOptions.NURSING_HOME:
      seniorLivingCommunityType = 'nursing home';
      Ilustration = IconIllustrationLargeNursing;
      break;
    default:
      seniorLivingCommunityType = 'assisted living';
      Ilustration = IconIllustrationLargeAssisted;
  }
  const headerText = `Thanks for sharing. We’re searching for communities that may be right for you!`;
  const [counter, setCounter] = useState<number>(0);

  useTimer(
    () => {
      if (counter > 2) {
        if (userHasAccount) {
          router.push(redirectRoute);
        } else if (isInRecommendationFlowOptimizationVariation) {
          router.push(SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION);
        }
      } else {
        setCounter(counter + 1);
      }
    },
    TRANSITION_TIME_MS,
    [counter]
  );

  return (
    <Grid container className={classes.gridContainer}>
      {userHasAccount || isInRecommendationFlowOptimizationVariation ? (
        <>
          <Ilustration width="200px" height="167px" />
          <Grid item xs={12} className={classes.header}>
            {isInRecommendationFlowOptimizationVariation ? (
              <>
                <Typography variant="h4" align="center" className={classes.thanksForSharingText}>
                  Thanks for sharing!
                </Typography>
                <Typography variant="h2" align="center">
                  We’re looking for {seniorLivingCommunityType} communities near {cityAndStateText}
                  ...
                </Typography>
              </>
            ) : (
              <Typography variant="h2" align="center">
                Looking for {seniorLivingCommunityType} communities near {cityAndStateText}...
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <MobileStepper
              variant="progress"
              steps={4}
              position="static"
              activeStep={counter}
              nextButton={null}
              backButton={null}
              classes={{
                progress: classes.progress,
              }}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} className={classes.header}>
            <Header>{headerText}</Header>
          </Grid>
          <SeniorLivingPreview
            seniorLivingTypes={seniorLivingTypes}
            onComplete={() => {
              router.push(SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION);
            }}
          />
        </>
      )}
    </Grid>
  );
}

export default Recap;
