import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import { ServiceType } from '@/__generated__/globalTypes';
import { SKIP_AUTH_CONTEXT_KEY, SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { DEFAULT_AVG, AVG_TO_MAX_FACTOR } from '@/types/common';
import { useSeekerState, useSeekerCCState, useAppDispatch } from '@/components/AppState';
import { GET_JOB_WAGES } from '@/components/request/GQL';
import { logIbPayEvent } from '@/utilities/analyticsPagesUtils';
import Header from '@/components/Header';
import OverlaySpinner from '@/components/OverlaySpinner';
import PayForCareSlider from '@/components/PayForCareSliderInstantBook';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    marginTop: theme.spacing(4),
  },
}));

const TOP_MAX_RATE = 50;

function PayForCare() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { zipcode } = useSeekerState();
  const {
    instantBook: { payRange },
  } = useSeekerCCState();

  const [average, setAverage] = useState(DEFAULT_AVG);

  const minFromStorage = payRange.minimum.amount;
  const maxFromStorage = payRange.maximum.amount;

  const { loading, data, error } = useQuery(GET_JOB_WAGES, {
    variables: {
      zipcode,
      serviceType: ServiceType.CHILD_CARE,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  useEffect(() => {
    if (loading || error || !data) {
      return;
    }
    const { averages } = data.getJobWages;
    const avg = Number(averages.average.amount);
    const avgMin = Number(averages.minimum.amount);

    setAverage(avg);
    dispatch({ type: 'cc_setIbRateMinimum', minimum: Number(avgMin) });
    dispatch({
      type: 'cc_setIbRateMaxiumum',
      maximum: Math.round(Number(avg) * AVG_TO_MAX_FACTOR),
    });
  }, [data, loading, error]);

  const handleChange = (newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      dispatch({ type: 'cc_setIbRateMaxiumum', maximum: newValue });
    }
  };

  const handleNext = () => {
    logIbPayEvent(maxFromStorage);
    router.push(SEEKER_INSTANT_BOOK_ROUTES.RECAP);
  };

  if (loading) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <>
      <Head>
        <title>What is the most you&apos;d like to pay</title>
      </Head>

      <Grid container>
        <Grid item xs={12}>
          <Header>What is the most you&apos;d like to pay?</Header>
        </Grid>
        <Grid item xs={12}>
          <PayForCareSlider
            value={maxFromStorage}
            min={minFromStorage}
            max={TOP_MAX_RATE}
            average={average}
            onChange={handleChange}
          />
          <Button
            className={classes.nextButtonContainer}
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default PayForCare;
