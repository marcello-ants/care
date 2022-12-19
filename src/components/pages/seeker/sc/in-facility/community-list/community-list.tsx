// @ts-nocheck
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { Button, Grid, useMediaQuery, useTheme, makeStyles } from '@material-ui/core';
import { MarkerProps } from '@react-google-maps/api';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import logger from '@/lib/clientLogger';
import OverlaySpinner from '@/components/OverlaySpinner';
import { Typography, SideDrawer, BottomDrawer, Banner } from '@care/react-component-lib';
import { useAppDispatch, useFlowState, useSeekerState } from '@/components/AppState';
import {
  CLIENT_FEATURE_FLAGS,
  SEEKER_IN_FACILITY_ROUTES,
  TEALIUM_EVENTS,
  TEALIUM_SLOTS,
  LEAD_SOURCES,
} from '@/constants';
import {
  SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD,
  SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
} from '@/components/request/GQL';
import CommunityCard from '@/components/pages/seeker/sc/in-facility/community-list/CommunityCard';
import FixElementToBottom from '@/components/FixElementToBottom';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import CustomGoogleMap from '@/components/features/googleMap/googleMap';
import BlueWrapperIcon from '@/components/BlueWrapperIcon';
import { Icon24InfoSeniorCare } from '@care/react-icons';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  seniorAssistedLivingCommunityLeadPublish,
  seniorAssistedLivingCommunityLeadPublishVariables,
} from '@/__generated__/seniorAssistedLivingCommunityLeadPublish';
import {
  seniorCareAssistedLivingProviders,
  seniorCareAssistedLivingProvidersVariables,
} from '@/__generated__/seniorCareAssistedLivingProviders';
import { CenterType, ServiceType, SubServiceType } from '@/__generated__/globalTypes';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { parseSeniorCareAssistedLivingProviders } from '@/components/pages/seeker/sc/in-facility/community-list/SeniorCareAssistedLivingProvidersHelper';
import { CommunityDetail } from '@/types/seeker';
import useIsDisqualifiedFromSeniorFacilityLeads from '@/components/hooks/useIsDisqualifiedFromSeniorFacilityLeads';
import { formatCareRecipientInfo } from '@/utilities/gqlPayloadHelper';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useCrmEventSALC from '@/components/hooks/useCrmEventSALC';
import {
  recommendedSeniorCareCommunityType,
  recommendedSeniorCareLivingOption,
} from '@/utilities/senior-care-facility-utility';
import { createPortal } from 'react-dom';
import { getLeadCountNational, getLeadCountSMB } from '@/utilities/account-creation-utils';
import CommunityDetails from './communityDetails';
import { SeekerInfoModal, shouldPromptForPhone, shouldPromptForName } from '../SeekerInfoModal';

const {
  publicRuntimeConfig: { BASE_PATH },
} = getConfig();

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: theme.spacing(3, 3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5, 3),
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5, 0),
    },
  },
  title: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h1,
    },
  },
  mobilebuttonContainer: {
    marginTop: theme.spacing(7),
    padding: theme.spacing(0, 3, 2),
  },
  mapAndCommunitiesContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  map: {
    flexBasis: '221px',
    marginTop: theme.spacing(3),
    margin: theme.spacing(3, -3, 0),
    [theme.breakpoints.up('md')]: {
      borderRadius: '10px',
      flexBasis: '100%',
      margin: theme.spacing(3, 'auto', 0),
      order: 1,
      width: '100%',
      minHeight: '706px',
    },
  },
  markerLabel: {
    marginTop: theme.spacing(7),
    maxWidth: '12ch',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  communities: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(3),
    },
  },
  desktopButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: 410,
    paddingTop: theme.spacing(4),
  },
  paper: {
    padding: `${theme.spacing(1)}px 0 0 !important`,
    height: '93vh',
    position: 'absolute',
    '& > div:first-child': {
      flex: '0 0 auto',
    },
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      width: 600,
    },
  },
  bannerContainer: {
    width: 327,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const fireAmplitudeEvent = (cta: string, numProviders?: Number, extraData?: object = {}) => {
  const data = {
    enrollment_step: 'SALC community list',
    member_type: 'Seeker',
    cta_clicked: cta,
    ...extraData,
  };

  if (numProviders) {
    data.num_of_providers = numProviders;
  }

  AnalyticsHelper.logEvent({
    name: 'CTA Interacted',
    data,
  });
};

function CommunityList(props: WithPotentialMemberProps) {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const { userHasAccount } = props;
  const isIpadOrLarger = useMediaQuery(theme.breakpoints.up('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState<CommunityDetail | undefined>();
  const transitionDuration = theme.transitions.duration.standard;
  const dispatch = useAppDispatch();
  const {
    SALCSavedFacilitiesIds,
    zipcode,
    seekerInfo,
    SALCSeniorCareFacilityLeadsPublished,
    SALCTrackingId,
    SALCCommunities,
    whoNeedsCare,
    whoNeedsCareAge,
    condition,
    helpTypes,
    assistedLivingCenterFacilityCount,
  } = useSeekerState();
  const { memberId: seekerId, czenJSessionId } = useFlowState();
  const [isLoading, setIsLoading] = useState(false);
  const isDisqualifiedFromSeniorFacilityLeads = useIsDisqualifiedFromSeniorFacilityLeads();
  const targetType = recommendedSeniorCareLivingOption(condition, helpTypes);
  const [isSeekerInfoModalOpen, setIsSeekerInfoModalOpen] = useState(false);
  const { flags } = useFeatureFlags();

  const recommendationOptimizationVariation =
    flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;
  const [showBanner, setShowBanner] = useState(
    !userHasAccount &&
      !isRecommendationOptimizationVariation &&
      !SALCSeniorCareFacilityLeadsPublished
  );
  const createCrmEventSALC = useCrmEventSALC();
  const SALCSeniorCareFacilityLeads = SALCCommunities?.map((salc) => ({
    businessName: salc.name,
    address: {
      addressLine1: salc.address,
      city: salc.city,
      state: salc.state,
      zip: salc.zip,
    },
  }));

  const handleSuccess = () => {
    logger.info({
      event: 'seniorAssistedLivingCommunityLeadPublishMutationSuccessful',
    });
    dispatch({
      type: 'setSALCSeniorCareFacilityLeadsPublished',
      SALCSeniorCareFacilityLeadsPublished: true,
    });
    // Trigger createCrmEventSALC mutation
    createCrmEventSALC({
      variables: {
        input: {
          czenCrmEventLeadsSubmitted: {
            autoAccept: false,
            leadCount: assistedLivingCenterFacilityCount,
            vertical: ServiceType.SENIOR_CARE,
            subVertical: SubServiceType.FAMILY_CARE,
            leads: SALCSeniorCareFacilityLeads,
            enrollment: true,
          },
          userId: seekerId,
        },
      },
    });
    if (!userHasAccount) {
      return;
    }
    router.push(SEEKER_IN_FACILITY_ROUTES.PAYOFF);
  };

  const [publishLead, { called, loading: loadingLeadPublish }] = useMutation<
    seniorAssistedLivingCommunityLeadPublish,
    seniorAssistedLivingCommunityLeadPublishVariables
  >(SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD, {
    onCompleted: handleSuccess,
    onError: (graphQLError: ApolloError) => {
      logger.error({
        event: 'seniorAssistedLivingCommunityLeadPublishMutationFailed',
        graphQLError: graphQLError.message,
      });
      dispatch({ type: 'setSeniorCareFacilityLeadGenerateMutationError', value: true });
      router.push(SEEKER_IN_FACILITY_ROUTES.PAYOFF);
    },
  });

  const [getSeniorCareAssistedLivingProviders, { data: queryData, loading: queryLoading }] =
    useLazyQuery<seniorCareAssistedLivingProviders, seniorCareAssistedLivingProvidersVariables>(
      SENIOR_CARE_ASSISTED_LIVING_PROVIDERS
    );

  useEffect(() => {
    if (SALCSeniorCareFacilityLeadsPublished) {
      logger.info({ event: 'seniorCareFacilityLeadsPublished' });
      router.push(SEEKER_IN_FACILITY_ROUTES.PAYOFF);
    } else if (userHasAccount) {
      getSeniorCareAssistedLivingProviders({
        variables: {
          zipcode,
          source: 'USC',
          facilityType: recommendedSeniorCareCommunityType(condition, helpTypes),
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!userHasAccount && !called && !SALCSeniorCareFacilityLeadsPublished) {
      const input = {
        providerIds: SALCSavedFacilitiesIds,
        seekerInfo: {
          email: seekerInfo.email,
          firstName: seekerInfo.firstName,
          id: seekerId!,
          lastName: seekerInfo.lastName,
          phoneNumber: seekerInfo.phone,
        },
        source: userHasAccount ? LEAD_SOURCES.NTH_DAY : LEAD_SOURCES.ENROLLMENT,
        trackingId: SALCTrackingId!,
        zipcode,
      };

      const careRecipientInfo = formatCareRecipientInfo({
        whoNeedsCare,
        whoNeedsCareAge,
        condition,
        helpTypes,
      });
      input.careRecipientInfo = careRecipientInfo;
      publishLead({ variables: { input } });
    }
  }, []);

  const failureRedirectRoute =
    isDisqualifiedFromSeniorFacilityLeads ||
    typeof assistedLivingCenterFacilityCount === 'undefined' ||
    assistedLivingCenterFacilityCount === 0
      ? SEEKER_IN_FACILITY_ROUTES.OPTIONS
      : SEEKER_IN_FACILITY_ROUTES.CARING_LEADS;

  useEffect(() => {
    if (
      userHasAccount &&
      queryData &&
      queryData.seniorCareAssistedLivingProviders.__typename === 'ProviderSearchSuccess' &&
      queryData.seniorCareAssistedLivingProviders.providerSearchResults.length > 0
    ) {
      const searchResultTrackingId = queryData.seniorCareAssistedLivingProviders.trackingId;
      dispatch({
        type: 'setSALCTrackingId',
        SALCTrackingId: searchResultTrackingId,
      });

      const resultingCommunities = parseSeniorCareAssistedLivingProviders(
        queryData.seniorCareAssistedLivingProviders.providerSearchResults,
        targetType
      );

      dispatch({
        type: 'setSALCCommunities',
        SALCCommunities: resultingCommunities,
      });
      const ids = resultingCommunities.map((community) => community.id);
      dispatch({
        type: 'setSALCSavedFacilitiesIds',
        SALCSavedFacilitiesIds: ids,
      });
    } else if (
      userHasAccount &&
      queryData?.seniorCareAssistedLivingProviders?.__typename === 'ProviderSearchSuccess' &&
      queryData?.seniorCareAssistedLivingProviders?.providerSearchResults.length === 0
    ) {
      logger.info({
        event: 'seniorCareAssistedLivingProviders',
        message: 'Found zero senior care assisted living providers, redirecting to caring flow.',
      });

      router.push(failureRedirectRoute);
    } else if (
      queryData?.seniorCareAssistedLivingProviders?.__typename === 'ProviderSearchError' &&
      userHasAccount
    ) {
      logger.error({
        event: 'seniorCareAssistedLivingProviders',
        graphQLError: queryData?.seniorCareAssistedLivingProviders?.message,
      });

      router.push(failureRedirectRoute);
    }
  }, [queryData]);

  useEffect(() => {
    if (SALCCommunities !== undefined) {
      if (userHasAccount) {
        const leadCountSMB = getLeadCountSMB(SALCCommunities);
        const leadCountNational = getLeadCountNational(SALCCommunities);

        const data = {
          tealium_event: TEALIUM_EVENTS.SENIORCARE_LEADS_VIEW,
          leadCount: SALCCommunities.length,
          leadCountSMB,
          leadCountNational,
        };
        const slots = [
          userHasAccount
            ? TEALIUM_SLOTS.SENIORCARE_LEADS_VIEWED_NON_ENROLLMENT
            : TEALIUM_SLOTS.SENIORCARE_LEADS_VIEWED_ENROLLMENT,
        ];
        const tealiumData: TealiumData = {
          ...(seekerId && { memberId: seekerId }),
          ...data,
          sessionId: czenJSessionId,
          slots,
          email: seekerInfo.email,
        };
        TealiumUtagService.view(tealiumData);
      }
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          num_of_providers: SALCCommunities.length ?? 0,
          source: userHasAccount ? LEAD_SOURCES.NTH_DAY : LEAD_SOURCES.ENROLLMENT,
        },
      });
    }
  }, [SALCCommunities]);

  const submitRequest = () => {
    const event = !userHasAccount ? 'Done reviewing' : 'Request info';
    fireAmplitudeEvent(event, SALCSavedFacilitiesIds.length);
    setIsLoading(true);
    if (userHasAccount) {
      const leadCountSMB =
        SALCCommunities.filter(
          (community) =>
            community.centerType === CenterType.SMALL_MEDIUM_BUSINESS &&
            SALCSavedFacilitiesIds.includes(community.id)
        ).length ?? 0;
      const leadCountNational =
        SALCSavedFacilitiesIds.filter(
          (community) =>
            community.centerType === CenterType.NATIONAL_ACCOUNT &&
            SALCSavedFacilitiesIds.includes(community.id)
        ).length ?? 0;

      const data = {
        tealium_event: TEALIUM_EVENTS.SENIORCARE_LEADS_SUBMITTED,
        leadCount: SALCSavedFacilitiesIds.length,
        leadCountSMB,
        leadCountNational,
      };
      const slots = [
        userHasAccount
          ? TEALIUM_SLOTS.SENIORCARE_LEADS_SUBMITTED_NON_ENROLLMENT
          : TEALIUM_SLOTS.SENIORCARE_LEADS_SUBMITTED_ENROLLMENT,
      ];
      const tealiumData: TealiumData = {
        ...(seekerId && { memberId: seekerId }),
        ...data,
        sessionId: czenJSessionId,
        slots,
        email: seekerInfo.email,
      };
      TealiumUtagService.view(tealiumData);
    }

    if (!userHasAccount) {
      router.push(SEEKER_IN_FACILITY_ROUTES.PAYOFF);
    } else {
      const input = {
        providerIds: SALCSavedFacilitiesIds,
        seekerInfo: {
          email: seekerInfo.email,
          firstName: seekerInfo.firstName,
          id: seekerId!,
          lastName: seekerInfo.lastName,
          phoneNumber: seekerInfo.phone,
        },
        source: userHasAccount ? LEAD_SOURCES.NTH_DAY : LEAD_SOURCES.ENROLLMENT,
        trackingId: SALCTrackingId!,
        zipcode,
      };

      const careRecipientInfo = formatCareRecipientInfo({
        whoNeedsCare,
        whoNeedsCareAge,
        condition,
        helpTypes,
      });
      input.careRecipientInfo = careRecipientInfo;
      publishLead({ variables: { input } });
    }
  };

  const handleNext = () => {
    if (
      shouldPromptForPhone(seekerInfo.phone) ||
      shouldPromptForName(seekerInfo.firstName, seekerInfo.lastName)
    ) {
      setIsSeekerInfoModalOpen(true);
    } else {
      submitRequest();
    }
  };

  useEffect(() => {
    if (
      isSeekerInfoModalOpen &&
      !shouldPromptForPhone(seekerInfo.phone) &&
      !shouldPromptForName(seekerInfo.firstName, seekerInfo.lastName)
    ) {
      setIsSeekerInfoModalOpen(false);
      submitRequest();
    }
  }, [isSeekerInfoModalOpen, seekerInfo.phone, seekerInfo.firstName, seekerInfo.lastName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 3000);

    if (!showBanner) {
      clearTimeout(timer);
    }
  }, []);

  const onCheck = (id: string) => {
    const isChecked = SALCSavedFacilitiesIds.includes(id);
    if (isChecked) {
      fireAmplitudeEvent('Facility checkbox - uncheck');
      const checkedFacilities = SALCSavedFacilitiesIds.filter(
        (facilityId: string) => facilityId !== id
      );
      dispatch({
        type: 'setSALCSavedFacilitiesIds',
        SALCSavedFacilitiesIds: checkedFacilities,
      });
    } else {
      fireAmplitudeEvent('Facility checkbox - check');
      dispatch({
        type: 'setSALCSavedFacilitiesIds',
        SALCSavedFacilitiesIds: [...SALCSavedFacilitiesIds, id],
      });
    }
  };

  const handleClick = (community: CommunityDetail) => {
    fireAmplitudeEvent('Facility card');
    setCurrentCommunity(community);
    setIsDrawerOpen(true);
  };

  const Drawer = isIpadOrLarger ? SideDrawer : BottomDrawer;

  if (
    isLoading ||
    (SALCSeniorCareFacilityLeadsPublished && userHasAccount) ||
    queryLoading ||
    (!queryData && userHasAccount) ||
    !SALCCommunities ||
    (loadingLeadPublish && !userHasAccount)
  ) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const markers: MarkerProps[] = SALCCommunities.filter((community) => {
    return community.name && community.latitude && community.longitude;
  }).map((community, i) => ({
    position: {
      lat: community.latitude!,
      lng: community.longitude!,
    },
    title: community.id,
    icon: `${BASE_PATH}/pin${i + 1}.svg`,
    label: {
      text: community.name!,
      className: classes.markerLabel,
      // the font styles cannot be controlled via className
      // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel.className
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: `${theme.typography.fontSize}px`,
      fontWeight: 'bold',
    },
  }));

  return (
    <Grid container className={classes.container}>
      {showBanner &&
        createPortal(
          <div className={classes.bannerContainer}>
            <Banner roundCorners type="confirmation" fullWidth>
              <Typography variant="h4">Your account has been created!</Typography>
            </Banner>
          </div>,
          document.body
        )}
      <BlueWrapperIcon icon={<Icon24InfoSeniorCare />} />
      <Grid item xs={12}>
        <Typography variant="h2" className={classes.title}>
          {!userHasAccount
            ? "Here are the suggested communities we'll contact you about."
            : 'Get started with evaluating senior living communities.'}
        </Typography>
        {!userHasAccount && (
          <Typography variant="body2" className={classes.subheader}>
            It can be helpful to review them and start forming a list of questions you might have.
          </Typography>
        )}
      </Grid>

      <div className={classes.mapAndCommunitiesContainer}>
        <CustomGoogleMap
          config={{
            setAutomaticBounds: markers.length !== 1,
            containerClassName: classes.map,
            options: {
              disableDefaultUI: true,
              styles: [
                {
                  featureType: 'poi',
                  stylers: [{ visibility: 'off' }],
                },
              ],
            },
          }}
          data={{
            center: markers.length === 1 ? markers[0].position : undefined,
            markers,
          }}
        />
        <div className={classes.communities}>
          {SALCCommunities.map((community, i) => (
            <CommunityCard
              key={community.id}
              selectedCommunity={community}
              index={i}
              onClick={() => handleClick(community)}
              onCheck={onCheck}
              checked={SALCSavedFacilitiesIds.includes(community.id)}
              displayCheckbox={userHasAccount}
            />
          ))}
          {isDesktop && (
            <Grid item xs={12}>
              <div className={classes.desktopButtonContainer}>
                <Button
                  color="primary"
                  disabled={SALCSavedFacilitiesIds.length < 1}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleNext}>
                  {!userHasAccount ? 'Done reviewing' : ' Request info'}
                </Button>
              </div>
            </Grid>
          )}
        </div>
      </div>

      {!isDesktop && (
        <>
          <FixElementToBottom useFade={false}>
            <div className={classes.mobilebuttonContainer}>
              <Button
                color="primary"
                disabled={SALCSavedFacilitiesIds.length < 1}
                variant="contained"
                size="large"
                fullWidth
                onClick={handleNext}>
                {!userHasAccount ? 'Done reviewing' : ' Request info'}
              </Button>
            </div>
          </FixElementToBottom>
        </>
      )}

      <Drawer
        data-testid="drawer"
        open={isDrawerOpen}
        classes={{ paper: classes.paper }}
        anchor="right"
        onClose={() => setIsDrawerOpen(false)}
        transitionDuration={transitionDuration}
        ModalProps={{
          onClose: () => setIsDrawerOpen(false),
          BackdropProps: {
            open: true,
          },
          keepMounted: false,
        }}>
        {currentCommunity && (
          <CommunityDetails
            community={currentCommunity}
            setIsDrawerOpen={setIsDrawerOpen}
            savedFacilitiesIds={SALCSavedFacilitiesIds}
            dispatch={dispatch}
            fireAmplitudeEvent={fireAmplitudeEvent}
            displayCTA={userHasAccount}
          />
        )}
      </Drawer>

      <SeekerInfoModal
        open={isSeekerInfoModalOpen}
        onClose={() => setIsSeekerInfoModalOpen(false)}
        phonePromptTitle="What's the best number for these communities to reach you at?"
        namePromptTitle="Share the best contact info for these communities to reach you at."
        enrollmentStep="SALC community list"
      />
    </Grid>
  );
}

CommunityList.Layout = FullWidthLayout;
CommunityList.disableScreenViewed = true;

export default withPotentialMember(CommunityList);
