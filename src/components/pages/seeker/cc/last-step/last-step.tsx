import { Box, Button, Grid, TextField } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Banner } from '@care/react-component-lib';
import { generateChildCareJobCreateInput } from '@/utilities/gqlPayloadHelper';
import {
  CHILD_CARE_ONE_TIME_JOB_CREATE,
  CHILD_CARE_RECURRING_JOB_CREATE,
} from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useAppDispatch, useSeekerCCState, useSeekerState } from '@/components/AppState';
import { childCareOneTimeJobCreate } from '@/__generated__/childCareOneTimeJobCreate';
import { childCareRecurringJobCreate } from '@/__generated__/childCareRecurringJobCreate';
import NeedSomeTipsBanner from '@/components/NeedSomeTipsBanner';
import { useQuery } from '@apollo/client';
import { getTopCaregivers, getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import { DistanceUnit, ServiceType } from '@/__generated__/globalTypes';
import { useEffect } from 'react';
import { mapGQLToProviderProfiles } from '@/components/pages/seeker/cc/lc/utils';
import { getNavFunctionsForCC } from '../../last-step/getNavFunctions';
import usePostAJob from '../../last-step/usePostAJob';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(15.4),
  },
  sectionOneTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  lastStepWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  aboutYourFamily: {
    width: '100%',
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.care?.white,
  },
  openModal: {
    border: 'none',
    background: theme.palette.care?.white,
    color: theme.palette.care?.blue[700],
    fontSize: '16px',
    padding: 0,
    width: 'auto',
    marginTop: theme.spacing(2),
    '&:hover': {
      border: 'none',
      background: theme.palette.care?.white,
      color: theme.palette.care?.blue[700],
    },
  },
  jobPosted: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(4),
  },
  errorText: {
    textAlign: 'center',
    paddingBottom: theme.spacing(1),
  },
  tipItem: {
    flexWrap: 'nowrap',
  },
}));

function LastStep() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { zipcode } = useSeekerState();
  const seekerCCState = useSeekerCCState();
  const { jobPost, enrollmentSource } = seekerCCState;
  const { jobDescription, submissionInfo } = jobPost;

  const reducer = {
    type: 'job_reducer',
    prefix: 'cc',
  };

  const { navigateToNextStep, navigateToNextStepWithNoPostJob } = getNavFunctionsForCC({
    enrollmentSource,
    jobDescription,
  });

  const { MAX_JOB_POST_ATTEMPTS, isWaiting, handleNext, handleNoPostJob, handleChange } =
    usePostAJob<childCareOneTimeJobCreate, childCareRecurringJobCreate>({
      reducer,
      navigateToNextStep,
      navigateToNextStepWithNoPostJob,
      seekerSpecificState: seekerCCState,
      generateJobInput: generateChildCareJobCreateInput,
      RECURRING_JOB_CREATE: CHILD_CARE_RECURRING_JOB_CREATE,
      ONE_TIME_JOB_CREATE: CHILD_CARE_ONE_TIME_JOB_CREATE,
      getOneTimeJobId: (response: childCareOneTimeJobCreate) =>
        response.childCareOneTimeJobCreate?.job?.id,
      getRecurringJobId: (response: childCareRecurringJobCreate) =>
        response.childCareRecurringJobCreate?.job,
    });

  const { data: queryData, loading: topCaregiversLoading } = useQuery<
    getTopCaregivers,
    getTopCaregiversVariables
  >(GET_TOP_CAREGIVERS, {
    variables: {
      zipcode,
      serviceID: ServiceType.CHILD_CARE,
      numResults: 15,
      hourlyRate: {
        maximum: {
          amount: seekerCCState.jobPost.rate.maximum.toString(),
          currencyCode: 'USD',
        },
        minimum: {
          amount: seekerCCState.jobPost.rate.minimum.toString(),
          currencyCode: 'USD',
        },
      },
      fullTime: true,
      maxDistanceFromSeeker: {
        unit: DistanceUnit.MILES,
        value: 25,
      },
    },
  });

  useEffect(() => {
    if (queryData) {
      dispatch({
        type: 'cc_setLCProviders',
        providers: mapGQLToProviderProfiles(queryData.topCaregivers),
      });
    }
  }, [topCaregiversLoading]);

  if (isWaiting || topCaregiversLoading) {
    return <OverlaySpinner isOpen={isWaiting || topCaregiversLoading} wrapped />;
  }

  if (submissionInfo.jobPostSuccessful) {
    const message =
      'Your needs have already been shared. You can always update your preferences later.';
    return (
      <Grid container spacing={1}>
        <Grid container className={classes.jobPosted} spacing={0}>
          <Box ml={1} mr={1}>
            <Banner type="confirmation" width="100%" roundCorners>
              <Typography>{message}</Typography>
            </Banner>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={navigateToNextStep}>
            Continue
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Box ml={1} mr={1}>
        <Banner type="confirmation" width="100%" roundCorners>
          <Typography>Last step!</Typography>
        </Banner>
      </Box>
      <Grid container className={classes.lastStepWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionOneTitle}>
            What else should caregivers know about your family?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            InputLabelProps={{ shrink: true }}
            name="description"
            error={false}
            placeholder="Ex: Our pint-sized Lego engineer loves to climb on furniture to view our floor space from up high. He's an intelligent old soul that questions everything. So, we need a sitter that will feed his belly and his imagination and be a patient negotiator of nap time to keep him engaged and on schedule."
            multiline
            value={jobDescription}
            rows={12}
            inputProps={{
              maxLength: 850,
            }}
            onChange={handleChange}
            className={classes.aboutYourFamily}
          />
        </Grid>
        <Grid item xs={12}>
          <NeedSomeTipsBanner verticalName="CC" />
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          {submissionInfo.attempts === MAX_JOB_POST_ATTEMPTS && (
            <>
              <Typography variant="h4" className={classes.errorText}>
                <strong>An error has occurred</strong>
              </Typography>

              <div>
                <Button color="primary" variant="contained" onClick={handleNoPostJob} fullWidth>
                  Continue without submitting
                </Button>
              </div>
            </>
          )}
          {submissionInfo.attempts < MAX_JOB_POST_ATTEMPTS && (
            <>
              <Button
                color={submissionInfo.attempts > 0 ? 'secondary' : 'primary'}
                variant="contained"
                size="large"
                fullWidth
                onClick={handleNext}>
                Submit
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}

LastStep.CheckAuthCookie = true;
export default LastStep;
