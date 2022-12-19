import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import { createPortal } from 'react-dom';

import { Button, makeStyles } from '@material-ui/core';
import { ProfileAvatar, Typography } from '@care/react-component-lib';
import {
  Icon24UtilityChevronSmall,
  Icon24UtilityClose,
  Icon24UtilityMenu,
  IconLogoCarelogo,
} from '@care/react-icons';

import { getCaregiver_getCaregiver_member as MemberDetails } from '@/__generated__/getCaregiver';

const { publicRuntimeConfig } = getConfig();

const { CZEN_GENERAL } = publicRuntimeConfig;

type StylesProps = {
  isMenuOpen: boolean;
};

const useStyles = makeStyles((theme) => ({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: theme.spacing(13),
    width: '100%',
    padding: theme.spacing(3, 4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.care.grey[300]}`,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      height: theme.spacing(7),
    },
  },
  logo: {
    height: theme.spacing(5),
    width: theme.spacing(18),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(4),
      width: 116,
    },
  },
  hamburgerIcon: {
    marginRight: theme.spacing(2),
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },
  hamburgerMenuContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarMenuButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    outline: 'none',
    '-webkit-tap-highlight-color': 'transparent',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  chevronIcon: {
    marginLeft: 4,
  },
  mobileMenu: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    top: 80,
    right: 80,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: theme.spacing(40.75),
    padding: theme.spacing(3, 4),
    minHeight: 325,
    zIndex: theme.zIndex.drawer,
    backgroundColor: theme.palette.care.white,
    borderRadius: `0 0 ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.up('lg')]: {
      display: ({ isMenuOpen }: StylesProps) => (isMenuOpen ? 'flex' : 'none'),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(6, 7, 5),
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100%',
      maxWidth: 375,
      borderRadius: 0,
      transform: ({ isMenuOpen }: StylesProps) => !isMenuOpen && 'translateX(-101%)',
      willChange: 'transform',
      transition: 'transform .15s cubic-bezier(0,0,.3,1)',
    },
  },
  mobileMenuCloseIcon: {
    display: 'none',
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
  profileName: {
    margin: theme.spacing(1, 0, 6),
  },
  menuItemsContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    zIndex: 9999,
  },
  menuHeader: {
    paddingBottom: theme.spacing(1),
    marginBottom: 6,
    borderBottom: `1px solid ${theme.palette.care.navy[800]}`,
  },
  menuLink: {
    padding: '11px 0',
    color: '#172C42',
    width: '100%',
    display: 'block',
    marginBottom: theme.spacing(3),
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.care.navy[900],
      background: theme.palette.care.grey[200],
    },
  },
}));

type FreeGatedProviderHeaderProps = {
  memberDetails: MemberDetails | null;
  logoutHandler: () => void;
};

const FreeGatedProviderHeader = ({
  memberDetails,
  logoutHandler,
}: FreeGatedProviderHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nextRoot = document.getElementById('__next');

  const classes = useStyles({ isMenuOpen });

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenuVisibilityHandler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const avatarButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    toggleMenuVisibilityHandler();
  };

  const dismissListener = (event: Event) => {
    if (!menuRef?.current?.contains(event.target as Node)) {
      event.stopPropagation();

      toggleMenuVisibilityHandler();
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', dismissListener, true);
    }

    return () => document.removeEventListener('click', dismissListener, true);
  }, [isMenuOpen]);

  if (nextRoot) {
    return createPortal(
      <>
        <div className={classes.header}>
          <div className={classes.hamburgerMenuContainer}>
            <Icon24UtilityMenu
              className={classes.hamburgerIcon}
              onClick={toggleMenuVisibilityHandler}
            />
            <IconLogoCarelogo className={classes.logo} />
          </div>
          <button
            type="button"
            className={classes.avatarMenuButton}
            onClick={avatarButtonClickHandler}>
            <ProfileAvatar size="small" src={memberDetails?.imageURL || undefined} />
            <Icon24UtilityChevronSmall className={classes.chevronIcon} />
          </button>
        </div>
        <div className={classes.mobileMenu} ref={menuRef}>
          <Icon24UtilityClose
            className={classes.mobileMenuCloseIcon}
            onClick={toggleMenuVisibilityHandler}
          />
          <ProfileAvatar size="xLarge" src={memberDetails?.imageURL || undefined} />
          <Typography variant="h3" className={classes.profileName}>
            {memberDetails?.displayName}
          </Typography>
          <div className={classes.menuItemsContainer}>
            <div>
              <Typography variant="h3" className={classes.menuHeader}>
                Account
              </Typography>
              <Typography variant="body1">
                <a href={`${CZEN_GENERAL}/member/profile.do`} className={classes.menuLink}>
                  Settings & Privacy
                </a>
              </Typography>
            </div>
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              fullWidth
              data-testid="logout-button"
              onClick={logoutHandler}>
              Log out
            </Button>
          </div>
        </div>
      </>,
      nextRoot
    );
  }

  return null;
};

export default FreeGatedProviderHeader;
