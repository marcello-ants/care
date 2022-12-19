import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';

import { SKIP_AUTH_CONTEXT_KEY, POST_A_JOB_ROUTES } from '@/constants';
import useEnterKey from '@/components/hooks/useEnterKey';
import Header from '@/components/Header';
import { GET_JOB_WAGES } from '@/components/request/GQL';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import PayForCareSlider from '@/components/PayForCareSlider';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { reduceWages } from '@/utilities/wageHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 3, 0),
  },
}));

const topMaxRate = 50;

function Home() {
  const classes = useStyles();
  const router = useRouter();
  const { flags } = useFeatureFlags();
  const { jobPost: state, typeOfCare } = useSeekerState();
  const dispatch = useAppDispatch();

  const { loading, data, error } = useQuery(GET_JOB_WAGES, {
    variables: {
      zipcode: state.zip,
      serviceType: 'SENIOR_CARE',
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      dispatch({ type: 'setRateMinimum', minimum: newValue[0] });
      dispatch({ type: 'setRateMaximum', maximum: newValue[1] });
    }
  };

  const handleNext = () => {
    const properties = {
      job_step: 'hourly rate',
      min_pay_rate: state?.rate?.minimum,
      max_pay_rate: state?.rate?.maximum,
      cta_clicked: 'next',
    };

    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data: properties,
    });

    if (AmpliHelper.useAmpli(flags, typeOfCare)) {
      AmpliHelper.ampli.jobPostedHourlyRate({
        ...AmpliHelper.getCommonData(),
        cta_clicked: 'next',
        min_pay_rate: properties.min_pay_rate,
        max_pay_rate: properties.max_pay_rate,
      });
    }

    router.push(POST_A_JOB_ROUTES.ABOUT_LOVED_ONE);
  };

  useEffect(() => {
    if (data && state.rate.rateRetrieved !== true) {
      const { avgMin: minimum, avgMax: maximum, legalMin: legalMinimum } = reduceWages(state, data);
      dispatch({ type: 'setRateRetrieved', rateRetrieved: true });
      dispatch({ type: 'setRateMinimum', minimum });
      dispatch({ type: 'setRateMaximum', maximum });
      dispatch({ type: 'setRateLegalMinimum', legalMinimum });
    }
  }, [data]);

  useEnterKey(true, handleNext);

  if (!error && (loading || !data || !state.rate)) {
    return (
      <section>
        <Grid container>
          <Grid item xs={12}>
            <Header>What would you like to pay for care?</Header>
          </Grid>
        </Grid>
      </section>
    );
  }

  return (
    <section>
      <Grid container>
        <Grid item xs={12}>
          <Header>What would you like to pay for care?</Header>
        </Grid>
        <PayForCareSlider
          value={[state.rate.minimum, state.rate.maximum]}
          min={state.rate.legalMinimum}
          max={topMaxRate}
          onChange={handleChange}
        />
      </Grid>
      <div className={classes.nextButtonContainer}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
          Next
        </Button>
      </div>
    </section>
  );
}

export default Home;
