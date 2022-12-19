/* eslint-disable camelcase */
/* istanbul ignore next */
import React, { useEffect, useState } from 'react';
import { Button, Grid, List, ListItem, makeStyles, TextareaAutosize } from '@material-ui/core';
import { captureMessage, Severity } from '@sentry/nextjs';
import { Typography } from '@care/react-component-lib';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';

import { POST_A_JOB_ROUTES } from '@/constants';
import OverlaySpinner from '@/components/OverlaySpinner';
import Header from '@/components/Header';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import { withTimeZoneSupport } from '@/components/polyfills/withTimeZoneSupport';
import { ONE_TIME_JOB_CREATE, SENIOR_CARE_RECURRING_JOB_CREATE } from '@/components/request/GQL';
import logger from '@/lib/clientLogger';
import { generateJobCreateInput } from '@/utilities/gqlPayloadHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import stripInvalidCharacters from '@/utilities/stripInvalidCharacters';
import { isInvalidAuthTokenInErrors } from '@/utilities/idealCaregiverHelper';
import {
  seniorCareRecurringJobCreate,
  seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreateError_errors,
} from '@/__generated__/seniorCareRecurringJobCreate';
import {
  seniorCareOneTimeJobCreate,
  seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreateError_errors,
} from '@/__generated__/seniorCareOneTimeJobCreate';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  bodyText: {
    fontWeight: 'normal',
    lineHeight: '24px',
  },
  caregiverContainer: {
    padding: 0,
    margin: theme.spacing(0, 0, 2),
  },
  submitButtonContainer: {
    padding: theme.spacing(0, 3, 2),
  },
  bulletPointList: {
    listStyleType: 'disc',
  },
  bulletPointItem: {
    marginLeft: theme.spacing(2),
    padding: 0,
    display: 'list-item',
    minHeight: '39px',
  },
  detailsBox: {
    width: '100%',
    fontFamily: theme.typography.fontFamily,
    borderRadius: '10px',
    boxShadow: '0 0 0 1px #C0C0C0',
    border: '5px solid transparent',
    fontSize: '14px',
    '-webkit-appearance': 'none',
    [theme.breakpoints.down('sm')]: {
      resize: 'none',
    },
  },
  subheader: {
    margin: theme.spacing(2, 0),
  },
  idealCaregiverSubtitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  examplesText: {
    marginBottom: theme.spacing(1),
  },
  errorText: {
    marginBottom: theme.spacing(2),
  },
  continueButton: {
    marginBottom: theme.spacing(3, 3, 0),
  },

  buttonsContainer: {
    marginTop: theme.spacing(4),
  },
}));

function Page() {
  const MAX_JOB_POST_ATTEMPTS = 3;

  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobPost: state, typeOfCare } = useSeekerState();
  const { flags } = useFeatureFlags();
  const [waitingOnNextRoute, setWaitingOnNextRoute] = useState(false);
  const [jobDescriptionError, setJobDescriptionError] = useState(false);

  const { idealCaregiver } = state;

  const handleNoPostJob = async () => {
    const data = {
      job_step: 'ideal caregiver',
      cta_clicked: 'Continue without submitting',
    };
    AnalyticsHelper.logEvent({
      name: 'Job not Posted',
      data,
    });
    await router.push(POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU);
    dispatch({ type: 'setJobStatus', jobSuccessful: false });
    dispatch({
      type: 'setSubmissionAttempted',
      submissionAttempted: false,
      attempts: 0,
    });
  };

  function handlePostSuccess(jobId?: string) {
    const data = {
      job_step: 'caregiver characteristics',
      preferred_gender: idealCaregiver?.gender?.charAt(0) || 'either',
      cta_clicked: 'next',
    };
    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data,
    });

    if (AmpliHelper.useAmpli(flags, typeOfCare)) {
      AmpliHelper.ampli.jobPostedCaregiverNeeds({
        ...AmpliHelper.getCommonData(),
        cta_clicked: 'next',
      });
    }

    if (jobId) {
      dispatch({ type: 'setJobId', jobId });
    }
    logger.info({ event: 'postAJobSuccess', zip: state.zip, jobId: jobId ?? 'UNKNOWN' });

    // set this to true to avoid spinner going away and revealing form momentarily
    setWaitingOnNextRoute(true);

    // reset this field to avoid weirdness with hitting the back button automatically triggering a PAJ request
    dispatch({
      type: 'setSubmissionAttempted',
      submissionAttempted: false,
      attempts: 0,
    });
    dispatch({ type: 'setJobStatus', jobSuccessful: true });
    router.push(POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU);
  }

  function logPostErrorMessage(
    errorMessage: string,
    maxAttemptsErrorMessage: string,
    graphQLError: string
  ) {
    if (state.idealCaregiver.attempts < MAX_JOB_POST_ATTEMPTS - 1) {
      logger.warn({ event: errorMessage, graphQLError });
      /* istanbul ignore next */
      captureMessage(`${errorMessage} ${graphQLError}`, Severity.Warning);
    } else {
      logger.error({ event: maxAttemptsErrorMessage, graphQLError });
    }
  }

  function handleJobDescriptionError(
    error:
      | seniorCareRecurringJobCreate_seniorCareRecurringJobCreate_SeniorCareRecurringJobCreateError_errors
      | seniorCareOneTimeJobCreate_seniorCareOneTimeJobCreate_SeniorCareOneTimeJobCreateError_errors
  ) {
    let eventName = 'postAJobDescriptionError';
    setJobDescriptionError(true);
    if (error.__typename === 'InappropriateLanguageInput') {
      eventName = 'postAJobInappropriateLanguageInput';
    }
    logger.error({ event: eventName, graphQLError: error.message });
  }

  function handlePostError(graphQLError: ApolloError) {
    let isAuthError = false;

    if (
      graphQLError.networkError &&
      'statusCode' in graphQLError.networkError &&
      graphQLError.networkError.statusCode === 401
    ) {
      logPostErrorMessage(
        'postAJobErrorFrom401',
        'postAJobMaxAttemptsFrom401',
        graphQLError.message
      );
      isAuthError = true;
    } else if (
      graphQLError.graphQLErrors &&
      graphQLError.graphQLErrors.length > 0 &&
      isInvalidAuthTokenInErrors(graphQLError.graphQLErrors)
    ) {
      logPostErrorMessage(
        'postAJobErrorFromAuthToken',
        'postAJobMaxAttemptsFromAuthToken',
        graphQLError.message
      );
      isAuthError = true;
    } else {
      logPostErrorMessage(
        'postAJobErrorNotFrom401',
        'postAJobMaxAttemptsNotFrom401',
        graphQLError.message
      );
    }

    if (isAuthError && idealCaregiver.attempts < MAX_JOB_POST_ATTEMPTS) {
      dispatch({
        type: 'setSubmissionAttempted',
        submissionAttempted: true,
        attempts: state.idealCaregiver.attempts + 1,
      });
    }
  }

  const [oneTimeJobCreate, oneTimeStatus] = useMutation(ONE_TIME_JOB_CREATE, {
    onCompleted(response: seniorCareOneTimeJobCreate) {
      if (
        response?.seniorCareOneTimeJobCreate?.__typename === 'SeniorCareOneTimeJobCreatePayload'
      ) {
        const jobId = response?.seniorCareOneTimeJobCreate?.job?.id;
        handlePostSuccess(jobId);
      } else if (
        response?.seniorCareOneTimeJobCreate?.__typename === 'SeniorCareOneTimeJobCreateError'
      ) {
        const [error] = response.seniorCareOneTimeJobCreate.errors;
        handleJobDescriptionError(error);
      }
    },
    onError(graphQLError) {
      handlePostError(graphQLError);
    },
  });

  const [recurringJobCreate, recurringStatus] = useMutation(SENIOR_CARE_RECURRING_JOB_CREATE, {
    onCompleted(response: seniorCareRecurringJobCreate) {
      if (
        response?.seniorCareRecurringJobCreate?.__typename === 'SeniorCareRecurringJobCreatePayload'
      ) {
        const jobId = response?.seniorCareRecurringJobCreate?.job?.id;
        handlePostSuccess(jobId);
      } else if (
        response?.seniorCareRecurringJobCreate?.__typename === 'SeniorCareRecurringJobCreateError'
      ) {
        const [error] = response.seniorCareRecurringJobCreate.errors;
        handleJobDescriptionError(error);
      }
    },
    onError(graphQLError) {
      handlePostError(graphQLError);
    },
  });

  function postAJob() {
    // make async PAJ request
    const jobCreateInput = generateJobCreateInput(state);
    setJobDescriptionError(false);

    if (state.careFrequency === 'onetime') {
      oneTimeJobCreate({
        variables: {
          input: jobCreateInput,
        },
      });
    } else if (state.recurring) {
      recurringJobCreate({
        variables: {
          input: jobCreateInput,
        },
      });
    }
  }

  function handleSubmission() {
    if (state.idealCaregiver.attempts === 0) {
      logger.info({ event: 'initialPostAJobAttempt' });
    }

    dispatch({
      type: 'setSubmissionAttempted',
      submissionAttempted: true,
      attempts: state.idealCaregiver.attempts + 1,
    });
    postAJob();
  }

  function handleTextFieldChange(event: any) {
    dispatch({
      type: 'setIdealCaregiverDetails',
      details: stripInvalidCharacters(event.target.value) ?? undefined,
    });
  }

  const oneTimeLoading =
    (oneTimeStatus.called || oneTimeStatus.loading) &&
    !oneTimeStatus.data &&
    !oneTimeStatus.error &&
    !jobDescriptionError;

  const recurringLoading =
    (recurringStatus.called || recurringStatus.loading) &&
    !recurringStatus.data &&
    !recurringStatus.error &&
    !jobDescriptionError;

  // automatically submit another PAJ request on pageload if the user had previously attempted a submission
  // and was redirected back to this page (i.e., after completing the OIDC flow)
  const shouldExecutePajRequest =
    state.idealCaregiver.submissionAttempted &&
    !recurringStatus.error &&
    !oneTimeStatus.error &&
    !jobDescriptionError;

  const isWaiting =
    shouldExecutePajRequest || recurringLoading || oneTimeLoading || waitingOnNextRoute;

  // only once on startup check if we landed here from redirect login
  useEffect(() => {
    if (shouldExecutePajRequest) {
      postAJob();
    }
  }, []);

  if (isWaiting) {
    return <OverlaySpinner isOpen={isWaiting} wrapped />;
  }

  if (state.jobPostSuccessful) {
    return (
      <Grid>
        <Grid item xs={12}>
          <Header>What are you looking for in a caregiver?</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            <strong>Job Already Posted</strong>
          </Typography>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={() => router.push(POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU)}
            fullWidth>
            Continue
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>What are you looking for in a caregiver?</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.idealCaregiverSubtitle}>
          Is there anything else we should know about your ideal caregiver?
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.caregiverContainer}>
        <Typography variant="body2" className={classes.examplesText}>
          Examples
        </Typography>
        <List className={classes.bulletPointList}>
          <ListItem disableGutters className={classes.bulletPointItem}>
            <Typography careVariant="body3">
              What type of personality would be a good fit?
            </Typography>
          </ListItem>
          <ListItem disableGutters className={classes.bulletPointItem}>
            <Typography careVariant="body3">Are there any specialized skills they need?</Typography>
          </ListItem>
          <ListItem disableGutters className={classes.bulletPointItem}>
            <Typography careVariant="body3">
              Should they have any specific hobbies/interests?
            </Typography>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12}>
        <TextareaAutosize
          className={classes.detailsBox}
          id="details"
          name="details"
          placeholder="Share details here"
          minRows={7}
          onChange={handleTextFieldChange}
          value={idealCaregiver.details}
        />
      </Grid>
      <Grid item xs={12} className={idealCaregiver.attempts > 0 ? '' : classes.buttonsContainer}>
        {idealCaregiver.attempts > 0 && (
          <>
            <Typography variant="h4" className={classes.errorText}>
              <strong>An error has occurred</strong>
            </Typography>

            <div className={classes.submitButtonContainer}>
              <Button
                className={classes.continueButton}
                color="primary"
                variant="contained"
                size="large"
                onClick={handleNoPostJob}
                fullWidth>
                Continue without submitting
              </Button>
            </div>
          </>
        )}
        {idealCaregiver.attempts < MAX_JOB_POST_ATTEMPTS && (
          <div className={classes.submitButtonContainer}>
            <Button
              color={idealCaregiver.attempts > 0 ? 'secondary' : 'primary'}
              variant="contained"
              onClick={handleSubmission}
              size="large"
              disabled={isWaiting}
              fullWidth>
              {idealCaregiver.attempts > 0 ? 'Try submitting again' : 'Submit'}
            </Button>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

Page.CheckAuthCookie = true;
export default withTimeZoneSupport(Page);
