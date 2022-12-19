import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useMediaQuery, useTheme, makeStyles } from '@material-ui/core';
import { Typography, Link, SideDrawer, BottomDrawer } from '@care/react-component-lib';

import { SeniorCareProviderProfile, MinimalProviderProfile } from '@/types/seeker';

import SkipOrSaveButton from '@/components/SkipOrSaveButton';
import { Icon24UtilityCheckmarkLarge, Icon24UtilityFavoriteOn } from '@care/react-icons';
import CaregiverTransition from '@/components/shared/CaregiverTransition/CaregiverTransition';
import Caregiver from '@/components/shared/CaregiverDrawer/Caregiver';
import { ProviderProfile } from '@/components/pages/seeker/lc/types';
import { isSCProviderProfile } from './utils';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: `${theme.spacing(1)}px 0 0 !important`,
    height: '85vh',
    position: 'absolute',
    '& > div:first-child': {
      flex: '0 0 auto',
    },
    [theme.breakpoints.up('md')]: {
      height: '100vh',
    },
  },
  container: {
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'calc(100% - 30px)',
  },
  content: {
    padding: theme.spacing(0, 3, 3),
    flex: '1 1 auto',
    overflowY: 'auto',
  },
  actions: {
    padding: 0,
    borderTop: `1px solid ${theme.palette?.care?.grey[400]}`,
  },
  removeLink: {
    textAlign: 'center',
    cursor: 'pointer',
    display: 'block',
    color: theme.palette.care?.grey[600],
    textDecoration: 'underline',

    '&:hover, &:focus': {
      color: theme.palette.care?.grey[600],
    },
  },
  providerAlreadyExistsWrapper: {
    padding: theme.spacing(3, 0),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  providerExistsTextAndIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  providerAlreadyExistsText: {
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h3,
    },
  },
  iconCheckMark: {
    '& path': {
      fill: '#fff',
    },
    width: 12,
    height: 12,
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    backgroundColor: theme.palette?.care?.green[700],
  },
  iconContainerHeart: {
    backgroundColor: theme.palette?.care?.red[500],
  },
}));

interface ActionsProps {
  classes: any;
  existsOnList: boolean;
  currentProvider: SeniorCareProviderProfile | ProviderProfile;
  onRemoveFromAccepted: Function;
  onSave: () => void;
  onSkip: Function;
  showToastMessage: boolean;
}

const Actions = (props: ActionsProps) => {
  const {
    classes,
    existsOnList,
    currentProvider,
    onRemoveFromAccepted,
    onSave,
    onSkip,
    showToastMessage,
  } = props;
  const isSCProfile = isSCProviderProfile(currentProvider);

  return (
    <>
      {existsOnList ? (
        <div className={classes.providerAlreadyExistsWrapper}>
          <div className={classes.providerExistsTextAndIconWrapper}>
            <div
              className={clsx(classes.iconContainer, !isSCProfile && classes.iconContainerHeart)}>
              {isSCProfile && <Icon24UtilityCheckmarkLarge className={classes.iconCheckMark} />}
              {!isSCProfile && <Icon24UtilityFavoriteOn className={classes.iconCheckMark} />}
            </div>

            <Typography variant="h4" className={classes.providerAlreadyExistsText}>
              {!isSCProfile
                ? `You’ve favorited ${(currentProvider as ProviderProfile).firstName}`
                : `${currentProvider.displayName} is on your shortlist`}
            </Typography>
          </div>
          <Link
            careVariant="link3"
            className={classes.removeLink}
            onClick={() => {
              onRemoveFromAccepted();
            }}>
            {!isSCProfile ? 'Unlike' : 'Remove from list'}
          </Link>
        </div>
      ) : (
        <SkipOrSaveButton
          isDrawerView
          passButtonText={isSCProfile ? 'Pass' : 'Skip'}
          onSave={onSave}
          onSkip={() => {
            onSkip(false);
          }}
          showToastMessage={showToastMessage}
          saveButtonText={!isSCProfile ? 'Like' : 'Add to list'}
          heartSaveButtonIcon={!isSCProfile}
        />
      )}
    </>
  );
};

interface GeneralCareiverDrawerProps {
  onPass: Function;
  onAddToList: Function;
  removeCaregiverFromAccepted: Function;
  openDrawer: boolean;
  setOpenDrawer: Function;
  // explicit exit is `onPass`, for example clicking on the "Skip" button
  // implicit exit is clicking outside the drawer or on the x icon
  onImplicitExit: Function;
}

interface SCCaregiverDrawerProps extends GeneralCareiverDrawerProps {
  currentProvider: SeniorCareProviderProfile;
  acceptedProviders: MinimalProviderProfile[];
}

interface ProviderDrawerProps extends GeneralCareiverDrawerProps {
  currentProvider: ProviderProfile;
  acceptedProvidersIds: string[];
}

const CaregiverDrawer = (props: ProviderDrawerProps | SCCaregiverDrawerProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktopOrUp = useMediaQuery(theme.breakpoints.up('md'));
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [leaveBackdropOpen, setLeaveBackdropOpen] = useState(false);
  const transitionDuration = theme.transitions.duration.standard;
  const callbackTransitionDuration = transitionDuration - 50;

  const acceptedProviders: any = [];
  const acceptedProvidersIds: string[] = [];

  const {
    onPass,
    onAddToList,
    currentProvider,
    removeCaregiverFromAccepted,
    openDrawer,
    setOpenDrawer,
    onImplicitExit,
  } = props;

  if (isSCProviderProfile(currentProvider)) {
    acceptedProviders.push(...(props as SCCaregiverDrawerProps).acceptedProviders);
  } else {
    acceptedProvidersIds.push(...(props as ProviderDrawerProps).acceptedProvidersIds);
  }

  const existedInIdsList: boolean = acceptedProvidersIds.includes(currentProvider.memberId);
  const existsOnProfilesList: boolean = acceptedProviders.some(
    (acceptedProvider: any) => acceptedProvider.memberId === currentProvider.memberId
  );
  const existsOnList: boolean = existedInIdsList || existsOnProfilesList;

  const onSave = () => {
    setShowToastMessage(true);
    setTimeout(() => {
      setShowToastMessage(false);
      setOpenDrawer(false);
      setTimeout(() => {
        onAddToList(currentProvider);
      }, callbackTransitionDuration);
    }, 1000);
  };

  const onSkip = (skipLoggingInteraction: boolean) => {
    setOpenDrawer(false);
    setTimeout(() => {
      onPass(skipLoggingInteraction);
    }, callbackTransitionDuration);
  };

  const onImplicitClose = () => {
    setOpenDrawer(false);
    setLeaveBackdropOpen(false);
    onImplicitExit();
  };

  const onRemoveFromAccepted = () => {
    removeCaregiverFromAccepted(currentProvider);
    onSkip(true);
  };

  useEffect(() => {
    if (currentProvider) {
      setOpenDrawer(true);
    }
  }, [currentProvider]);

  useEffect(() => {
    if (openDrawer) {
      setLeaveBackdropOpen(true);
    }
  }, [openDrawer]);

  const onModalClose = () => onImplicitClose();

  return (
    <>
      {isDesktopOrUp ? (
        <SideDrawer
          open={openDrawer}
          onClose={onImplicitClose}
          anchor="right"
          classes={{ paper: classes.paper }}
          transitionDuration={transitionDuration}
          ModalProps={{
            onClose: onModalClose,
            BackdropProps: {
              open: leaveBackdropOpen,
            },
            keepMounted: true,
          }}
          // @ts-ignore
          TransitionComponent={CaregiverTransition}>
          <div className={classes.container}>
            <div className={classes.content}>
              <Caregiver isDrawerView currentProvider={currentProvider} />
            </div>
            <div className={classes.actions}>
              <Actions
                classes={classes}
                existsOnList={existsOnList}
                currentProvider={currentProvider}
                onRemoveFromAccepted={onRemoveFromAccepted}
                onSave={onSave}
                onSkip={onSkip}
                showToastMessage={showToastMessage}
              />
            </div>
          </div>
        </SideDrawer>
      ) : (
        <BottomDrawer
          open={openDrawer}
          onClose={onImplicitClose}
          classes={{ paper: classes.paper }}
          transitionDuration={transitionDuration}
          ModalProps={{
            onClose: onModalClose,
            BackdropProps: {
              open: leaveBackdropOpen,
            },
            keepMounted: true,
          }}>
          <div className={classes.content}>
            <Caregiver isDrawerView currentProvider={currentProvider} />
          </div>
          <div className={classes.actions}>
            <Actions
              classes={classes}
              existsOnList={existsOnList}
              currentProvider={currentProvider}
              onRemoveFromAccepted={onRemoveFromAccepted}
              onSave={onSave}
              onSkip={onSkip}
              showToastMessage={showToastMessage}
            />
          </div>
        </BottomDrawer>
      )}
    </>
  );
};

export default CaregiverDrawer;
