import { makeStyles, Grid } from '@material-ui/core';
import dayjs from 'dayjs';
import TimeSlider from './TimeSlider';
import { withTimeZoneSupport } from './polyfills/withTimeZoneSupport';
import { calculateBoundaryDatesAndTimes } from '../utilities/oneTimeHelper';

const useStyles = makeStyles((theme) => ({
  timeSlider: {
    marginBottom: theme.spacing(2),
  },
}));

// check line in this file for descrition and usage
type OneTimeJobTimeProps = {
  startTime: string;
  endTime: string;
  startDate: string | null;
  onChange: (start: string, end: string) => void;
};

function OneTimeJobTime(props: OneTimeJobTimeProps) {
  const classes = useStyles();
  const { startTime, endTime, startDate, onChange } = props;

  const { earliestTimeSelector } = calculateBoundaryDatesAndTimes(startDate, dayjs());

  const handleTimeChange = (values: string[]) => {
    const [start, end] = values;
    onChange(start, end);
  };

  return (
    <>
      <Grid item xs={12}>
        <TimeSlider
          className={classes.timeSlider}
          onChange={handleTimeChange}
          values={[startTime, endTime]}
          min={earliestTimeSelector}
        />
      </Grid>
    </>
  );
}

export default withTimeZoneSupport(OneTimeJobTime);
