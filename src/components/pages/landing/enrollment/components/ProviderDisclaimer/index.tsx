// External Dependencies
import { Typography, Link } from '@care/react-component-lib';

// Styles
import useStyles from './styles';

export default function ProviderDisclaimer() {
  // Styles
  const classes = useStyles();

  return (
    <Typography careVariant="disclaimer1" className={classes.disclaimer}>
      <span>
        You must be 18 years or older to use Care.com. By clicking &quot;Submit,&quot; you agree to
        our
      </span>{' '}
      <Link href="/terms-of-use-p1012.html" careVariant="disclaimer1">
        Terms of Use
      </Link>{' '}
      <span>and</span>{' '}
      <Link href="/privacy-policy-p1013.html" careVariant="disclaimer1">
        Privacy Policy
      </Link>
      <span>.</span>
    </Typography>
  );
}
