import { isEmpty, omit } from 'lodash-es';
import * as yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import getConfig from 'next/config';
import { Alert } from '@material-ui/lab';
import { Typography } from '@care/react-component-lib';
import { Icon24UtilityNextArrow } from '@care/react-icons';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  useAppDispatch,
  useFlowState,
  useSeekerCCState,
  useSeekerState,
} from '@/components/AppState';
import logger from '@/lib/clientLogger';
import AuthService from '@/lib/AuthService';
import {
  CLIENT_FEATURE_FLAGS,
  PRIVACY_POLICY_URL,
  SEEKER_DAYCARE_CHILD_CARE_ROUTES,
  SKIP_AUTH_CONTEXT_KEY,
  TERMS_OF_USE_URL,
  VERTICALS_NAMES,
} from '@/constants';
import { seekerCreate } from '@/__generated__/seekerCreate';
import {
  HOW_DID_YOU_HEAR_ABOUT_US,
  SeekerCreateInput,
  ServiceType,
  SubServiceType,
} from '@/__generated__/globalTypes';
import { SEEKER_CREATE } from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { AppDispatch } from '@/types/app';
import { SeekerState } from '@/types/seeker';
import Header from '@/components/Header';
import EmailField from '@/components/features/accountCreation/EmailField';
import { HearAboutUsField } from '@/components/HearAboutUs';
import { FeatureFlags, useFeatureFlags } from '@/components/FeatureFlagsContext';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import { handleAccountCreationValidationErrors } from '@/utilities/accountCreationValidationErrorHelper';
import PhoneInput from '@/components/PhoneInput';
import { careDateToGQLFormat } from '@/components/pages/seeker/account-creation/account-creation';
import ContactMethod from '@/components/pages/seeker/cc/account-creation/ContactMethod';
import { SeekerContactMethod } from '@/types/seekerCC';
import { withZipcodeVerification } from '@/components/hooks/useZipcodeVerifiedComponent';

export interface DayCareFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  howDidYouHearAboutUs: string;
  contactMethod: string;
}

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const phoneNumberRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

const validationSchema = (withContact: boolean) =>
  yup.object({
    firstName: yup
      .string()
      .min(2, 'First name needs to have at least two letters.')
      .required('First name is required'),
    lastName: yup
      .string()
      .min(2, 'Last name needs to have at least two letters.')
      .required('Last name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(phoneNumberRegex, 'Phone number must be valid')
      .required('Phone number is required'),
    ...(withContact ? { contactMethod: yup.string().oneOf(['MAIL', 'PHONE']).required() } : {}),
  });

const ERROR_CREATING_ACCOUNT = 'An error occurred creating your account, please try again.';

function sendFailureEvent(state: SeekerState, dispatch: AppDispatch) {
  if (!state.initialAccountCreationFailed) {
    dispatch({ type: 'setInitialAccountCreationFailed', initialAccountCreationFailed: true });
    logger.info({ event: 'seekerAccountCreationFailedInitialAttempt' });
  }
  logger.error({ event: 'seekerAccountCreationFailed' });
}

function sendAttemptEvent(state: SeekerState, dispatch: AppDispatch) {
  if (!state.initialAccountCreationAttempted) {
    dispatch({
      type: 'setInitialAccountCreationAttempted',
      initialAccountCreationAttempted: true,
    });
    logger.info({ event: 'seekerAccountCreationInitialAttempt' });
  }
  logger.info({ event: 'seekerAccountCreationAttempt' });
}

function useFlagValue(flagName: string): FeatureFlags[string] {
  return useFeatureFlags()?.flags[flagName];
}

function useContactMethod() {
  return {
    showContactMethod:
      useFlagValue(CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD)?.variationIndex === 1,
  };
}

function useDayCareForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { referrerCookie } = useFlowState();
  const seekerCCState = useSeekerCCState();
  const { dayCare, careDate, enrollmentSource } = seekerCCState;
  const seekerState = useSeekerState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const authService = AuthService();
  const { showContactMethod } = useContactMethod();

  async function handleAccountCreationSuccess(response: seekerCreate) {
    const { seekerCreate: res } = response;

    if (res.__typename === 'SeekerCreateError') {
      sendFailureEvent(seekerState, dispatch);
      setErrorMessage(ERROR_CREATING_ACCOUNT);
      handleAccountCreationValidationErrors(res.errors, setErrorMessage);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      formik.setSubmitting(false);
      return;
    }

    dispatch({ type: 'setMemberId', memberId: res.memberId });
    AnalyticsHelper.setMemberId(res.memberId);

    const flowLinkObj: any = SEEKER_DAYCARE_CHILD_CARE_ROUTES;

    const nextPage = dayCare?.recommendations.length
      ? `${router.basePath}${flowLinkObj.RECOMMENDATIONS}`
      : `${router.basePath}${flowLinkObj.ACCOUNT_PASSWORD}`;

    await authService.redirectLogin(nextPage, res.authToken);
  }

  function handleAccountCreationError() {
    setErrorMessage(ERROR_CREATING_ACCOUNT);
    sendFailureEvent(seekerState, dispatch);
    dispatch({ type: 'cc_setSeekerName', firstName: '', lastName: '' });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  }

  const [seekerAccountCreate] = useMutation<seekerCreate, { input: SeekerCreateInput }>(
    SEEKER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleAccountCreationSuccess,
      onError: handleAccountCreationError,
    }
  );

  function handleSubmission(values: DayCareFormValues) {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_flow: enrollmentSource,
        enrollment_step: 'Day care account creation',
        cta_clicked: 'Join Now',
        member_type: 'Seeker',
        vertical: VERTICALS_NAMES.CHILD_CARE,
      },
    });

    setErrorMessage(null);
    sendAttemptEvent(seekerState, dispatch);
    dispatch({ type: 'cc_setSeekerName', firstName: values.firstName, lastName: values.lastName });
    dispatch({ type: 'cc_setSeekerPhoneNumber', phoneNumber: values.phoneNumber });
    dispatch({
      type: 'cc_setSeekerContactMethod',
      contactMethod: !isEmpty(values.contactMethod)
        ? (values.contactMethod as SeekerContactMethod)
        : undefined,
    });
    seekerAccountCreate({
      variables: {
        input: {
          ...omit(values, ['phoneNumber', 'contactMethod']),
          zipcode: seekerState.zipcode,
          careDate: careDateToGQLFormat(careDate),
          serviceType: ServiceType.CHILD_CARE,
          subServiceType: SubServiceType.DAY_CARE,
          referrerCookie,
          howDidYouHearAboutUs:
            (values.howDidYouHearAboutUs as HOW_DID_YOU_HEAR_ABOUT_US) || undefined,
        },
      },
    });
  }

  const formik = useFormik<DayCareFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      howDidYouHearAboutUs: '',
      contactMethod: '',
    },
    validationSchema: validationSchema(showContactMethod),
    onSubmit: handleSubmission,
  });

  return {
    formik,
    errorMessage,
  };
}

const useStyles = makeStyles({
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
  recommendationHeader: {
    display: 'flex',
    alignItems: 'center',
    '& h2': {
      width: '85%',
    },
  },
  buttonEndIcon: {
    display: 'inline',
    margin: 0,
    position: 'absolute',
    right: '20px',
    top: '16px',
  },
});

function DaycareAccountCreation() {
  const classes = useStyles();
  const { showContactMethod } = useContactMethod();
  const { formik, errorMessage } = useDayCareForm();
  const showPhoneNumberError = formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber);
  const featureFlags = useFeatureFlags();

  // Feature Flags
  const hdyhauFlagEvaluation = featureFlags?.flags[CLIENT_FEATURE_FLAGS.DAYCARE_HDYHAU];
  const showHDYHAU = hdyhauFlagEvaluation?.value !== 2;

  useEffect(() => {
    AnalyticsHelper.logTestExposure(CLIENT_FEATURE_FLAGS.HDYHAU, hdyhauFlagEvaluation);
  }, []);

  const phoneNumberRifmOnChange = useCallback((text: string) => {
    formik.setFieldValue('phoneNumber', text);
  }, []);
  const setContactMethod = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('contactMethod', (event.target as HTMLInputElement).value);
  }, []);

  const seekerCCState = useSeekerCCState();
  const { recommendations } = seekerCCState?.dayCare;
  const handleSubmit = useCallback(() => {
    // since button is never disabled then check if ok to submit
    if (!formik.isValid || formik.isSubmitting) {
      return;
    }
    formik.handleSubmit();
  }, []);

  const submitText = errorMessage ? 'Try again' : 'Join and view matches';

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      <Grid container>
        <Box pl={1} pr={1}>
          {errorMessage && (
            <Grid item xs={12}>
              <Box mb={3}>
                <Alert severity="error">{errorMessage}</Alert>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box mb={1}>
              <Header>
                <div className={classes.recommendationHeader}>
                  <Typography variant="h2">
                    Request tours with daycares that match your needs.
                  </Typography>
                </div>
              </Header>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {recommendations?.length ? (
              <Typography variant="body2">
                <span>We will send your information to</span>
                <br />
                <span>matching centers.</span>
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={12} className={classes.inputContainer}>
            <FormikInlineTextField id="firstName" name="firstName" label="First name" />
          </Grid>
          <Grid item xs={12} className={classes.inputContainer}>
            <FormikInlineTextField id="lastName" name="lastName" label="Last name" />
          </Grid>
          <Grid item xs={12} className={classes.inputContainer}>
            <EmailField
              id="email"
              name="email"
              label="Email Address"
              czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
              showErrorWhenTouched
            />
          </Grid>
          <Grid item xs={12} className={classes.inputContainer}>
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
          </Grid>
          {showContactMethod && (
            <Grid item xs={12}>
              <Box mt={2}>
                <ContactMethod
                  onChange={setContactMethod}
                  value={formik.values.contactMethod}
                  error={Boolean(formik.touched.contactMethod && !formik.values.contactMethod)}
                />
              </Box>
            </Grid>
          )}
          {showHDYHAU && (
            <Grid item xs={12}>
              <Box ml={-1} mr={-1}>
                <HearAboutUsField name="howDidYouHearAboutUs" required={false} />
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box mb={3} mt={2.5}>
              <Typography variant="subtitle2" color="textSecondary">
                <span>
                  By clicking &quot;Request tours,&quot; you (1) affirm you have read and agree to
                  our
                </span>{' '}
                <a href={TERMS_OF_USE_URL}>Terms of Use</a>
                <span>&nbsp;and</span> <a href={PRIVACY_POLICY_URL}>Privacy Policy,</a>{' '}
                <span>
                  and (2) you agree that Care.com may share your information with up to 5 local
                </span>{' '}
                <span>
                  daycares (including by email) to contact you regarding your request based on the
                </span>{' '}
                <span>criteria you&rsquo;ve provided.</span>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              endIcon={
                <Icon24UtilityNextArrow color="#FFFFFF" className={classes.buttonEndIcon} />
              }>
              {submitText}
            </Button>
          </Grid>
        </Box>
      </Grid>
    </FormikProvider>
  );
}

export default withZipcodeVerification(
  DaycareAccountCreation,
  'daycareAccountCreationMissingZipcode',
  SEEKER_DAYCARE_CHILD_CARE_ROUTES.LOCATION
);
