import React, { MouseEventHandler, ReactNode } from 'react';
import { Grid, makeStyles } from '@material-ui/core';

import { Typography } from '@care/react-component-lib';
import { Icon24InfoSeniorCare } from '@care/react-icons';

import useIsInFacility from '@/components/hooks/useIsInFacility';
import EmailForm from '@/components/features/accountCreation/EmailForm-test-b';
import BlueWrapperIcon from '@/components/BlueWrapperIcon';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { useAppState } from '@/components/AppState';
import { SeniorLivingOptions } from '@/types/seeker';

type SeekerEmailPageProps = {
  handleJoinNow: MouseEventHandler<HTMLButtonElement>;
  headerText: ReactNode;
  inputHeaderText?: ReactNode;
  subHeaderText?: ReactNode;
  showSubHeader?: boolean | undefined;
};

const useStyles = makeStyles((theme) => ({
  header: {
    ...theme.typography.h2,
  },
  subheader: ({ isInFacility }: any) => ({
    color: theme.palette.care?.grey[isInFacility ? 900 : 600],
    margin: theme.spacing(1, 0),
    marginTop: isInFacility && theme.spacing(2),
  }),

  inputHeader: ({ showSubHeader }: any) => ({
    marginTop: showSubHeader ? theme.spacing(2) : theme.spacing(3),
    color: theme.palette.care?.grey[700],
  }),

  newLine: {
    display: 'block',
  },
}));

function SeekerEmailPage({
  handleJoinNow,
  headerText,
  inputHeaderText,
  subHeaderText,
  showSubHeader,
}: SeekerEmailPageProps) {
  const { isInFacility } = useIsInFacility();
  const classes = useStyles({ isInFacility, showSubHeader });
  const isUnhappyPath = !showSubHeader;
  const { seeker: seekerState } = useAppState();

  // feature flags
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const showRecommendationOptimization =
    recommendationOptimizationVariation?.variationIndex === 1 && !isUnhappyPath;

  return (
    <Grid container>
      <Grid item xs={12}>
        {(showRecommendationOptimization ||
          seekerState.recommendedHelpType === SeniorLivingOptions.NURSING_HOME) && (
          <BlueWrapperIcon icon={<Icon24InfoSeniorCare />} />
        )}
        <Typography className={classes.header}>{headerText}</Typography>
      </Grid>
      {showSubHeader && (
        <Grid item xs={12}>
          <Typography variant={isInFacility ? 'body2' : 'h4'} className={classes.subheader}>
            {subHeaderText}
          </Typography>
        </Grid>
      )}
      {isInFacility && !showRecommendationOptimization && (
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.inputHeader}>
            {inputHeaderText}
          </Typography>
        </Grid>
      )}
      <EmailForm handleJoinNow={handleJoinNow} />
    </Grid>
  );
}

SeekerEmailPage.defaultProps = {
  inputHeaderText: 'Create a free account to continue',
  subHeaderText: 'It only takes a few seconds.',
  showSubHeader: true,
};

export default SeekerEmailPage;
