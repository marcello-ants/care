import { ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Select, MenuItem, Button, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import { Pill, StatelessSelector } from '@care/react-component-lib';

import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { useAppDispatch, useFlowState, useSeekerState } from '@/components/AppState';
import Header from '@/components/Header';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import OverlaySpinner from '@/components/OverlaySpinner';

import {
  SeniorCareAgeRangeType,
  SeniorCareRecipientRelationshipType,
} from '@/__generated__/globalTypes';
import { GET_SEEKER_ZIP_CODE } from '@/components/request/GQL';

import { withPotentialMember } from '@/components/features/potentialMember/withPotentialMember';

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(1),
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      [theme.breakpoints.up('md')]: {
        paddingTop: `${theme.spacing(0.75)}px !important`,
        paddingBottom: `${theme.spacing(0.75)}px !important`,
        '&:first-child': {
          paddingTop: `${theme.spacing(1)}px !important`,
        },
        '&:last-child': {
          paddingBottom: '0px !important',
        },
      },
    },
  },
  stepper: {
    marginBottom: theme.spacing(4),
  },
  letsGetStartedHeader: {
    marginBottom: theme.spacing(3),
  },
  ageHeader: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  ageSelector: {
    width: '40%',
  },
}));

const ageRangeLabels: { [key in SeniorCareAgeRangeType]: string } = {
  [SeniorCareAgeRangeType.THIRTIES]: "30's",
  [SeniorCareAgeRangeType.FORTIES]: "40's",
  [SeniorCareAgeRangeType.FIFTIES]: "50's",
  [SeniorCareAgeRangeType.SIXTIES]: "60's",
  [SeniorCareAgeRangeType.SEVENTIES]: "70's",
  [SeniorCareAgeRangeType.EIGHTIES]: "80's",
  [SeniorCareAgeRangeType.NINETIES]: "90's",
  [SeniorCareAgeRangeType.HUNDREDS]: "100's",
};

const recipientRelationshipTypeLabels: { [key in SeniorCareRecipientRelationshipType]: string } = {
  [SeniorCareRecipientRelationshipType.GRANDPARENT]: 'My grandparent',
  [SeniorCareRecipientRelationshipType.PARENT]: 'My parent',
  [SeniorCareRecipientRelationshipType.SPOUSE]: 'My spouse',
  [SeniorCareRecipientRelationshipType.SELF]: 'Myself',
  [SeniorCareRecipientRelationshipType.OTHER]: 'Other',
};

function WhoNeedsInfacilityCare() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const state = useSeekerState();
  const { memberId, userHasAccount } = useFlowState();
  const router = useRouter();
  const featureFlags = useFeatureFlags();
  const recommendationFlowOptimizationEvaluation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationFlowOptimizationEvaluation =
    recommendationFlowOptimizationEvaluation?.variationIndex === 1;

  const { whoNeedsCare, whoNeedsCareAge } = state;

  const { data, error } = useQuery(GET_SEEKER_ZIP_CODE, {
    variables: { memberId },
    skip: !memberId,
  });

  useEffect(() => {
    if (userHasAccount) {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          lead_flow: 'mhp module',
        },
      });
    } else {
      if (isRecommendationFlowOptimizationEvaluation) {
        AnalyticsHelper.logTestExposure(
          CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION,
          recommendationFlowOptimizationEvaluation
        );
        router.push(SEEKER_IN_FACILITY_ROUTES.LOCATION);
        return;
      }
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {},
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      const {
        getSeeker: {
          member: {
            address: { zip },
          },
        },
      } = data;
      dispatch({ type: 'setZipcode', zipcode: zip });
    }
  }, [data, error]);

  const handleNext = () => {
    const baseData = {
      cta_clicked: 'next',
      member_type: 'Seeker',
      who_needs_care: whoNeedsCare,
      who_needs_care_age: whoNeedsCareAge,
    };
    let amplitudeData;

    if (userHasAccount) {
      amplitudeData = {
        ...baseData,
        lead_step: 'who needs care in facility',
        lead_flow: 'mhp module',
      };
    } else {
      amplitudeData = {
        ...baseData,
        enrollment_step: 'who needs care age in facility sc',
      };
    }

    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data: amplitudeData,
    });

    if (userHasAccount) {
      router.push(SEEKER_IN_FACILITY_ROUTES.URGENCY);
    } else {
      router.push(SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE);
    }
  };

  const handleAgeChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const age = event?.target?.value as SeniorCareAgeRangeType;
    dispatch({
      type: 'setWhoNeedsCareAge',
      age,
    });
  };

  const handlePillChange = (value: string[]) => {
    const relationshipType = value[0] as SeniorCareRecipientRelationshipType;
    dispatch({ type: 'setWhoNeedsCare', whoNeedsCare: relationshipType });
  };

  const enableNextButton = Boolean(whoNeedsCare !== null && whoNeedsCareAge);

  if (isRecommendationFlowOptimizationEvaluation && !userHasAccount) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <Grid container>
      <Grid item xs={12} className={classes.letsGetStartedHeader}>
        <Header>Let’s get started by learning more about your senior care needs</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">Who needs care?</Typography>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          name="careType"
          single
          className={classes.selector}
          onChange={handlePillChange}>
          {Object.keys(recipientRelationshipTypeLabels)
            .filter((key) => key !== SeniorCareRecipientRelationshipType.GRANDPARENT)
            .map((key) => {
              return (
                <Pill
                  key={key}
                  label={
                    recipientRelationshipTypeLabels[key as SeniorCareRecipientRelationshipType]
                  }
                  value={key}
                  selected={whoNeedsCare === key}
                  size="md"
                />
              );
            })}
        </StatelessSelector>
      </Grid>
      <Grid item xs={12} className={classes.ageHeader}>
        <Typography variant="h4">How old are they?</Typography>
      </Grid>
      <Grid item xs={12} className={classes.stepper}>
        <Select onChange={handleAgeChange} className={classes.ageSelector} value={whoNeedsCareAge}>
          {Object.keys(ageRangeLabels).map((key) => {
            return (
              <MenuItem key={key} value={key}>
                {ageRangeLabels[key as SeniorCareAgeRangeType]}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <CareComButtonContainer>
          <Button
            disabled={!enableNextButton}
            onClick={handleNext}
            variant="contained"
            color="primary"
            fullWidth
            size="large">
            Next
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
}

WhoNeedsInfacilityCare.disableScreenViewed = true;

export default withPotentialMember(WhoNeedsInfacilityCare);
