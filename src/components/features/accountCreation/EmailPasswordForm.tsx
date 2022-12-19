import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import { useFormikContext } from 'formik';
import { HearAboutUsField } from '@/components/HearAboutUs';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useEnterKey from '@/components/hooks/useEnterKey';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import LegalDisclaimer from '@/components/features/accountCreation/LegalDisclaimer';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { FormValues } from './accountCreationForm';

const useStyles = makeStyles((theme) => ({
  terms: {
    width: '200px',
    textAlign: 'center',
    margin: theme.spacing(1, 'auto', 0),
  },
  hearAboutUsContainer: {
    '& > div': {
      paddingRight: 0,
      paddingLeft: 0,
      paddingBottom: 0,
    },
  },
  joinNowButtonContainer: {
    padding: theme.spacing(4, 3, 3),
  },
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
}));

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

type EmailPasswordFormProps = {
  handleJoinNow: any;
};

function EmailPasswordForm(props: EmailPasswordFormProps) {
  const classes = useStyles();
  const { handleJoinNow } = props;

  const featureFlags = useFeatureFlags();
  const hdyhauFlagEvaluation = featureFlags?.flags[CLIENT_FEATURE_FLAGS.HDYHAU];
  const showHDYHAU = hdyhauFlagEvaluation?.variationIndex === 1;

  const { isValidating, errors } = useFormikContext<FormValues>();
  const buttonDisabled =
    isValidating || Boolean(errors.email || errors.password || errors.howDidYouHearAboutUs);

  useEnterKey(!buttonDisabled, handleJoinNow);

  const passwordCopyTestFlag = featureFlags?.flags[CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY];
  const passwordCopyTestValue = passwordCopyTestFlag?.value;

  const isPasswordCopyTest = passwordCopyTestValue && [2, 3].includes(passwordCopyTestValue);

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.PASSWORD_REQUIREMENTS_COPY,
      passwordCopyTestFlag
    );
  }, []);

  useEffect(() => {
    AnalyticsHelper.logTestExposure(CLIENT_FEATURE_FLAGS.HDYHAU, hdyhauFlagEvaluation);
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className={classes.inputContainer}>
          <EmailField
            id="email"
            name="email"
            label="Email address"
            czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
          />
        </div>
      </Grid>
      <Grid item xs={12} className={classes.inputContainer}>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          minLength={isPasswordCopyTest ? 8 : undefined}
          passwordCopyTest={passwordCopyTestValue}
        />
      </Grid>
      {showHDYHAU && (
        <Grid item xs={12} className={classes.hearAboutUsContainer}>
          <HearAboutUsField name="howDidYouHearAboutUs" />
        </Grid>
      )}

      <Grid item xs={12}>
        <LegalDisclaimer cta="Continue" />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.joinNowButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={buttonDisabled}
            onClick={handleJoinNow}>
            Continue
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}

export default EmailPasswordForm;
