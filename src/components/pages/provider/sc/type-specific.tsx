import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StatelessSelector, Pill, Modal } from '@care/react-component-lib';

import { PROVIDER_ROUTES } from '@/constants';
import OverlaySpinner from '@/components/OverlaySpinner';
import Header from '@/components/Header';
import FixElementToBottom from '@/components/FixElementToBottom';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import useEnterKey from '@/components/hooks/useEnterKey';
import { SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';

import {
  seniorCareProviderAttributesUpdate,
  seniorCareProviderAttributesUpdateVariables,
} from '@/__generated__/seniorCareProviderAttributesUpdate';
import { HELP_TYPE_OPTIONS, HelpType, helpTypesToServices } from '@/types/provider';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      height: 'auto',

      '& > div': {
        height: 'auto',
      },
    },
  },
}));

function TypeSpecificPage() {
  const classes = useStyles();
  const router = useRouter();
  const state = useProviderState();
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const nextRoute = PROVIDER_ROUTES.EXPERIENCE_LEVEL;

  const continueToNextScreen = () => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'caregiver_tasks',
      cta_clicked: 'Next',
      caregiver_tasks: state.typeSpecific.join(','),
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
    router.push(nextRoute);
  };

  const handleNext = async () => {
    let successful;
    try {
      setLoading(true);
      const { data } = await apolloClient.mutate<
        seniorCareProviderAttributesUpdate,
        seniorCareProviderAttributesUpdateVariables
      >({
        mutation: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
        variables: {
          input: {
            careTypeToProvide: helpTypesToServices(state.typeSpecific),
          },
        },
      });
      successful =
        data?.seniorCareProviderAttributesUpdate.__typename ===
        'SeniorCareProviderAttributesUpdateSuccess';
    } catch (e) {
      successful = false;
    }

    if (successful) {
      continueToNextScreen();
    } else {
      setLoading(false);
      setShowErrorModal(true);
    }
  };

  function handleChange(values: string[]) {
    dispatch({ type: 'setTypeSpecific', typeSpecific: values as HelpType[] });
  }

  useEnterKey(true, handleNext);

  return (
    <Grid container>
      {loading ? (
        <OverlaySpinner isOpen wrapped />
      ) : (
        <>
          <Grid item xs={12}>
            <Header>What type of care do you want to provide?</Header>
          </Grid>
          <Grid item xs={12}>
            <StatelessSelector
              className={classes.selector}
              value={state.typeSpecific}
              onChange={handleChange}>
              {HELP_TYPE_OPTIONS.filter((item) => item.value !== HelpType.MEMORY_CARE).map(
                (option) => (
                  <Pill key={option.value} size="lg" {...option} />
                )
              )}
            </StatelessSelector>
          </Grid>
          <FixElementToBottom>
            <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
              Next
            </Button>
          </FixElementToBottom>
        </>
      )}

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
        We weren’t able to save your care type. Don’t worry though, you can update this from your
        profile later.
      </Modal>
    </Grid>
  );
}

export default TypeSpecificPage;
