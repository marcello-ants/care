import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import { ApolloError, useMutation } from '@apollo/client';
import { Banner, Modal, Typography } from '@care/react-component-lib';
import { Box, Button, Grid, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

import logger from '@/lib/clientLogger';
import AuthService, { getUserEmail } from '@/lib/AuthService';
import FixElementToBottom from '@/components/FixElementToBottom';
import RecommendationCard from '@/components/pages/seeker/cc/daycare-recommendations/Cards';
import CustomGoogleMap from '@/components/features/googleMap/googleMap';
import FullWidthWithPaddingLayout from '@/components/layouts/FullWidthWithPaddingLayout';
import {
  useAppDispatch,
  useFlowState,
  useSeekerCCState,
  useSeekerState,
  useAppState,
} from '@/components/AppState';
import { DayCareFrequencyOptions, DaycareProviderProfile } from '@/types/seekerCC';
import {
  CARE_DATES,
  CLIENT_FEATURE_FLAGS,
  JOB_MFE_DC_PAJ_NTH_DAY,
  SEEKER_DAYCARE_CHILD_CARE_ROUTES,
  VERTICALS_NAMES,
} from '@/constants';
import { postChildCareLead, postChildCareLeadVariables } from '@/__generated__/postChildCareLead';
import {
  POST_AUTO_ACCEPT_CHILD_CARE_LEAD,
  POST_CHILD_CARE_LEAD,
  UPDATE_SEEKER_ATTRIBUTE,
} from '@/components/request/GQL';
import {
  ChildCareLeadContactMethod,
  ChildCareLeadsSubmissionMethod,
  DayCareTimeOfDay,
  ServiceType,
  SubServiceType,
} from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  mapAttendingDays,
  mapChildrenDoB,
  mapMonthToDate,
  hash256,
  getLeadCountSMB,
  getLeadCountNational,
} from '@/utilities/account-creation-utils';
import useTealiumTracking from '@/components/hooks/useTealiumTracking';
import { Marker } from '@/types/map';
import useCrmEventDaycare from '@/components/hooks/useCrmEventDaycare';
import { convertDaycareLeadsToCrmEventFormat } from '@/utilities/daycareHelper';
import {
  autoAcceptChildCareLeadPublish,
  autoAcceptChildCareLeadPublishVariables,
} from '@/__generated__/autoAcceptChildCareLeadPublish';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import DaycareProfile from './DaycareProfile';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
    },
    '& > *:not(:first-of-type)': {
      marginTop: theme.spacing(2),
    },
  },
  nextButton: {
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
  },
  title: {
    maxWidth: '315px',
    [theme.breakpoints.up('md')]: {
      maxWidth: 'none',
    },
  },
  map: {
    width: '100%',
    height: '221px',
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
  },
  markerLabel: {
    marginTop: theme.spacing(9),
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.care.grey[900],
    textShadow: `-1px -1px 0 ${theme.palette.care.white}, -1px -1px 0 ${theme.palette.care.white}, -1px -1px 0 ${theme.palette.care.white}, -1px -1px 0 ${theme.palette.care.white}`,
  },
}));

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const filterProvidersForMap = (
  providers: DaycareProviderProfile[],
  classes: string,
  handleOpenProfile: { (daycareId: string): void; (arg0: string): any }
) => {
  const markers: Marker[] = [];

  providers.forEach((provider, i) => {
    if (
      provider.hasCoordinates &&
      provider.address &&
      provider.address.latitude &&
      provider.address.longitude
    ) {
      markers.push({
        position: {
          lat: provider.address.latitude,
          lng: provider.address.longitude,
        },
        title: provider.name ? provider.name : '',
        icon: `/app/enrollment/pin${i + 1}.svg`,
        label: {
          text: provider.name ? provider.name : '',
          className: classes,
        },
        onClick: () => handleOpenProfile(provider.id),
      });
    }
  });

  return markers;
};

function useDaycareAutoSubmitUIState() {
  const [modalType, setModalType] = useState<'error' | 'success' | null>(null);
  const dispatch = useAppDispatch();
  const {
    dayCare: { autoSubmit },
  } = useSeekerCCState();
  const initialAutoSubmit = useMemo(() => autoSubmit, []);

  useEffect(() => {
    if (!autoSubmit.startTime) {
      dispatch({ type: 'cc_startDayCareAutoSubmitCountdown' });
    }
  }, []);

  useEffect(() => {
    if (autoSubmit.submitted && initialAutoSubmit.submitted !== autoSubmit.submitted) {
      setModalType('success');
    } else if (autoSubmit.attempts >= 3 && initialAutoSubmit.attempts !== autoSubmit.attempts) {
      setModalType('error');
    }
  }, [autoSubmit.submitted, autoSubmit.attempts]);

  const dismissModal = useCallback(() => {
    setModalType(null);
  }, []);

  return {
    dismissModal,
    showSuccess: modalType === 'success',
    showError: modalType === 'error',
  };
}

function Recommendations() {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const authService = AuthService();

  const {
    careDate,
    phoneNumber,
    firstName,
    lastName,
    enrollmentSource,
    dayCare: {
      recommendationsTrackingId,
      recommendations: dayCareRecommendations,
      submissionCompleted,
      startMonth,
      additionalInformation,
      dayTime,
      careFrequency,
      childrenDateOfBirth,
      shouldShowMap,
      contactMethod,
    },
    isSendLeadEnabled,
    careKind,
    isPixelFired,
  } = useSeekerCCState();
  const [showNextButton] = useState(submissionCompleted);
  const {
    flow: { czenJSessionId },
  } = useAppState();
  const { memberId } = useFlowState();
  const { zipcode, maxDistanceFromSeekerDayCare } = useSeekerState();
  const dispatch = useAppDispatch();
  const [submissionAttempts, setSubmissionAttempts] = useState(0);
  const authStore = authService.getStore();
  const seekerUuid = authStore?.profile.sub.split(':')[1] as string;
  const seekerEmail = authStore?.profile.email;
  const createCrmEventDaycare = useCrmEventDaycare();
  const dayCareLeadsRedirectionFlag = useFeatureFlag(
    CLIENT_FEATURE_FLAGS.DAYCARE_LEADS_REDIRECTION
  );

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.DAYCARE_LEADS_REDIRECTION,
      dayCareLeadsRedirectionFlag
    );
  }, []);

  function getRequiredForRequestData(submissionMethod: ChildCareLeadsSubmissionMethod) {
    const requiredData = {
      seekerUuid,
      firstName,
      lastName,
      email: seekerEmail,
      phoneNumber,
      zipcode,
      recommendationsTrackingId,
      recommendations: dayCareRecommendations,
      childrenDateOfBirth,
      careType: careFrequency.careType,
    };
    if (submissionMethod === ChildCareLeadsSubmissionMethod.AUTO) {
      return {
        ...requiredData,
        distance: maxDistanceFromSeekerDayCare,
      };
    }
    return requiredData;
  }
  function getErrorLogPayload(submissionMethod: ChildCareLeadsSubmissionMethod) {
    const requiredData = getRequiredForRequestData(submissionMethod);
    return {
      ...requiredData,
      memberId,
      email: requiredData.email ? 'exists' : 'empty',
      phoneNumber: requiredData.phoneNumber ? 'exists' : 'empty',
    };
  }

  function handleChildCareDayCareLeadManualSubmitError(graphQLError: ApolloError) {
    logger.error({
      event: 'childCareDayCareLeadCreationError',
      graphQLError: graphQLError?.message,
      data: getErrorLogPayload(ChildCareLeadsSubmissionMethod.MANUAL),
    });
  }

  function handleAutoAcceptSubmitError(graphQLError: ApolloError) {
    logger.error({
      event: 'childCareDayCareAutoAcceptLeadCreationError',
      graphQLError: graphQLError?.message,
      data: getErrorLogPayload(ChildCareLeadsSubmissionMethod.AUTO),
    });
  }

  const [postLead] = useMutation<postChildCareLead, postChildCareLeadVariables>(
    POST_CHILD_CARE_LEAD,
    {
      onError: handleChildCareDayCareLeadManualSubmitError,
    }
  );
  const dayCareAutoAcceptBackendFlag = useFeatureFlag(
    CLIENT_FEATURE_FLAGS.DAYCARE_AUTO_ACCEPT_BACKEND
  );
  const [postAutoAcceptLead] = useMutation<
    autoAcceptChildCareLeadPublish,
    autoAcceptChildCareLeadPublishVariables
  >(POST_AUTO_ACCEPT_CHILD_CARE_LEAD, {
    onError: handleAutoAcceptSubmitError,
  });
  const [updateSeekerAttribute] = useMutation(UPDATE_SEEKER_ATTRIBUTE);

  const { dismissModal, showError } = useDaycareAutoSubmitUIState();

  const submitButtonText = 'Request info';
  const subtitleText = 'Get started evaluating these daycares!';

  function checkRequiredFieldsAvailability(submissionMethod: ChildCareLeadsSubmissionMethod) {
    const hasEmptyField = Boolean(
      Object.values(getRequiredForRequestData(submissionMethod)).some((el) => !el)
    );
    if (!hasEmptyField) {
      return true;
    }
    logger.error({
      event: 'childCareDayCareLeadCreationMissingData',
      data: getErrorLogPayload(submissionMethod),
    });
    return false;
  }

  function routeToNthDay() {
    const nthDayPaj = CZEN_GENERAL + JOB_MFE_DC_PAJ_NTH_DAY;
    window.location.assign(nthDayPaj);
  }

  useEffect(() => {
    hash256(getUserEmail()).then((hash) => {
      const emailSHA256 = hash;
      const slots = [
        '/us-subscription/conversion/seeker/basic/signup/',
        '/us-subscription/conversion/seeker/basic/signup/impact/',
      ];
      const tealiumData: TealiumData = {
        ...(memberId && { memberId }),
        tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
        sessionId: czenJSessionId,
        email: getUserEmail(),
        emailSHA256,
        slots,
        memberType: 'seeker',
        overallStatus: 'basic',
        serviceId: ServiceType.CHILD_CARE,
        subServiceId: careKind,
        intent: careDate,
      };

      if (!isPixelFired && dayCareRecommendations.length > 0) {
        TealiumUtagService.view(tealiumData);
        AnalyticsHelper.logEvent({
          name: 'Slot Sent',
          data: { slots },
        });
        dispatch({
          type: 'setIsPixelFired',
          isPixelFired: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    const updateSeekerAttributeInput = { attributes: { daycareInterest: true } };
    updateSeekerAttribute({ variables: { input: updateSeekerAttributeInput } });
  }, []);

  useEffect(() => {
    dayCareRecommendations.forEach((recommendation) => {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          enrollment_flow: enrollmentSource,
          enrollment_step: 'recommendations',
          member_type: 'Seeker',
          vertical: VERTICALS_NAMES.CHILD_CARE,
          tracking_id: recommendationsTrackingId,
          provider_id: recommendation.id,
          member_id: memberId,
        },
      });
    });

    if (!dayCareAutoAcceptBackendFlag?.value || careDate === CARE_DATES.JUST_BROWSING) {
      return;
    }

    if (
      dayCareLeadsRedirectionFlag?.value &&
      !checkRequiredFieldsAvailability(ChildCareLeadsSubmissionMethod.AUTO)
    ) {
      routeToNthDay();
    } else {
      postAutoAcceptLead({
        variables: {
          autoAcceptChildCareLeadPublishInput: {
            acceptableDistance: {
              unit: maxDistanceFromSeekerDayCare.unit,
              value: maxDistanceFromSeekerDayCare.distance,
            },
            attendingDays: mapAttendingDays(
              careFrequency.careType === DayCareFrequencyOptions.FULL_TIME
                ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                : careFrequency.specifcDays
            ),
            careExpectations: additionalInformation,
            childrenDatesOfBirth: mapChildrenDoB(childrenDateOfBirth),
            contactMethod: contactMethod as ChildCareLeadContactMethod,
            justBrowsing: false,
            providerIds: dayCareRecommendations.map((next) => next.id),
            seekerInfo: {
              id: seekerUuid,
              email: seekerEmail,
              firstName,
              lastName,
              phoneNumber: phoneNumber.replace(/\D/g, ''),
            },
            source: 'ENROLLMENT',
            startDate: mapMonthToDate(startMonth!),
            timeOfDay: dayTime ? DayCareTimeOfDay[dayTime] : DayCareTimeOfDay.MORNING,
            trackingId: recommendationsTrackingId,
            zipcode,
          },
        },
      });
    }
  }, []);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const selectedDaycare = selectedProfileId
    ? dayCareRecommendations.find((n) => n.id === selectedProfileId)
    : undefined;
  const isProfileOpen = selectedProfileId !== null;
  const nextLink = SEEKER_DAYCARE_CHILD_CARE_ROUTES.TOURS_REQUESTED;

  // unable to find a way to test this, suggestions are welcomed
  /* istanbul ignore next */
  const handleCloseProfile = () => {
    setSelectedProfileId(null);
  };
  const handleOpenProfile = (daycareId: string) => {
    setSelectedProfileId(daycareId);
  };
  const handleRequestTour = async () => {
    if (dayCareRecommendations.filter((n) => n.selected).length === 0) {
      setErrorMessage(true);
      window.scrollTo(0, 0);
      return;
    }

    if (
      dayCareLeadsRedirectionFlag?.value &&
      !checkRequiredFieldsAvailability(ChildCareLeadsSubmissionMethod.MANUAL)
    ) {
      routeToNthDay();
      return;
    }

    let success: boolean;
    const providerIds = dayCareRecommendations
      .filter((next) => next.selected)
      .map((next) => next.id);

    if (!isSendLeadEnabled) {
      await router.push(SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD);
      return;
    }

    try {
      const result = await postLead({
        variables: {
          childCareLeadInput: {
            submissionMethod: ChildCareLeadsSubmissionMethod.MANUAL,
            trackingId: recommendationsTrackingId,
            providerIds,
            zipcode,
            source: 'ENROLLMENT',
            childCareExpectations: additionalInformation,
            startDate: mapMonthToDate(startMonth!),
            childrenDatesOfBirth: mapChildrenDoB(childrenDateOfBirth),
            timeOfDay: dayTime ? DayCareTimeOfDay[dayTime] : DayCareTimeOfDay.MORNING,
            attendingDays: mapAttendingDays(
              careFrequency.careType === DayCareFrequencyOptions.FULL_TIME
                ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                : careFrequency.specifcDays
            ),
            contactMethod: contactMethod as ChildCareLeadContactMethod,
            seekerInfo: {
              id: seekerUuid,
              email: seekerEmail,
              firstName,
              lastName,
              phoneNumber: phoneNumber.replace(/\D/g, ''),
            },
          },
        },
      });
      success = Boolean(result.data?.childCareLeadCreate?.batchId);
    } catch {
      success = false;
    }

    if (success) {
      providerIds.forEach((providerId) => {
        AnalyticsHelper.logEvent({
          name: 'Member Enrolled',
          data: {
            enrollment_flow: enrollmentSource,
            enrollment_step: 'recommendations',
            member_type: 'Seeker',
            vertical: VERTICALS_NAMES.CHILD_CARE,
            action: 'leadSubmission',
            cta_clicked: submitButtonText, // Request Tour(s) / Request info
            tracking_id: recommendationsTrackingId,
            provider_id: providerId,
            member_id: memberId,
            source: 'manual',
          },
        });
      });

      // Trigger Iterable Event
      createCrmEventDaycare({
        variables: {
          input: {
            czenCrmEventLeadsSubmitted: {
              autoAccept: false,
              leadCount: providerIds.length,
              vertical: ServiceType.CHILD_CARE,
              subVertical: SubServiceType.DAY_CARE,
              leads: convertDaycareLeadsToCrmEventFormat(dayCareRecommendations),
              enrollment: true,
            },
            userId: authStore.profile.sub.split(':')[1] as string,
          },
        },
      });

      await router.push(nextLink);
      dispatch({ type: 'cc_setDayCareRecommendationsSubmissionInfo', completed: true });
    } else {
      setSubmissionAttempts((attempts) => attempts + 1);
    }
  };

  const handleNext = () => {
    router.push(nextLink);
  };

  const handleDaycareSelectChange = (daycareId: string, isSelected: boolean) => {
    let newIds = dayCareRecommendations.filter((n) => n.selected).map((n) => n.id);

    if (!isSelected) {
      newIds = newIds.filter((id) => id !== daycareId);
    } else if (!newIds.includes(daycareId)) {
      setErrorMessage(false);
      newIds = [...newIds, daycareId];
    }

    dispatch({ type: 'cc_setDayCareRecommendationsSelectections', dayCareIds: newIds });
  };

  useTealiumTracking(['/us-marketplace/daycare/leads-viewed/'], {
    tealium_event: 'DAYCARE_LEADS_VIEWED',
    intent: careDate,
    leadCountSMB: getLeadCountSMB(dayCareRecommendations),
    leadCountNational: getLeadCountNational(dayCareRecommendations),
  });

  const markers = filterProvidersForMap(
    dayCareRecommendations,
    classes.markerLabel,
    handleOpenProfile
  );

  const isMobileOrSmaller = useMediaQuery(theme.breakpoints.down('sm'));
  const button = (
    <Button
      onClick={showNextButton || submissionAttempts >= 3 ? handleNext : handleRequestTour}
      variant="contained"
      color="primary"
      fullWidth
      size="large"
      className={classes.nextButton}>
      {showNextButton || submissionAttempts >= 3 ? 'Next' : `${submitButtonText}`}
    </Button>
  );

  const renderCards = (): Array<React.ReactNode> => {
    let imageVariation = -1;
    return dayCareRecommendations.map((daycare, i) => {
      imageVariation = imageVariation === 4 ? 0 : imageVariation + 1;
      return (
        <RecommendationCard
          key={daycare.id}
          order={i + 1}
          isSelected={daycare.selected}
          isDisabled={submissionCompleted}
          daycareProfile={daycare}
          onSelectChange={handleDaycareSelectChange}
          onClick={() => handleOpenProfile(daycare.id)}
          photoIndex={imageVariation}
        />
      );
    });
  };

  return (
    <>
      <Head>
        <title>Daycare recommendations</title>
      </Head>
      <Grid container>
        <Grid item xs={12} md={6} lg={5}>
          {errorMessage ? (
            <Box mb={3} ml={1} mr={1}>
              <Banner type="warning" width="100%" roundCorners>
                <Typography variant="body2">Please select at least 1 daycare to proceed</Typography>
              </Banner>
            </Box>
          ) : (
            <Box mb={3} ml={1} mr={1}>
              <Banner type="confirmation" width="100%" roundCorners>
                <Typography variant="body2">Account created!</Typography>
              </Banner>
            </Box>
          )}
        </Grid>
      </Grid>
      <Modal
        open={showError || submissionAttempts >= 3}
        title="Oops, something went wrong"
        ButtonPrimary={
          <Button color="secondary" variant="contained" onClick={handleNext}>
            Continue
          </Button>
        }
        onClose={dismissModal}>
        There was a technical problem on our side. Sorry, we realize that&apos;s frustrating! Click
        to continue and we&apos;ll get you to our daycare listings.
      </Modal>
      <Box px={1}>
        <DaycareProfile
          isOpen={isProfileOpen}
          onClose={handleCloseProfile}
          dayCare={selectedDaycare}
        />
        <Grid container>
          <Grid item xs={12}>
            <Box marginBottom={2}>
              <Typography variant="h2" className={classes.title}>
                {subtitleText}
              </Typography>
            </Box>
          </Grid>
          <Grid container direction="row-reverse">
            {shouldShowMap ? (
              <>
                <Grid item xs={12} md={6} lg={7}>
                  <Box height={isDesktop ? '609px' : '100%'} marginBottom={isDesktop ? 0 : 2}>
                    <CustomGoogleMap
                      config={{
                        setAutomaticBounds: markers.length !== 1,
                        containerClassName: classes.map,
                        options: {
                          disableDefaultUI: true,
                        },
                      }}
                      data={{
                        center: markers.length === 1 ? markers[0].position : undefined,
                        markers,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <div className={classes.cardContainer}>{renderCards()}</div>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} md={6} lg={7}>
                <div className={classes.cardContainer}>{renderCards()}</div>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      <Grid container>
        {isMobileOrSmaller ? (
          <FixElementToBottom>
            <>{button}</>
          </FixElementToBottom>
        ) : (
          <Grid item xs={12} md={6} lg={5}>
            <Box mx="auto" mt={5} mb={15} display="flex" justifyContent="center">
              {button}
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
}

Recommendations.Layout = FullWidthWithPaddingLayout;

export default Recommendations;
