import React, { ChangeEvent } from 'react';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSeekerCCState, useAppDispatch } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';

const useStyles = makeStyles((theme) => ({
  sectionOneTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  additionalInformation: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  informationText: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  buttonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  optionalLabel: {
    color: theme.palette.grey[500],
  },
}));

export default function AdditionalInformation() {
  const classes = useStyles();
  const seekerCCState = useSeekerCCState();
  const dispatch = useAppDispatch();
  const { additionalInformation } = seekerCCState?.dayCare;
  const { goNext } = useFlowNavigation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setAdditionalInformation', additionalInformation: event.target.value });
  };

  const handleNext = () => {
    goNext();
  };

  return (
    <>
      <Grid container className={classes.additionalInformation}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionOneTitle}>
            Anything else you want to tell us?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Optional notes"
            InputLabelProps={{
              shrink: true,
              classes: {
                root: classes.optionalLabel,
              },
            }}
            name="additionalInformation"
            error={false}
            placeholder="Ex: Our pint-sized Lego engineer loves to climb on furniture to view our floor space from up high. He's an intelligent old soul that questions everything."
            multiline
            value={additionalInformation}
            rows={12}
            inputProps={{
              maxLength: 850,
            }}
            onChange={handleChange}
            className={classes.informationText}
          />
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
