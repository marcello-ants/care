import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';

import { POST_A_JOB_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { DayOfWeek, PartsOfDay } from '@/types/common';
import Header from '@/components/Header';
import useEnterKey from '@/components/hooks/useEnterKey';
import PostAJobDays from '@/components/PostAJobDays';
import RecurringJobTime from '@/components/RecurringJobTime';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  // TODO: should be able to replace this with the "info1" typography variant once available
  errorText: {
    color: theme.palette.error.main,
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: theme.spacing(1),
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 3, 0),
  },
  daySubheader: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  timeSubheader: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

function Page() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    jobPost: { recurring: state },
    typeOfCare,
  } = useSeekerState();
  const { flags } = useFeatureFlags();
  const [validateForm, setValidateForm] = useState(false); // used to trigger validation
  const [validDays, setValidDays] = useState(false);
  const [validTimes, setValidTimes] = useState(false);
  const [enableRouting, setEnableRouting] = useState(false); // this is set to true when Next is clicked

  const { schedule, careTimes, specificTimes } = state;

  const handleRouting = () => {
    if (!validTimes || !validDays) {
      return;
    }
    const data = {
      job_step: 'date-time',
      job_type: 'recurring',
      day_of_week: Object.keys(schedule), // using keys since we only need day value
      time_of_day: Object.keys(careTimes),
      flexible_schedule: state.scheduleMayVary,
      cta_clicked: 'next',
    };
    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data,
    });

    if (AmpliHelper.useAmpli(flags, typeOfCare)) {
      AmpliHelper.ampli.jobPostedSchedule({
        ...AmpliHelper.getCommonData(),
        job_type: 'recurring',
        day_of_week: data.day_of_week,
        time_of_week: data.time_of_day,
        flexible_schedule: data.flexible_schedule.toString(),
        cta_clicked: 'next',
      });
    }

    router.push(POST_A_JOB_ROUTES.PAY_FOR_CARE);
  };

  /* every time days and time selection is validated we want to check if if routing is required.
  we need to watch for each validation because validation and enableRouting are not synchronised. 
  We are not ready to navigate when enableRouting is true as we have to wait for validation to complete
  we have to come up with a better approach to handle days and times components together - TODO
  */
  useEffect(() => {
    if (enableRouting) {
      handleRouting();
    }
  }, [validDays, validTimes, enableRouting]);

  // callback that is sent to PostAJobDays component to handle validation response
  const handleDaysValidationResponse = (isFormValid: boolean) => {
    setValidDays(isFormValid); // validation status update
    setValidateForm(false); // reset Next button click status, we will need this to be able to resubmit
  };

  // callback that is sent to RecurringJobTime component to handle validation response
  const handleTimesValidationResponse = (isFormValid: boolean) => {
    setValidTimes(isFormValid);
    setValidateForm(false);
  };

  // callback to trigger days validation when specific time is updated.
  const daysValidationResquest = () => {
    setValidateForm(true);
    setEnableRouting(false);
  };

  // on Next validateForm is set to true, this triggers validation in PostAJobDays & RecurringJobTime components
  const handleNext = () => {
    setValidateForm(true);
    setEnableRouting(true); // we will look for this flag when validation is successful
  };

  // PostAJobDays dispatch handlers
  const handleCareDaysChange = (day: DayOfWeek, isPrevSelected?: boolean | undefined) => {
    if (isPrevSelected) {
      dispatch({ type: 'removeDayBlock', day });
    } else {
      dispatch({ type: 'addDayBlock', day });
    }
  };

  // RecurringJobTime Time change
  const handleCareTimesChange = (values: PartsOfDay) => {
    dispatch({ type: 'setPartsOfDay', partsOfDay: values });
  };

  const handleSpecificTimes = (isSpecificTimes: boolean) => {
    dispatch({ type: 'setSpecificTimes', isSpecificTimes });
  };

  useEnterKey(true, handleNext);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>Which days do you need care?</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.daySubheader}>
          Days
        </Typography>
      </Grid>
      <PostAJobDays
        validateForm={validateForm}
        onValidationComplete={handleDaysValidationResponse}
        schedule={schedule}
        onChange={handleCareDaysChange}
      />
      {(!specificTimes || Object.keys(schedule).length > 0) && (
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.timeSubheader}>
            Times
          </Typography>
        </Grid>
      )}
      <RecurringJobTime
        validateForm={validateForm}
        onValidationComplete={handleTimesValidationResponse}
        careTimes={careTimes}
        specificTimes={specificTimes}
        validateDays={daysValidationResquest}
        showDisclaimer
        onTimeChange={handleCareTimesChange}
        onSpecificTimeChange={handleSpecificTimes}
      />
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button color="primary" variant="contained" size="large" onClick={handleNext} fullWidth>
          Next
        </Button>
      </Grid>
    </Grid>
  );
}

export default Page;
