/* eslint-disable jsx-a11y/label-has-associated-control */
// External Dependencies
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/constants';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  formContainer: {
    width: '340px',
  },
  formLabel: {
    fontSize: '0.743rem',
    position: 'absolute',
    width: '6.25rem',
    top: '0',
    color: '#999999',
    padding: '0',
    lineHeight: '1.1875rem',
    margin: '0.3125rem 0 0.5rem',
    display: 'block',
  },
  formBlockRadio: {
    '& input': {
      position: 'relative',
      left: '100px',
      top: '3px',
    },
    '& label': {
      color: '#333',
      fontWeight: 400,
      fontSize: '0.743rem',
      marginBottom: '0.125rem',
      left: '103px',
      position: 'relative',
      lineHeight: '1.1875rem',
      padding: '0',
    },
  },
  formInput: {
    color: '#999',
    borderColor: 'rgb(118,118,118)',
    background: 'none rgb(255,255,255)',
    fontWeight: 400,
    height: '2rem',
    fontSize: '0.8669rem',
    padding: '1px 2px',
    marginBottom: '0.3125rem',
    position: 'relative',
    top: '5px',
    border: '1px solid transparent',
    borderRadius: '3px',
    width: '100%',
    margin: '0.5rem 0',
  },
  formDisclaimer: {
    textAlign: 'left',
    lineHeight: '0.875rem',
    fontSize: '0.743rem',
    wordWrap: 'break-word',
  },
}));

function ExternalLoginForm() {
  const classes = useStyles();

  return (
    <form className={classes.formContainer}>
      <div className="form-checkable-field">
        <span className={classes.formLabel}>What would you like to do?</span>
        <div className={classes.formBlockRadio}>
          <input
            id="hire-a-caregiver"
            type="radio"
            name="What would you like to do?"
            value="Hire a caregiver"
            required
          />
          <label htmlFor="hire-a-caregiver">Hire a caregiver</label>
        </div>
        <div className={classes.formBlockRadio}>
          <input
            id="apply-for-care-jobs"
            type="radio"
            name="What would you like to do?"
            value="Apply for care jobs"
            required
          />
          <label htmlFor="apply-for-care-jobs">Apply for care jobs</label>
        </div>
        <input
          className={classes.formInput}
          type="text"
          name="First Name"
          value=""
          title="First Name"
          placeholder="First Name"
          required
        />
        <input
          className={classes.formInput}
          type="text"
          name="Last Name"
          value=""
          title="Last Name"
          placeholder="Last Name"
          required
        />
        <input
          className={classes.formInput}
          type="text"
          name="Address"
          value=""
          title="Address"
          placeholder="Address"
          required
        />
        <input
          className={classes.formInput}
          type="text"
          name="Zip code"
          value=""
          title="Zip code"
          placeholder="Zip code"
          required
        />
        <input
          className={classes.formInput}
          type="text"
          name="Email"
          value=""
          title="Email"
          placeholder="Email"
          required
        />
        <input
          className={classes.formInput}
          type="text"
          name="Password"
          value=""
          title="Password"
          placeholder="Password"
          required
        />
        <span className={classes.formDisclaimer}>By clicking Join Now, you agree to our </span>
        <a href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer">
          <span className={classes.formDisclaimer}>Terms of Use </span>
        </a>
        <span className={classes.formDisclaimer}>and </span>
        <a href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer">
          <span className={classes.formDisclaimer}>Privacy Policy.</span>
        </a>
      </div>
    </form>
  );
}

export default ExternalLoginForm;
