import { FormikProvider } from 'formik';
import { useEffect } from 'react';

import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Header from '@/components/Header';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import OverlaySpinner from '@/components/OverlaySpinner';
import LegalDisclaimer from '@/components/TermsConditions';
import { HearAboutUsField } from '@/components/HearAboutUs';

import {
  validateFirstName,
  validateLastName,
} from '@/components/features/accountCreation/accountCreationForm';

import useNameForm from '@/components/pages/seeker/three-step-account-creation/hooks/useNameForm';

import { AccountCreationNameFormProps } from '@/components/pages/seeker/three-step-account-creation/interfaces';
import useHDYHAU from '@/components/pages/seeker/three-step-account-creation/hooks/useHDYHAU';

import {
  CLIENT_FEATURE_FLAGS,
  PRIVACY_POLICY_URL,
  SEEKER_CHILD_CARE_ROUTES,
  TERMS_OF_USE_URL,
} from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useLangConversational from '@/components/hooks/useLangConversational';
import { Icon24UtilityNextArrow } from '@care/react-icons';
import { theme } from '@care/material-ui-theme';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useIsEligibleAndTestVariantForNameBeforeEmail } from '@/components/hooks/useNameBeforeEmail';
import { useSpecialCharsValidationOnNames } from '@/components/hooks/useSpecialCharsValidationOnNames';

const useStyles = makeStyles(() => ({
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
  buttonEndIcon: {
    display: 'inline',
    margin: 0,
    position: 'absolute',
    right: '20px',
    top: '16px',
    [theme.breakpoints.down(410)]: {
      right: '10px',
    },
  },
  disclaimer: {
    color: theme.palette.care.grey[600],
  },
}));

function AccountCreationNameForm({
  vertical,
  verticalState,
  nextPageURL,
}: AccountCreationNameFormProps) {
  const classes = useStyles();
  const { formik, errorMessage } = useNameForm({ vertical, verticalState, nextPageURL });
  const { showHDYHAU, hdyhauFlagEvaluation, flagName: hdyhauFlagName } = useHDYHAU({ vertical });
  const featureFlags = useFeatureFlags();
  const isEligibleAndTestVariantForNameBeforeEmail =
    useIsEligibleAndTestVariantForNameBeforeEmail();
  const { validateSpecialChars, fireAmplitudeEventOnError, fireDedupedNameValidationEvent } =
    useSpecialCharsValidationOnNames();

  const languageConversationalFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_NAME,
    languageConversationalFlag
  );

  const splitAccCreationDcCtaIteration =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION]?.value;

  useEffect(() => {
    AnalyticsHelper.logTestExposure(hdyhauFlagName, hdyhauFlagEvaluation);
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION,
      featureFlags?.flags[CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE_CTA_ITERATION]
    );
  }, []);

  let buttonText = isEligibleAndTestVariantForNameBeforeEmail ? 'Next' : 'Join now';

  if (vertical === 'DC') {
    const getDcButtonText = (value: Number) => {
      switch (value) {
        case 2:
          return 'Agree & view matching daycares';
        case 3:
          return 'Join & view matching daycares';
        case 4:
          return 'View matching daycares';
        default:
          return 'Join and view matches';
      }
    };

    buttonText = getDcButtonText(splitAccCreationDcCtaIteration);
  }

  const submitText = errorMessage ? 'Try again' : buttonText;

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const headerText = () => {
    if (vertical === 'CC') {
      return languageConversationalText;
    }
    if (vertical === 'DC') {
      return (
        <>
          <span>Almost done.&nbsp;</span>
          <br />
          <span>What&apos;s your name?</span>
        </>
      );
    }
    if (vertical === 'IB') {
      return 'One more step!';
    }
    return 'Almost done, add a few details about yourself.';
  };

  const handleNext = () => {
    const firstNameError = formik?.errors?.firstName;
    const lastNameError = formik?.errors?.lastName;
    if (validateSpecialChars && (firstNameError || lastNameError)) {
      fireAmplitudeEventOnError({ firstNameError, lastNameError });
      return;
    }
    formik.submitForm();
  };

  return (
    <FormikProvider value={formik}>
      <Grid container>
        {errorMessage && (
          <Grid item xs={12}>
            <Box mb={3}>
              <Alert severity="error">{errorMessage}</Alert>
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box mb={1}>
            <Header>{headerText()}</Header>
          </Box>
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
            <Box ml={-1} mr={-1} mb={-2}>
              <HearAboutUsField
                name="howDidYouHearAboutUs"
                required={false}
                withLabelText={vertical !== 'IB'}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box mt={2.5} mb={3}>
            {vertical === 'DC' ? (
              <Typography variant="subtitle2" className={classes.disclaimer}>
                <span>By clicking &quot;{buttonText}</span>
                <span>,&quot; you (1) affirm you have read and agree to our</span>{' '}
                <a href={TERMS_OF_USE_URL}>Terms of Use</a>
                <span>&nbsp;and</span> <a href={PRIVACY_POLICY_URL}>Privacy Policy</a>{' '}
                <span>
                  and (2) you agree that Care.com may share your information with up to 5 local
                  daycares (including by SMS and email) to contact you regarding your request based
                  on the criteria you&rsquo;ve provided.
                </span>
              </Typography>
            ) : (
              !isEligibleAndTestVariantForNameBeforeEmail && (
                <LegalDisclaimer variant="subtitle2" byClickingText="Join now" />
              )
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleNext}
            tabIndex={0}
            endIcon={
              vertical === 'DC' && (
                <Icon24UtilityNextArrow color="#FFFFFF" className={classes.buttonEndIcon} />
              )
            }>
            {submitText}
          </Button>
        </Grid>
      </Grid>
    </FormikProvider>
  );
}

export default AccountCreationNameForm;
