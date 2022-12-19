import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Grid, makeStyles } from '@material-ui/core';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import Header from '@/components/Header';
import { useSpecialCharsValidationOnNames } from '@/components/hooks/useSpecialCharsValidationOnNames';

import { FormValues, validateFirstName, validateLastName } from './accountCreationForm';

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    '& .MuiFormControl-root': {
      padding: 0,
    },
  },
  footerActions: {
    paddingTop: theme.spacing(5),
  },
  buttonContainer: {
    padding: theme.spacing(0, 3),
  },
}));

type NameFormProps = {
  submitText?: string;
  onSubmit: any;
};

function NameForm(props: NameFormProps) {
  const classes = useStyles();
  const { submitText, onSubmit } = props;
  const { errors } = useFormikContext<FormValues>();
  const { validateSpecialChars, fireAmplitudeEventOnError, fireDedupedNameValidationEvent } =
    useSpecialCharsValidationOnNames();

  const handleNext = () => {
    const firstNameError = errors?.firstName;
    const lastNameError = errors?.lastName;
    if (validateSpecialChars && (firstNameError || lastNameError)) {
      fireAmplitudeEventOnError({ firstNameError, lastNameError });
      return;
    }
    onSubmit();
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>What&#39;s your name?</Header>
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
      <Grid item xs={12} className={classes.footerActions}>
        <div className={classes.buttonContainer}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            disabled={
              !validateSpecialChars && (Boolean(errors.firstName) || Boolean(errors.lastName))
            }
            onClick={handleNext}>
            {submitText}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}

NameForm.defaultProps = {
  submitText: 'Submit',
};

export default NameForm;
