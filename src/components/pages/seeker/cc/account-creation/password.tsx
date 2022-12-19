import { useCallback, useEffect, useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { FormikProvider, useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import { Box, makeStyles, Grid, Button, Link } from '@material-ui/core';
import { Typography, Banner } from '@care/react-component-lib';
import logger from '@/lib/clientLogger';
import {
  CC_PRE_RATE_CARD_PATH,
  SEEKER_CHILD_CARE_PAJ_ROUTES,
  CLIENT_FEATURE_FLAGS,
  JOB_MFE_CC_PAJ,
  SEEKER_CHILD_CARE_ROUTES,
  BOOKING_MFE_IB_ASSESSMENT,
} from '@/constants';
import { DefaultCareKind } from '@/types/seekerCC';
import { CHANGE_MEMBER_PASSWORD } from '@/components/request/GQL';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import OverlaySpinner from '@/components/OverlaySpinner';
import Header from '@/components/Header';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import { validateForm } from '@/components/features/accountCreation/accountCreationForm';
import AuthService from '@/lib/AuthService';
import { useSeekerCCState, useAppDispatch, useAppState } from '@/components/AppState';
import {
  changeMemberPassword,
  changeMemberPasswordVariables,
} from '@/__generated__/changeMemberPassword';
import { ServiceType } from '@/__generated__/globalTypes';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { hash256 } from '@/utilities/account-creation-utils';
import useLangConversational from '@/components/hooks/useLangConversational';

export interface DayCarePasswordFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

function validatePasswordForm(values: DayCarePasswordFormValues) {
  const errors = validateForm({ ...values, howDidYouHearAboutUs: '' });
  // since we only have one password field, then map all errors to that field
  const error =
    errors.firstName ||
    errors.lastName ||
    errors.email ||
    errors.password ||
    errors.howDidYouHearAboutUs ||
    (!values.password ? 'Password is required' : null);

  return error ? { password: error } : {};
}

function useGetNextStepLink(isSkipLoginForRateCardRedirectionTestEnabled?: boolean) {
  const {
    careKind,
    instantBook: { eligibleLocation },
  } = useSeekerCCState();

  const router = useRouter();
  const featureFlags = useFeatureFlags();
  const instantBookM1Flag = featureFlags.flags[CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_M1];

  const directCCJobsToJobMfe = featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_CC];

  if (careKind === DefaultCareKind.DAY_CARE_CENTERS) {
    return isSkipLoginForRateCardRedirectionTestEnabled
      ? `${CZEN_GENERAL}/app/ratecard/childcare/pre-rate-card?enrollFlow=true`
      : CC_PRE_RATE_CARD_PATH(CZEN_GENERAL);
  }

  // Instant book redirect
  if (
    careKind === DefaultCareKind.ONE_TIME_BABYSITTERS &&
    eligibleLocation &&
    instantBookM1Flag?.variationIndex === 2
  ) {
    return CZEN_GENERAL + BOOKING_MFE_IB_ASSESSMENT;
  }

  return directCCJobsToJobMfe?.variationIndex === 0
    ? CZEN_GENERAL + JOB_MFE_CC_PAJ
    : router.basePath + SEEKER_CHILD_CARE_PAJ_ROUTES.JOB_SCHEDULE;
}

function useDayCareForm(isSkipLoginForRateCardRedirectionTestEnabled?: boolean) {
  const authService = AuthService();
  const { firstName, lastName, careKind } = useSeekerCCState();
  const nextStepLink = useGetNextStepLink(isSkipLoginForRateCardRedirectionTestEnabled);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePasswordUpdateFailure(message: string | null) {
    setErrorMessage(message || 'There was an issue updating your password, please try again.');
    logger.error({ event: 'seekerAccountPasswordUpdateFailed' });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  }

  function handlePasswordUpdateSuccess(response: changeMemberPassword) {
    const { memberChangePassword: res } = response;

    if (res.__typename === 'MemberChangePasswordError') {
      const error = res.errors.find((e) => e.message);
      handlePasswordUpdateFailure(error ? error.message : null);
      return;
    }

    if (careKind === DefaultCareKind.DAY_CARE_CENTERS) {
      logger.info({
        event: 'PreRateCardRedirection',
        isFlagEnabled: isSkipLoginForRateCardRedirectionTestEnabled,
        currentPageURL: window.location.href,
        redirectsTo: nextStepLink,
      });

      if (isSkipLoginForRateCardRedirectionTestEnabled) {
        window.location.assign(nextStepLink);
        return;
      }
    }

    window.location.assign(nextStepLink);
  }

  const [updatePassword] = useMutation<changeMemberPassword, changeMemberPasswordVariables>(
    CHANGE_MEMBER_PASSWORD,
    {
      onCompleted: handlePasswordUpdateSuccess,
      onError: () => {
        handlePasswordUpdateFailure(null);
      },
    }
  );

  function handleSubmission(values: DayCarePasswordFormValues) {
    logger.info({ event: 'seekerAccountPasswordUpdateAttempt' });
    setErrorMessage(null);
    updatePassword({
      variables: {
        passwordInput: {
          password: values.password,
        },
      },
    });
  }
  const authStore = authService.getStore();
  const formik = useFormik<DayCarePasswordFormValues>({
    initialValues: {
      password: '',
      firstName,
      lastName,
      email: authStore.profile.email,
    },
    validate: validatePasswordForm,
    onSubmit: handleSubmission,
  });

  return { formik, errorMessage };
}

const useStyles = makeStyles((theme) => ({
  skipForNowLink: {
    '& > a': {
      color: theme.palette.care?.grey[700],
      cursor: 'pointer',
    },
  },

  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
}));

function DaycareAccountPassword() {
  const classes = useStyles();
  const {
    dayCare,
    careKind,
    isPixelFired,
    instantBook: { eligibleLocation },
    careDate,
  } = useSeekerCCState();
  const featureFlags = useFeatureFlags();
  // A/B Test - skip-login-in-ratecard-redirection
  const skipLoginInRateCardRedirectionTestFlagEvaluation =
    featureFlags.flags[CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION];
  const skipLoginInRateCardRedirectionTestIsEnabled = Boolean(
    skipLoginInRateCardRedirectionTestFlagEvaluation?.value
  );

  const { formik, errorMessage } = useDayCareForm(skipLoginInRateCardRedirectionTestIsEnabled);
  const nextStepLink = useGetNextStepLink(skipLoginInRateCardRedirectionTestIsEnabled);

  const dispatch = useAppDispatch();

  const languageConversationalFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD,
    languageConversationalFlag
  ) as { heading: string | Element; additionalText: string };

  const {
    flow: { memberId, czenJSessionId },
  } = useAppState();

  const logInstantBookTestExposure = () => {
    if (careKind === DefaultCareKind.ONE_TIME_BABYSITTERS && eligibleLocation) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_M1,
        featureFlags.flags[CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_M1]
      );
    }
  };

  const handleSubmit = useCallback(() => {
    // since button is never disabled then check if ok to submit
    if (!formik.isValid || formik.isSubmitting) {
      return;
    }
    logInstantBookTestExposure();
    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: { cta_clicked: 'Set password' },
    });

    formik.handleSubmit();
  }, []);

  const handleSkipForNow = useCallback(() => {
    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: { cta_clicked: 'Skip step' },
    });
    logInstantBookTestExposure();

    if (careKind === DefaultCareKind.DAY_CARE_CENTERS) {
      logger.info({
        event: 'PreRateCardRedirection',
        isFlagEnabled: skipLoginInRateCardRedirectionTestIsEnabled,
        currentPageURL: window.location.href,
        redirectsTo: nextStepLink,
      });
    }

    window.location.assign(nextStepLink);
  }, [nextStepLink]);

  const submitText = errorMessage ? 'Try again' : 'Set password';

  const passwordCopyTestFlag = featureFlags.flags[CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY];
  const passwordCopyTestValue = passwordCopyTestFlag?.value;

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY,
      passwordCopyTestFlag
    );
  }, []);

  const isPasswordCopyTest = passwordCopyTestValue && [2, 3].includes(passwordCopyTestValue);
  const passwordMinLength = isPasswordCopyTest ? 8 : undefined;

  const subheadText = isPasswordCopyTest
    ? 'Create a new password to save time, or skip it for now, and we’ll email you a temporary one'
    : languageConversationalText.additionalText;

  // Create Daycare Lead on load
  useEffect(() => {
    hash256(formik.values.email).then((hash) => {
      const emailSHA256 = hash;
      const basicSeekerSlots = [
        '/us-subscription/conversion/seeker/basic/signup/',
        '/us-subscription/conversion/seeker/basic/signup/impact/',
      ];
      const basicSeekerTealiumData: TealiumData = {
        ...(memberId && { memberId }),
        tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
        sessionId: czenJSessionId,
        slots: basicSeekerSlots,
        email: formik.values.email,
        emailSHA256,
        memberType: 'seeker',
        overallStatus: 'basic',
        serviceId: ServiceType.CHILD_CARE,
        subServiceId: careKind,
        intent: careDate,
      };
      // if the context isn't updated properly or read properly only fire this if there are no recommendations
      if (!isPixelFired && dayCare.recommendations.length === 0) {
        TealiumUtagService.view(basicSeekerTealiumData);
        AnalyticsHelper.logEvent({
          name: 'Slot Sent',
          data: { slots: basicSeekerSlots },
        });
        dispatch({
          type: 'setIsPixelFired',
          isPixelFired: true,
        });
      }
    });

    if (careKind === DefaultCareKind.DAY_CARE_CENTERS) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.SKIP_LOGIN_IN_RATECARD_REDIRECTION,
        skipLoginInRateCardRedirectionTestFlagEvaluation!
      );
    }
  }, []);

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      {errorMessage ? (
        <Box mb={3}>
          <Banner type="warning" width="100%" roundCorners>
            <Typography variant="body2">{errorMessage}</Typography>
          </Banner>
        </Box>
      ) : (
        <Box mb={3}>
          {!dayCare.submissionCompleted &&
            languageConversationalFlag !== 2 &&
            languageConversationalFlag !== 4 && (
              <Banner type="confirmation" width="100%" roundCorners>
                <Typography variant="body2">Account created!</Typography>
              </Banner>
            )}
        </Box>
      )}
      <Grid container>
        <Box>
          <Grid item xs={12}>
            <Header>{languageConversationalText.heading}</Header>
          </Grid>
          <Box pt={1}>
            <Typography variant="body2">{subheadText}</Typography>
          </Box>
        </Box>
        <Grid item xs={12} className={classes.inputContainer}>
          <PasswordField
            id="password"
            name="password"
            label="Password"
            minLength={passwordMinLength}
            passwordCopyTest={passwordCopyTestValue}
            showErrorWhenTouched
          />
        </Grid>
        <Grid item xs={12}>
          <Box mt={3}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}>
              {submitText}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mt={3} justifyContent="center" display="flex">
            <Typography variant="subtitle1" className={classes.skipForNowLink}>
              <Link underline="none" onClick={handleSkipForNow}>
                Skip for now
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </FormikProvider>
  );
}

export default DaycareAccountPassword;
