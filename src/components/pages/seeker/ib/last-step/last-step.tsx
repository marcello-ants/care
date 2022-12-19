import { FormikProvider } from 'formik';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { useCallback } from 'react';
import getConfig from 'next/config';
import { Banner, Typography } from '@care/react-component-lib';
import Head from 'next/head';
import { useFlowState } from '@/components/AppState';
import EmailField from '@/components/features/accountCreation/EmailField';
import Header from '@/components/Header';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL, FLOWS } from '@/constants';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useCreateAccountIB } from './useCreateAccountIB';

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const useStyles = makeStyles(() => ({
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
  terms: {
    '& a': {
      color: theme.palette.care?.blue[700],
    },
  },
}));

const EmailPasswordIbPage = () => {
  const classes = useStyles();
  const { formik, errorMessage } = useCreateAccountIB();
  const { flowName } = useFlowState();
  const isIBShortenedFlow = flowName === FLOWS.SEEKER_INSTANT_BOOK_SHORT.name;
  const handleSubmit = useCallback(() => {
    // since button is never disabled then check if ok to submit
    if (!formik.isValid || formik.isSubmitting) {
      return;
    }
    formik.handleSubmit();
  }, []);

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const getPageCopy = () => {
    const pageCopy = {
      header: 'Last step! Create a free account',
      subCopy: 'Your matches are ready. Find a sitter your family will love by joining now.',
      buttonText: 'Join now',
    };

    if (isIBShortenedFlow) {
      pageCopy.header = 'Join free to book a babysitter';
      pageCopy.subCopy = '';
      pageCopy.buttonText = 'Next';
    }

    if (errorMessage) {
      pageCopy.buttonText = 'Try again';
    }

    return pageCopy;
  };

  return (
    <>
      <Head>
        <title>Last step! Create a free account</title>
      </Head>
      <FormikProvider value={formik}>
        <Grid container>
          {errorMessage && (
            <Box mb={3}>
              <Banner type="warning" width="100%" roundCorners>
                <Typography variant="body2">{errorMessage}</Typography>
              </Banner>
            </Box>
          )}

          <Box mb={1}>
            <Header>{getPageCopy().header}</Header>
          </Box>

          <Typography variant="body2">{getPageCopy().subCopy}</Typography>

          <Grid item xs={12}>
            <Box className={classes.inputContainer}>
              <EmailField
                id="email"
                name="email"
                label="Email address"
                czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
                showErrorWhenTouched
              />
            </Box>
          </Grid>

          <Grid item xs={12} className={classes.inputContainer}>
            <PasswordField
              id="password"
              name="password"
              label="Password (optional)"
              showErrorWhenTouched
              allowEmptyField
            />
          </Grid>

          <Grid item xs={12}>
            {!isIBShortenedFlow && (
              <Box mt={3}>
                <Typography variant="body2" className={classes.terms}>
                  <span>By clicking &quot;Join now&quot;, you agree to our</span>{' '}
                  <a href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
                    Terms of Use
                  </a>{' '}
                  <span>and</span>{' '}
                  <a href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
                    Privacy Policy.
                  </a>
                </Typography>
              </Box>
            )}
            <Box mt={4}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}>
                {getPageCopy().buttonText}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormikProvider>
    </>
  );
};

export default EmailPasswordIbPage;
