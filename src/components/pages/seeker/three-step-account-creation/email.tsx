import getConfig from 'next/config';
import * as yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { Banner, Typography } from '@care/react-component-lib';
import userEmailStore from '@/lib/UserEmailStore';
import useProviderCount from '@/components/hooks/useProviderCount';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import OverlaySpinner from '@/components/OverlaySpinner';
import EmailField from '@/components/features/accountCreation/EmailField';
import { ServiceType } from '@/__generated__/globalTypes';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

interface FormValues {
  email: string;
}

const useStyles = makeStyles(() => ({
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
}));

const VERTICAL_CAREGIVERS: { [key: string]: string } = {
  [ServiceType.HOUSEKEEPING]: 'housekeepers',
  [ServiceType.PET_CARE]: 'pet caregivers',
  [ServiceType.TUTORING]: 'tutors',
};

interface AccountCreationEmailFormProps {
  serviceType: ServiceType;
}

function AccountCreationEmailForm({ serviceType }: AccountCreationEmailFormProps) {
  const classes = useStyles();
  const { numOfProviders, displayProviderMessage } = useProviderCount(serviceType);
  const { goNext } = useFlowNavigation();

  const validationSchema = yup.object({
    email: yup.string().required('Email is required'),
  });

  const handleSubmission = (values: FormValues) => {
    userEmailStore.setEmail(values.email);
    logCareEvent('Member Enrolled', 'Email', {
      caregiverCount: numOfProviders,
      member_type: 'Seeker',
    });
    goNext();
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: userEmailStore.getEmail(),
    },
    validationSchema,
    onSubmit: handleSubmission,
  });

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      {displayProviderMessage && (
        <Box mb={3} ml={1} mr={1}>
          <Banner type="information" width="100%" roundCorners>
            <Typography variant="body2" data-testid="housekeepers-nearby">
              Nice! {numOfProviders} {VERTICAL_CAREGIVERS[serviceType]} near you!
            </Typography>
          </Banner>
        </Box>
      )}
      <Grid container>
        <Box pl={1} pr={1}>
          <Typography variant="h2">Create a free account</Typography>
          <Box mt={1}>
            <Typography variant="body2">
              See {VERTICAL_CAREGIVERS[serviceType]} who match your needs. It only takes a few
              seconds.
            </Typography>
          </Box>
          <Grid item xs={12} className={classes.inputContainer}>
            <EmailField
              id="email"
              name="email"
              label="Email address"
              czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
              showErrorWhenTouched
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={5}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={formik.submitForm}
                tabIndex={0}>
                Next
              </Button>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </FormikProvider>
  );
}

export default AccountCreationEmailForm;
