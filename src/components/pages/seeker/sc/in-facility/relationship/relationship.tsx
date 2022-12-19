import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { useAppDispatch, useFlowState } from '@/components/AppState';
import { Grid, Typography } from '@material-ui/core';
import { Banner, StatelessSelector, Pill } from '@care/react-component-lib';
import Header from '@/components/Header';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { makeStyles } from '@material-ui/core/styles';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { createPortal } from 'react-dom';

const useStyles = makeStyles((theme) => ({
  selector: {
    '& .MuiListItem-root': {
      marginBottom: 0,
    },
  },
  typeContainer: {
    margin: theme.spacing(1, 0, 1),
  },
  header: {
    marginBottom: theme.spacing(1),
  },
  bannerContainer: {
    width: 327,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const options = [
  // SeniorCareRecipientRelationshipType measures the relationship of the senior care
  // recipient to the care seeker, while the label measures the relationship of the seeker to the
  // senior care recipient.
  { label: 'Child', value: SeniorCareRecipientRelationshipType.PARENT },
  {
    label: 'Spouse/partner',
    value: SeniorCareRecipientRelationshipType.SPOUSE,
  },
  {
    label: 'Self',
    value: SeniorCareRecipientRelationshipType.SELF,
  },
  { label: 'Other', value: SeniorCareRecipientRelationshipType.OTHER },
];

function Relationship() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const flowState = useFlowState();
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;
  const [showBanner, setShowBanner] = useState(
    isRecommendationOptimizationVariation && !flowState.userHasAccount
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 3000);

    if (!showBanner) {
      clearTimeout(timer);
    }
  }, []);

  const handleChange = (value: string[]) => {
    const relationshipType = value[0] as SeniorCareRecipientRelationshipType;
    dispatch({ type: 'setWhoNeedsCare', whoNeedsCare: relationshipType });

    const baseData = {
      cta_clicked: relationshipType,
    };
    let data;

    if (flowState.userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'relationship to care recipient',
        lead_flow: 'mhp module',
      };
    } else {
      data = {
        ...baseData,
        enrollment_step: 'relationship to care recipient',
      };
    }

    AnalyticsHelper.logEvent({
      name: flowState.userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });

    let nextRoute = flowState.userHasAccount
      ? SEEKER_IN_FACILITY_ROUTES.RECAP
      : SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_PASSWORD;
    if (isRecommendationOptimizationVariation) {
      nextRoute = SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE;
    }

    router.push(nextRoute);
  };

  return (
    <Grid container>
      {showBanner &&
        createPortal(
          <div className={classes.bannerContainer}>
            <Banner roundCorners type="confirmation" fullWidth>
              <Typography variant="h4">Your account has been created!</Typography>
            </Banner>
          </div>,
          document.body
        )}
      <Grid item xs={12} className={classes.header}>
        <Header>What is your relationship to the person needing care?</Header>
      </Grid>

      <Grid item xs={12} className={classes.typeContainer}>
        <StatelessSelector onChange={handleChange} single className={classes.selector}>
          {options.map((option) => (
            <Pill key={option.label} {...option} size="md" />
          ))}
        </StatelessSelector>
      </Grid>
    </Grid>
  );
}

export default Relationship;
