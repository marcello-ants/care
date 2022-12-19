import { useQuery } from '@apollo/client';
import { Box, Grid, GridProps, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Typography } from '@care/react-component-lib';
import { useEffect } from 'react';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { GET_NUMBER_OF_JOBS_NEARBY, GET_AVERAGE_JOB_WAGE } from './request/GQL';
import {
  getNumberOfNewJobsNearby,
  getNumberOfNewJobsNearbyVariables,
} from '../__generated__/getNumberOfNewJobsNearby';
import { getAverageJobWage, getAverageJobWageVariables } from '../__generated__/getAverageJobWage';
import { ServiceType, DistanceUnit } from '../__generated__/globalTypes';
import { CLIENT_FEATURE_FLAGS, SKIP_AUTH_CONTEXT_KEY } from '../constants';
import { useAppDispatch, useProviderCCState } from './AppState';

interface Props extends GridProps {
  zipcode: string;
  distance: number;
  serviceType: ServiceType;
}

const useStyles = makeStyles((theme) => ({
  alertContent: {
    backgroundColor: theme.palette.care.blue[100],
    color: theme.palette.care.blue[700],
    borderRadius: 8,
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
  alertEmoji: {
    fontSize: '24px',
    paddingTop: theme.spacing(0.25),
    margin: 'auto',
  },
}));

const JobsAvailableCard = ({ zipcode, serviceType, distance, ...gridProps }: Props) => {
  const classes = useStyles();
  const featureFlags = useFeatureFlags();
  const { city } = useProviderCCState();
  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const {
    loading: jobsLoading,
    data: jobsData,
    error: jobsError,
  } = useQuery<getNumberOfNewJobsNearby, getNumberOfNewJobsNearbyVariables>(
    GET_NUMBER_OF_JOBS_NEARBY,
    {
      variables: {
        zipcode,
        serviceType,
        radius: { value: distance, unit: DistanceUnit.MILES },
      },
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      skip: !zipcode,
    }
  );
  const {
    loading: rateLoading,
    data: rateData,
    error: rateError,
  } = useQuery<getAverageJobWage, getAverageJobWageVariables>(GET_AVERAGE_JOB_WAGE, {
    variables: {
      zipcode,
      serviceType,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    skip: !zipcode,
  });

  const areThereJobs = !jobsLoading && !jobsError && Boolean(jobsData?.getNumberOfNewJobsNearby);
  const areThereEnoughJobs = areThereJobs && jobsData!.getNumberOfNewJobsNearby >= 10;
  const areThereRates =
    !rateLoading && !rateError && Boolean(rateData?.getJobWages?.averages?.average?.amount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (areThereJobs)
      dispatch({
        type: 'setNumberOfJobsNear',
        numberOfJobsNear: jobsData!.getNumberOfNewJobsNearby,
      });
  }, [areThereJobs]);

  const renderJobsAlertText = () => {
    const isEnoughRatesAndJobs = areThereRates && areThereEnoughJobs;

    if (
      isEnoughRatesAndJobs &&
      providerCCFreeGatedExperience &&
      serviceType === ServiceType.CHILD_CARE
    ) {
      return (
        <>
          <span>There are&nbsp;</span>
          <b>{jobsData!.getNumberOfNewJobsNearby} jobs</b>
          <span>&nbsp;near you&mdash;earn up to</span>{' '}
          <b>${rateData!.getJobWages.averages.average.amount}/hr</b>
          <span>&nbsp;in&nbsp;</span>
          <span>{city}</span>
          <span>.</span>
        </>
      );
    }

    if (isEnoughRatesAndJobs) {
      return (
        <>
          <span>There are&nbsp;</span>
          <b>{jobsData!.getNumberOfNewJobsNearby} new jobs</b>
          <span>&nbsp;near you at an average rate of&nbsp;</span>
          <b>${rateData!.getJobWages.averages.average.amount}/hr</b>
          <span>.</span>
        </>
      );
    }

    return <span>There are new jobs near you.</span>;
  };

  return (
    <Grid item xs={12} {...gridProps}>
      <Box mb={3}>
        <Alert
          severity="info"
          className={classes.alertContent}
          icon={
            <Typography variant="body2" className={classes.alertEmoji}>
              <span>&#x1F389;</span>
            </Typography>
          }>
          <Typography variant="body2">
            <span>{renderJobsAlertText()}</span>
          </Typography>
        </Alert>
      </Box>
    </Grid>
  );
};

export default JobsAvailableCard;
