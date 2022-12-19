import { Button, Checkbox, FormControlLabel, FormGroup, Grid, makeStyles } from '@material-ui/core';
import { useAppDispatch, useSeekerHKState } from '@/components/AppState';
import Head from 'next/head';
import { Typography } from '@care/react-component-lib';
import { TASKS_OPTIONS, Tasks, TasksLabels } from '@/types/seekerHK';
import useNextRoute from '@/components/hooks/useNextRoute';
import Header from '@/components/Header';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(4),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  hkTasksWrapper: {
    marginTop: theme.spacing(1),
  },
  hkTasks: {
    marginTop: theme.spacing(2),
    '& .MuiFormControlLabel-label': {
      width: '90%',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 0),
    margin: theme.spacing(3, 0, 57),
  },
}));

function WhatTasksPage() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { pushNextRoute } = useNextRoute();
  const stateHK = useSeekerHKState();
  const { tasks } = stateHK;

  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Tasks', {
      expected_tasks: tasks.map((task) => TasksLabels[task]),
    });
    pushNextRoute();
  };
  const handleChange = (event: any) => {
    const currentTasksList = [...tasks];
    const elementName = event?.currentTarget.name;
    const elementChecked = event?.currentTarget.checked;
    if (elementChecked) {
      currentTasksList?.push(elementName);
    } else {
      currentTasksList?.splice(currentTasksList?.indexOf(elementName), 1);
    }
    dispatch({ type: 'setTasks', tasks: currentTasksList });
  };

  return (
    <>
      <Head>
        <title>What tasks do you expect your housekeeper to complete?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.header}>
          <Header>What tasks do you expect your housekeeper to complete?</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" color="textPrimary">
            Click all that apply
          </Typography>
        </Grid>
        <Grid item xs className={classes.hkTasksWrapper}>
          <FormGroup>
            {TASKS_OPTIONS.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name={option.value}
                    checked={tasks.includes(option.value as Tasks)}
                    onChange={handleChange}
                  />
                }
                label={option.label}
                labelPlacement="start"
                className={classes.hkTasks}
                key={option.value}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default WhatTasksPage;
