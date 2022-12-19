/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApolloError, useMutation } from '@apollo/client';
import { useAppDispatch, useProviderCCState } from '@/components/AppState';
import {
  CAREGIVER_ATTRIBUTES_UPDATE,
  PROVIDER_JOB_INTEREST_UPDATE,
} from '@/components/request/GQL';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { Modal, Typography, Slider } from '@care/react-component-lib';
import { PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { ProviderFreeGatedDefaultRates } from '@/types/providerCC';
import OverlaySpinner from '@/components/OverlaySpinner';
import PreferencesPageContent from '@/components/pages/provider/cc/PreferencesPageContent';
import {
  ServiceType,
  JobInterestUpdateSource,
  JobHoursUnit,
  ChildCareAgeGroups,
} from '@/__generated__/globalTypes';
import {
  providerJobInterestUpdate,
  providerJobInterestUpdateVariables,
} from '@/__generated__/providerJobInterestUpdate';
import {
  caregiverAttributesUpdate,
  caregiverAttributesUpdateVariables,
} from '@/__generated__/caregiverAttributesUpdate';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';

const useStyles = makeStyles((theme) => ({
  hourlyRateContainer: {
    marginTop: theme.spacing(4),
  },
}));

const PreferencesPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { hourlyRate, ageGroups, numberOfChildren } = useProviderCCState();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();

  const [jobInterestMutation, { data: jobInterestUpdateData, error: jobInterestUpdateError }] =
    useMutation<providerJobInterestUpdate, providerJobInterestUpdateVariables>(
      PROVIDER_JOB_INTEREST_UPDATE,
      {
        onCompleted: () => {
          logger.info({
            event: 'providerCCJobTypesMutationSuccessful',
          });
        },
        onError: (graphQLError: ApolloError) => {
          logger.error({
            event: 'providerCCJobTypesMutationFailed',
            graphQLError: graphQLError.message,
          });
        },
      }
    );

  const [
    caregiverAttributesUpdateMutation,
    { data: caregiverAttributesUpdateData, error: caregiverAttributesUpdateError },
  ] = useMutation<caregiverAttributesUpdate, caregiverAttributesUpdateVariables>(
    CAREGIVER_ATTRIBUTES_UPDATE,
    {
      onCompleted: () => {
        const selectedRate = hourlyRate.toString();

        // There's a potential race condition in the back end for both the mutations used on this page.
        // Calling them at the same time causes an error. We need to wait for one to finish before calling the next
        jobInterestMutation({
          variables: {
            input: {
              source: JobInterestUpdateSource.ENROLLMENT,
              serviceType: ServiceType.CHILD_CARE,
              oneTimeJobInterest: {
                childCareJobRates: [
                  {
                    hourlyRate: {
                      currencyCode: 'USD',
                      amount: selectedRate,
                    },
                    numberOfChildren: 1,
                  },
                ],
              },
              recurringJobInterest: {
                jobHours: {
                  minimum: hourlyRate,
                  unit: JobHoursUnit.PER_WEEK,
                },
                jobRate: {
                  maximum: {
                    amount: selectedRate,
                    currencyCode: 'USD',
                  },
                  minimum: {
                    amount: selectedRate,
                    currencyCode: 'USD',
                  },
                },
              },
            },
          },
        });
      },
    }
  );

  const onChangeRate = useCallback(
    (rate: number) => dispatch({ type: 'setCCHourlyRate', hourlyRate: rate }),
    []
  );

  const onSubmit = () => {
    setIsLoading(true);

    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_childcare_preferences',
        cta_clicked: 'Next',
      },
    });

    caregiverAttributesUpdateMutation({
      variables: {
        input: {
          childcare: {
            ageGroups: ageGroups as ChildCareAgeGroups[],
            numberOfChildren,
          },
          serviceType: ServiceType.CHILD_CARE,
        },
      },
    });
  };

  useEffect(() => {
    // if both requests completed, redirect to next page
    if (jobInterestUpdateData && caregiverAttributesUpdateData) {
      router.push(PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY);
    }
  }, [jobInterestUpdateData, caregiverAttributesUpdateData]);

  useEffect(() => {
    // If an error is received from any of the requests, show an error modal
    if (jobInterestUpdateError || caregiverAttributesUpdateError) {
      setIsLoading(false);
      setShowErrorModal(true);
    }
  }, [jobInterestUpdateError, caregiverAttributesUpdateError]);

  if (isLoading) {
    return <OverlaySpinner isOpen={isLoading} wrapped />;
  }

  return (
    <>
      <PreferencesPageContent hideSickChildrenCheckbox />
      <Grid item xs={12} className={classes.hourlyRateContainer}>
        <Box mb="16px">
          <Typography variant="h4" {...{ component: 'h2' }}>
            My hourly rate
          </Typography>
        </Box>
        <Grid item xs={12}>
          <Slider
            unit="/hr"
            prefix="$"
            onChange={onChangeRate}
            min={ProviderFreeGatedDefaultRates.MIN_RATE}
            max={ProviderFreeGatedDefaultRates.MAX_RATE}
            value={hourlyRate}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box p="0 16px" mt="50px">
          <Button color="primary" variant="contained" size="large" fullWidth onClick={onSubmit}>
            Next
          </Button>
        </Box>
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
              router.push(PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        We weren&apos;t able to save your schedule. Don&apos;t worry though, you can update this
        from your profile later.
      </Modal>
    </>
  );
};

export default PreferencesPage;
