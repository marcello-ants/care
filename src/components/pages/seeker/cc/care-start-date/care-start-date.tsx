import { useState, ChangeEvent } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Grid,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Box,
} from '@material-ui/core';
import { Select } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import { useSeekerCCState, useAppDispatch } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { Months } from '@/types/seekerCC';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(51.5),
  },
  startDateWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function Home() {
  const classes = useStyles();
  const state = useSeekerCCState();
  const dispatch = useAppDispatch();
  const { startMonth } = state?.dayCare;
  const [validMonth, setValidMonth] = useState(true);
  const { goNext } = useFlowNavigation();

  const handleStartDateChange = (event: ChangeEvent<{ value: any }>) => {
    setValidMonth(true);
    dispatch({
      type: 'setDayCareStartMonth',
      month: event.target.value,
    });
  };

  const [currentMonth, currentYear] = dayjs().format('MM/YYYY').split('/');
  const labelsToShow = new Array(12).fill(undefined).map((_, index) => {
    const newIndex = parseInt(currentMonth, 10) + index - 1;
    const month = Months[newIndex % 12];
    const year = newIndex < 12 ? currentYear : parseInt(currentYear, 10) + 1;
    return { label: `${month.label} ${year}`, value: `${month.value}` };
  });

  const handleNext = () => {
    if (!startMonth) {
      setValidMonth(false);
    } else {
      goNext();
    }
  };

  return (
    <>
      <Grid container className={classes.startDateWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary">
            When do you want them to start daycare?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box mt={3}>
            <FormControl fullWidth error={!validMonth}>
              <InputLabel id="start-month-label">Desired start month</InputLabel>
              <Select
                id="start-month"
                labelId="start-month-label"
                value={startMonth}
                onChange={handleStartDateChange}>
                <MenuItem value="" key="" />
                {labelsToShow.map((month) => (
                  <MenuItem value={month.value} key={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
              {!validMonth && <FormHelperText>Please enter a start month</FormHelperText>}
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
