import React, { useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { makeStyles, Button, useMediaQuery, useTheme } from '@material-ui/core';
import { Icon24UtilityChevron } from '@care/react-icons';
import ProgressDots from '@/components/features/progressDots/ProgressDots';

type Step = {
  imgPath: string;
};

const NEXT = 'NEXT';
const PREV = 'PREV';

type Direction = typeof PREV | typeof NEXT;

interface CarouselState {
  pos: number;
  sliding: boolean;
  dir: Direction;
}

const initialState: CarouselState = { pos: 0, sliding: false, dir: NEXT };

type CarouselAction = { type: Direction; numItems: number } | { type: 'stopSliding' | 'reset' };

function reducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case 'reset':
      return initialState;
    case PREV:
      return {
        ...state,
        dir: PREV,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      };
    case NEXT:
      return {
        ...state,
        dir: NEXT,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      };
    case 'stopSliding':
      return { ...state, sliding: false };
    default:
      return state;
  }
}

const getOrder = (index: number, pos: number, numItems: number) => {
  return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
    borderRadius: 16,
  },
  buttonsContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 99,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
    padding: theme.spacing(0, 2),
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: '#fff',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
    '&:hover': {
      backgroundColor: '#fff',
      opacity: '80%',
    },
    '&:disabled': {
      opacity: '20%',
    },
  },
  iconLeft: {
    transform: 'rotate(90deg)',
  },
  iconRight: {
    transform: 'rotate(-90deg)',
  },
  progressDotsContainer: {
    position: 'absolute',
    zIndex: 99,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    bottom: ({ isDesktop }: { isDesktop: boolean }) =>
      isDesktop ? theme.spacing(2) : theme.spacing(1),
    height: 'auto',
  },
  progressDots: {
    backgroundColor: '#282B30',
    opacity: '85%',
    padding: 4,
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotsRootOverride: {
    marginTop: 0,
  },
  progressDotsDotOverride: {
    backgroundColor: theme.palette.care?.white,
  },
  carouselWrapper: {
    width: `100%`,
    height: 202,
    [theme.breakpoints.up('sm')]: {
      height: 301,
    },
  },
  carouselSlot: {
    minWidth: '100%',
    height: 202,
    [theme.breakpoints.up('sm')]: {
      height: 301,
    },
  },

  carouselContainer: {
    display: 'flex',
  },
}));

const Carousel = ({ steps }: { steps: Step[] }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const numItems = steps.length;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles({ isDesktop });

  const slide = (dir: Direction) => {
    dispatch({ type: dir, numItems });

    setTimeout(() => {
      dispatch({ type: 'stopSliding' });
    }, 50);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => slide(NEXT),
    onSwipedRight: () => slide(PREV),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const getTransform = () => {
    if (!state.sliding) return 'translateX(calc(-100%))';
    if (state.dir === PREV) return 'translateX(calc(2 * (-100%)))';
    return 'translateX(0%)';
  };

  return (
    <div {...handlers} className={classes.root}>
      <div className={classes.carouselWrapper}>
        <div
          className={classes.carouselContainer}
          style={{
            transition: state.sliding ? 'none' : `transform .25s ease`,
            transform: steps.length > 1 ? getTransform() : undefined,
          }}>
          {steps.map((step: Step, index: number) => (
            <div
              className={classes.carouselSlot}
              key={step.imgPath}
              data-testid={index}
              style={{
                backgroundImage: `url(${step.imgPath})`,
                backgroundSize: 'cover',
                order: getOrder(index, state.pos, numItems),
              }}
            />
          ))}
        </div>
      </div>
      {isDesktop && (
        <div className={classes.buttonsContainer}>
          <Button className={classes.button} onClick={() => slide(PREV)} data-testid="leftButton">
            <Icon24UtilityChevron className={classes.iconLeft} />
          </Button>
          <Button className={classes.button} onClick={() => slide(NEXT)} data-testid="rightButton">
            <Icon24UtilityChevron className={classes.iconRight} />
          </Button>
        </div>
      )}
      <div className={classes.progressDotsContainer}>
        <div className={classes.progressDots}>
          <ProgressDots
            stepNumber={state.pos + 1}
            totalSteps={numItems}
            classes={{
              root: classes.progressDotsRootOverride,
              dot: classes.progressDotsDotOverride,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
