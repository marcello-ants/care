import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/constants';

const useStyles = makeStyles((theme) => ({
  terms: {
    [theme.breakpoints.down('sm')]: {
      width: '260px',
    },
  },
}));

const LegalDisclaimer = ({
  byClickingText,
  variant,
}: {
  byClickingText: string;
  variant?: Variant;
}) => {
  const classes = useStyles();
  return (
    <Typography variant={variant} color="textSecondary" className={classes.terms}>
      <span>By clicking &quot;{byClickingText}&quot;, you agree to our</span>{' '}
      <a href={TERMS_OF_USE_URL}>Terms of Use</a>
      <span>&nbsp;and</span> <a href={PRIVACY_POLICY_URL}>Privacy Policy</a>
      <span>.</span>
    </Typography>
  );
};

LegalDisclaimer.defaultProps = {
  variant: 'caption',
};

export default LegalDisclaimer;
