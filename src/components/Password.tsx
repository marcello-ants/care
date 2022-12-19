import clsx from 'clsx';
import { FormikProvider, useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import getConfig from 'next/config';
import { useMutation } from '@apollo/client';
import { Box, makeStyles, Grid, Button, Link, useMediaQuery, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Typography, Banner } from '@care/react-component-lib';

import logger from '@/lib/clientLogger';
import {
  VerticalsAbbreviation,
  SEEKER_HOUSEKEEPING_ROUTES,
  SEEKER_PET_CARE_PAJ_ROUTES,
  SEEKER_TUTORING_PAJ_ROUTES,
  CLIENT_FEATURE_FLAGS,
  JOB_MFE_HK_PAJ,
  JOB_MFE_PC_PAJ,
  JOB_MFE_TU_PAJ,
  JOB_MFE_CC_PAJ_NTH_DAY,
  JOB_MFE_DC_PAJ_NTH_DAY,
  PAJ_NTH_DAY_HK,
  PAJ_NTH_DAY_HK_MW,
  PAJ_NTH_DAY_PC,
  PAJ_NTH_DAY_PC_MW,
  PAJ_NTH_DAY_SC,
  PAJ_NTH_DAY_SC_MW,
  PAJ_NTH_DAY_TU,
  PAJ_NTH_DAY_TU_MW,
} from '@/constants';
import { CHANGE_MEMBER_PASSWORD } from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import Header from '@/components/Header';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import { validateForm } from '@/components/features/accountCreation/accountCreationForm';
import AuthService from '@/lib/AuthService';
import {
  useSeekerHKState,
  useSeekerPCState,
  useSeekerTUState,
  useSeekerState,
} from '@/components/AppState';
import {
  changeMemberPassword,
  changeMemberPasswordVariables,
} from '@/__generated__/changeMemberPassword';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';

export interface PasswordFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

export function validatePasswordForm(values: PasswordFormValues) {
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

function getNextStepLinkDayOne(
  vertical: VerticalsAbbreviation,
  basePath: string,
  directHKJobsToJobMfe: boolean,
  directPCJobsToJobMfe: boolean,
  directTUJobsToJobMfe: boolean
) {
  let path;
  switch (vertical) {
    case 'PC':
      path = directPCJobsToJobMfe
        ? CZEN_GENERAL + JOB_MFE_PC_PAJ
        : basePath + SEEKER_PET_CARE_PAJ_ROUTES.JOB_SCHEDULE;
      break;
    case 'TU':
      path = directTUJobsToJobMfe
        ? CZEN_GENERAL + JOB_MFE_TU_PAJ
        : basePath + SEEKER_TUTORING_PAJ_ROUTES.JOB_SCHEDULE;
      break;
    default:
      path = directHKJobsToJobMfe
        ? CZEN_GENERAL + JOB_MFE_HK_PAJ
        : basePath + SEEKER_HOUSEKEEPING_ROUTES.JOB_SCHEDULE;
      break;
  }
  return path;
}

function getNextStepLinkNthDay(
  vertical: VerticalsAbbreviation,
  isDesktop: boolean,
  zipcode: string
) {
  let path;
  switch (vertical) {
    case 'DC':
      path = `${CZEN_GENERAL}${JOB_MFE_DC_PAJ_NTH_DAY}`;
      break;
    case 'PC':
      path = `${CZEN_GENERAL}${isDesktop ? PAJ_NTH_DAY_PC(zipcode) : PAJ_NTH_DAY_PC_MW}`;
      break;
    case 'HK':
      path = `${CZEN_GENERAL}${isDesktop ? PAJ_NTH_DAY_HK(zipcode) : PAJ_NTH_DAY_HK_MW}`;
      break;
    case 'SC':
      path = `${CZEN_GENERAL}${isDesktop ? PAJ_NTH_DAY_SC(zipcode) : PAJ_NTH_DAY_SC_MW}`;
      break;
    case 'TU':
      path = `${CZEN_GENERAL}${isDesktop ? PAJ_NTH_DAY_TU(zipcode) : PAJ_NTH_DAY_TU_MW}`;
      break;
    default:
      path = `${CZEN_GENERAL}${JOB_MFE_CC_PAJ_NTH_DAY}`;
      break;
  }
  return path;
}

export function useGetNextStepLink(vertical: VerticalsAbbreviation, isShortEnrollment?: boolean) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { zipcode } = useSeekerState();
  const router = useRouter();
  const directHKJobsToJobMfe =
    useFeatureFlag(CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_HK)?.variationIndex === 0;
  const directPCJobsToJobMfe =
    useFeatureFlag(CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_PC)?.variationIndex === 0;
  const directTUJobsToJobMfe =
    useFeatureFlag(CLIENT_FEATURE_FLAGS.SEEKER_JOB_MFE_TU)?.variationIndex === 0;

  let path = getNextStepLinkDayOne(
    vertical,
    router.basePath,
    directHKJobsToJobMfe,
    directPCJobsToJobMfe,
    directTUJobsToJobMfe
  );

  if (isShortEnrollment) {
    path = getNextStepLinkNthDay(vertical, isDesktop, zipcode);
  }

  return path;
}

export function useForm(vertical: VerticalsAbbreviation, isShortEnrollment?: boolean) {
  const authService = AuthService();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  let state;
  switch (vertical) {
    case 'PC':
      state = useSeekerPCState();
      break;
    case 'TU':
      state = useSeekerTUState();
      break;
    case 'HK':
      state = useSeekerHKState();
      break;
    default:
      state = useSeekerState().seekerInfo;
      break;
  }
  const { firstName, lastName } = state;
  const nextStepLink = useGetNextStepLink(vertical, isShortEnrollment);

  async function handleFailedPasswordUpdate(message: string | null) {
    setErrorMessage(message || 'There was an issue updating your password, please try again.');
    logger.error({ event: 'seekerAccountPasswordUpdateFailed' });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  }

  function handleSuccessPasswordUpdate(response: changeMemberPassword) {
    const { memberChangePassword: res } = response;

    if (res.__typename === 'MemberChangePasswordError') {
      const error = res.errors.find((er) => er.message);
      handleFailedPasswordUpdate(error ? error.message : null);
      return;
    }

    window.location.assign(nextStepLink);
  }

  const [updatePassword] = useMutation<changeMemberPassword, changeMemberPasswordVariables>(
    CHANGE_MEMBER_PASSWORD,
    {
      onCompleted: handleSuccessPasswordUpdate,
      onError: () => {
        handleFailedPasswordUpdate(null);
      },
    }
  );

  function handleSubmission(values: PasswordFormValues) {
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
  const formik = useFormik<PasswordFormValues>({
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
  skipLink: {
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
  title: {
    marginBottom: theme.spacing(1),
  },
  passwordContainerSE: {
    width: '100%',
    maxWidth: '600px',
    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.care?.grey[50],
      padding: `${theme.spacing(8)}px ${theme.spacing(4)}px`,
    },
  },
  bannerContainerSE: {
    width: '100%',
    maxWidth: '600px',

    [theme.breakpoints.up('md')]: {
      maxWidth: '376px',
    },
  },
}));

interface Props {
  vertical: VerticalsAbbreviation;
  isShortEnrollment?: boolean;
}

const Password: React.FC<Props> = ({ vertical, isShortEnrollment }) => {
  const classes = useStyles({ isShortEnrollment });
  const { formik, errorMessage } = useForm(vertical, isShortEnrollment);
  const nextStepLink = useGetNextStepLink(vertical, isShortEnrollment);

  const passwordCopyTestFlag = useFeatureFlag(CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY);
  const passwordCopyTestValue = passwordCopyTestFlag?.value;

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY,
      passwordCopyTestFlag
    );
  }, []);

  const isPasswordCopyTest = passwordCopyTestValue && [2, 3].includes(passwordCopyTestValue);
  const passwordMinLength = isPasswordCopyTest ? 8 : undefined;

  const headerText = isShortEnrollment ? 'Finish setting up your account' : 'Setup your password';
  const subheadText = isPasswordCopyTest
    ? 'Create a new password to save time, or skip it for now, and we’ll email you a temporary one'
    : 'We created a temporary password, but you can set a new one now to save time.';

  const handleSubmit = useCallback(() => {
    // since button is never disabled then check if ok to submit
    if (!formik.isValid || formik.isSubmitting) {
      return;
    }

    const analyticsData: {
      // eslint-disable-next-line camelcase
      cta_clicked: string;
      // eslint-disable-next-line camelcase
      job_flow?: string;
    } = {
      cta_clicked: 'Set password',
    };

    if (isShortEnrollment) {
      analyticsData.job_flow = 'SingleEnrollment';
    }

    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: analyticsData,
    });
    formik.handleSubmit();
  }, []);

  const handleSkip = useCallback(() => {
    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: { cta_clicked: 'Skip step' },
    });
    window.location.assign(nextStepLink);
  }, [nextStepLink]);

  const submitText = errorMessage ? 'Try again' : 'Set password';

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      {errorMessage ? (
        <Box mb={3} className={clsx({ [classes.bannerContainerSE]: isShortEnrollment })}>
          <Banner type="warning" width="100%" roundCorners>
            <Typography variant="body2">{errorMessage}</Typography>
          </Banner>
        </Box>
      ) : (
        <Box mb={3} className={clsx({ [classes.bannerContainerSE]: isShortEnrollment })}>
          <Banner type="confirmation" width="100%" roundCorners>
            <Typography variant="body2">Account created!</Typography>
          </Banner>
        </Box>
      )}
      <Grid container justifyContent="center">
        <Box className={clsx({ [classes.passwordContainerSE]: isShortEnrollment })}>
          <Grid item xs={12} className={classes.title}>
            <Header>{headerText}</Header>
          </Grid>
          {!isShortEnrollment && (
            <Grid item xs={12}>
              <Typography variant="body2">{subheadText}</Typography>
            </Grid>
          )}
          <Grid item xs={12} className={classes.inputContainer}>
            <PasswordField
              id="password"
              name="password"
              label="Password"
              minLength={passwordMinLength}
              showErrorWhenTouched
              passwordCopyTest={passwordCopyTestValue}
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
          {!isShortEnrollment && (
            <Grid item xs={12}>
              <Box mt={3} justifyContent="center" display="flex">
                <Typography variant="subtitle1" className={classes.skipLink}>
                  <Link underline="none" onClick={handleSkip}>
                    Skip for now
                  </Link>
                </Typography>
              </Box>
            </Grid>
          )}
        </Box>
      </Grid>
    </FormikProvider>
  );
};

Password.defaultProps = {
  isShortEnrollment: false,
};

export default Password;
