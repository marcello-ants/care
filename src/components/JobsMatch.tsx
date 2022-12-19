import { useQuery } from '@apollo/client';
import { Box, Grid, GridProps, makeStyles } from '@material-ui/core';
import { Typography, Banner } from '@care/react-component-lib';
import { useEffect } from 'react';
import { GET_NUMBER_OF_JOBS_NEARBY } from './request/GQL';
import {
  getNumberOfNewJobsNearby,
  getNumberOfNewJobsNearbyVariables,
} from '../__generated__/getNumberOfNewJobsNearby';
import { ServiceType } from '../__generated__/globalTypes';
import { SKIP_AUTH_CONTEXT_KEY } from '../constants';
import { useAppDispatch } from './AppState';

interface Props extends GridProps {
  zipcode: string;
}

const useStyles = makeStyles((theme) => ({
  bannerText: {
    color: theme.palette.care.blue[700],
  },
  alertEmoji: {
    fontSize: '24px',
    paddingTop: theme.spacing(0.25),
    margin: 'auto',
  },
}));

const JobsMatch = ({ zipcode, ...gridProps }: Props) => {
  const classes = useStyles();

  const {
    loading: jobsLoading,
    data: jobsData,
    error: jobsError,
  } = useQuery<getNumberOfNewJobsNearby, getNumberOfNewJobsNearbyVariables>(
    GET_NUMBER_OF_JOBS_NEARBY,
    {
      variables: {
        zipcode,
        serviceType: ServiceType.CHILD_CARE,
      },
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    }
  );

  const areThereJobs = !jobsLoading && !jobsError && Boolean(jobsData?.getNumberOfNewJobsNearby);
  const areThereEnoughJobs = areThereJobs && jobsData!.getNumberOfNewJobsNearby >= 10;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (areThereJobs)
      dispatch({
        type: 'setNumberOfJobsNear',
        numberOfJobsNear: jobsData!.getNumberOfNewJobsNearby,
      });
  }, [areThereJobs]);

  if (!areThereEnoughJobs) return null;

  return (
    <Grid item xs={12} {...gridProps}>
      <Box mb={3}>
        <Banner
          type="information"
          width="100%"
          roundCorners
          icon={
            <Typography variant="body2" className={classes.alertEmoji}>
              &#x1F389;
            </Typography>
          }>
          <Typography variant="body2" data-testid="job-count-toast" className={classes.bannerText}>
            <span>Nice!&nbsp;</span>
            <b>{jobsData!.getNumberOfNewJobsNearby} jobs</b>
            <span>&nbsp;match your needs.</span>
          </Typography>
        </Banner>
      </Box>
    </Grid>
  );
};

export default JobsMatch;
