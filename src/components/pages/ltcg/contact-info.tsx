import React, { useEffect } from 'react';
import getConfig from 'next/config';
import { useFormikContext } from 'formik';
import { Button, Typography, makeStyles } from '@material-ui/core';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import EmailField from '@/components/features/accountCreation/EmailField';
import { PhoneField } from '@/components/PhoneInput';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import Header from '@/components/Header';
import LegalDisclaimer from '@/components/features/accountCreation/LegalDisclaimer';
import useEnterKey from '@/components/hooks/useEnterKey';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const useStyles = makeStyles((theme) => ({
  subheader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  inputContainer: {
    marginTop: theme.spacing(-3),
    '& .MuiFormControl-root': {
      padding: theme.spacing(0, 0, 2),
    },
  },
  terms: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

function contactInfo() {
  const classes = useStyles();
  const { isSubmitting, isValid, submitForm } = useFormikContext();

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('contact-info', 'ltcg experience');
  }, []);

  const handleSubmit = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        screen_name: 'contact-info',
        source: 'ltcg experience',
        cta_clicked: 'submit',
        enrollment_step: 'email and phone',
      },
    });
    submitForm();
  };

  const isSubmitEnabled = isValid && !isSubmitting;
  useEnterKey(isSubmitEnabled, handleSubmit);

  return (
    <div>
      <Header>
        Share your contact info so we can help you through the process and set up your account.
      </Header>
      <Typography variant="body2" className={classes.subheader}>
        Our experts will be in touch quickly to help identify your needs.
      </Typography>
      <div className={classes.inputContainer}>
        <EmailField
          id="email"
          name="email"
          label="Email address"
          czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
          showErrorWhenTouched
        />
      </div>
      <div className={classes.inputContainer}>
        <PhoneField id="phoneNumber" name="phoneNumber" label="Phone number" />
      </div>
      <div className={classes.inputContainer}>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          defaultHelperText="At least 6 characters"
          showErrorWhenTouched
        />
      </div>
      <div className={classes.terms}>
        <LegalDisclaimer cta="Submit" fullWidth />
      </div>
      <CareComButtonContainer>
        <Button
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}>
          Submit
        </Button>
      </CareComButtonContainer>
    </div>
  );
}

export default contactInfo;
