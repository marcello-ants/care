import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { StepperInput, Typography } from '@care/react-component-lib';
import { useFormik } from 'formik';
import * as yup from 'yup';
import logger from '@/lib/clientLogger';

import useEnterKey from '@/components/hooks/useEnterKey';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import Header from '@/components/Header';
import ZipInput from '@/components/ZipInput';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import { PROVIDER_ROUTES } from '@/constants';
import { Location } from '@/types/common';
import { isValidZipCode } from '@/utilities/globalValidations';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  distanceLabel: {
    padding: theme.spacing(1, 0, 3),
  },
  distanceInputContainer: {
    padding: theme.spacing(2, 0),
    // a workaround needed until the DNA-1168 is done
    '& > div': {
      padding: 0,
      maxWidth: '100%',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 2),
  },
  zipInputContainer: {
    minHeight: theme.spacing(15.2),
  },
  hero: {
    margin: '0 auto',
    height: 225,
    width: '100%',
    maxWidth: 410,
    [theme.breakpoints.up('md')]: {
      borderRadius: 16,
    },
  },
  heroContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(-3, -3, 3),
    flexDirection: 'column',
    marginBottom: '29px',
  },
  heroText: {
    color: 'white',
    marginTop: theme.spacing(-10),
    padding: `0px 35px`,
    fontSize: '1.6rem',
    fontWeight: 'bold',
    lineHeight: '2rem',
  },
}));

function ZipPage() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { zipcode, city, state, distance, visitorStartedFlow } = useProviderState();
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      location: { zipcode, city, state },
      distance,
    },
    validationSchema: yup.object({
      location: yup.object({
        zipcode: yup.string().length(5).required(),
      }),
      distance: yup.number().min(5).max(50).required(), // this is also guaranteed by the StepperInput
    }),
    onSubmit: (values) => {
      if (!values.location.city || !values.location.state) {
        logger.info({ event: 'ZipcodeIsNotValidated', zipcode });
      }
      dispatch({
        type: 'setProviderLocation',
        zipcode: values.location.zipcode,
        city: values.location.city,
        state: values.location.state,
      });
      dispatch({ type: 'setProviderDistance', distance: values.distance });
      const data = {
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_location',
        cta_clicked: 'Next',
        distance_willing_to_travel: values.distance,
      };
      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data,
      });
      router.push(PROVIDER_ROUTES.ACCOUNT_CREATION);
    },
  });

  const logInitialFlowStart = () => {
    if (!visitorStartedFlow) {
      dispatch({ type: 'setVisitorStartedSCProviderFlow', visitorStartedFlow: true });
      logger.info({ event: 'providerAccountCreationStarts' });
    }
  };

  const onZipInputChange = (newLocation: Location) => {
    dispatch({
      type: 'setProviderLocation',
      zipcode: newLocation.zipcode,
      city: newLocation.city,
      state: newLocation.state,
    });
    formik.setFieldValue('location', newLocation);
  };
  const onDistanceChanged = (newDistance: number) => {
    formik.setFieldValue('distance', newDistance);
    dispatch({ type: 'setProviderDistance', distance: newDistance });
  };
  const handleError = (e: boolean) => {
    setError(e);
  };
  const isNextDisabled = !isValidZipCode(zipcode) || error;

  useEnterKey(!isNextDisabled, formik.submitForm);

  useEffect(() => {
    logInitialFlowStart();
    formik.validateField('location');
  }, [formik.values.location]);

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12}>
        <div className={classes.heroContainer}>
          <img
            className={classes.hero}
            src="/app/enrollment/sc-provider-enrollment-intro.jpeg"
            alt="Start earning money as a senior caregiver"
          />
          <Typography align="left" className={classes.heroText}>
            Start earning money as a senior caregiver
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Header>Where are you located?</Header>
      </Grid>
      <Grid item xs={12} className={classes.zipInputContainer}>
        <ZipInput
          location={formik.values.location}
          onError={handleError}
          onChange={onZipInputChange}
        />
      </Grid>
      <Grid item xs={12} className={classes.distanceLabel}>
        <Header>How far are you willing to travel?</Header>
      </Grid>
      <Grid item xs={12} className={classes.distanceInputContainer}>
        <StepperInput
          name="distance"
          min={5}
          max={50}
          inc={5}
          initialVal={formik.values.distance}
          optionalLabel="miles"
          onChange={onDistanceChanged}
        />
      </Grid>
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={isNextDisabled}
          onClick={formik.submitForm}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
}

ZipPage.CheckAuthCookie = true;
export default ZipPage;
