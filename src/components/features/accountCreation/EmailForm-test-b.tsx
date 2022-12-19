import React, { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import { useFormikContext } from 'formik';
import { HearAboutUsField } from '@/components/HearAboutUs';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useIsInFacility from '@/components/hooks/useIsInFacility';
import useEnterKey from '@/components/hooks/useEnterKey';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import EmailField from './EmailField';
import { FormValues } from './accountCreationForm';

const useStyles = makeStyles(() => ({
  hearAboutUsContainer: {
    '& > div': {
      paddingRight: 0,
      paddingLeft: 0,
      paddingBottom: 0,
    },
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

type EmailFormProps = {
  handleJoinNow: any;
};

function EmailForm(props: EmailFormProps) {
  const classes = useStyles();
  const { handleJoinNow } = props;

  const featureFlags = useFeatureFlags();
  const { isInFacility } = useIsInFacility();

  // Feature Flags
  const hdyhauFlagEvaluation = featureFlags?.flags[CLIENT_FEATURE_FLAGS.HDYHAU];
  const showHDYHAU = hdyhauFlagEvaluation?.variationIndex === 1 && !isInFacility;

  const { isValidating, errors, values } = useFormikContext<FormValues>();
  const buttonDisabled =
    isValidating || Boolean(errors.email || errors.howDidYouHearAboutUs) || !values.email;

  useEnterKey(!buttonDisabled, handleJoinNow);

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
      {showHDYHAU && (
        <Grid item xs={12} className={classes.hearAboutUsContainer}>
          <HearAboutUsField name="howDidYouHearAboutUs" />
        </Grid>
      )}
      <Grid item xs={12}>
        <CareComButtonContainer mt={4}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={buttonDisabled}
            onClick={handleJoinNow}>
            Continue
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
}

export default EmailForm;
