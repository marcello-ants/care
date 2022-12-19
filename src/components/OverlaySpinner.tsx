import React from 'react';
import { Backdrop } from '@material-ui/core';
import { Spinner } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import { HEIGHT_MINUS_TOOLBAR } from '../constants';

const useStyles = makeStyles({
  backdrop: {
    zIndex: 5,
    backgroundColor: 'transparent',
    height: `${HEIGHT_MINUS_TOOLBAR}`,
    left: '-5px',
    right: '-5px',
  },
  container: {
    height: `${HEIGHT_MINUS_TOOLBAR}`,
  },
});

interface OverlaySpinnerProps {
  isOpen?: boolean;
  spinnerSize?: string;
  wrapped?: boolean;
}

function OverlaySpinner(props: OverlaySpinnerProps) {
  const { isOpen = false, spinnerSize, wrapped, ...rest } = props;
  const classes = useStyles();
  const backdrop = (
    <Backdrop
      classes={{
        root: classes.backdrop,
      }}
      open={isOpen}
      {...rest}>
      <Spinner size={spinnerSize} />
    </Backdrop>
  );
  if (wrapped) {
    return <div className={classes.container}>{backdrop}</div>;
  }
  return <>{backdrop}</>;
}
OverlaySpinner.defaultProps = {
  isOpen: false,
  spinnerSize: '64px',
  wrapped: false,
};

export default OverlaySpinner;
