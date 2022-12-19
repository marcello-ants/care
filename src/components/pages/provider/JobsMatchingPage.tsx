import React, { useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import CenteredPage from '@/components/CenteredPage';
import OverlaySpinner from '@/components/OverlaySpinner';
import JobCard from './JobCard';
import JobCardHeader from './JobCardHeader';
import JobCardFooter from './JobCardFooter';
import { jobsNearAnalytics, useJobList } from './jobPostUtil';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    marginTop: theme.spacing(3),
  },
}));
interface JobsMatchingPageProps {
  numberOfJobsNear: number;
  nextUrl: string;
}
export default function JobsMatchingPage({ numberOfJobsNear, nextUrl }: JobsMatchingPageProps) {
  const classes = useStyles();
  const jobsInfo = useJobList();
  useEffect(() => {
    if (!jobsInfo.loading && (jobsInfo.jobs?.length === 0 || jobsInfo.jobsError)) {
      jobsNearAnalytics(numberOfJobsNear);
      window.location.assign(nextUrl);
    }
  }, [jobsInfo.loading]);
  return jobsInfo.loading || jobsInfo.jobs?.length === 0 || jobsInfo.jobsError ? (
    <OverlaySpinner isOpen wrapped />
  ) : (
    <CenteredPage>
      <Grid container>
        <JobCardHeader
          numberOfJobsNear={numberOfJobsNear}
          jobsLength={jobsInfo.jobs?.length || 0}
        />
        {jobsInfo.jobs?.map((job, index) => (
          <Grid item xs={12} className={classes.cardContainer} key={`item-${index + 1}`}>
            <JobCard {...job} />
          </Grid>
        ))}
      </Grid>
      <JobCardFooter numberOfJobsNear={numberOfJobsNear} nextUrl={nextUrl} />
    </CenteredPage>
  );
}
