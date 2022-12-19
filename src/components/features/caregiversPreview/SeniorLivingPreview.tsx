import { useState } from 'react';
import clsx from 'clsx';
import { Grid, useMediaQuery, MobileStepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useTimer from '@/components/hooks/useTimer';
import CareTypeCard, { CareType } from './CareTypeCard';

type SeniorLivingPreviewProps = {
  seniorLivingTypes: CareType[];
  onComplete: () => void;
};

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
    display: 'flex',
  },
  progress: {
    height: theme.spacing(1),
    width: 267,
    margin: '0 auto',
    borderRadius: 5,
    marginTop: 5,
    '& div': {
      borderRadius: 5,
    },
  },
  itemTransitionBegin: {
    transition: `transform ${theme.transitions.duration.short}ms, opacity ${theme.transitions.duration.short}ms ease`,
    transform: 'scale(1.0)',
    opacity: 1,
  },
  itemTransitionEnd: {
    transform: 'scale(0.7)',
    opacity: 0,
  },
}));

const TRANSITION_TIME_MS = 1400;

function SeniorLivingPreview({ seniorLivingTypes, onComplete }: SeniorLivingPreviewProps) {
  const classes = useStyles();
  const isReallySmallDevice = useMediaQuery('(max-width:345px)');
  const [counter, setCounter] = useState<number>(0);
  const itemsToShow = seniorLivingTypes;

  useTimer(
    () => {
      if (counter > itemsToShow.length - 1) {
        onComplete();
      } else {
        setCounter(counter + 1);
      }
    },
    TRANSITION_TIME_MS,
    [counter]
  );

  return (
    <Grid container className={classes.gridContainer} spacing={isReallySmallDevice ? 2 : 0}>
      {itemsToShow.map((careType, index) => (
        <Grid
          item
          xs={12}
          className={clsx(
            classes.itemTransitionBegin,
            index >= counter ? classes.itemTransitionEnd : null
          )}
          key={`${careType.description}`}>
          <CareTypeCard careType={careType} />
        </Grid>
      ))}

      <Grid item xs={12}>
        <MobileStepper
          variant="progress"
          steps={itemsToShow.length + 1}
          position="static"
          activeStep={counter}
          nextButton={null}
          backButton={null}
          classes={{
            progress: classes.progress,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default SeniorLivingPreview;
