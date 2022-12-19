import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { KeyboardDatePicker } from '@care/react-component-lib';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { withTimeZoneSupport } from './polyfills/withTimeZoneSupport';
import { calculateBoundaryDatesAndTimes } from '../utilities/oneTimeHelper';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const useStyles = makeStyles((theme) => ({
  datePickerContainer: {
    paddingTop: theme.spacing(2),
    '& > div': {
      // datepicker has a lot of spacing... removing some margin to match mock
      padding: 0,
      marginTop: theme.spacing(-3),
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(1, 3),
  },
  timeSlider: {
    marginBottom: theme.spacing(2),
  },
  dateSubheader: {
    marginTop: theme.spacing(4),
  },
  timesSubheader: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

function sanitizeDate(date: any) {
  if (date && dayjs(date).isValid()) {
    return date;
  }
  return null;
}

// check line in this file for descrition and usage
type PostAJobDatesProps = {
  startDate: string | null;
  endDate: string | null;
  setValidationStatus: Function;
  onStartDateChange: (newValue: string | null) => void;
  onEndDateChange: (newValue: string | null) => void;
  jobType?: string;
};

function PostAJobDates(props: PostAJobDatesProps) {
  const classes = useStyles();
  const { startDate, endDate, setValidationStatus, onStartDateChange, onEndDateChange, jobType } =
    props;

  const { earliestStartDate, latestStartDate, earliestEndDate, latestEndDate } =
    calculateBoundaryDatesAndTimes(startDate, dayjs());

  const areDatesValid = () => {
    let validationStatus = false;
    if (startDate && endDate) {
      const convertedStartDate = dayjs(startDate, 'YYYY-MM-DD');
      const convertedEndDate = dayjs(endDate, 'YYYY-MM-DD');
      const validStartDate =
        convertedStartDate.isSameOrAfter(earliestStartDate) &&
        convertedStartDate.isSameOrBefore(latestStartDate);

      const validEndDate =
        convertedEndDate.isSameOrAfter(earliestEndDate) &&
        convertedEndDate.isSameOrBefore(latestEndDate);

      validationStatus =
        validStartDate && validEndDate && convertedStartDate.isSameOrBefore(convertedEndDate);
    } else if (startDate && !endDate) {
      const convertedStartDate = dayjs(startDate, 'YYYY-MM-DD');
      validationStatus =
        convertedStartDate.isSameOrAfter(earliestStartDate) &&
        convertedStartDate.isSameOrBefore(latestStartDate);
    }
    setValidationStatus(validationStatus);
  };

  const handleEndDateChange = (date: any) => {
    let updatedDate = null;
    if (date && date.isValid()) {
      updatedDate = date.format('YYYY-MM-DD');
    }
    onEndDateChange(updatedDate);
  };

  const handleStartDateChange = (date: any) => {
    let updatedDate = null;
    if (date && date.isValid()) {
      updatedDate = date.format('YYYY-MM-DD');
    }
    onStartDateChange(updatedDate);
  };

  useEffect(() => {
    areDatesValid();
  }, [startDate, endDate, jobType]);

  return (
    <>
      <Grid item xs={12} className={classes.datePickerContainer}>
        <KeyboardDatePicker
          selectDate
          label="Estimated start date"
          format="MM/DD/YYYY"
          id="startDate"
          minDate={earliestStartDate ?? undefined}
          maxDate={latestStartDate ?? undefined}
          value={sanitizeDate(startDate)}
          onChange={handleStartDateChange}
        />
      </Grid>
      <Grid item xs={12} className={classes.datePickerContainer}>
        <KeyboardDatePicker
          selectDate
          label="Estimated end date (optional)"
          format="MM/DD/YYYY"
          id="endDate"
          minDate={earliestEndDate ?? undefined}
          maxDate={latestEndDate ?? undefined}
          value={sanitizeDate(endDate)}
          onChange={handleEndDateChange}
        />
      </Grid>
    </>
  );
}

PostAJobDates.defaultProps = {
  jobType: 'onetime',
};

export default withTimeZoneSupport(PostAJobDates);
