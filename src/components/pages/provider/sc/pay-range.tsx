import { useRouter } from 'next/router';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApolloClient, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Modal } from '@care/react-component-lib';

import { SKIP_AUTH_CONTEXT_KEY, PROVIDER_ROUTES } from '@/constants';
import Header from '@/components/Header';
import { GET_JOB_WAGES, SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import OverlaySpinner from '@/components/OverlaySpinner';
import PayForCareSlider from '@/components/PayForCareSlider';
import { reduceWages } from '@/utilities/wageHelper';
import { getJobWages, getJobWagesVariables } from '@/__generated__/getJobWages';
import { ServiceType } from '@/__generated__/globalTypes';
import useEnterKey from '@/components/hooks/useEnterKey';
import {
  seniorCareProviderAttributesUpdate,
  seniorCareProviderAttributesUpdateVariables,
} from '@/__generated__/seniorCareProviderAttributesUpdate';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 3, 0),
  },
}));

const topMaxRate = 50;
const header = 'What is your preferred pay range?';

const PayRange = () => {
  const classes = useStyles();
  const router = useRouter();
  const state = useProviderState();
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const nextRoute = PROVIDER_ROUTES.JOB_TYPE;

  const { loading, data, error } = useQuery<getJobWages, getJobWagesVariables>(GET_JOB_WAGES, {
    variables: {
      zipcode: state.zipcode,
      serviceType: ServiceType.SENIOR_CARE,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  useEffect(() => {
    if (data && state.rate.rateRetrieved !== true) {
      const { avgMin: minimum, avgMax: maximum, legalMin: legalMinimum } = reduceWages(state, data);
      dispatch({ type: 'setProviderRate', rate: { minimum, maximum, legalMinimum } });
      dispatch({ type: 'setProviderRateRetrieved', rateRetrieved: true });
    }
  }, [data]);

  const sendAnalytics = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_preferred_hourly_rate',
        cta_clicked: 'Next',
        min_pay_rate: state.rate.minimum.toString(),
        max_pay_rate: state.rate.maximum.toString(),
      },
    });
  };

  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [minimum, maximum] = newValue;
      dispatch({ type: 'setProviderRate', rate: { minimum, maximum } });
    }
  };

  const handleNext = async () => {
    let successful;
    try {
      setPersisting(true);
      const { data: updateData } = await apolloClient.mutate<
        seniorCareProviderAttributesUpdate,
        seniorCareProviderAttributesUpdateVariables
      >({
        mutation: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
        variables: {
          input: {
            jobRate: {
              minimum: {
                amount: state.rate.minimum.toString(),
                currencyCode: 'USD',
              },
              maximum: {
                amount: state.rate.maximum.toString(),
                currencyCode: 'USD',
              },
            },
          },
        },
      });
      successful =
        updateData?.seniorCareProviderAttributesUpdate.__typename ===
        'SeniorCareProviderAttributesUpdateSuccess';
    } catch (e) {
      successful = false;
    }

    if (successful) {
      sendAnalytics();
      router.push(nextRoute);
    } else {
      setPersisting(false);
      setShowErrorModal(true);
    }
  };

  useEnterKey(true, handleNext);

  if (!error && (loading || !data || !state.rate)) {
    return (
      <section>
        <Grid container>
          <Grid item xs={12}>
            <Header>{header}</Header>
          </Grid>
        </Grid>
      </section>
    );
  }

  return persisting ? (
    <OverlaySpinner isOpen wrapped />
  ) : (
    <section>
      <Grid container>
        <Grid item xs={12}>
          <Header>{header}</Header>
        </Grid>
        <PayForCareSlider
          value={[state.rate.minimum, state.rate.maximum]}
          min={state.rate.legalMinimum}
          max={topMaxRate}
          onChange={handleChange}
        />
      </Grid>
      <div className={classes.nextButtonContainer}>
        <Button color="primary" size="large" variant="contained" fullWidth onClick={handleNext}>
          Next
        </Button>
      </div>
      <Modal
        open={showErrorModal}
        title="Oops, something went wrong"
        ButtonPrimary={
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setShowErrorModal(false);
              router.push(nextRoute);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        We weren&apos;t able to save your pay range. Don&apos;t worry though, you can update this
        from your profile later.
      </Modal>
    </section>
  );
};

export default PayRange;
