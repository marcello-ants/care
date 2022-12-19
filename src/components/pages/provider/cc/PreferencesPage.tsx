import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import {
  getCaregiverProfileCompleteness,
  getCaregiverProfileCompletenessVariables,
} from '@/__generated__/getCaregiverProfileCompleteness';
import { getMemberIds, getMemberIdsVariables } from '@/__generated__/getMemberIds';
import { ServiceType, IdType } from '@/__generated__/globalTypes';
import { useAppDispatch, useFlowState } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import OverlaySpinner from '@/components/OverlaySpinner';
import { GET_CAREGIVER_ENROLLMENT_STATUS, GET_MEMBER_IDS } from '@/components/request/GQL';
import {
  CLIENT_FEATURE_FLAGS,
  CZEN_BACKGROUND_CHECK_CC,
  PROVIDER_CHILD_CARE_ROUTES,
} from '@/constants';
import AuthService from '@/lib/AuthService';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import PreferencesPageContent from '@/components/pages/provider/cc/PreferencesPageContent';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  nextButtonContainer: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(2, 2),
  },
}));

const sendAnalytics = () => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_childcare_preferences',
      cta_clicked: 'Next',
    },
  });
};

function PreferencesPage() {
  const classes = useStyles();
  const authService = AuthService();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isWaiting, setIsWaiting] = useState(false);
  const featureFlags = useFeatureFlags();
  const { userHasAccount, memberId, memberUuid } = useFlowState();
  const isUserAuthed = authService.getStore();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const startFreeGatedAccountCreationFlow =
    providerCCFreeGatedExperience && !isUserAuthed && !userHasAccount;

  const { loading: completenessLoading, data: completenessData } = useQuery<
    getCaregiverProfileCompleteness,
    getCaregiverProfileCompletenessVariables
  >(GET_CAREGIVER_ENROLLMENT_STATUS, {
    variables: {
      serviceType: ServiceType.CHILD_CARE,
    },
    skip: !isUserAuthed && !userHasAccount,
  });

  useQuery<getMemberIds, getMemberIdsVariables>(GET_MEMBER_IDS, {
    variables: {
      ids: [memberUuid || ''],
      idType: IdType.UUID,
    },
    onCompleted: (data) => {
      const userId = data?.getMemberIds[0].memberId || '';

      dispatch({
        type: 'setMemberId',
        memberId: userId,
      });
      AnalyticsHelper.setMemberId(userId);
    },
    // if user is authed and we don't have memberId, fetch it for analytics otherwise if they're not authenticated we skip
    skip:
      ((isUserAuthed || userHasAccount) && Boolean(memberId)) || (!isUserAuthed && !userHasAccount),
  });

  useEffect(() => {
    // if user is on free gated flow and not authed the first step is /location
    if (startFreeGatedAccountCreationFlow) {
      router.push(PROVIDER_CHILD_CARE_ROUTES.LOCATION);
    }
  }, []);

  useEffect(() => {
    if (completenessData) {
      const { getCaregiverProfileCompleteness: completeness } = completenessData;

      const { freeGated, firstName, lastName } = completeness;

      const isFreeGated = Boolean(freeGated);

      setIsWaiting(true);
      dispatch({ type: 'setFreeGated', freeGated: isFreeGated });
      dispatch({ type: 'setCallFreeGatedMutation', callFreeGatedMutation: false });

      if (firstName) {
        dispatch({ type: 'setCCFirstName', firstName });
      }

      if (lastName) {
        dispatch({ type: 'setCCLastName', lastName });
      }

      if (!isFreeGated && !completeness.jobInterest) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.JOB_TYPES);
        return;
      }

      if (isFreeGated && providerCCFreeGatedExperience && !freeGated?.hourlyRate) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.PREFERENCES);
        return;
      }

      if (!completeness.availability) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY);
        return;
      }

      if (!completeness.languages) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.PROFILE);
        return;
      }

      if (!completeness.bio) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.BIO);
        return;
      }

      if (!completeness.photo) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.PHOTO);
        return;
      }

      // this is a workaround until completeness logic is fixed in the BE
      // TODO: add !freeGated?.appDownload to the condition
      if (isFreeGated && providerCCFreeGatedExperience) {
        router.push(PROVIDER_CHILD_CARE_ROUTES.APP_DOWNLOAD);
        return;
      }

      // TODO: uncomment WELCOME_BACK route condition when BE is fixed
      // if (isFreeGated && providerCCFreeGatedExperience && !freeGated?.welcomeBack) {
      //   router.push(PROVIDER_CHILD_CARE_ROUTES.WELCOME_BACK);
      //   return;
      // }

      if (completeness.subscriptionPlanViewed || completeness.photo) {
        router.push(CZEN_BACKGROUND_CHECK_CC);
        return;
      }

      setIsWaiting(false);
    }
  }, [completenessData]);

  const onSubmit = () => {
    setIsWaiting(true);
    sendAnalytics();
    router.push(PROVIDER_CHILD_CARE_ROUTES.LOCATION);
  };

  if (isWaiting || completenessLoading || startFreeGatedAccountCreationFlow) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <Grid container className={classes.gridContainer}>
      <PreferencesPageContent />
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={onSubmit}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
}

export default PreferencesPage;
