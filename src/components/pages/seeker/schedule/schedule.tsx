import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect, ComponentProps } from 'react';
import { Box, Button, Grid, FormGroup, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SegmentControl, Banner, Typography, Checkbox } from '@care/react-component-lib';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { ServiceType } from '@/__generated__/globalTypes';
import { SKIP_AUTH_CONTEXT_KEY, CARE_DATES } from '@/constants';
import {
  useAppDispatch,
  useSeekerCCState,
  useSeekerHKState,
  useSeekerPCState,
  useSeekerState,
  useSeekerTUState,
} from '@/components/AppState';
import { DayOfWeek, PartsOfDay } from '@/types/common';
import { formatAmplitudeDate, formatAmplitudeTime } from '@/utilities/analyticsHelper';
import { reduceWages } from '@/utilities/wageHelper';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

import { withTimeZoneSupport } from '@/components/polyfills/withTimeZoneSupport';
import PostAJobDays from '@/components/PostAJobDays';
import RecurringJobTime from '@/components/RecurringJobTime';
import PayForCareSlider from '@/components/PayForCareSlider';
import PostAJobDates from '@/components/PostAJobDates';
import OneTimeJobTime from '@/components/OneTimeJobTime';
import { GET_JOB_WAGES } from '@/components/request/GQL';
import useProviderCount from '@/components/hooks/useProviderCount';
import logger from '@/lib/clientLogger';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';

dayjs.extend(Timezone);
dayjs.extend(utc);

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3, 0),
  },
  sectionOneTitle: {
    marginTop: theme.spacing(3),
  },
  jobScheduleWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '& .block-hidden': {
      display: 'none',
    },
    '& .block-show': {
      display: 'block',
      width: '100%',
    },
  },
  jobType: {
    height: '32px',
  },
  section: {
    marginTop: theme.spacing(4),
  },
  typeSelection: {
    marginTop: theme.spacing(3),
  },
  daysBlock: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  timeBlocks: {
    marginTop: theme.spacing(2),
  },
  payRange: {
    marginTop: theme.spacing(4),
  },
  payRangeSubheader: {
    marginTop: theme.spacing(2),
  },
  timesSubheader: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  datesBlock: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
}));

type SegmentControlOptionsProps = ComponentProps<typeof SegmentControl>['options'];

const JOB_TYPES = Object.freeze({
  RECURRING: { value: 'recurring', label: 'Recurring' },
  ONE_TIME: { value: 'onetime', label: 'One time' },
});

const jobTypeOptions: SegmentControlOptionsProps = [
  { ...JOB_TYPES.RECURRING, selected: true },
  { ...JOB_TYPES.ONE_TIME, selected: false },
];
const topMaxRate = 50;

/* eslint-disable camelcase */
interface TrackingData {
  job_type: string;
  caregiver_count: number;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  day_of_week?: string[] | null;
  time_of_day?: string[] | null;
  schedule_may_vary?: number;
  flexible_schedule?: number;
  min_pay_rate?: number;
  max_pay_rate?: number;
}

/* eslint-enable camelcase */

const VERTICAL_PREFIX_BY_SERVICE_TYPE: { [key: string]: string } = {
  [ServiceType.CHILD_CARE]: 'cc',
  [ServiceType.HOUSEKEEPING]: 'hk',
  [ServiceType.PET_CARE]: 'pc',
  [ServiceType.TUTORING]: 'tu',
};

type VerticalStateFunc =
  | typeof useSeekerCCState
  | typeof useSeekerHKState
  | typeof useSeekerPCState
  | typeof useSeekerTUState;

const STATE_FUNC_BY_SERVICE_TYPE: { [key: string]: VerticalStateFunc } = {
  [ServiceType.CHILD_CARE]: useSeekerCCState,
  [ServiceType.HOUSEKEEPING]: useSeekerHKState,
  [ServiceType.PET_CARE]: useSeekerPCState,
  [ServiceType.TUTORING]: useSeekerTUState,
};

export interface PostAJobScheduleProps {
  serviceType: ServiceType;
  nextPageURL: string;
}

function PostAJobSchedule({ serviceType, nextPageURL }: PostAJobScheduleProps) {
  const classes = useStyles();
  const router = useRouter();
  const isCCFlow = serviceType === ServiceType.CHILD_CARE;
  const reducer = {
    type: 'job_reducer',
    prefix: VERTICAL_PREFIX_BY_SERVICE_TYPE[serviceType],
  };

  const dispatch = useAppDispatch();

  const verticalState = STATE_FUNC_BY_SERVICE_TYPE[serviceType]();

  const seekerState = useSeekerState();
  const [validateForm, setValidateForm] = useState(false); // used to trigger validation
  const [validDays, setValidDays] = useState(false);
  const [validTimes, setValidTimes] = useState(false);

  const [enableRouting, setEnableRouting] = useState(false); // this is set to true when Next is clicked

  const { schedule, careTimes, specificTimes, flexibleStartDate } = verticalState.jobPost.recurring;
  const { scheduleMayVary, jobType } = verticalState.jobPost;
  const { startDate, endDate } = verticalState?.jobPost?.jobDateTime?.dates;
  const { startTime, endTime } = verticalState?.jobPost?.jobDateTime?.time;
  const [disableNext, setDisableNext] = useState(true);
  const { numOfProviders, displayProviderMessage } = useProviderCount(serviceType);
  const handleValidation = (isValid: boolean) => {
    setDisableNext(!(startTime && endTime && isValid));
  };

  const handleRouting = () => {
    if (jobType === JOB_TYPES.RECURRING.value && (!validTimes || !validDays)) {
      return;
    }

    const trackingData: TrackingData = {
      job_type:
        jobType === JOB_TYPES.RECURRING.value
          ? JOB_TYPES.RECURRING.label
          : JOB_TYPES.ONE_TIME.label,
      caregiver_count: 0,
      day_of_week: Object.keys(schedule), // using keys since we only need day value
      time_of_day: Object.keys(careTimes),
      start_date: formatAmplitudeDate(startDate),
      end_date: formatAmplitudeDate(endDate),
      start_time: formatAmplitudeTime(startTime),
      end_time: formatAmplitudeTime(endTime),
      flexible_schedule: scheduleMayVary ? 1 : 0,
      min_pay_rate: verticalState?.jobPost?.rate?.minimum,
      max_pay_rate: verticalState?.jobPost?.rate?.maximum,
    };

    if (trackingData.job_type === JOB_TYPES.ONE_TIME.label) {
      trackingData.day_of_week = null;
      trackingData.time_of_day = null;
    } else {
      trackingData.start_time = null;
      trackingData.end_time = null;
    }
    if (!isCCFlow) {
      logCareEvent('Job Posted', 'PAJ - Schedule', trackingData);
    } else {
      logChildCareEvent(
        'Job Posted',
        'PAJ - Schedule',
        verticalState.enrollmentSource,
        trackingData
      );
    }

    router.push(nextPageURL);
  };

  // every time days and time selection is validated we want to check if if routing is required
  useEffect(() => {
    if (enableRouting) {
      handleRouting();
    }
  }, [validDays, validTimes, enableRouting]);

  const handleNext = () => {
    if (jobType === JOB_TYPES.RECURRING.value) {
      setValidateForm(true);
    }
    setEnableRouting(true); // we will look for this flag when validation is successful
  };

  const handleFlexibleDate = (event: any) => {
    dispatch({
      type: 'job_setFlexibleStartDate',
      flexibleStartDate: event?.currentTarget.checked,
      reducer,
    });
  };

  const handleScheduleMayVary = (event: any) => {
    dispatch({
      type: 'job_setScheduleMayVary',
      scheduleMayVary: event?.currentTarget.checked,
      reducer,
    });
  };

  // callback that is sent to PostAJobDays component to handle validation response
  const handleDaysValidationResponse = (isFormValid: boolean) => {
    setValidDays(isFormValid);
    setValidateForm(false);
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

  // Pay Range handling
  const { data } = useQuery(GET_JOB_WAGES, {
    variables: {
      zipcode: seekerState.zipcode,
      serviceType: serviceType as string,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  const handlePayRangeChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length > 1) {
      dispatch({
        type: 'job_setRateMinimum',
        minimum: newValue[0],
        reducer,
      });
      dispatch({
        type: 'job_setRateMaximum',
        maximum: newValue[1],
        reducer,
      });
    }
  };

  useEffect(() => {
    if (data) {
      const {
        avgMin: minimum,
        avgMax: maximum,
        legalMin: legalMinimum,
      } = reduceWages(verticalState.jobPost, data);
      dispatch({
        type: 'job_setRateMinimum',
        minimum,
        reducer,
      });
      dispatch({
        type: 'job_setRateMaximum',
        maximum,
        reducer,
      });
      dispatch({
        type: 'job_setRateLegalMinimum',
        legalMinimum,
        reducer,
      });
    }
  }, [data]);

  const handleStartDateChange = (newDate: string | null) => {
    dispatch({
      type: 'job_setJobStartDate',
      date: newDate,
      reducer,
    });
  };

  const handleEndDateChange = (newDate: string | null) => {
    dispatch({
      type: 'job_setJobEndDate',
      date: newDate,
      reducer,
    });
  };

  const handleCareDaysChange = (day: DayOfWeek, isPrevSelected?: boolean | undefined) => {
    if (isPrevSelected) {
      dispatch({
        type: 'job_removeDayBlock',
        day,
        reducer,
      });
    } else {
      dispatch({
        type: 'job_addDayBlock',
        day,
        reducer,
      });
    }
  };

  const handleCareTimesChange = (values: PartsOfDay) => {
    dispatch({
      type: 'job_setPartsOfDay',
      partsOfDay: values,
      reducer,
    });
  };

  const handleSpecificTimes = (isSpecificTimes: boolean) => {
    dispatch({
      type: 'job_setSpecificTimes',
      isSpecificTimes,
      reducer,
    });
  };

  const handleTimeChange = (start: string, end: string) => {
    dispatch({
      type: 'job_setJobTimes',
      start,
      end,
      reducer,
    });
  };

  const handleJobTypeChange = (selectedJobType: string) => {
    dispatch({
      type: 'job_setJobType',
      jobType: selectedJobType,
      reducer,
    });
  };

  const getStartDateFromIntent = (): string => {
    const todayEST = dayjs().tz('America/New_York');
    let processedIntent;
    if ('careDate' in verticalState) {
      processedIntent = verticalState.careDate;
    }
    let startDateFromIntent: string = '';
    const flowDateType = CARE_DATES;
    switch (processedIntent) {
      case flowDateType.IN_1_2_MONTHS:
        startDateFromIntent = dayjs().add(1, 'month').format('YYYY-MM-DD');
        break;
      case flowDateType.WITHIN_A_WEEK:
      case flowDateType.RIGHT_NOW:
      case flowDateType.JUST_BROWSING:
      default:
        // If it is 9pm or later EST we want to push to the next day
        startDateFromIntent = todayEST.add(3, 'hour').format('YYYY-MM-DD');
    }
    return startDateFromIntent;
  };

  // pre populate date based on intent
  useEffect(() => {
    if (!startDate) {
      // TODO fix snapshot issue
      handleStartDateChange(getStartDateFromIntent());
      logger.info({ event: 'postAJobPageViewed' });
    }
  }, []);

  let titleMessage;
  let flowString;
  switch (serviceType) {
    case ServiceType.HOUSEKEEPING:
      titleMessage = 'How often will you need a housekeeper?';
      break;
    case ServiceType.TUTORING:
      titleMessage = 'When do you need a tutor?';
      flowString = 'tutor';
      break;
    case ServiceType.PET_CARE:
      titleMessage = 'When do you need pet care?';
      flowString = 'pet caregiver';
      break;
    default:
      titleMessage = 'When do you need care?';
      flowString = 'Caregiver';
      break;
  }

  return (
    <>
      {displayProviderMessage && isCCFlow && (
        <Box ml={1} mr={1}>
          <Banner type="information" width="100%" roundCorners>
            <Typography variant="body2">
              <span>We have over&nbsp;</span>
              <span>{numOfProviders > 150 ? '150' : numOfProviders}</span>
              <span>&nbsp;caregivers, let&apos;s find the best fit for you</span>
            </Typography>
          </Banner>
        </Box>
      )}

      {!isCCFlow && displayProviderMessage && (
        <Box ml={1} mr={1}>
          <Banner type="information" width="100%" roundCorners>
            <Typography variant="body2">
              <span>Let&apos;s refine those&nbsp;</span>
              <span>{numOfProviders > 150 ? '150+' : numOfProviders}</span> {flowString}{' '}
              <span>options</span>
            </Typography>
          </Banner>
        </Box>
      )}

      <Grid container className={classes.jobScheduleWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionOneTitle}>
            {titleMessage}
          </Typography>
        </Grid>

        <Grid item xs={12} className={classes.typeSelection}>
          <SegmentControl
            options={jobTypeOptions}
            onChange={handleJobTypeChange}
            className={classes.jobType}
          />
        </Grid>

        <div className={classes.datesBlock}>
          <PostAJobDates
            endDate={endDate}
            startDate={startDate}
            setValidationStatus={handleValidation}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            jobType={jobType}
          />
        </div>

        {/* recurring job block */}
        <div className={jobType === JOB_TYPES.RECURRING.value ? 'block-show' : 'block-hidden'}>
          <Grid item xs={12}>
            <FormGroup className={classes.section}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="flexibleStartDate"
                    onChange={handleFlexibleDate}
                    checked={flexibleStartDate}
                  />
                }
                label="My start date is flexible"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h2" className={classes.daysBlock}>
              Which days?
            </Typography>
          </Grid>
          <PostAJobDays
            validateForm={validateForm}
            onValidationComplete={handleDaysValidationResponse}
            schedule={schedule}
            onChange={handleCareDaysChange}
          />

          <div className={classes.timeBlocks}>
            <RecurringJobTime
              validateForm={validateForm}
              onValidationComplete={handleTimesValidationResponse}
              careTimes={careTimes}
              specificTimes={specificTimes}
              validateDays={daysValidationResquest}
              showDisclaimer={false}
              onTimeChange={handleCareTimesChange}
              onSpecificTimeChange={handleSpecificTimes}
              customSeekerState={verticalState}
              jobReducer={reducer}
            />
          </div>
        </div>
        {/* END: recurring job block */}

        {/* one-time job block */}
        <div className={jobType === JOB_TYPES.ONE_TIME.value ? 'block-show' : 'block-hidden'}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.timesSubheader}>
              Time
            </Typography>
          </Grid>
          <OneTimeJobTime
            startTime={startTime}
            endTime={endTime}
            startDate={startDate}
            onChange={handleTimeChange}
          />
        </div>
        {/* END: one-time job block */}

        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="scheduleMayVary"
                  onChange={handleScheduleMayVary}
                  checked={scheduleMayVary}
                />
              }
              label="My schedule may vary"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h2" className={classes.payRange}>
            What would you like to pay?
          </Typography>
        </Grid>
        <PayForCareSlider
          value={[verticalState.jobPost.rate.minimum, verticalState.jobPost.rate.maximum]}
          min={verticalState.jobPost.rate.legalMinimum}
          max={topMaxRate}
          onChange={handlePayRangeChange}
        />

        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            onClick={handleNext}
            disabled={disableNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default withTimeZoneSupport(PostAJobSchedule);
