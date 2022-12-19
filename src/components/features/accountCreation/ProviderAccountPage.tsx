import React, { ChangeEvent, useEffect, useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Box, Grid, makeStyles, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ApolloError, useMutation } from '@apollo/client';
import { FormikErrors, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import { InlineTextField, Typography } from '@care/react-component-lib';
import { HOW_DID_YOU_HEAR_ABOUT_US, ServiceType, DistanceUnit } from '@/__generated__/globalTypes';
import { providerCreate, providerCreateVariables } from '@/__generated__/providerCreate';
import logger from '@/lib/clientLogger';
import { handleAccountCreationValidationErrors } from '@/utilities/accountCreationValidationErrorHelper';
import AuthService from '@/lib/AuthService';
import OverlaySpinner from '@/components/OverlaySpinner';
import { PROVIDER_CREATE } from '@/components/request/GQL';
import Header from '@/components/Header';
import { HearAboutUsField } from '@/components/HearAboutUs';
import JobsAvailableCard from '@/components/JobsAvailableCard';
import { useAppDispatch, useFlowState } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import {
  CLIENT_FEATURE_FLAGS,
  EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR,
  PRIVACY_POLICY_URL,
  SKIP_AUTH_CONTEXT_KEY,
  TERMS_OF_USE_URL,
} from '@/constants';
import useEnterKey from '@/components/hooks/useEnterKey';
import EmailField from '@/components/features/accountCreation/EmailField';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import FixElementToBottom from '@/components/FixElementToBottom';

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  alertContainer: {
    marginBottom: theme.spacing(1),
  },
  legalTextContainer: {
    paddingTop: theme.spacing(3),
  },
  legalText: {
    padding: theme.spacing(1, 0),
  },
  // this is needed to allocate some space for error messages
  inputContainer: {
    marginBottom: theme.spacing(-3),
    '& .MuiFormControl-root': {
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: theme.spacing(3),
    },
  },
  nameFieldContainer: {
    '&>div': {
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
  },
  helperText: {
    margin: theme.spacing(0.5, 1),
  },
  errorLabel: {
    display: 'block',
    color: theme.palette.care?.red[800],
    fontSize: theme.spacing(1.5),
    lineHeight: `${theme.spacing(2)}px`,
    margin: theme.spacing(0.5, 1, 0),
    '& + &': {
      marginTop: theme.spacing(0),
    },
  },
}));

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  source: string;
}

function validateForm(values: FormValues) {
  const { email, password } = values;
  const errors: FormikErrors<FormValues> = {};

  // ensure password doesn't contain email
  if (password.toLowerCase().includes(email.toLowerCase())) {
    errors.password = EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR;
  }

  return errors;
}

interface Props {
  nextRoute: string;
  missingZipRoute: string;
  zipcode: string;
  distance: number;
  serviceType: ServiceType;
  onBeforeSubmit?: () => void; // eslint-disable-line
}

const ProviderAccountPage = ({
  nextRoute,
  missingZipRoute,
  zipcode,
  distance,
  serviceType,
  onBeforeSubmit,
}: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authService = AuthService();
  const [errorMessage, setErrorMessage] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [hdyhau, setHdyhau] = useState('');
  const [nameInputValidation, setNameInputValidation] = useState({
    firstName: false,
    lastName: false,
  });
  const { referrerCookie } = useFlowState();
  const featureFlags = useFeatureFlags();
  const setFirstName = (newFirstName: string) =>
    dispatch({ type: 'setCCFirstName', firstName: newFirstName });
  const setLastName = (newLastName: string) =>
    dispatch({ type: 'setCCLastName', lastName: newLastName });
  const isProviderCCFreeGatedFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;
  const NAME_LIMIT = 45;
  const isChildCare = serviceType === ServiceType.CHILD_CARE;
  const isFreeGatedCC = isProviderCCFreeGatedFlag && isChildCare;
  const authPasswordRulesFeature =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.AUTH0_PASSWORD_RULES]?.value;

  async function handleSuccess(response: providerCreate) {
    const res = response?.providerCreate;
    if (res.__typename === 'ProviderCreateError') {
      setIsWaiting(false);
      logger.info({ event: 'providerAccountCreationFailedByValidationError' });
      handleAccountCreationValidationErrors(res.errors, (msg) => {
        setErrorMessage(msg || '');
      });

      return;
    }

    dispatch({
      type: 'setMemberId',
      memberId: res.memberId,
    });
    AnalyticsHelper.setMemberId(res.memberId);

    // Sends log when a provider account is successfully created
    logger.info({ event: 'providerAccountCreationSuccessful', memberId: res.memberId });

    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_email_and_password',
      cta_clicked: 'Join now',
      hdyhau,
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });

    const nextPage = router.basePath + nextRoute;
    await authService.redirectLogin(nextPage, res.authToken, res.oneTimeToken);
  }

  function handleProviderCreateError(graphQLError: ApolloError) {
    setIsWaiting(false);
    setErrorMessage('An error occurred creating your account, please try again.');
    logger.error({ event: 'providerAccountCreationFailed', graphQLError: graphQLError.message });
  }

  const [providerCreateMutation] = useMutation<providerCreate, providerCreateVariables>(
    PROVIDER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleSuccess,
      onError: handleProviderCreateError,
    }
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      source: '',
    },
    validateOnMount: true,
    validateOnBlur: false,
    validateOnChange: true,
    validate: validateForm,
    ...(isFreeGatedCC && {
      validationSchema: yup.object({
        firstName: yup
          .string()
          .min(2, 'First name must be at least 2 characters')
          .max(NAME_LIMIT)
          // allow only letters with spaces
          .matches(/^[a-zA-Z ]*$/, 'First name contains invalid characters')
          .required('First name is required'),
        lastName: yup
          .string()
          .min(2, 'Last name must be at least 2 characters')
          .max(NAME_LIMIT)
          // allow only letters with spaces
          .matches(/^[a-zA-Z ]*$/, 'Last name contains invalid characters')
          .required('Last name is required'),
      }),
    }),
    onSubmit: (values) => {
      setIsWaiting(true);
      setErrorMessage('');

      if (onBeforeSubmit) {
        onBeforeSubmit();
      }

      providerCreateMutation({
        variables: {
          input: {
            serviceType,
            email: values.email,
            howDidYouHearAboutUs: (values.source as HOW_DID_YOU_HEAR_ABOUT_US) || undefined,
            distanceWillingToTravel: { value: distance, unit: DistanceUnit.MILES },
            password: values.password,
            referrerCookie,
            zipcode,
          },
        },
      });
      setHdyhau(values.source as HOW_DID_YOU_HEAR_ABOUT_US);
    },
  });

  const handleInputNameValidation = (event: any) => {
    const {
      target: { name },
      type,
    } = event;

    if (type === 'focus') {
      setNameInputValidation({ ...nameInputValidation, [name]: false });

      return;
    }

    setNameInputValidation({ ...nameInputValidation, [name]: true });
  };

  const onChangeNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    // truncate string to match limit if user pastes more characters than allowed
    const newValue = value.length <= NAME_LIMIT ? value : value.slice(0, NAME_LIMIT);

    if (id === 'firstNameInput') {
      formik.setFieldValue('firstName', newValue);

      setFirstName(newValue);
    }

    if (id === 'lastNameInput') {
      formik.setFieldValue('lastName', newValue);

      setLastName(newValue);
    }
  };

  useEnterKey(formik.isValid, formik.submitForm);

  useEffect(() => {
    if (!zipcode) {
      logger.info({ event: 'zipCodeMissing' });
      router.replace(missingZipRoute);
    }
  }, []);

  if (isWaiting || !zipcode) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      {errorMessage && (
        <Box mb={3}>
          <Alert severity="error">{errorMessage}</Alert>
        </Box>
      )}
      <Grid container className={classes.gridContainer}>
        <JobsAvailableCard
          serviceType={serviceType}
          zipcode={zipcode}
          distance={distance}
          className={classes.alertContainer}
        />
        <Grid item xs={12}>
          <Header>
            <span>
              {isFreeGatedCC ? 'Create an account' : 'Create an account to apply for jobs'}
            </span>
          </Header>
        </Grid>
        {isFreeGatedCC && (
          <>
            <Grid item xs={12}>
              <div className={classes.nameFieldContainer}>
                <InlineTextField
                  id="firstNameInput"
                  name="firstName"
                  label="First name"
                  value={formik.values.firstName}
                  onChange={onChangeNameHandler}
                  onFocus={handleInputNameValidation}
                  onBlur={handleInputNameValidation}
                />
              </div>
              {nameInputValidation.firstName && formik.errors.firstName && (
                <span className={classes.errorLabel}>{formik.errors.firstName}</span>
              )}
            </Grid>

            <Grid item xs={12}>
              <div className={classes.nameFieldContainer}>
                <InlineTextField
                  id="lastNameInput"
                  name="lastName"
                  label="Last name"
                  value={formik.values.lastName}
                  onChange={onChangeNameHandler}
                  onFocus={handleInputNameValidation}
                  onBlur={handleInputNameValidation}
                />
                {nameInputValidation.lastName && formik.errors.lastName && (
                  <span className={classes.errorLabel}>{formik.errors.lastName}</span>
                )}
                <Typography
                  className={classes.helperText}
                  careVariant="info1"
                  color="textSecondary">
                  Families only see the first initial
                </Typography>
              </div>
            </Grid>
          </>
        )}
        <Grid item xs={12} className={classes.inputContainer}>
          <EmailField
            id="email"
            name="email"
            label="Email address"
            czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
          />
        </Grid>
        <Grid item xs={12} className={classes.inputContainer}>
          <PasswordField
            id="password"
            name="password"
            label="Password"
            defaultHelperText={`At least ${authPasswordRulesFeature ? 8 : 6} characters`}
            minLength={authPasswordRulesFeature ? 8 : 6}
          />
        </Grid>
        {!isFreeGatedCC && (
          <Grid item xs={12} className={classes.inputContainer}>
            <HearAboutUsField name="source" />
          </Grid>
        )}
        <Grid item xs={12} className={classes.legalTextContainer}>
          <Typography variant="body2" className={classes.legalText}>
            {/* TODO: check links */}
            <span>By clicking &quot;Join now&quot;, you agree to our</span>{' '}
            <a href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
              Terms of Use
            </a>{' '}
            <span>and</span>{' '}
            <a href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
              Privacy Policy
            </a>
            <span>.</span>
          </Typography>
        </Grid>
        <FixElementToBottom>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={!formik.isValid}
            onClick={formik.submitForm}
            tabIndex={0}>
            Join now
          </Button>
        </FixElementToBottom>
      </Grid>
    </FormikProvider>
  );
};

export default ProviderAccountPage;
