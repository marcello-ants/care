// External Dependencies
import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

// Internal Dependencies
import Header from '@/components/Header';
import { caregivers } from '@/components/pages/seeker/sc/recap/recap';
import CaregiversPreview from '@/components/features/caregiversPreview/CaregiversPreview';
import { CLIENT_FEATURE_FLAGS, SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import DidYouKnow from '@/components/features/DidYouKnow/DidYouKnow';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useLangConversational from '@/components/hooks/useLangConversational';
import { useIsEligibleForNameBeforeEmail } from '@/components/hooks/useNameBeforeEmail';

// Styles

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  header: {
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
}));

/**
 * Interstitial view with Reviews.
 *
 * @returns JSX
 */
function InterstitialWithReviews() {
  const classes = useStyles();
  const router = useRouter();
  let nextRoute = SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL;
  const isEligibleForNameBeforeEmailTest = useIsEligibleForNameBeforeEmail();

  useEffect(() => {
    const amplitudeData = {
      screen_name: 'recapChildCare',
    };
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: amplitudeData,
    });
  }, []);

  const featureFlags = useFeatureFlags();

  const languageConversationalFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;

  const nameBeforeEmailFlag = featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_NAME_BEFORE_EMAIL];

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.RECAP,
    languageConversationalFlag
  );

  const onComplete = () => {
    if (isEligibleForNameBeforeEmailTest) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.SEEKER_CC_NAME_BEFORE_EMAIL,
        nameBeforeEmailFlag
      );
      if (typeof nameBeforeEmailFlag !== 'undefined' && nameBeforeEmailFlag.variationIndex === 2) {
        nextRoute = SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_NAME;
      }
    }
    router.push(nextRoute);
  };

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} className={classes.header}>
        <Header>{languageConversationalText}</Header>
      </Grid>
      <DidYouKnow info="100% of caregivers are required to complete our background check" />
      <CaregiversPreview caregivers={caregivers} onComplete={onComplete} />
    </Grid>
  );
}

export default InterstitialWithReviews;
