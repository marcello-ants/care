import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@care/react-component-lib';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { IconTickLg, IconIllustrationXlargeArticlesandguides } from '@care/react-icons';
import Header from '@/components/Header';
import OverlaySpinner from '@/components/OverlaySpinner';
import {
  CAREGIVER_ATTRIBUTES_UPDATE,
  PROVIDER_FREE_GATED_CREATE,
  PROVIDER_NAME_UPDATE,
} from '@/components/request/GQL';
import {
  caregiverAttributesUpdate,
  caregiverAttributesUpdateVariables,
} from '@/__generated__/caregiverAttributesUpdate';
import {
  providerNameUpdate,
  providerNameUpdateVariables,
} from '@/__generated__/providerNameUpdate';
import { providerFreeGatedCreate } from '@/__generated__/providerFreeGatedCreate';
import { useMutation } from '@apollo/client';
import { useAppDispatch, useProviderCCState } from '@/components/AppState';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useTealiumTracking from '@/components/hooks/useTealiumTracking';
import { ChildCareAgeGroups, ServiceType } from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { getUserEmail } from '@/lib/AuthService';
import logger from '@/lib/clientLogger';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  currentLineSubtitle: {
    color: theme.palette.care.navy[600],
    fontWeight: 700,
  },
  listItem: {
    marginBottom: theme.spacing(3),
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 2),
  },
  successIconContainer: {
    width: 40,
    height: 40,
    background: theme.palette.care.navy[600],
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    '& > path': { stroke: theme.palette.care.white },
  },
  iconContainer: {
    width: 40,
    height: 40,
    border: `1px solid ${theme.palette.care.grey[400]}`,
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: theme.palette.care.grey[500],
  },
}));

const RegularContent = () => {
  const classes = useStyles();

  return (
    <Box mb="40px">
      <Grid item xs={12}>
        <Box mb="32px">
          <Header>Here’s what comes next</Header>
        </Box>
      </Grid>
      <Grid container item xs={12} className={classes.listItem}>
        <Grid item xs={2}>
          <div className={classes.successIconContainer}>
            <IconTickLg className={classes.successIcon} size="18px" />
          </div>
        </Grid>
        <Grid container item xs={10}>
          <Grid item xs={12}>
            <Typography variant="body1">Create your account</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography careVariant="body3" className={classes.currentLineSubtitle}>
              Done!
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={12} className={classes.listItem}>
        <Grid item xs={2}>
          <div className={classes.iconContainer}>
            <span className={classes.iconText}>2</span>
          </div>
        </Grid>
        <Grid container item xs={10}>
          <Grid item xs={12}>
            <Typography variant="body1">Build your profile</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography careVariant="body3" color="secondary">
              Your availability, pay rate, and bio.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={2}>
          <div className={classes.iconContainer}>
            <span className={classes.iconText}>3</span>
          </div>
        </Grid>
        <Grid container item xs={10}>
          <Grid item xs={12}>
            <Typography variant="body1">Get screened</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography careVariant="body3" color="secondary">
              Answer some required safety questions and earn a safety badge for your profile.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const FreeGatedContent = () => (
  <Box mb="12px">
    <Grid item xs={12}>
      <Box mb="24px">
        <Header>Now, let’s build your profile</Header>
      </Box>
    </Grid>
    <Grid item xs={12}>
      <Box mb="24px">
        <Typography color="textSecondary">
          Add your pay rate, availability, and tell families about yourself. This will help us match
          you with the best jobs in your area.
        </Typography>
      </Box>
    </Grid>
    <Grid item xs={12}>
      <Box display="flex" justifyContent="center">
        <IconIllustrationXlargeArticlesandguides width={200} />
      </Box>
    </Grid>
  </Box>
);

function StepsPage() {
  const classes = useStyles();
  const router = useRouter();
  const {
    firstName,
    lastName,
    ageGroups,
    freeGated,
    callFreeGatedMutation,
    callProviderNameUpdateMutation,
    careForSickChild,
    numberOfChildren,
    caregiverPreferencesPersisted,
  } = useProviderCCState();
  const dispatch = useAppDispatch();
  const featureFlags = useFeatureFlags();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const isFreeGated = freeGated && providerCCFreeGatedExperience;

  const [caregiverAttributesUpdateMutation] = useMutation<
    caregiverAttributesUpdate,
    caregiverAttributesUpdateVariables
  >(CAREGIVER_ATTRIBUTES_UPDATE, {
    onCompleted: () => {
      dispatch({
        type: 'setProviderCCCaregiverPreferencesPersisted',
        caregiverPreferencesPersisted: true,
      });
    },
  });

  const [providerNameUpdateMutation] = useMutation<providerNameUpdate, providerNameUpdateVariables>(
    PROVIDER_NAME_UPDATE,
    {
      onCompleted: () => {
        dispatch({
          type: 'setCallProviderNameUpdateMutation',
          callProviderNameUpdateMutation: false,
        });
      },
      onError(graphQLError) {
        logger.error({
          event: 'providerNameUpdateMutationFailed',
          graphQLError: graphQLError.message,
        });
      },
    }
  );

  const [providerFreeGatedCreateMutation] = useMutation<providerFreeGatedCreate>(
    PROVIDER_FREE_GATED_CREATE,
    {
      onCompleted(response) {
        const res = response?.providerFreeGatedCreate;

        if (res.__typename === 'ProviderFreeGatedCreateSuccess') {
          AnalyticsHelper.logEvent({
            name: 'Test Exposure',
            data: {
              test_name: 'provider-cc-free-gated-experience-test',
              test_variant: res.freeGated,
            },
          });
          dispatch({ type: 'setFreeGated', freeGated: res.freeGated });

          if (res.freeGated) {
            AnalyticsHelper.logEvent({
              name: 'Member Enrolled',
              data: {
                enrollment_step: 'provider_account_free_gated_creation',
                enrollment_flow: 'MW VHP Provider Enrollment',
                cta_clicked: 'Join now',
              },
            });
          }
        }

        if (res.__typename === 'ProviderFreeGatedCreateError') {
          logger.info({ event: 'providerFreeGatedCreateError' });
        }

        dispatch({ type: 'setCallFreeGatedMutation', callFreeGatedMutation: false });
      },

      onError(graphQLError) {
        logger.error({
          event: 'providerFreeGatedAccountCreationFailed',
          graphQLError: graphQLError.message,
        });
      },
    }
  );

  useEffect(() => {
    if (providerCCFreeGatedExperience && callFreeGatedMutation) {
      providerFreeGatedCreateMutation();
    }

    if (providerCCFreeGatedExperience && firstName && callProviderNameUpdateMutation) {
      providerNameUpdateMutation({
        variables: {
          input: {
            firstName,
            lastName,
          },
        },
      });
    }

    if (!caregiverPreferencesPersisted && !providerCCFreeGatedExperience) {
      // on childcare freeGated flow these attributes will be managed on preferences page (first step in flow was moved)
      caregiverAttributesUpdateMutation({
        variables: {
          input: {
            childcare: {
              ageGroups: ageGroups as ChildCareAgeGroups[],
              careForSickChild,
              numberOfChildren,
            },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
      });
    }
  }, []);

  useTealiumTracking(['/us-subscription/conversion/provider/basic/incomplete/'], {
    email: getUserEmail(),
  });

  const onSubmit = () => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_steps',
      cta_clicked: 'Build your profile',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });

    router.push(
      isFreeGated ? PROVIDER_CHILD_CARE_ROUTES.PREFERENCES : PROVIDER_CHILD_CARE_ROUTES.JOB_TYPES
    );
  };

  if (providerCCFreeGatedExperience && callFreeGatedMutation) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item>{isFreeGated ? <FreeGatedContent /> : <RegularContent />}</Grid>
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={onSubmit}>
          Build your profile
        </Button>
      </Grid>
    </Grid>
  );
}

export default StepsPage;
