// External Dependencies
import Head from 'next/head';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

import { useSeekerCCState } from '@/components/AppState';
import Header from '@/components/Header';
import { SEEKER_CHILD_CARE_PAJ_ROUTES, CLIENT_FEATURE_FLAGS, JOB_MFE_CC_PAJ } from '@/constants';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

// Styles
const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(8),
  },
  subtitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(7),
    fontSize: '16px',
  },
  subtitle2: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
    fontSize: '16px',
  },
  skipForNowLink: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(45),
    '& > a': {
      textDecoration: 'none',
      color: theme.palette.care?.grey[700],
    },
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
}));

// Constants
const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

/**
 * Account creation - Part 3 - Confirmation
 *
 * @constructor
 */
function SeekerAccountCreationConfirmation() {
  const classes = useStyles();
  const router = useRouter();
  const { enrollmentSource } = useSeekerCCState();
  const featureFlags = useFeatureFlags();

  const directCCJobsToJobMfe = featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_CC];

  // Handlers
  function handleNext() {
    logChildCareEvent('Job Posted', 'PAJ - Start', enrollmentSource, {}, 'Lets go', true);
    // adding ignore test as this is a temp flag will be removed in a week
    /* istanbul ignore next */
    const redirectURL =
      directCCJobsToJobMfe?.variationIndex === 0
        ? CZEN_GENERAL + JOB_MFE_CC_PAJ
        : SEEKER_CHILD_CARE_PAJ_ROUTES.JOB_SCHEDULE;

    router.push(redirectURL);
  }

  return (
    <>
      <Head>
        <title>Account Creation Confirmation</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>Share a few more details about your ideal caregiver</Header>
          <Typography className={classes.subtitle} careVariant="info1">
            That way, you&apos;ll make better care connections
          </Typography>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
              Let&apos;s go
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default SeekerAccountCreationConfirmation;
