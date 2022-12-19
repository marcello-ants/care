import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';

import useEnterKey from '@/components/hooks/useEnterKey';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import Header from '@/components/Header';
import PostAJobDates from '@/components/PostAJobDates';
import OneTimeJobTime from '@/components/OneTimeJobTime';
import {
  AnalyticsHelper,
  formatAmplitudeDate,
  formatAmplitudeTime,
} from '@/utilities/analyticsHelper';
import { POST_A_JOB_ROUTES } from '@/constants';
import { calculateTimes } from '@/state/seeker/reducerHelpers';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(1, 3),
  },
  dateSubheader: {
    marginTop: theme.spacing(4),
  },
  timesSubheader: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  timeSlider: {
    marginBottom: theme.spacing(2),
  },
}));

function OneTimePage() {
  const classes = useStyles();
  const router = useRouter();
  const {
    jobPost: { oneTime },
  } = useSeekerState();
  const dispatch = useAppDispatch();

  const { date: startDate, time: startTime } = oneTime?.schedule?.start ?? {};
  const { date: endDate, time: endTime } = oneTime?.schedule?.end ?? {};
  const [disableNext, setDisableNext] = useState(true);

  const handleValidation = (isValid: boolean) => {
    setDisableNext(!(startTime && endTime && isValid));
  };

  const handleNext = () => {
    // checks if start and end dates are correct after button gets clicked and updates them if necessary
    const { start, end } = calculateTimes(startDate, startTime, endTime);

    dispatch({ type: 'setOneTimeTimes', start, end });
    const data = {
      job_step: 'date-time',
      job_type: 'one time',
      start_date: formatAmplitudeDate(startDate),
      end_date: formatAmplitudeDate(endDate),
      start_time: formatAmplitudeTime(start),
      end_time: formatAmplitudeTime(end),
      cta_clicked: 'next',
    };
    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data,
    });
    router.push(POST_A_JOB_ROUTES.PAY_FOR_CARE);
  };

  const handleStartDateChange = (newDate: string | null) => {
    dispatch({
      type: 'setOneTimeStartDate',
      date: newDate,
    });
  };

  const handleEndDateChange = (newDate: string | null) => {
    dispatch({ type: 'setOneTimeEndDate', date: newDate });
  };

  const handleTimeChange = (start: string, end: string) => {
    dispatch({ type: 'setOneTimeTimes', start, end });
  };

  useEnterKey(!disableNext, handleNext);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>When do you need care?</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.dateSubheader}>
          Dates
        </Typography>
      </Grid>

      <PostAJobDates
        endDate={endDate}
        startDate={startDate}
        setValidationStatus={handleValidation}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />

      <Grid item xs={12}>
        <Typography variant="h4" className={classes.timesSubheader}>
          Times
        </Typography>
      </Grid>
      <OneTimeJobTime
        startDate={startDate}
        startTime={startTime}
        endTime={endTime}
        onChange={handleTimeChange}
      />
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleNext}
          disabled={disableNext}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
}

export default OneTimePage;
