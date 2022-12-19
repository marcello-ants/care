import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import logger from '@/lib/clientLogger';
import Header from '@/components/Header';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import {
  useAppDispatch,
  useSeekerState,
  useSeekerCCState,
  useFlowState,
} from '@/components/AppState';
import ZipInput from '@/components/ZipInput';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { ServiceIdsForMember } from '@/types/seekerCC';
import { Location } from '@/types/common';
import { CLIENT_FEATURE_FLAGS, SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useLangConversational from '@/components/hooks/useLangConversational';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(57),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  distanceInputContainer: {
    padding: theme.spacing(2, 0),
    '& > div': {
      padding: 0,
      maxWidth: '100%',
    },
  },
  distanceLabel: {
    padding: theme.spacing(1, 0, 3),
  },
}));

function CareLocation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const sendLeadEnabledQueryParam = router.query;

  // Styling
  const classes = useStyles();

  // React State
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [error, setError] = useState(false);
  const [validateOnClick, setValidateOnClick] = useState(false);

  // App State
  const { enrollmentSource, czenServiceIdForMember } = useSeekerCCState();
  const { zipcode, city, state, visitorStartedSACFlow, maxDistanceFromSeekerDayCare } =
    useSeekerState();
  const { flowName } = useFlowState();
  const { goNext } = useFlowNavigation();

  // Feature flags + Launch Darkly
  const featureFlags = useFeatureFlags();

  const languageConversationalFlag =
    czenServiceIdForMember === ServiceIdsForMember.dayCare
      ? 0
      : featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.CARE_LOCATION,
    languageConversationalFlag
  );

  const logInitialFlowStart = () => {
    if (!visitorStartedSACFlow) {
      dispatch({ type: 'setVisitorStartedSACFlow', visitorStartedSACFlow: true });
      logger.info({ event: 'seekerAccountCreationStarts' });
    }

    dispatch({ type: 'setFlowName', flowName });
  };

  useEffect(() => {
    // GROW-1818 - Only fire for Daycare
    if (czenServiceIdForMember === ServiceIdsForMember.dayCare) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_SETTINGS,
        featureFlags.flags[CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_SETTINGS]
      );
    }

    if (czenServiceIdForMember !== ServiceIdsForMember.dayCare) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE,
        featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]
      );
    }
  }, []);

  useEffect(() => {
    logInitialFlowStart();
  }, []);

  useEffect(() => {
    if (sendLeadEnabledQueryParam?.sendLeadEnabled) {
      const isSendLeadEnabledFlag = sendLeadEnabledQueryParam.sendLeadEnabled !== 'false';
      dispatch({
        type: 'cc_setIsSendLeadEnabled',
        isSendLeadEnabled: isSendLeadEnabledFlag,
      });
    }
  }, []);

  useEffect(() => {
    if (!shouldGoNext) {
      return;
    }

    setValidateOnClick(true);

    if (error) {
      return;
    }

    logChildCareEvent('Member Enrolled', 'Care Location', enrollmentSource, {
      zip: zipcode,
      city,
      state,
      ...(czenServiceIdForMember === ServiceIdsForMember.dayCare
        ? {
            extraData: {
              user_distance: maxDistanceFromSeekerDayCare.distance,
              user_distance_unit: maxDistanceFromSeekerDayCare.unit,
            },
          }
        : {}),
    });

    goNext();
  }, [shouldGoNext, city, error]);

  const onZipInputChange = (location: Location) => {
    dispatch({ type: 'setZipcode', zipcode: location.zipcode });
    dispatch({ type: 'setCityAndState', city: location.city, state: location.state });
  };

  const handleError = (e: boolean) => {
    setError(e);
  };

  return (
    <>
      <Head>
        <title>Where do you need care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>{languageConversationalText}</Header>
        </Grid>
        <Grid item xs={12}>
          <ZipInput
            location={{ zipcode, city, state }}
            onError={handleError}
            onChange={onZipInputChange}
            validateOnLostFocusOrClick
            validateOnClick={validateOnClick}
            setValidateOnClick={setValidateOnClick}
            setShouldGoNext={setShouldGoNext}
          />
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            onClick={() => setShouldGoNext(true)}
            variant="contained"
            color="primary"
            fullWidth
            size="large">
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CareLocation;
