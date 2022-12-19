import { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { Grid, makeStyles, Button } from '@material-ui/core';
import { StatelessSelector, Pill, Modal } from '@care/react-component-lib';

import Header from '@/components/Header';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import OverlaySpinner from '@/components/OverlaySpinner';
import { LevelOfExperienceLabels } from '@/types/provider';
import { PROVIDER_ROUTES } from '@/constants';

import { SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';

import {
  seniorCareProviderAttributesUpdate,
  seniorCareProviderAttributesUpdateVariables,
} from '@/__generated__/seniorCareProviderAttributesUpdate';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(4),
    },
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(-0.5),
      },
    },
  },
}));

const pillOptions = [
  { label: LevelOfExperienceLabels.YEARS_1, value: '1' },
  { label: LevelOfExperienceLabels.YEARS_3, value: '3' },
  { label: LevelOfExperienceLabels.YEARS_5, value: '5' },
  { label: LevelOfExperienceLabels.YEARS_10, value: '10' },
  { label: LevelOfExperienceLabels.YEARS_0, value: '0' },
];

export default function ExperienceLevel() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  const providerState = useProviderState();
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const nextRoute = PROVIDER_ROUTES.PROFILE;

  const sendAnalytics = (yearsOfExperience: string) => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'caregiver_experience',
      cta_clicked: yearsOfExperience,
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
  };

  const handleChange = async (values: string[]) => {
    const yearsOfExperience = values[0];

    dispatch({ type: 'setExperienceLevel', experienceLevel: yearsOfExperience });

    let successful;
    try {
      setLoading(true);
      const { data } = await apolloClient.mutate<
        seniorCareProviderAttributesUpdate,
        seniorCareProviderAttributesUpdateVariables
      >({
        mutation: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
        variables: { input: { yearsOfExperience: Number(yearsOfExperience) } },
      });
      successful =
        data?.seniorCareProviderAttributesUpdate.__typename ===
        'SeniorCareProviderAttributesUpdateSuccess';
    } catch (e) {
      successful = false;
    }

    if (successful) {
      sendAnalytics(yearsOfExperience);
      router.push(nextRoute);
    } else {
      setLoading(false);
      setShowErrorModal(true);
    }
  };

  return (
    <Grid container>
      {loading ? (
        <OverlaySpinner isOpen wrapped />
      ) : (
        <>
          <Grid item xs={12}>
            <Header>How much paid senior caregiving experience do you have?</Header>
          </Grid>
          <Grid item xs={12}>
            <StatelessSelector
              single
              name="experienceLevel"
              className={classes.selector}
              value={providerState.experienceLevel}
              onChange={handleChange}>
              {pillOptions.map((pill) => (
                <Pill key={pill.value} {...pill} size="md" />
              ))}
            </StatelessSelector>
          </Grid>
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
            We weren’t able to save your years of experience. Don’t worry though, you can update
            this from your profile later.
          </Modal>
        </>
      )}
    </Grid>
  );
}
