import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Drawer, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { Link, Typography } from '@care/react-component-lib';
import { LEAD_CONNECT_ROUTING_STEP, SEEKER_CC_LEAD_CONNECT_ROUTES } from '@/constants';
import { useAppDispatch } from '@/components/AppState';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import LcContainer from '@/components/LcContainer';
import LcHeader from '@/components/LcHeader';
import ProfileCard from '@/components/pages/seeker/lc/profile-card';
import OverlaySpinner from '@/components/OverlaySpinner';

import { ProviderProfile } from '@/components/pages/seeker/lc/types';
import CaregiverDrawer from '@/components/shared/CaregiverDrawer/CaregiverDrawer';

import { findMatchingIndex, generateCaregiverPath } from './caregiverProfileHelper';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: theme.palette.care?.grey[50],

    [theme.breakpoints.up('md')]: {
      backgroundColor: theme.palette.care?.white,
    },
  },
  shortlistDrawer: {
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
  drawer: {
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
}));

interface ProviderListPageProps {
  headerText: string;
  subheaderText: string;
  providerType: string;
  providerProfiles: ProviderProfile[];
  favoritedProviderIds: string[];
  reviewedProvidersIds: string[] | undefined;
  ctaInteractionLogger: Function;
  updateFavoritedProviderIds: (id: string) => void;
  onNextClick: () => void;
  onSkipClick: () => void;
}

const getProviderPosition = (
  providersArr: ProviderProfile[],
  providerId: string
): number | undefined => {
  const isCorrectProfile = (profile: ProviderProfile) => {
    return profile.memberId === providerId;
  };
  const position = providersArr.findIndex(isCorrectProfile) + 1;

  return position > 0 ? position : undefined;
};

const ProviderListPage = ({
  headerText,
  subheaderText,
  providerType,
  providerProfiles,
  favoritedProviderIds,
  reviewedProvidersIds,
  updateFavoritedProviderIds,
  onNextClick,
  onSkipClick,
  ctaInteractionLogger,
}: ProviderListPageProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDesktopOrUp = useMediaQuery(theme.breakpoints.up('md'));

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number | undefined>(undefined);
  const [step = ''] = (router.query.param as string[]) || [];
  const [currentCaregiver, setCurrentCaregiver] = useState<ProviderProfile | undefined>(
    typeof currentProfileIndex !== 'undefined' ? providerProfiles[currentProfileIndex] : undefined
  );

  const updateMatchingIndex = () => {
    const matchingIndex = findMatchingIndex(step, providerProfiles);
    if (matchingIndex >= 0) {
      setCurrentProfileIndex(matchingIndex);
      setCurrentCaregiver(providerProfiles[matchingIndex]);
    }
  };

  useEffect(() => {
    if (step === LEAD_CONNECT_ROUTING_STEP) {
      if (favoritedProviderIds.length > 0) {
        // Redirect to skip for now if we are on the routing step
        // and caregivers have been previously saved

        router.push(SEEKER_CC_LEAD_CONNECT_ROUTES.SKIP_FOR_NOW);
      }
    } else if (step) {
      updateMatchingIndex();
    } else if (step === '') {
      // empty step - initial view
      // Amplitude event should be here
    }
  }, [step]);

  useEffect(() => {
    if (providerProfiles.length !== 0) {
      if (step !== '' && step !== LEAD_CONNECT_ROUTING_STEP) {
        updateMatchingIndex();
      }
    }
  }, [providerProfiles]);

  if (!providerProfiles || providerProfiles.length === 0 || step === LEAD_CONNECT_ROUTING_STEP) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const routeToNoneProvider = () => {
    router.push(SEEKER_CC_LEAD_CONNECT_ROUTES.CAREGIVER_LIST);
  };

  const routeToSelectedProvider = async (selectedProviderMemberId: string) => {
    const selectedProviderIndex = findMatchingIndex(selectedProviderMemberId, providerProfiles);

    if (selectedProviderIndex >= 0) {
      const selectedProvider = providerProfiles[selectedProviderIndex];
      const nextProfileRoute = generateCaregiverPath(selectedProvider);

      await router.push(nextProfileRoute);
    }
  };

  const addToReviewedProviders = (providerId: string) => {
    let updatedReviewedProviders = [providerId];
    if (reviewedProvidersIds) {
      if (!reviewedProvidersIds.includes(providerId)) {
        updatedReviewedProviders = reviewedProvidersIds.concat([providerId]);
      } else {
        updatedReviewedProviders = reviewedProvidersIds;
      }
    }

    dispatch({
      type: 'cc_setLCReviewedProviders',
      lcReviewedProvidersIds: updatedReviewedProviders,
    });

    return updatedReviewedProviders;
  };

  const routeToNextProvider = async (justReviewedProviderId: string) => {
    const updatedReviewedProviders = addToReviewedProviders(justReviewedProviderId);
    const moreProvidersLeftToShow = updatedReviewedProviders.length < providerProfiles.length;

    if (moreProvidersLeftToShow && typeof currentProfileIndex !== 'undefined') {
      let i = 0;
      let nextProfileFound = false;
      let selectedProviderMemberId;

      while (i < providerProfiles.length && !nextProfileFound) {
        // we use modulo to wrap around back to 0
        const nextProfileIndex = (currentProfileIndex + i) % providerProfiles.length;
        selectedProviderMemberId = providerProfiles[nextProfileIndex].memberId;
        nextProfileFound = !updatedReviewedProviders.includes(selectedProviderMemberId.toString());
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

  const handlePassOrExit = async (passAction: boolean) => {
    if (passAction && currentCaregiver) {
      await routeToNextProvider(currentCaregiver.memberId);
    } else {
      routeToNoneProvider();
    }
  };

  return (
    <div className={classes.page}>
      <LcHeader isVisible header={headerText} subheader={subheaderText} />
      <LcContainer>
        {providerProfiles.map((providerProfile) => (
          <ProfileCard
            isDesktopOrUp={isDesktopOrUp}
            key={providerProfile.memberId}
            profile={providerProfile}
            showRates
            isFavorited={favoritedProviderIds.includes(providerProfile.memberId ?? '')}
            onFavorite={() => {
              updateFavoritedProviderIds(providerProfile.memberId ?? '');
              addToReviewedProviders(providerProfile.memberId);

              ctaInteractionLogger(
                'Caregiver Profile - List View',
                'Profile like',
                favoritedProviderIds.length,
                providerProfile.memberId,
                getProviderPosition(providerProfiles, providerProfile.memberId)
              );
            }}
            onClick={async () => {
              await routeToSelectedProvider(providerProfile.memberId);
              if (providerProfile.memberId === currentCaregiver?.memberId) {
                setIsProfileOpen(true);
              }
            }}
          />
        ))}
        {currentCaregiver && (
          <CaregiverDrawer
            currentProvider={currentCaregiver}
            acceptedProvidersIds={favoritedProviderIds}
            onPass={async () => {
              ctaInteractionLogger(
                'Caregiver Profile - Card',
                'Skip',
                favoritedProviderIds.length,
                currentCaregiver.memberId,
                getProviderPosition(providerProfiles, currentCaregiver.memberId)
              );

              await handlePassOrExit(true);
            }}
            onAddToList={async () => {
              ctaInteractionLogger(
                'Caregiver Profile - Card',
                'Like',
                favoritedProviderIds.length,
                currentCaregiver.memberId,
                getProviderPosition(providerProfiles, currentCaregiver.memberId)
              );

              updateFavoritedProviderIds(currentCaregiver.memberId);
              await routeToNextProvider(currentCaregiver.memberId);
            }}
            removeCaregiverFromAccepted={async () => {
              ctaInteractionLogger(
                'Caregiver Profile - Card',
                'Dislike',
                favoritedProviderIds.length,
                currentCaregiver.memberId,
                getProviderPosition(providerProfiles, currentCaregiver.memberId)
              );

              updateFavoritedProviderIds(currentCaregiver.memberId);
            }}
            openDrawer={isProfileOpen}
            setOpenDrawer={setIsProfileOpen}
            onImplicitExit={async () => {
              ctaInteractionLogger(
                'Caregiver Profile - Card',
                'Close card',
                favoritedProviderIds.length,
                currentCaregiver.memberId,
                getProviderPosition(providerProfiles, currentCaregiver.memberId)
              );

              await handlePassOrExit(false);
            }}
          />
        )}
        <Drawer
          className={classes.drawerModal}
          classes={{ paper: classes.drawer }}
          open={favoritedProviderIds.length > 0 && step === '' && !isProfileOpen}
          anchor="bottom"
          ModalProps={{
            hideBackdrop: true,
            disableScrollLock: true,
            disableAutoFocus: true,
          }}>
          <div className={classes.shortlistDrawer}>
            <Typography variant="h2" className={classes.shortlistText}>
              {`You've favorited ${favoritedProviderIds.length} ${
                favoritedProviderIds.length === 1 ? providerType : `${providerType}s`
              }`}
            </Typography>
            <Typography variant="body2">
              Favorite more or click &quot;next&quot; to send them
            </Typography>
            <Typography variant="body2">a message.</Typography>
          </div>
          <div>
            <Button
              color="primary"
              variant="contained"
              size={isDesktopOrUp ? 'large' : 'medium'}
              className={classes.nextButton}
              onClick={onNextClick}>
              Next
            </Button>
          </div>
        </Drawer>
        <Link careVariant="link2" className={classes.skipLink} onClick={onSkipClick}>
          Skip and view all
        </Link>
      </LcContainer>
    </div>
  );
};

ProviderListPage.Layout = FullWidthLayout;
ProviderListPage.usePageTransition = false;

export default ProviderListPage;
