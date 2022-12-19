import React, { ReactElement } from 'react';

import { makeStyles, styled, Box } from '@material-ui/core';
import { Transition } from 'react-transition-group';
import { TransitionStatus, ENTERING, ENTERED, EXITING } from 'react-transition-group/Transition';

const useTransitionStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: '600px',
    height: '100%',
    margin: ' 0 0 0 auto',
  },
}));
export const TRANSLATE_3D_POSITION = {
  NONE: 'initial',
  RIGHT: 'translateX(100%) translateY(0)',
  CENTER: 'translateX(0) translateY(0)',
  BOTTOM: 'translateX(0) translateY(100%)',
};

export const getTransformAnimation = ({ state }: any): string => {
  let transformString = '';

  switch (state) {
    case ENTERING:
      transformString = TRANSLATE_3D_POSITION.RIGHT;
      break;
    case ENTERED:
      transformString = TRANSLATE_3D_POSITION.CENTER;
      break;
    case EXITING:
      transformString = TRANSLATE_3D_POSITION.BOTTOM;
      break;
    default:
      transformString = TRANSLATE_3D_POSITION.NONE;
      break;
  }

  return transformString;
};

const TransitionBox = styled(({ ...props }) => <Box {...props} />)(({ theme, state }: any) => ({
  transition: theme.transitions.create(['opacity', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  opacity: state === ENTERED ? '1' : '0',
  transform: getTransformAnimation({ state }),
}));

interface CaregiverTransitionProps {
  children: ReactElement;
  appear: boolean;
  in: boolean;
  timeout: number;
}

const CaregiverTransition = (props: CaregiverTransitionProps) => {
  const { children, ...restOfProps } = props;
  const classes = useTransitionStyles();

  return (
    <Transition unmountOnExit {...restOfProps}>
      {(state: TransitionStatus) => (
        <TransitionBox className={classes.root} state={state}>
          {children}
        </TransitionBox>
      )}
    </Transition>
  );
};

export default CaregiverTransition;
