import * as yup from 'yup';
import { FormikProvider, FormikValues, useFormik } from 'formik';
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import EmailField from '@/components/features/accountCreation/EmailField';
import UserEmailStore from '@/lib/UserEmailStore';
import PhoneInput from '@/components/PhoneInput';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import Header from '@/components/Header';
import { theme } from '@care/material-ui-theme';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { CLIENT_FEATURE_FLAGS, SEEKER_SPLIT_ACCOUNT_DC } from '@/constants';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const useStyles = makeStyles(() => ({
  headerContainer: {
    maxWidth: '375px',
    marginBottom: theme.spacing(2),
  },
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
}));

function SeekerEmailPhoneFormDC() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { dayCare, phoneNumber } = useSeekerCCState();
  const phoneNumberRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  const splitAccCreationDC = useFeatureFlag(CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE);

  const validationSchema = yup.object({
    email: yup.string().required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(phoneNumberRegex, 'Phone number must be valid')
      .required('Phone number is required'),
  });

  const handleNext = (values: FormikValues) => {
    UserEmailStore.setEmail(values.email);
    dispatch({ type: 'cc_setSeekerPhoneNumber', phoneNumber: values.phoneNumber });
    logCareEvent('Member Enrolled', 'day care account creation - contact', {
      memberType: 'Seeker',
    });
    router.push(SEEKER_SPLIT_ACCOUNT_DC.NAME);
  };

  const formik = useFormik<FormikValues>({
    initialValues: {
      email: UserEmailStore.getEmail(),
      phoneNumber,
    },
    validationSchema,
    onSubmit: handleNext,
  });

  const showPhoneNumberError = formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber);

  const phoneNumberRifmOnChange = (text: string) => {
    formik.setFieldValue('phoneNumber', text);
  };

  const handleSubmit = useCallback(() => {
    // since button is never disabled then check if ok to submit
    if (!formik.isValid || formik.isSubmitting) {
      return;
    }
    formik.handleSubmit();
  }, []);

  return (
    <FormikProvider value={formik}>
      <Grid container>
        <div className={classes.headerContainer}>
          <Header>
            {dayCare.recommendations.length > 0
              ? 'Good news! We found daycares that match your needs.'
              : 'Request tours with daycares that match your needs.'}
          </Header>
        </div>

        <Typography>
          {splitAccCreationDC && splitAccCreationDC.value === 3
            ? 'Add your information to view matches'
            : 'We will send your information to matching daycares.'}
        </Typography>
        <Grid item xs={12}>
          <div className={classes.inputContainer}>
            <EmailField
              id="email"
              name="email"
              label="Email address"
              czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
              showErrorWhenTouched
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.inputContainer}>
            <PhoneInput
              id="phoneNumber"
              name="phoneNumber"
              label="Phone number"
              onChange={phoneNumberRifmOnChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              error={showPhoneNumberError}
              helperText={showPhoneNumberError ? formik.errors.phoneNumber : ''}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Box mt={4}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}>
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </FormikProvider>
  );
}

export default SeekerEmailPhoneFormDC;
