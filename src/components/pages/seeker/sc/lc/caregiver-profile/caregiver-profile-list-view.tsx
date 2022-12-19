import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import { FetchResult } from '@apollo/client/link/core';
import {
  useMediaQuery,
  useTheme,
  CardContent,
  CardHeader,
  makeStyles,
  Box,
  Drawer,
  Button,
} from '@material-ui/core';

import { captureException } from '@sentry/nextjs';

import {
  Link,
  Typography,
  Card,
  Rating,
  ReadMore,
  ProfileAvatar,
  Checkbox,
} from '@care/react-component-lib';

import { ServiceType, ActionType, ActorType } from '@/__generated__/globalTypes';
import { favoriteProvider, favoriteProviderVariables } from '@/__generated__/favoriteProvider';
import {
  leadConnectActionRecord,
  leadConnectActionRecordVariables,
} from '@/__generated__/leadConnectActionRecord';
import { getTopCaregivers, getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import { SeniorCareProviderProfile, MinimalProviderProfile } from '@/types/seeker';

import {
  CLIENT_FEATURE_FLAGS,
  LEAD_CONNECT_ROUTING_STEP,
  SEEKER_LEAD_CONNECT_ROUTES,
  NUMBER_OF_LEAD_CONNECT_RESULTS,
} from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';

import { useAppDispatch, useSeekerState, useFlowState } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import {
  findMatchingIndex,
  generateCaregiverPath,
  handleViewAllCaregivers,
  performInitialActions,
  populateCaregiverProfiles,
  logInteraction,
  logScreenViewed,
} from '@/components/pages/seeker/sc/lc/caregiver-profile/caregiverProfileHelper';
import OverlaySpinner from '@/components/OverlaySpinner';
import LcContainer from '@/components/LcContainer';
import LcHeader from '@/components/LcHeader';
import QuotesIcon from '@/components/QuotesIcon';
import { FAVORITE_PROVIDER, LEAD_CONNECT_ACTION_RECORD } from '@/components/request/GQL';

import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import CaregiverDrawer from '@/components/shared/CaregiverDrawer/CaregiverDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.care?.grey[50],
    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.care?.white,
    },
  },
  shortlistDrawerInfo: {
    margin: `0px 0px ${theme.spacing(3)}px`,
    [theme.breakpoints.up('md')]: {
      margin: `0px  ${theme.spacing(6)}px 0px 0px`,
    },
  },
  shortlistText: {
    marginBottom: theme.spacing(1),
  },
  nextButton: {
    width: 247,
  },
  drawerPaper: {
    pointerEvents: 'auto',
    borderRadius: '24px 24px 0 0',
    boxShadow: ' 0px 0px 16px rgba(0, 0, 0, 0.15) !important',
    padding: theme.spacing(3, 4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4, 0),
      flexDirection: 'row',
    },
  },
  drawerModal: {
    pointerEvents: 'none',
  },

  card: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.care?.white,

    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(2),
      border: `1px solid ${theme.palette.care?.grey[300]}`,
    },
  },
  cardContent: {
    display: 'flex',
  },
  readMore: {
    marginLeft: theme.spacing(2),
    pointerEvents: 'none',
  },
  cardHeader: {
    alignItems: 'start',
    paddingBottom: 0,
  },
  cardHeaderContent: {
    [theme.breakpoints.up('md')]: {
      alignSelf: 'center',
    },
  },
  text: {
    [theme.breakpoints.up('md')]: {
      // responsive font sizes; On desktop should look like body2
      ...theme.typography.body2,
    },
  },
  skipLink: {
    textAlign: 'center',
    cursor: 'pointer',
    padding: theme.spacing(4, 0),
    display: 'block',
    color: theme.palette.care?.grey[600],
    textDecoration: 'underline',

    '&:hover, &:focus': {
      color: theme.palette.care?.grey[600],
    },
  },
  favoriteIcon: {
    padding: theme.spacing(0.5),
  },
}));

const CaregiverProfile = () => {
  const router = useRouter();
  const theme = useTheme();
  const classes = useStyles();
  const apolloClient = useApolloClient();
  const dispatch = useAppDispatch();
  const { memberId } = useFlowState();
  const isDesktopOrUp = useMediaQuery(theme.breakpoints.up('md'));
  const {
    caregiversNearbySearchRadius,
    leadAndConnect: {
      acceptedProviders,
      initialProviderSeen,
      maxDistanceFromSeeker,
      actionedProviders,
    },
    jobPost: { zip, typeOfCare: desiredTypeOfCare, rate },
    helpTypes: requestedServices,
  } = useSeekerState();

  const { flags } = useFeatureFlags();
  const leadConnectBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_PROVIDER_NETWORK]?.variationIndex;
  const leadConnectFifteenCaregiversBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_FIFTEEN_CAREGIVERS]?.variationIndex;
  const leadConnectRecapScreen = flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_RECAP_SCREEN];
  const goToRecap = leadConnectRecapScreen?.variationIndex === 0;
  const actionRecordBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_ACTION_RECORD_MUTATION]?.variationIndex;
  const recordAction = actionRecordBucket === 1;

  const caregiverNoun = acceptedProviders.length === 1 ? 'caregiver' : 'caregivers';

  const [caregiverProfiles, setCaregiverProfiles] = useState<SeniorCareProviderProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number | undefined>(undefined);
  const [selectedCaregivers, setSelectedCaregivers] = useState<any>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const openNextDrawer = acceptedProviders.length > 0;
  const [step = ''] = (router.query.param as string[]) || [];
  const seoProfileId = (router.query.seoProfileId as string) ?? '';
  const handleViewAllParams = {
    leadConnectBucket,
    zip,
    caregiversNearbySearchRadius,
    isDesktop: isDesktopOrUp,
  };
  const evaluateCta = 'lead and connect - evaluate caregivers';

  const updateMatchingIndex = () => {
    const matchingIndex = findMatchingIndex(step, caregiverProfiles);

    if (matchingIndex >= 0) {
      logScreenViewed(
        'caregiverProfileListViewCard',
        memberId,
        caregiverProfiles.length,
        matchingIndex
      );
      setCurrentProfileIndex(matchingIndex);
    }
  };

  const [getTopCaregiver, { data, error: queryError }] = useLazyQuery<
    getTopCaregivers,
    getTopCaregiversVariables
  >(GET_TOP_CAREGIVERS);

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.LEAD_CONNECT_RECAP_SCREEN,
      leadConnectRecapScreen
    );
  }, []);

  useEffect(() => {
    performInitialActions(
      initialProviderSeen,
      dispatch,
      zip,
      rate,
      requestedServices,
      leadConnectBucket,
      getTopCaregiver,
      maxDistanceFromSeeker,
      seoProfileId,
      undefined,
      leadConnectFifteenCaregiversBucket
    );
  }, []);

  useEffect(() => {
    if (step === LEAD_CONNECT_ROUTING_STEP) {
      if (acceptedProviders.length > 0) {
        // Redirect to skip for now if we are on the routing step
        // and caregivers have been previously saved
        router.push(SEEKER_LEAD_CONNECT_ROUTES.SKIP_FOR_NOW);
      }
    } else if (step) {
      updateMatchingIndex();
    }
  }, [step]);

  useEffect(() => {
    if (caregiverProfiles.length === 0 && data && !queryError) {
      const resultCount = populateCaregiverProfiles(
        data,
        requestedServices,
        desiredTypeOfCare,
        setCaregiverProfiles,
        handleViewAllParams
      );
      logScreenViewed('caregiverProfileListView', memberId, resultCount, undefined);
    }
  }, [data, queryError]);

  useEffect(() => {
    if (caregiverProfiles.length !== 0) {
      if (step !== '' && step !== LEAD_CONNECT_ROUTING_STEP) {
        updateMatchingIndex();
      }
    }
  }, [caregiverProfiles]);

  useEffect(() => {
    const newSelectedCaregivers = acceptedProviders.reduce((acc: any, currentAcceptedCaregiver) => {
      acc[currentAcceptedCaregiver.memberId] = true;
      return acc;
    }, {});

    setSelectedCaregivers(newSelectedCaregivers);
  }, [acceptedProviders]);

  if (queryError) {
    const errorMsg = 'LeadAndConnectGetTopCaregiversFailed';
    logger.error({ event: errorMsg, graphQLError: queryError.message });
    captureException(errorMsg);
    handleViewAllCaregivers(handleViewAllParams);
  }

  if (!caregiverProfiles || caregiverProfiles.length === 0 || step === LEAD_CONNECT_ROUTING_STEP) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const currentProvider: SeniorCareProviderProfile | undefined =
    typeof currentProfileIndex !== 'undefined' ? caregiverProfiles[currentProfileIndex] : undefined;

  const providerIdExistsinActioned = (providerId: string, targetActionedProviders: string[]) => {
    const matchingIndex = targetActionedProviders.findIndex((actionedProviderId) => {
      return actionedProviderId === providerId;
    });
    return matchingIndex !== -1;
  };

  const addToActionedProviders = (providerId: string) => {
    let updatedActionedProviders = [providerId];
    if (actionedProviders) {
      if (!providerIdExistsinActioned(providerId, actionedProviders)) {
        updatedActionedProviders = actionedProviders.concat([providerId]);
      } else {
        updatedActionedProviders = actionedProviders;
      }
    }

    dispatch({
      type: 'setActionedProviders',
      actionedProviders: updatedActionedProviders,
    });

    return updatedActionedProviders;
  };

  const recordLeadAndConnectAction = (targetId: string, action: ActionType) => {
    if (recordAction) {
      const recordActionPromise: Promise<FetchResult<leadConnectActionRecord>> =
        apolloClient.mutate<leadConnectActionRecord, leadConnectActionRecordVariables>({
          mutation: LEAD_CONNECT_ACTION_RECORD,
          variables: {
            input: {
              action,
              actorType: ActorType.SEEKER,
              targetId,
              vertical: ServiceType.SENIOR_CARE,
            },
          },
        });

      recordActionPromise
        .then((result) => {
          if (
            result.data?.leadConnectActionRecord.__typename === 'LeadConnectActionRecordPayload'
          ) {
            logger.info({
              event: 'leadConnectActionRecordMutationSuccess',
              message: 'Successfully recorded impression!',
            });
          } else {
            logger.error({ event: 'leadConnectActionRecordMutationError' });
          }
        })
        .catch((error) => {
          logger.error({ event: 'leadConnectActionRecordFailed', message: error.message });
        });
    }
  };

  const routeToSelectedProvider = async (selectedProviderMemberId: string) => {
    const selectedProviderIndex = findMatchingIndex(selectedProviderMemberId, caregiverProfiles);
    if (selectedProviderIndex >= 0) {
      const selectedProvider = caregiverProfiles[selectedProviderIndex];
      await router.push(generateCaregiverPath(selectedProvider), undefined, { scroll: false });
      await recordLeadAndConnectAction(selectedProvider.memberUUID, ActionType.SHOWN);
    }
  };

  const routeToNoneProvider = () => {
    router.push(SEEKER_LEAD_CONNECT_ROUTES.CAREGIVER_PROFILE, undefined, { scroll: false });
  };

  const routeToNextProvider = async (justActedUponProviderId: string) => {
    const updatedActionedProviders = addToActionedProviders(justActedUponProviderId);

    const moreProvidersLeftToShow = updatedActionedProviders.length < caregiverProfiles.length;

    if (moreProvidersLeftToShow && typeof currentProfileIndex !== 'undefined') {
      let i = 0;
      let nextProfileFound = false;
      let selectedProviderMemberId;
      while (i < caregiverProfiles.length && !nextProfileFound) {
        // we use modulo to wrap around back to 0
        const nextProfileIndex = (currentProfileIndex + i) % caregiverProfiles.length;
        selectedProviderMemberId = caregiverProfiles[nextProfileIndex].memberId;
        if (!providerIdExistsinActioned(selectedProviderMemberId, updatedActionedProviders)) {
          nextProfileFound = true;
        }
        i += 1;
      }

      if (nextProfileFound && typeof selectedProviderMemberId !== 'undefined') {
        await routeToSelectedProvider(selectedProviderMemberId);
      } else {
        routeToNoneProvider();
      }
    } else {
      routeToNoneProvider();
    }
  };

  const handlePassOrExit = async (passAction: boolean, skipLoggingInteraction?: boolean) => {
    if (!skipLoggingInteraction) {
      logInteraction(
        'caregiverProfileListViewCard',
        passAction ? 'pass' : 'exit',
        currentProfileIndex,
        memberId,
        undefined,
        undefined,
        currentProvider?.memberId
      );
    }
    if (passAction && currentProvider) {
      await recordLeadAndConnectAction(currentProvider.memberUUID, ActionType.PASS);
      await routeToNextProvider(currentProvider.memberId);
    } else {
      routeToNoneProvider();
    }
  };

  const addToList = (
    providerToAdd: MinimalProviderProfile,
    skipLoggingInteraction: boolean = false
  ) => {
    if (!skipLoggingInteraction) {
      logInteraction(
        'caregiverProfileListViewCard',
        'add to list',
        currentProfileIndex,
        memberId,
        undefined,
        undefined,
        currentProvider?.memberId
      );
    }

    const alreadySaved: boolean = acceptedProviders.some(
      (acceptedProvider: any) => acceptedProvider.memberId === providerToAdd.memberId
    );

    let modifiedProviders = acceptedProviders;
    if (!alreadySaved) {
      modifiedProviders = [
        ...acceptedProviders,
        {
          memberId: providerToAdd.memberId,
          memberUUID: providerToAdd.memberUUID,
          imgSource: providerToAdd.imgSource,
          displayName: providerToAdd.displayName,
          averageRating: providerToAdd.averageRating,
          numberReviews: providerToAdd.numberReviews,
          yearsOfExperience: providerToAdd.yearsOfExperience,
          signUpDate: providerToAdd.signUpDate,
        },
      ];
      dispatch({
        type: 'setAcceptedProviders',
        acceptedProviders: modifiedProviders,
      });
      const resultPromise: Promise<FetchResult<favoriteProvider>> = apolloClient.mutate<
        favoriteProvider,
        favoriteProviderVariables
      >({
        mutation: FAVORITE_PROVIDER,
        variables: {
          input: {
            memberId: providerToAdd.memberId,
            serviceType: ServiceType.SENIOR_CARE,
          },
        },
      });
      resultPromise.catch((error) => {
        logger.error({ event: 'favoriteProviderFailed', message: error.message });
      });
    }
  };

  const handleAddToListClick = async (
    providerToAdd: MinimalProviderProfile,
    skipLoggingInteraction: boolean = false
  ) => {
    await addToList(providerToAdd, skipLoggingInteraction);
    await recordLeadAndConnectAction(providerToAdd.memberUUID, ActionType.ADD);
    await routeToNextProvider(providerToAdd.memberId);
  };

  const removeCaregiverFromAccepted = (caregiverToUpdate: MinimalProviderProfile) => {
    const modifiedProviders = acceptedProviders.filter(
      (provider) => provider.memberId !== caregiverToUpdate.memberId
    );

    dispatch({
      type: 'setAcceptedProviders',
      acceptedProviders: modifiedProviders,
    });
  };

  const handleRemoveCaregiverFromAcceptedClick = (caregiverToUpdate: MinimalProviderProfile) => {
    logInteraction(
      'caregiverProfileListViewCard',
      'remove from list',
      currentProfileIndex,
      memberId,
      evaluateCta,
      acceptedProviders.length - 1,
      currentProvider?.memberId
    );
    removeCaregiverFromAccepted(caregiverToUpdate);
  };

  const updateSelectedCaregivers = (caregiverToUpdate: MinimalProviderProfile) => {
    const isPreviouslyChecked = Boolean(selectedCaregivers[caregiverToUpdate.memberId]);

    if (isPreviouslyChecked) {
      logInteraction(
        'caregiverProfileListViewCard',
        'uncheck',
        currentProfileIndex,
        memberId,
        evaluateCta,
        acceptedProviders.length - 1,
        currentProvider?.memberId
      );
      removeCaregiverFromAccepted(caregiverToUpdate);
      recordLeadAndConnectAction(caregiverToUpdate.memberUUID, ActionType.PASS);
    } else {
      addToActionedProviders(caregiverToUpdate.memberId);
      logInteraction(
        'caregiverProfileListViewCard',
        'check',
        currentProfileIndex,
        memberId,
        evaluateCta,
        acceptedProviders.length + 1,
        currentProvider?.memberId
      );
      addToList(caregiverToUpdate, true);
      recordLeadAndConnectAction(caregiverToUpdate.memberUUID, ActionType.ADD);
    }
  };

  return (
    <div className={classes.root}>
      <LcHeader
        isVisible
        header="Here's a personalized list of caregivers based on your needs"
        subheader="Shortlist the ones you like best"
      />
      <LcContainer>
        {currentProvider && (
          <CaregiverDrawer
            currentProvider={currentProvider}
            acceptedProviders={acceptedProviders}
            removeCaregiverFromAccepted={handleRemoveCaregiverFromAcceptedClick}
            onPass={async (skipLoggingInteraction: boolean) => {
              await handlePassOrExit(true, skipLoggingInteraction);
            }}
            onAddToList={handleAddToListClick}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            onImplicitExit={async () => {
              await handlePassOrExit(false);
            }}
          />
        )}
        {caregiverProfiles.map((caregiverProfile) => (
          <Card
            data-testid="caregiverCard"
            key={caregiverProfile.memberId}
            className={classes.card}
            careVariant="contrast"
            onClick={async () => {
              await routeToSelectedProvider(caregiverProfile.memberId);
              if (caregiverProfile.memberId === currentProvider?.memberId) {
                setOpenDrawer(true);
              }
            }}>
            <CardHeader
              className={classes.cardHeader}
              classes={{ content: classes.cardHeaderContent }}
              avatar={
                <ProfileAvatar
                  alt={caregiverProfile.displayName}
                  src={caregiverProfile.imgSource}
                  variant="rounded"
                  size="xLarge"
                />
              }
              action={
                <Checkbox
                  checked={Object.prototype.hasOwnProperty.call(
                    selectedCaregivers,
                    caregiverProfile.memberId
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSelectedCaregivers(caregiverProfile);
                  }}
                />
              }
              title={
                <>
                  <Typography variant={isDesktopOrUp ? 'h2' : 'h3'}>
                    {caregiverProfile.displayName}
                  </Typography>
                  {caregiverProfile.averageRating ? (
                    <div>
                      <Rating size="small" readOnly value={caregiverProfile.averageRating} />
                      <Typography careVariant="info1">
                        ({caregiverProfile.numberReviews})
                      </Typography>
                    </div>
                  ) : (
                    <Box marginBottom={1} />
                  )}
                </>
              }
              subheader={
                <Typography className={classes.text} careVariant="body3">
                  <>
                    <span>{`${caregiverProfile.cityAndState} • ${caregiverProfile.distanceFromSeeker} mi away`}</span>
                    {isDesktopOrUp ? ' • ' : <br />}
                    <span>{`${caregiverProfile.minRate}-${caregiverProfile.maxRate}/hr • ${caregiverProfile.yearsOfExperience} yrs exp.`}</span>
                  </>
                </Typography>
              }
            />
            <CardContent className={classes.cardContent}>
              <QuotesIcon />
              <ReadMore
                careVariant="body3"
                showLessButton
                charLimit={isDesktopOrUp ? 120 : 80}
                value={caregiverProfile.biography}
                className={clsx(classes.text, classes.readMore)}
              />
            </CardContent>
          </Card>
        ))}
        <Drawer
          className={classes.drawerModal}
          classes={{ paper: classes.drawerPaper }}
          open={openNextDrawer && step === '' && !openDrawer}
          anchor="bottom"
          ModalProps={{
            hideBackdrop: true,
            disableScrollLock: true,
            disableAutoFocus: true,
          }}>
          <div className={classes.shortlistDrawerInfo}>
            <Typography variant="h2" className={classes.shortlistText}>
              You&apos;ve shortlisted {acceptedProviders.length} {caregiverNoun}
            </Typography>
            <Typography variant="body2">Add more or continue to evaluate them.</Typography>
          </div>
          <div>
            <Button
              color="primary"
              variant="contained"
              size={isDesktopOrUp ? 'large' : 'medium'}
              className={classes.nextButton}
              onClick={() => {
                logInteraction(
                  'caregiverProfileListView',
                  'next',
                  undefined,
                  memberId,
                  evaluateCta,
                  acceptedProviders.length,
                  currentProvider?.memberId
                );
                if (goToRecap) {
                  router.push(SEEKER_LEAD_CONNECT_ROUTES.RECAP);
                } else {
                  router.push(SEEKER_LEAD_CONNECT_ROUTES.UPGRADE_OR_SKIP);
                }
              }}>
              Next
            </Button>
          </div>
        </Drawer>
        <Link
          careVariant="link2"
          className={classes.skipLink}
          onClick={() => {
            AnalyticsHelper.logEvent({
              name: 'CTA Interacted',
              data: {
                screen_name: 'caregiverProfileListView',
                cta_link_type: evaluateCta,
                num_of_caregivers: NUMBER_OF_LEAD_CONNECT_RESULTS(
                  leadConnectFifteenCaregiversBucket === 1
                ),
                user_id: memberId,
                cta_clicked: 'skip and view all',
              },
            });

            logInteraction(
              'caregiverProfileListView',
              'skip and view all',
              undefined,
              memberId,
              evaluateCta,
              acceptedProviders.length,
              currentProvider?.memberId
            );
            handleViewAllCaregivers(handleViewAllParams);
          }}>
          Skip and view all
        </Link>
      </LcContainer>
    </div>
  );
};

CaregiverProfile.Layout = FullWidthLayout;
CaregiverProfile.usePageTransition = false;

export default CaregiverProfile;
