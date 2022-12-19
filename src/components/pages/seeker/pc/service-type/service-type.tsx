import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import { Button, Radio, FormControlLabel, Grid, makeStyles, RadioGroup } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

import { SERVICE_TYPES_OPTIONS, ServiceTypes, ServiceTypesLabels } from '@/types/seekerPC';
import { useAppDispatch, useSeekerPCState } from '@/components/AppState';
import Header from '@/components/Header';
import useNextRoute from '@/components/hooks/useNextRoute';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(3),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  serviceTypesWrapper: {
    margin: theme.spacing(2, 0),
  },
  serviceTypes: {
    '& .MuiFormControlLabel-label': {
      width: '90%',
    },
    '& svg': {
      width: '1em',
      height: '1em',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 0),
    margin: theme.spacing(2, 0, 57),
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: theme.spacing(3),
  },
}));

function ServiceTypePage() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { pushNextRoute } = useNextRoute();
  const statePC = useSeekerPCState();
  const { serviceType } = statePC;
  const [showError, setShowError] = useState(false);

  const handleNext = () => {
    if (serviceType) {
      logCareEvent('Member Enrolled', 'Service type', {
        service_type: ServiceTypesLabels[serviceType],
      });
      pushNextRoute();
      return;
    }
    setShowError(true);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setServiceType', serviceType: event.target.value as ServiceTypes });
    setShowError(false);
  };

  return (
    <>
      <Head>
        <title>Which type of service do you need?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.header}>
          <Header>Which type of service do you need?</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" color="textPrimary">
            Choose which service applies:
          </Typography>
        </Grid>
        <Grid item xs className={classes.serviceTypesWrapper}>
          <RadioGroup name="serviceTypes" value={serviceType} onChange={handleChange}>
            {SERVICE_TYPES_OPTIONS.map((option) => (
              <FormControlLabel
                control={<Radio />}
                label={option.label}
                labelPlacement="start"
                className={classes.serviceTypes}
                value={option.value}
                key={option.value}
              />
            ))}
          </RadioGroup>
        </Grid>
        {showError && (
          <Grid item xs={12}>
            <div className={classes.errorText}>Please select the type of service needed</div>
          </Grid>
        )}
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ServiceTypePage;
