import { ReactElement, useRef } from 'react';
import { createPortal } from 'react-dom';
import { alpha, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import useWindowSize from './hooks/useWindowSize';
import useResizeObserver from './hooks/useResizeObserver';

interface IFixElementToBottom {
  children: ReactElement;
  useFade?: boolean;
}

// used styles from previous story and made component for reuse
const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: 'inherit',
    height: theme.spacing(12),
    [theme.breakpoints.up('md')]: {
      height: 'auto',
    },
  },
  fade: {
    bottom: 0,
    width: 'inherit',
    zIndex: theme.zIndex.appBar,
    left: '50%',
    transform: `translate(-50%)`,
  },
}));

function FixElementToBottom({ useFade, children }: IFixElementToBottom) {
  const classes = useStyles();
  const ref = useRef<any>(null);
  const windowSize = useWindowSize();
  const theme = useTheme();
  const isMobileOrSmaller = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobileDevice =
    typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
  // used to get width from parent div so button can use it
  const contentRect = useResizeObserver(ref);
  const width = contentRect?.width || 0;
  const elmTop = ref?.current?.getBoundingClientRect().top + window.scrollY;
  const elOffset = elmTop || 0;
  const height = windowSize?.height || 0;
  // page height varies a bit when viewed on mobile devices
  const BUTTON_HEIGHT = isMobileDevice ? 112 : 108;
  // calculates where button should become fixed
  const threshold = elOffset - height + BUTTON_HEIGHT;

  const trigger = useScrollTrigger({
    threshold,
    disableHysteresis: true,
  });

  const showPortalButton = !trigger && isMobileOrSmaller;

  return (
    <div className={classes.wrapper} ref={ref}>
      {showPortalButton ? (
        createPortal(
          <div
            className={classes.fade}
            style={{
              position: 'fixed',
              width,
              marginBottom: 0,
              padding: useFade ? theme.spacing(4, 5, 3) : 0,
              background: useFade
                ? `linear-gradient(0deg, ${theme.palette.common.white} 50%, ${alpha(
                    theme.palette.common.white,
                    0
                  )} 90%)`
                : 'none',
            }}>
            {children}
          </div>,
          document.body
        )
      ) : (
        <div
          className={classes.fade}
          style={{
            position: 'relative',
            width: 'auto',
            marginBottom: theme.spacing(-3),
            padding: useFade ? theme.spacing(4, 5, 3) : 0,
            background: useFade
              ? `linear-gradient(0deg, ${theme.palette.common.white} 50%, ${alpha(
                  theme.palette.common.white,
                  0
                )} 90%)`
              : 'none',
          }}>
          {children}
        </div>
      )}
    </div>
  );
}

FixElementToBottom.defaultProps = {
  useFade: true,
};

export default FixElementToBottom;
