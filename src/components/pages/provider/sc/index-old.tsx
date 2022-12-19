import { useRouter } from 'next/router';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Icon48BrandSeniorCare } from '@care/react-icons';
import Header from '@/components/Header';
import useEnterKey from '@/components/hooks/useEnterKey';
import logger from '@/lib/clientLogger';
import { useAppDispatch, useProviderState } from '@/components/AppState';
import { useEffect } from 'react';
import { PROVIDER_ROUTES } from '@/constants';
import ProviderWhatsNextList, {
  ProviderWhatsNextListStep,
} from '@/components/ProviderWhatsNextList';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  header: {
    paddingTop: theme.spacing(1),
  },
  textSpacing: {
    padding: theme.spacing(2, 0),
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(1),
    },
  },
  getStartedButtonContainer: {
    padding: theme.spacing(2),
  },
}));

function Home() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { visitorStartedFlow } = useProviderState();

  const logInitialFlowStart = () => {
    if (!visitorStartedFlow) {
      dispatch({ type: 'setVisitorStartedSCProviderFlow', visitorStartedFlow: true });
      logger.info({ event: 'providerAccountCreationStarts' });
    }
  };

  const handleNext = () => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_flow_intro',
      cta_clicked: 'Get started',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
    router.push(PROVIDER_ROUTES.ZIP);
  };

  useEffect(() => {
    logInitialFlowStart();
  }, []);

  useEnterKey(true, handleNext);

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12}>
        <Icon48BrandSeniorCare size="60px" />
      </Grid>
      <Grid item xs={12} className={classes.header}>
        <Header>Welcome to Care.com!</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" className={classes.textSpacing}>
          We&apos;re a leading platform for care jobs. You can choose your clients, pay rate, and
          schedule.
        </Typography>
      </Grid>
      <ProviderWhatsNextList currentStep={ProviderWhatsNextListStep.CREATE_AN_ACCOUNT} />
      <Grid item xs={12} className={classes.getStartedButtonContainer}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
          Get started
        </Button>
      </Grid>
    </Grid>
  );
}

export default Home;
