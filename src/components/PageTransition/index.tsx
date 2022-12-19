import { ReactElement } from 'react';
import { styled, Theme, useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Transition, SwitchTransition, config } from 'react-transition-group';
import { TransitionStatus, ENTERING, ENTERED, EXITING } from 'react-transition-group/Transition';
import useBeforePopState from './useBeforePopState';

type TransitionState = TransitionStatus;

interface PageTransitionProps {
  children: ReactElement;
}

interface TransformAnimation {
  state: TransitionState;
}
interface TransitionBoxProps extends TransformAnimation {
  theme: Theme;
}

export const TRANSLATE_3D_POSITION = {
  NONE: 'initial',
  RIGHT: 'translateX(150%) translateY(0)',
  CENTER: 'translateX(0) translateY(0)',
  LEFT: 'translateX(-150%) translateY(0)',
};

export const getTransformAnimation = ({ state }: TransformAnimation): string => {
  let transformString = '';
  switch (state) {
    case ENTERING:
      transformString = TRANSLATE_3D_POSITION.RIGHT;
      break;
    case ENTERED:
      transformString = TRANSLATE_3D_POSITION.CENTER;
      break;
    case EXITING:
      transformString = TRANSLATE_3D_POSITION.LEFT;
      break;
    default:
      transformString = TRANSLATE_3D_POSITION.NONE;
      break;
  }

  return transformString;
};

const TransitionBox = styled(({ ...props }) => <Box {...props} />)(
  ({ theme: currentTheme, state }: TransitionBoxProps) => ({
    transition: currentTheme.transitions.create(['transform', 'opacity'], {
      duration: currentTheme.transitions.duration.standard,
    }),
    transform: getTransformAnimation({ state }),
    opacity: state === ENTERED ? '1' : '0',
  })
);

const PageTransition = ({ children }: PageTransitionProps) => {
  const theme = useTheme();
  const { isPoppingState } = useBeforePopState();

  // turn off animations when going backwards
  config.disabled = isPoppingState;

  return (
    <SwitchTransition mode="out-in">
      <Transition
        key={children?.key}
        timeout={theme.transitions.duration.standard}
        unmountOnExit
        mountOnEnter>
        {(state: TransitionStatus) => {
          return <TransitionBox state={state}>{children}</TransitionBox>;
        }}
      </Transition>
    </SwitchTransition>
  );
};

export default PageTransition;
