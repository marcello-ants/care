import { useEffect } from 'react';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import Head from 'next/head';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import Header from '@/components/Header';
import { HearAboutUsField } from '@/components/HearAboutUs';

import {
  validateFirstName,
  validateLastName,
} from '@/components/features/accountCreation/accountCreationForm';
import useHDYHAU from '@/components/pages/seeker/three-step-account-creation/hooks/useHDYHAU';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { logIbNameHDYHAUEvent } from '@/utilities/analyticsPagesUtils';
import { useAppDispatch, useSeekerCCState, useSeekerState } from '@/components/AppState';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { validationSchema } from '@/components/pages/seeker/three-step-account-creation/constants';
import { useSpecialCharsValidationOnNames } from '@/components/hooks/useSpecialCharsValidationOnNames';

interface FormValues {
  firstName: string;
  lastName: string;
  hdyhau: string;
}

const useStyles = makeStyles(() => ({
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
}));

const NamePage = () => {
  const {
    showHDYHAU,
    hdyhauFlagEvaluation,
    flagName: hdyhauFlagName,
  } = useHDYHAU({ vertical: 'IB' });
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { firstName, lastName } = useSeekerCCState();
  const { hdyhau } = useSeekerState();
  const { validateSpecialChars, fireAmplitudeEventOnError, fireDedupedNameValidationEvent } =
    useSpecialCharsValidationOnNames();

  const handleSubmit = (values: FormValues) => {
    dispatch({ type: 'cc_setSeekerName', firstName: values.firstName, lastName: values.lastName });
    dispatch({
      type: 'setHdyhau',
      hdyhau: values.hdyhau,
    });
    logIbNameHDYHAUEvent(values.hdyhau);
    router.push(SEEKER_INSTANT_BOOK_ROUTES.LAST_STEP);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName,
      lastName,
      hdyhau,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleNext = () => {
    const firstNameError = formik?.errors?.firstName;
    const lastNameError = formik?.errors?.lastName;
    if (firstNameError || lastNameError) {
      fireAmplitudeEventOnError({ firstNameError, lastNameError });
      return;
    }
    formik.submitForm();
  };

  useEffect(() => {
    formik.validateForm();
    AnalyticsHelper.logTestExposure(hdyhauFlagName, hdyhauFlagEvaluation);
  }, []);

  return (
    <>
      <Head>
        <title>Tell us your name</title>
      </Head>
      <FormikProvider value={formik}>
        <Grid container>
          <Grid item xs={12}>
            <Header>Tell us your name</Header>
          </Grid>
          <Grid item xs={12} className={classes.inputContainer}>
            <FormikInlineTextField
              id="firstName"
              name="firstName"
              label="First name"
              validate={(firstNameInput: string) =>
                validateFirstName(firstNameInput, validateSpecialChars)
              }
              fireValidationErrorEvent={fireDedupedNameValidationEvent}
            />
          </Grid>
          <Grid item xs={12} className={classes.inputContainer}>
            <FormikInlineTextField
              id="lastName"
              name="lastName"
              label="Last name"
              validate={(lastNameInput: string) =>
                validateLastName(lastNameInput, validateSpecialChars)
              }
              fireValidationErrorEvent={fireDedupedNameValidationEvent}
            />
          </Grid>
          {showHDYHAU && (
            <Grid item xs={12}>
              <Box ml={-1} mr={-1} mb={-2} mt={0.5}>
                <HearAboutUsField name="hdyhau" withLabelText={false} />
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box mt={4}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleNext}
                tabIndex={0}>
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormikProvider>
    </>
  );
};

export default NamePage;
