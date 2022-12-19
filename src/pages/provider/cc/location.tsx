import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { StepperInput } from '@care/react-component-lib';
import { useFormik } from 'formik';
import * as yup from 'yup';

import useEnterKey from '@/components/hooks/useEnterKey';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import Header from '@/components/Header';
import ZipInput from '@/components/ZipInput';
import JobMap from '@/components/pages/provider/cc/JobMap';
import { useProviderCCState, useAppDispatch } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { Location } from '@/types/common';
import { ServiceType } from '@/__generated__/globalTypes';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  distanceLabel: {
    padding: theme.spacing(2, 0, 1),
    textAlign: 'center',
  },
  distanceInputContainer: {
    padding: theme.spacing(1, 0),
    // a workaround needed until the DNA-1168 is done
    '& > div': {
      padding: 0,
      maxWidth: '100%',
    },
  },
  inputLabel: {
    '& * input': {
      fontWeight: 'bold',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(1, 2),
  },
  zipInputContainer: {
    minHeight: theme.spacing(15.2),
  },
}));

function LocationPage() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { zipcode, city, state, lat, lng, distance } = useProviderCCState();
  const [error, setError] = useState(false);
  const featureFlags = useFeatureFlags();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const headerText = providerCCFreeGatedExperience
    ? 'Where do you want to work?'
    : 'Where do you live?';

  const formik = useFormik({
    initialValues: {
      location: { zipcode, city, state, lat, lng },
      distance,
    },
    validationSchema: yup.object({
      location: yup.object({
        zipcode: yup.string().length(5).required(),
        city: yup.string().required(),
        state: yup.string().required(),
      }),
      distance: yup.number().min(5).max(50).required(), // this is also guaranteed by the StepperInput
    }),
    onSubmit: (values) => {
      dispatch({
        type: 'setProviderCCLocation',
        zipcode: values.location.zipcode,
        city: values.location.city,
        state: values.location.state,
        lat: values.location.lat,
        lng: values.location.lng,
      });
      dispatch({ type: 'setProviderCCDistance', distance: values.distance });
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
      router.push(PROVIDER_CHILD_CARE_ROUTES.ACCOUNT);
    },
  });

  const onZipInputChange = (newLocation: Location) => {
    if (
      newLocation.zipcode === zipcode &&
      city &&
      state &&
      (!newLocation.lat || newLocation.lat === lat) &&
      (!newLocation.lng || newLocation.lng === lng)
    ) {
      return;
    }

    dispatch({
      type: 'setProviderCCLocation',
      zipcode: newLocation.zipcode,
      city: newLocation.city,
      state: newLocation.state,
      lat: newLocation.lat,
      lng: newLocation.lng,
    });
    formik.setFieldValue('location', newLocation);
  };
  const onDistanceChanged = (newDistance: number) => {
    formik.setFieldValue('distance', newDistance);
    dispatch({ type: 'setProviderCCDistance', distance: newDistance });
  };
  const handleError = (e: boolean) => {
    setError(e);
  };
  const isNextDisabled = !formik.isValid || error;
  useEnterKey(!isNextDisabled, formik.submitForm);

  useEffect(() => {
    formik.validateField('location');
  }, [formik.values.location]);

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12}>
        <Header>{headerText}</Header>
      </Grid>
      <Grid item xs={12} className={classes.zipInputContainer}>
        <ZipInput
          location={formik.values.location}
          onError={handleError}
          onChange={onZipInputChange}
          prepopulateZip={!zipcode}
        />
      </Grid>
      <Grid item xs={12}>
        <JobMap
          lat={lat}
          lng={lng}
          zipcode={zipcode}
          distance={formik.values.distance}
          serviceType={ServiceType.CHILD_CARE}
        />
      </Grid>
      <Grid item xs={12} className={classes.distanceLabel}>
        <Typography variant="h4">How far are you willing to travel?</Typography>
      </Grid>
      <Grid item xs={12} className={classes.distanceInputContainer}>
        <StepperInput
          name="distance"
          min={5}
          max={50}
          inc={5}
          initialVal={formik.values.distance}
          className={classes.inputLabel}
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

export default LocationPage;
