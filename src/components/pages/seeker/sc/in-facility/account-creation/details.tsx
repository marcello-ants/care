import { MouseEventHandler, useEffect } from 'react';
import { makeStyles, Grid, Button } from '@material-ui/core';
import { useFormikContext } from 'formik';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import Header from '@/components/Header';
import { PhoneField } from '@/components/PhoneInput';
import {
  validateFirstName,
  validateLastName,
} from '@/components/features/accountCreation/accountCreationForm';
import useEnterKey from '@/components/hooks/useEnterKey';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const useStyles = makeStyles(() => ({
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
}));

type AccountDetailsPageProps = {
  onNext: MouseEventHandler<HTMLButtonElement>;
};

export default function AccountDetailsPage(props: AccountDetailsPageProps) {
  const classes = useStyles();
  const formik = useFormikContext();
  const { onNext } = props;

  const handleNext = (event: any) => {
    const amplitudeData = {
      enrollment_step: 'details in facility sc',
      cta_clicked: 'Next',
      member_type: 'Seeker',
    };

    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: amplitudeData,
    });

    onNext(event);
  };

  useEnterKey(formik.isValid, handleNext);

  useEffect(() => {
    // re-validate the form to ensure the CTA is disabled initially
    formik.validateForm();
  }, []);

  return (
    <Grid container>
      <Header>Add a few more details about yourself.</Header>
      <Grid item xs={12} className={classes.inputContainer}>
        <FormikInlineTextField
          id="firstName"
          name="firstName"
          label="First name"
          validate={validateFirstName}
        />
      </Grid>
      <Grid item xs={12} className={classes.inputContainer}>
        <FormikInlineTextField
          id="lastName"
          name="lastName"
          label="Last name"
          validate={validateLastName}
        />
      </Grid>
      <Grid item xs={12} className={classes.inputContainer}>
        <PhoneField id="phoneNumber" name="phoneNumber" label="Phone number" />
      </Grid>
      <Grid item xs={12}>
        <CareComButtonContainer mt={4}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={!formik.isValid}
            onClick={handleNext}>
            Next
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
}
