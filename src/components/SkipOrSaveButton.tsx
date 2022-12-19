import clsx from 'clsx';
import { CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core';
import { Banner, Typography } from '@care/react-component-lib';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import {
  Icon24UtilityCheckmarkLarge,
  Icon24UtilityClose,
  Icon24UtilityFavoriteOn,
} from '@care/react-icons';

type SkipOrSaveButtonProps = {
  onSave: () => void;
  onSkip: () => void;
  showToastMessage: boolean;
  isDrawerView?: boolean;
  saveButtonText?: string;
  passButtonText?: string;
  heartSaveButtonIcon?: boolean;
};

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      fill: '#fff',
    },
    width: 16,
    height: 16,
    [theme.breakpoints.up('md')]: {
      width: 30,
      height: 30,
    },
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px', // asked by design team to be 12px
    [theme.breakpoints.up('md')]: {
      width: 56,
      height: 56,
      marginRight: '16px', // asked by design team to be 16px
    },
  },
  iconBannerContainer: {
    width: 24,
    height: 24,
  },
  skipIconContainer: {
    backgroundColor: theme.palette?.care?.grey[500],
  },
  addIconContainer: {
    backgroundColor: theme.palette?.care?.green[700],
  },
  addIconContainerCustom: {
    backgroundColor: theme.palette?.care?.red[500],
  },
  root: ({ isDrawerView }: any) => ({
    margin: isDrawerView ? 0 : theme.spacing(3, 0),
    width: '100%',
    zIndex: 1,
    position: 'relative',
  }),
  container: ({ isDrawerView }: any) => ({
    display: 'flex',
    width: '100%',
    borderRadius: isDrawerView ? 0 : 16,
    boxShadow: isDrawerView ? 'none' : '0px 0px 16px rgba(0, 0, 0, 0.25);',
    marginTop: isDrawerView ? 0 : theme.spacing(2),

    [theme.breakpoints.up('md')]: {
      boxShadow: 'none',
      borderRadius: isDrawerView ? 0 : '0px 0px 16px 16px',
    },
  }),
  button: ({ isDrawerView }: any) => ({
    cursor: 'pointer',
    border: 'none',
    backgroundColor: theme?.palette?.care?.white,
    padding: theme.spacing(2, 2),
    flexBasis: isDrawerView ? '50%' : 'content',
    display: isDrawerView ? 'flex' : '',
    justifyContent: isDrawerView ? 'center' : '',
    margin: isDrawerView ? 0 : -1,

    // custom breakpoint to account for button text overflow
    '@media screen and (min-width: 375px)': {
      padding: theme.spacing(2, 3.5),
    },
    whiteSpace: 'nowrap',
    outline: 'none',
    [theme.breakpoints.up('md')]: {
      border: isDrawerView ? 'none' : `1px solid ${theme.palette?.care?.grey[400]}`,
      padding: isDrawerView ? theme.spacing(2, 0) : theme.spacing(2, 0, 2, 12),
      fontSize: 18,
      '&:hover': {
        backgroundColor: theme.palette?.care?.grey[200],
      },
    },
    '&:disabled *': {
      opacity: '80%',
    },
  }),
  buttonDrawerLabel: {
    fontSize: '18px',
  },
  skipButton: ({ isDrawerView }: any) => ({
    borderRadius: isDrawerView ? '0' : '16px 0 0 16px',
    position: 'relative',
    flexGrow: 1,
    '&::after': {
      position: 'absolute',
      content: '""',
      height: '100%',
      width: '1px',
      backgroundColor: theme.palette?.care?.grey[300],
      zIndex: 2,
      right: 0,
      top: 0,
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: isDrawerView ? '0' : '0 0 0 16px',
      flexGrow: 1,
    },
  }),

  addButton: ({ isDrawerView }: any) => ({
    borderRadius: isDrawerView ? '0' : '0 16px 16px 0',
    flexGrow: 2,
    [theme.breakpoints.up('md')]: {
      borderRadius: isDrawerView ? '0' : '0 0 16px 0',
      flexGrow: 1,
    },
  }),
  buttonInnerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const duration = 200;

const defaultStyle: CSSProperties = {
  transition: `${duration}ms ease-in-out`,
  opacity: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  width: 327,
  margin: '0 auto',
  zIndex: -1,
};

// toaster height = 56px
// spacing        = 16px
//                = 72px
const transitionStyles = {
  entering: { opacity: 1, top: 0 },
  entered: { opacity: 1, top: -72 },
  exiting: { opacity: 0, top: -72 },
  exited: { opacity: 0, top: 0 },
  unmounted: { opacity: 0, top: 0 },
};

function SkipOrSaveButton({
  onSave,
  onSkip,
  showToastMessage,
  isDrawerView,
  saveButtonText = 'Add to list',
  passButtonText = 'Pass',
  heartSaveButtonIcon,
}: SkipOrSaveButtonProps) {
  const classes = useStyles({ isDrawerView });

  const heartBannerIcon = (
    <div
      className={clsx(
        classes.iconContainer,
        classes.iconBannerContainer,
        classes.addIconContainerCustom
      )}>
      <Icon24UtilityFavoriteOn color="white" size="14px" />
    </div>
  );
  const heartBanner = (
    <Banner type="warning" roundCorners fullWidth icon={heartBannerIcon}>
      <span>Caregiver favorited!</span>
    </Banner>
  );
  const usualBanner = (
    <Banner type="confirmation" roundCorners fullWidth>
      <span>Added to list</span>
    </Banner>
  );

  return (
    <div className={classes.root}>
      <Transition in={showToastMessage} timeout={duration} mountOnEnter unmountOnExit>
        {(state: TransitionStatus) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}>
            {heartSaveButtonIcon ? heartBanner : usualBanner}
          </div>
        )}
      </Transition>
      <div className={classes.container}>
        <button
          type="button"
          className={clsx(classes.button, classes.skipButton)}
          onClick={onSkip}
          disabled={showToastMessage}>
          <div className={classes.buttonInnerContainer}>
            <div className={clsx(classes.iconContainer, classes.skipIconContainer)}>
              <Icon24UtilityClose className={classes.icon} color="white" />{' '}
            </div>
            <Typography variant="h4" className={isDrawerView ? classes.buttonDrawerLabel : ''}>
              {passButtonText}
            </Typography>
          </div>
        </button>
        <button
          type="button"
          className={clsx(classes.button, classes.addButton)}
          onClick={onSave}
          disabled={showToastMessage}>
          <div className={classes.buttonInnerContainer}>
            <div
              className={clsx(
                classes.iconContainer,
                classes.addIconContainer,
                heartSaveButtonIcon && classes.addIconContainerCustom
              )}>
              {!heartSaveButtonIcon && (
                <Icon24UtilityCheckmarkLarge className={classes.icon} color="white" />
              )}
              {heartSaveButtonIcon && (
                <Icon24UtilityFavoriteOn className={classes.icon} color="white" />
              )}{' '}
            </div>
            <Typography variant="h4" className={isDrawerView ? classes.buttonDrawerLabel : ''}>
              {saveButtonText}
            </Typography>
          </div>
        </button>
      </div>
    </div>
  );
}

SkipOrSaveButton.defaultProps = {
  isDrawerView: false,
  heartSaveButtonIcon: false,
  saveButtonText: 'Add to list',
  passButtonText: 'Pass',
};

export default SkipOrSaveButton;
