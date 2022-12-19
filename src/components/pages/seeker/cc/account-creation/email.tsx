import * as yup from 'yup';
import { useState, useCallback, useEffect } from 'react';
import { FormikProvider, useFormik } from 'formik';
import getConfig from 'next/config';

import { Box, makeStyles, Grid, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ServiceType } from '@/__generated__/globalTypes';
import { Banner, Typography } from '@care/react-component-lib';
import { AppDispatch } from '@/types/app';

import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import {
  useAppDispatch,
  useFlowState,
  useSeekerCCState,
  useSeekerState,
} from '@/components/AppState';
import OverlaySpinner from '@/components/OverlaySpinner';
import Header from '@/components/Header';
import EmailField from '@/components/features/accountCreation/EmailField';
import useProviderCount from '@/components/hooks/useProviderCount';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import DividerWithText from '@/components/DividerWithText';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS, SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import useLangConversational from '@/components/hooks/useLangConversational';
import { useSeekerAccountCreation } from '@/components/hooks/useSeekerAccountCreation';
import { useIsEligibleAndTestVariantForNameBeforeEmail } from '@/components/hooks/useNameBeforeEmail';
import LegalDisclaimer from '@/components/TermsConditions';
import analyticsDataBuilder, { formSubmissionUtil } from './utils/utils';
import getFbContainer, {
  SplitFormValues,
  SplitFormWithFbData,
  facebookResponseProps,
} from './components/fbContainer';

const FB_SIGNUP_UNAPPROVED_STATES = ['CA'];
const EVENT_NAME = 'Member Enrolled';
const ENROLLMENT_STEP_EMAIL = 'Email';
const ENROLLMENT_STEP_FACEBOOK = 'Facebook';
const NEXT_BTN = 'Next';

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const validationSchema = yup.object({
  email: yup.string().required('Email is required'),
});

function SplitAccountForm(isEligibleAndTestVariantForNameBeforeEmail: boolean) {
  const { goNext } = useFlowNavigation();
  const { zipcode } = useSeekerState();
  const { firstName, lastName, careDate, careKind } = useSeekerCCState();
  const { hdyhau } = useSeekerState();
  const { referrerCookie } = useFlowState();
  const nameBeforeEmailNextPageUrl = SEEKER_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD;
  const setFormikSubmittingFalse = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { executeSeekerAccountCreate } = useSeekerAccountCreation({
    vertical: 'CC',
    nextPageURL: nameBeforeEmailNextPageUrl,
    setFormikSubmittingFalse,
    setErrorMessage,
  });
  const handleSubmission = (emailFormValues: SplitFormValues) => {
    if (isEligibleAndTestVariantForNameBeforeEmail) {
      const accountCreationFormValues = {
        firstName,
        lastName,
        email: emailFormValues.email,
        howDidYouHearAboutUs: hdyhau,
      };
      executeSeekerAccountCreate(
        accountCreationFormValues,
        zipcode,
        careDate,
        referrerCookie,
        careKind,
        false
      );
    } else {
      goNext();
    }
  };

  const formik = useFormik<SplitFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: handleSubmission,
  });

  return { errorMessage, formik };
}

const useStyles = makeStyles(() => ({
  inputContainer: {
    '& > div': {
      padding: '0 0 24px 0',
    },
  },
}));

export const dispatchValues = (values: SplitFormWithFbData, dispatch: AppDispatch) => {
  const { accessToken, email, firstName = '', lastName = '' } = values;
  dispatch({ type: 'cc_setSeekerEmail', email });

  if (accessToken) {
    dispatch({ type: 'cc_setSeekerName', firstName, lastName });
    dispatch({ type: 'setFbAccessToken', accessToken });
  }
};

type GetCallbackFunc = {
  formik: any;
  setShowApiCallErrorBanner: (showApiCallErrorBanner: boolean) => void;
  handleSubmit: ({ accessToken, firstName, lastName, email }: SplitFormWithFbData) => void;
};

export const getCallbackFunc = ({
  formik,
  setShowApiCallErrorBanner,
  handleSubmit,
}: GetCallbackFunc) => {
  const handleFacebookLogin = async (response: facebookResponseProps) => {
    const { accessToken, name, email } = await response;

    if (!accessToken) {
      setShowApiCallErrorBanner(true);
      return;
    }

    formik.setFieldTouched('email');
    formik.setFieldValue('email', email);

    const errors = await formik.validateForm();
    const isError = Boolean(Object.keys(errors).length);

    const [firstName, lastName] = name.split(' ');

    if (!isError) {
      handleSubmit({ accessToken, firstName, lastName, email });
    }
  };

  return handleFacebookLogin;
};

function SplitAccountCreation() {
  const classes = useStyles();
  const [showApiCallErrorBanner, setShowApiCallErrorBanner] = useState(false);
  const isEligibleAndTestVariantForNameBeforeEmail =
    useIsEligibleAndTestVariantForNameBeforeEmail();
  const { errorMessage, formik } = SplitAccountForm(isEligibleAndTestVariantForNameBeforeEmail);
  const { state } = useSeekerState();
  const dispatch = useAppDispatch();
  const { displayProviderMessage, numOfProviders } = useProviderCount(ServiceType.CHILD_CARE);

  const featureFlags = useFeatureFlags();
  const withFbSignUpButtonFlagEvaluation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.CC_SEEKER_FB_SIGNUP];
  const isUserOutsideExcludedStates = !FB_SIGNUP_UNAPPROVED_STATES.includes(state);

  const shouldShowFbSignUpButton =
    isUserOutsideExcludedStates && withFbSignUpButtonFlagEvaluation?.value === 2;

  const fbSignupEmphasized = featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_FB_SIGNUP_EMPHASIZED];
  const fbButtonOnTop = fbSignupEmphasized?.value === 3;
  const fbButtonOnBottom = fbSignupEmphasized?.value === 2;

  const languageConversationalFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL,
    languageConversationalFlag
  ) as { heading: string; additionalText: string };

  useEffect(() => {
    if (isUserOutsideExcludedStates) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.CC_SEEKER_FB_SIGNUP,
        withFbSignUpButtonFlagEvaluation
      );
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.SEEKER_FB_SIGNUP_EMPHASIZED,
        fbSignupEmphasized
      );
    }
  }, []);

  const getAnalyticsData = (enrollmentStep: string) =>
    analyticsDataBuilder({
      enrollmentStep,
      caregiverCount: numOfProviders,
    });

  const handleSubmit = useCallback((values: SplitFormWithFbData) => {
    dispatchValues(values, dispatch);
    const enrollmentStep = values.accessToken ? ENROLLMENT_STEP_FACEBOOK : ENROLLMENT_STEP_EMAIL;
    const submitButton = values.accessToken ? ENROLLMENT_STEP_FACEBOOK : NEXT_BTN;

    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: { cta_clicked: submitButton },
    });

    formSubmissionUtil(formik, EVENT_NAME, getAnalyticsData(enrollmentStep));
  }, []);

  const FbSignUpComponent = getFbContainer({
    fbButtonOnTop,
    fbButtonOnBottom,
    handleFacebookLogin: getCallbackFunc({
      formik,
      setShowApiCallErrorBanner,
      handleSubmit,
    }),
  });

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const buttonText = isEligibleAndTestVariantForNameBeforeEmail ? 'Join now' : 'Next';
  const submitText = errorMessage ? 'Try again' : buttonText;
  return (
    <FormikProvider value={formik}>
      {showApiCallErrorBanner && (
        <Box ml={1} mr={1} mb={3}>
          <Banner type="warning" width="100%" roundCorners>
            <Typography variant="h4">Use your email instead</Typography>
            <Typography variant="body2">
              Sorry, we couldn’t connect to Facebook. Use your email to create an account or try
              again later.
            </Typography>
          </Banner>
        </Box>
      )}
      {displayProviderMessage &&
        languageConversationalFlag !== 2 &&
        languageConversationalFlag !== 4 && (
          <Box ml={1} mr={1} mb={3}>
            <Banner type="information" width="100%" roundCorners>
              <Typography variant="body2">
                We found {numOfProviders} caregivers near you!
              </Typography>
            </Banner>
          </Box>
        )}
      <Grid container>
        <Box>
          {errorMessage && (
            <Grid item xs={12}>
              <Box mb={3}>
                <Alert severity="error">{errorMessage}</Alert>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box mb={1}>
              <Header>{languageConversationalText.heading}</Header>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{languageConversationalText.additionalText}</Typography>
          </Grid>
        </Box>

        {shouldShowFbSignUpButton && fbButtonOnTop && (
          <Box mt={3}>
            {FbSignUpComponent}
            <DividerWithText>OR</DividerWithText>
          </Box>
        )}
        <Grid item xs={12} className={classes.inputContainer}>
          <EmailField
            id="email"
            name="email"
            label="Email Address"
            czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
            showErrorWhenTouched
          />
        </Grid>
        {isEligibleAndTestVariantForNameBeforeEmail && (
          <Grid item xs={12}>
            <Box mb={3}>
              <LegalDisclaimer variant="subtitle2" byClickingText="Join now" />
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={() => handleSubmit({ email: formik.values.email })}>
            {submitText}
          </Button>
        </Grid>
        {shouldShowFbSignUpButton && !fbButtonOnTop && (
          <Grid item xs={12}>
            <DividerWithText>OR</DividerWithText>
            {FbSignUpComponent}
          </Grid>
        )}
      </Grid>
    </FormikProvider>
  );
}

export default SplitAccountCreation;
