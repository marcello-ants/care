import React from 'react';
import Head from 'next/head';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { Button, Grid, makeStyles } from '@material-ui/core';
import Header from '@/components/Header';
import { CareDayTime, CareDayTimeLabels } from '@/types/seekerCC';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';

const options = [
  { label: CareDayTimeLabels.MORNING, value: CareDayTime.MORNING },
  { label: CareDayTimeLabels.AFTERNOON, value: CareDayTime.AFTERNOON },
  { label: CareDayTimeLabels.ALLDAY, value: CareDayTime.ALLDAY },
];

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(42.6),
  },
  selector: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(4),
    },
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      whiteSpace: 'nowrap',
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(-0.5),
      },
    },
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

function CareDayTimePage() {
  const classes = useStyles();
  const state = useSeekerCCState();
  const { dayTime } = state?.dayCare;
  const dispatch = useAppDispatch();
  const { goNext } = useFlowNavigation();

  const disableNext = !dayTime;

  const handleNext = () => {
    goNext();
  };

  const onChangeHandler = (value: string[]) => {
    if (!value.length) return;
    const selection = value[0];

    dispatch({ type: 'cc_setDayCareDayTime', dayTime: selection as CareDayTime });
  };

  return (
    <>
      <Head>
        <title>What time of day do you need care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>What time of day do you need care?</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            single
            name="dayTime"
            onChange={onChangeHandler}
            className={classes.selector}>
            {options.map((option) => (
              <Pill
                key={option.value}
                size="md"
                label={option.label}
                value={option.value}
                selected={option.value === dayTime}
              />
            ))}
          </StatelessSelector>
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={disableNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CareDayTimePage;
