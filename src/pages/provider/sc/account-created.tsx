import { useRouter } from 'next/router';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from '@/components/Header';
import ProviderWhatsNextList, {
  ProviderWhatsNextListStep,
} from '@/components/ProviderWhatsNextList';
import { PROVIDER_ROUTES } from '@/constants';
import useEnterKey from '@/components/hooks/useEnterKey';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import useTealiumTracking from '@/components/hooks/useTealiumTracking';
import { getUserEmail } from '@/lib/AuthService';

const useStyles = makeStyles((theme) => ({
  textSpacing: {
    paddingBottom: theme.spacing(2),
  },

  headerSpacing: {
    padding: theme.spacing(2, 0, 2),
  },
  thumbsUp: {
    fontSize: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedButtonContainer: {
    padding: theme.spacing(4, 2),
  },
}));

function AccountCreatedPage() {
  const classes = useStyles();
  const router = useRouter();

  useTealiumTracking(['/us-subscription/conversion/provider/basic/incomplete/'], {
    email: getUserEmail(),
  });

  const handleNext = () => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_account_creation_success',
      cta_clicked: 'Next',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
    router.push(PROVIDER_ROUTES.TYPE_SPECIFIC);
  };

  useEnterKey(true, handleNext);

  return (
    <Grid container>
      <div className={classes.thumbsUp}>👍</div>
      <Grid item xs={12} className={classes.headerSpacing}>
        <Header>Your account has been created!</Header>
      </Grid>
      <Grid item xs={12} className={classes.textSpacing}>
        <Typography variant="body1">
          Now you can start building out your profile so that you&apos;re able to apply for jobs.
        </Typography>
      </Grid>
      <ProviderWhatsNextList currentStep={ProviderWhatsNextListStep.COMPLETE_YOUR_PROFILE} />
      <Grid item xs={12} className={classes.getStartedButtonContainer}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          size="large"
          onClick={() => handleNext()}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
}

export default AccountCreatedPage;
