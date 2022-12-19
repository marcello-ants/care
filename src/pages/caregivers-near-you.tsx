// External dependencies
import { useEffect, useRef, useState } from 'react';
import { Typography } from '@care/react-component-lib';
import { Grid, makeStyles } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';

// Internal dependencies
import Header from '@/components/Header';
import Divider from '@/components/Divider';
import { useSeekerState } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import {
  CLIENT_FEATURE_FLAGS,
  SEEKER_ROUTES,
  NUMBER_OF_CAREGIVERS_TO_DISPLAY_CAREGIVERS_NEAR_YOU,
  NUMBER_OF_LEAD_CONNECT_RESULTS,
  CAREGIVERS_NEAR_YOU_REDIRECTION_TIMEOUT,
} from '@/constants';
import { getTopCaregivers, getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { useRouter } from 'next/router';
import { mapCaregiverProfiles } from '@/components/pages/seeker/sc/lc/caregiver-profile/caregiverProfileHelper';
import { SeniorCareProviderProfile } from '@/types/seeker';
import logger from '@/lib/clientLogger';
import { GetTopCaregiverStopwatch } from '@/components/features/Stopwatch/GetTopCaregiverStopWatch';
import {
  generateInputAndCallGetTopCaregivers,
  generateSCTestAwareGetTopCaregiversInput,
} from '@/components/pages/seeker/sc/getTopCaregiversHelper';
import CareGiverCard from '@/components/CareGiverCard';
import { generateLeadConnectMfeSessionState } from '@/utilities/leadAndConnectHelper';
import useSeniorCarePreRateCardRedirect from '@/components/hooks/useSeniorCarePreRateCardRedirect';

const useStyles = makeStyles((theme) => ({
  bodyText: {
    fontWeight: 'normal',
    lineHeight: '24px',
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
  careTypeContainer: {
    margin: theme.spacing(2, 0, 3, 0),
  },
  buttonContainer: {
    padding: theme.spacing(0, 3),
  },
  nextButton: {
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
  skipButton: {
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(2),
    },
  },
  skipButtonSpan: {
    fontSize: '16px',
  },
  careGiverItem: {
    borderBottom: `1px dashed ${theme.palette.grey[200]}`,
    '&:nth-child(even)': { borderLeft: `1px dashed ${theme.palette.grey[200]}` },
    '&:nth-last-child(2)': { borderBottom: 'none' },
    '&:last-child': { borderBottom: 'none' },
  },
  link: {
    textDecoration: 'none',
  },
  h4Text: {
    marginTop: 0,
    marginBottom: 0,
  },
  fullHeight: {
    minHeight: 'calc(80vh - 60px)',
  },
  footerActions: {
    alignSelf: 'flex-end',
  },
  divider: {
    padding: theme.spacing(3, 0, 3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2, 0, 3),
    },
  },
  caregiversAreaTitle: {
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(2),
    },
  },
  caregiverCardsContainer: {
    marginTop: '0px',
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
}));

function CaregiversNearYou() {
  // Styles
  const classes = useStyles();

  // Refs
  const getTopCaregiverStopwatch = useRef(new GetTopCaregiverStopwatch('caregivers-near-you'));

  // Component's state
  const [caregiverProfiles, setCaregiverProfiles] = useState<SeniorCareProviderProfile[]>([]);
  const {
    jobPost: {
      jobPostSuccessful,
      zip,
      typeOfCare: desiredTypeOfCare,
      rate,
      lovedOne: { whoNeedsCare: lovedOneWhoNeedsCare },
    },
    helpTypes: requestedServices,
    leadAndConnect: { maxDistanceFromSeeker },
    whoNeedsCare,
  } = useSeekerState();

  // Feature Flags
  const { flags } = useFeatureFlags();
  const leadConnectBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_PROVIDER_NETWORK]?.variationIndex;

  const leadConnectFifteenCaregiversBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_FIFTEEN_CAREGIVERS]?.variationIndex;

  // A/B Test - skip-login-in-ratecard-redirection
  const skipLoginInRateCardRedirectionTestFlagEvaluation =
    flags[CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION];

  const skipLoginInRateCardRedirectionTestIsEnabled = Boolean(
    skipLoginInRateCardRedirectionTestFlagEvaluation?.value
  );

  const router = useRouter();

  const { goToPreRateCard, preRateCardURL } = useSeniorCarePreRateCardRedirect({
    query: {
      enrollFlow: 'true',
    },
    skipLogin: skipLoginInRateCardRedirectionTestIsEnabled,
  });

  function upgradeMembership() {
    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data: {
        job_step: 'Job confirmation',
        cta_clicked: 'Upgrade',
      },
    });

    logger.info({
      event: 'PreRateCardRedirection',
      isFlagEnabled: skipLoginInRateCardRedirectionTestIsEnabled,
      currentPageURL: window.location.href,
      redirectsTo: preRateCardURL,
    });

    goToPreRateCard();
  }

  const prepareForLeadConnectMfe = () => {
    const getTopCaregiversPartialParams = { zipcode: zip!, rate, helpTypes: requestedServices };
    const getTopCaregiversInput: getTopCaregiversVariables =
      generateSCTestAwareGetTopCaregiversInput(
        leadConnectBucket,
        getTopCaregiversPartialParams,
        maxDistanceFromSeeker,
        leadConnectFifteenCaregiversBucket
      );
    generateLeadConnectMfeSessionState(
      getTopCaregiversInput,
      rate,
      requestedServices,
      desiredTypeOfCare,
      lovedOneWhoNeedsCare ?? whoNeedsCare
    );
  };

  const [getTopCaregiver, { loading, data, error: queryError }] = useLazyQuery<
    getTopCaregivers,
    getTopCaregiversVariables
  >(GET_TOP_CAREGIVERS);

  const displayError = queryError || !data?.topCaregivers?.length;

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
    });
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION,
      skipLoginInRateCardRedirectionTestFlagEvaluation
    );

    if (zip) {
      getTopCaregiverStopwatch.current.start();
      const getTopCaregiversPartialParams = { zipcode: zip, rate, helpTypes: requestedServices };

      generateInputAndCallGetTopCaregivers(
        leadConnectBucket,
        getTopCaregiversPartialParams,
        getTopCaregiver,
        maxDistanceFromSeeker,
        leadConnectFifteenCaregiversBucket
      );
    } else {
      router.push(SEEKER_ROUTES.LOCATION);
    }
  }, []);

  useEffect(() => {
    const getTopCaregiversPartialParams = { zipcode: zip!, rate, helpTypes: requestedServices };

    const params = {
      getTopCaregiverSuccess: data,
      getTopCaregiverError: queryError,
      desiredNumResults: NUMBER_OF_LEAD_CONNECT_RESULTS(leadConnectFifteenCaregiversBucket === 1),
      leadConnectBucket,
      getTopCaregiversPartialParams,
      maxDistanceFromSeeker,
      leadConnectFifteenCaregiversBucket,
    };

    getTopCaregiverStopwatch.current.stop(params);
    if (caregiverProfiles.length === 0 && data && !queryError) {
      const resultingProviders: SeniorCareProviderProfile[] = mapCaregiverProfiles(
        data!,
        requestedServices,
        desiredTypeOfCare
      );
      if (resultingProviders.length > 0) {
        setCaregiverProfiles(resultingProviders);
      }
    }

    prepareForLeadConnectMfe();
    const upgradeMembershipTimeout = setTimeout(() => {
      upgradeMembership();
    }, CAREGIVERS_NEAR_YOU_REDIRECTION_TIMEOUT);

    return () => {
      if (upgradeMembershipTimeout) {
        clearTimeout(upgradeMembershipTimeout);
      }
    };
    // A/B Test end.
  }, [data, queryError]);

  return loading ? (
    <OverlaySpinner isOpen wrapped />
  ) : (
    <Grid container spacing={2} className={classes.fullHeight}>
      <Grid item container spacing={1} alignContent="flex-start">
        <Grid item xs={12}>
          <Header>
            {jobPostSuccessful
              ? 'Your job needs have been shared!'
              : 'Unfortunately, your job could not be posted at this time'}
          </Header>
        </Grid>

        {jobPostSuccessful && (
          <Grid item xs={12}>
            <Typography variant="body2" className={classes.bodyText}>
              Be on the lookout for applicants in your inbox.
            </Typography>
          </Grid>
        )}

        <Grid item>
          <div className={classes.divider}>
            <Divider />
          </div>
        </Grid>

        <Grid item container spacing={2} justifyContent="center">
          {displayError && (
            <Grid item xs={12}>
              <Typography variant="h4" className={classes.h4Text}>
                Next, you&apos;ll be able to search for caregivers in your area. You can upgrade now
                to message them directly.
              </Typography>
            </Grid>
          )}

          {caregiverProfiles && caregiverProfiles.length > 0 && (
            <>
              <Grid item xs={12} container spacing={2}>
                <Typography variant="h4" className={classes.h4Text}>
                  {jobPostSuccessful
                    ? "Don't wait for caregivers to contact you, upgrade now to reach out to them directly."
                    : 'The good news: you can still directly search local caregivers. Upgrade now to reach out to them directly.'}
                </Typography>
              </Grid>

              <Grid item xs={12} className={classes.caregiversAreaTitle}>
                <Typography variant="body1" className={classes.h4Text}>
                  Top caregivers in your area
                </Typography>
              </Grid>

              <Grid item xs={12} className={classes.caregiverCardsContainer}>
                <Grid container spacing={2}>
                  {caregiverProfiles
                    .slice(0, NUMBER_OF_CAREGIVERS_TO_DISPLAY_CAREGIVERS_NEAR_YOU)
                    .map((providerProfile) => {
                      const {
                        yearsOfExperience,
                        averageRating: avgReviewRating,
                        displayName,
                        imgSource: imageURL,
                      } = providerProfile;
                      return (
                        <Grid item xs={6} className={classes.careGiverItem} key={displayName}>
                          <CareGiverCard
                            yearsOfExperience={yearsOfExperience}
                            avgReviewRating={avgReviewRating ?? 0}
                            member={{ displayName, imageURL: imageURL ?? '' }}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CaregiversNearYou;
