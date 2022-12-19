import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Grid, useMediaQuery, MobileStepper, GridSize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CaregiverCard, { Caregiver, CaregiverCardProps } from './CaregiverCard';

type CaregiversPreviewProps = {
  caregivers: Caregiver[];
  // eslint-disable-next-line react/require-default-props
  onComplete?: () => void;
} & Pick<CaregiverCardProps, 'avatarProps'>;

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    alignContent: 'space-between',
    justifyContent: 'center',
    margin: theme.spacing(-4, 'auto', 0),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
    },
  },
  progress: {
    height: theme.spacing(1),
    width: '300px',
    margin: '0 auto',
    marginTop: theme.spacing(5),
    borderRadius: '5px',
    '& div': {
      borderRadius: '5px',
    },
  },
  item: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 3),
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

function CaregiversPreview({ caregivers, onComplete, avatarProps }: CaregiversPreviewProps) {
  const classes = useStyles();
  const [counter, setCounter] = useState<number>(0);
  const shouldAnimate = typeof onComplete === 'function';
  const transitionTime = caregivers.length > 3 ? 1000 : 1400;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        if (counter > caregivers.length - 1) {
          onComplete!();
        } else {
          setCounter(counter + 1);
        }
      }, transitionTime);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [counter, shouldAnimate]);

  const isReallySmallDevice = useMediaQuery('(max-width:345px)');
  let xsCols = 6;
  if (caregivers.length < 4) {
    xsCols = isReallySmallDevice ? 12 : 12 / caregivers.length;
  }

  return (
    <Grid container className={classes.gridContainer}>
      {caregivers.map((caregiver, index) => (
        <Grid
          item
          xs={xsCols as GridSize}
          sm={4}
          md="auto"
          className={clsx(classes.item, {
            [classes.itemTransitionBegin]: shouldAnimate,
            [classes.itemTransitionEnd]: shouldAnimate && index >= counter,
          })}
          key={`${index + 1}`}>
          <CaregiverCard caregiver={caregiver} avatarProps={avatarProps} />
        </Grid>
      ))}
      {shouldAnimate && (
        <Grid item xs={12}>
          <MobileStepper
            variant="progress"
            steps={caregivers.length + 1}
            position="static"
            activeStep={counter}
            nextButton={null}
            backButton={null}
            classes={{
              progress: classes.progress,
            }}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default CaregiversPreview;
