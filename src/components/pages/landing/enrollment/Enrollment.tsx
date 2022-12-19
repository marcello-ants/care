/* eslint-disable jsx-a11y/label-has-associated-control */
// External Dependencies
import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

// Internal Dependencies
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import LandingLayout from '@/components/layouts/LandingLayout';
import SimpleHeader from './components/SimpleHeader';
import ProviderFormV1 from './components/ProviderForm';

// Styles
import useStyles from './styles';

function Enrollment() {
  // Styles
  const classes = useStyles();

  // Amplitude
  useEffect(() => {
    AnalyticsHelper.logScreenViewed('provider-enrollment-landing', 'provider-enrollment-form');
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <Typography careVariant="display2" className={classes.mainHeaderDesktop}>
          Find great care jobs now
        </Typography>
        <Typography careVariant="display3" className={classes.mainHeaderMobile}>
          <span>Find great&nbsp;</span>
          <br />
          <span>&nbsp;care jobs now</span>
        </Typography>
        <Typography variant="body2" className={classes.mainSubtitleDesktop}>
          <span>Create a profile, and in a few minutes, you&rsquo;ll have access to&nbsp;</span>
          <br />
          <span>thousands of jobs in your area.</span>
        </Typography>
        <Typography variant="body2" className={classes.mainSubtitleMobile}>
          <span>Create a profile, and in a few minutes,&nbsp;</span>
          <br />
          <span>you&rsquo;ll have access to thousands of&nbsp;</span>
          <br />
          <span>jobs in your area.</span>
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.signUpMainContainer}>
        <img src="/app/enrollment/caregiver.png" alt="" />
        <ProviderFormV1 />
      </Grid>
    </>
  );
}

Enrollment.Header = <SimpleHeader />;
Enrollment.Layout = LandingLayout;

export default Enrollment;
