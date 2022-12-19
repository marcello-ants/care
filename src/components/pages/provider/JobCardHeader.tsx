import { Grid, makeStyles } from '@material-ui/core';
import Header from '@/components/Header';

const useStyles = makeStyles((theme) => ({
  blueText: {
    color: theme.palette.care.blue[700],
  },
}));
interface JobCardHeaderProps {
  jobsLength: number;
  numberOfJobsNear: number;
}
export default function JobCardHeader({ jobsLength, numberOfJobsNear }: JobCardHeaderProps) {
  const classes = useStyles();

  if (jobsLength === 1)
    return (
      <Grid item xs={12}>
        <Header>
          <span>There is</span>
          <span className={classes.blueText}> 1 new job </span>
          <span>that matches your specified skills.</span>
        </Header>
      </Grid>
    );

  return (
    <Grid item xs={12}>
      <Header>
        <span>Here are</span>
        <span className={classes.blueText}>
          {jobsLength > numberOfJobsNear
            ? ` ${jobsLength} new jobs `
            : ` ${jobsLength} of ${numberOfJobsNear} jobs `}
        </span>
        <span>that match your skills.</span>
      </Header>
    </Grid>
  );
}
