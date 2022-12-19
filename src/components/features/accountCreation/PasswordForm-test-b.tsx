import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@care/react-component-lib';
import { useFormikContext } from 'formik';
import useEnterKey from '@/components/hooks/useEnterKey';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from '@/constants';
import PasswordField from './PasswordField';
import { FormValues } from './accountCreationForm';

const useStyles = makeStyles((theme) => ({
  terms: {
    width: '200px',
    textAlign: 'center',
    margin: theme.spacing(1, 'auto', 0),
  },
  joinNowButtonContainer: {
    padding: theme.spacing(4, 3, 3),
  },
  inputContainer: {
    '& > div': {
      padding: theme.spacing(0, 0, 3),
    },
  },
}));

type PasswordFormProps = {
  handleJoinNow: any;
};

function PasswordForm(props: PasswordFormProps) {
  const classes = useStyles();
  const { handleJoinNow } = props;

  const { isValidating, errors, validateForm } = useFormikContext<FormValues>();
  const buttonDisabled = isValidating || Boolean(errors.password);

  useEnterKey(!buttonDisabled, handleJoinNow);

  useEffect(() => {
    validateForm();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>You&#39;re one step closer to finding your perfect caregiver.</Header>
      </Grid>
      <Grid item xs={12} className={classes.inputContainer}>
        <PasswordField id="password" name="password" label="Password" />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.terms}>
          <Typography careVariant="info1">
            {/* needs links */}
            <span>By clicking &quot;Submit&quot;, you agree to our</span>{' '}
            <a href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
              Terms of Use
            </a>{' '}
            <span>and</span>{' '}
            <a href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
              Privacy Policy.
            </a>
          </Typography>
        </div>
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
            Submit
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}

export default PasswordForm;
