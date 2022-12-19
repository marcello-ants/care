// External Dependencies
import { useCallback } from 'react';
import getConfig from 'next/config';
import { FormikProvider } from 'formik';
import Button from '@material-ui/core/Button';
import { Box, Hidden } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

// Internal Dependencies
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import EmailField from '@/components/features/accountCreation/EmailField';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import { HearAboutUsField } from '@/components/HearAboutUs';
import { useProviderEnrollmentForm } from './utils/formHandler';
import { ServicesList } from './components/ServicesList';
import ProviderError from '../ProviderError';
import ProviderDisclaimer from '../ProviderDisclaimer';

// Styles
import useStyles from './styles';

// Constants
const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

function SeekerForm() {
  // Styles
  const classes = useStyles();

  // Formik
  const { formik, isSubmitError } = useProviderEnrollmentForm();

  // Handlers
  const handleFormSubmission = useCallback(() => {
    if (!formik.isValid || formik.isSubmitting) {
      return;
    }

    formik.handleSubmit();
  }, []);

  return (
    <>
      {isSubmitError && <ProviderError />}
      <FormikProvider value={formik}>
        <Typography variant="h2" className={classes.sectionTitle}>
          <span>What job are you most</span>{' '}
          <Hidden smUp>
            <br />
          </Hidden>{' '}
          <span>interested in?</span>
        </Typography>
        <ServicesList />
        <Box mt={5}>
          <Typography variant="h2" className={`${classes.sectionTitle}`}>
            <span>Create your account</span>
            <Typography careVariant="disclaimer1" className={classes.sectionTitleDisclaimer}>
              *required
            </Typography>
          </Typography>
        </Box>
        <Box className={classes.inputContainer}>
          <EmailField
            id="email"
            name="email"
            label="Email*"
            czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
            showErrorWhenTouched
          />
        </Box>
        <Box className={classes.inputsContainer}>
          <PasswordField
            id="password"
            name="password"
            label="Password*"
            defaultHelperText=""
            showErrorWhenTouched
          />
        </Box>
        <Box className={classes.inputContainer} mb={2}>
          <FormikInlineTextField id="providerZip" name="providerZip" label="Zip code*" />
        </Box>
        <Box className={classes.inputContainer}>
          <HearAboutUsField name="howDidYouHearAboutUs" />
        </Box>
        <Box mb={4}>
          <ProviderDisclaimer />
        </Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          className={classes.submitButton}
          disabled={formik.isSubmitting}
          onClick={handleFormSubmission}>
          Join now
        </Button>
      </FormikProvider>
      <Typography variant="body1" className={classes.companyInquiries}>
        <span>For company inquiries</span>{' '}
        <a href="https://www.care.com/business-p1369-q59964639.html">sign up here</a>
        <span>.</span>
      </Typography>
    </>
  );
}

export default SeekerForm;
