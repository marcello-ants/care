import { useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Grid } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';

import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import BlueIconWrapper from '@/components/BlueWrapperIcon';
import { Icon24InfoSeniorCare } from '@care/react-icons';
import useTimer from '@/components/hooks/useTimer';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '70vh',
  },
  gridContainer: {
    margin: '0 auto',
    maxWidth: '575px',
    paddingBottom: theme.spacing(3),
  },

  header: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  familiesText: {
    color: theme.palette.care?.green[800],
  },
  icon: {
    margin: theme.spacing(0, 'auto', 2),
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 80,
    height: 80,

    '&:not(:last-child)': {
      marginRight: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(5),
      },
    },

    '& img': {
      width: '100%',
      height: '100%',
    },
  },
  imageTransitionBegin: {
    transition: `transform ${theme.transitions.duration.short}ms, opacity ${theme.transitions.duration.short}ms ease`,
    transform: 'scale(1.0)',
    opacity: 1,
  },
  imageTransitionEnd: {
    transform: 'scale(0.7)',
    opacity: 0,
  },
}));

const caregiverImages = [
  {
    alt: 'Caregiver helping senior in wheelchair',
    imageURL: '/app/enrollment/care-trust/trust-image-1.jpeg',
  },
  {
    alt: 'Caregiver giving backrub to senior',
    imageURL: '/app/enrollment/care-trust/trust-image-2.jpeg',
  },
  {
    alt: 'Caregiver helping senior to walk',
    imageURL: '/app/enrollment/care-trust/trust-image-3.jpeg',
  },
];

function CareTrust() {
  const classes = useStyles();
  const router = useRouter();

  const onCompleteAnimation = () => {
    router.push(SEEKER_IN_FACILITY_ROUTES.WHO_NEEDS_CARE);
  };

  const [counter, setCounter] = useState<number>(0);

  useTimer(
    () => {
      if (counter > caregiverImages.length - 1) {
        onCompleteAnimation();
      } else {
        setCounter(counter + 1);
      }
    },
    1400,
    [counter]
  );

  return (
    <div className={classes.mainContainer}>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12} className={classes.header}>
          <BlueIconWrapper icon={<Icon24InfoSeniorCare />} className={classes.icon} />
          <Typography variant="h2">
            <span>Did you know? Care.com is trusted by over</span>{' '}
            <span className={classes.familiesText}>3 million families</span>
          </Typography>
        </Grid>
        <Grid container justifyContent="center">
          {caregiverImages.map((image, index) => {
            return (
              <div
                key={image.imageURL}
                className={clsx(
                  classes.imageContainer,
                  classes.imageTransitionBegin,
                  index >= counter ? classes.imageTransitionEnd : null
                )}>
                <img src={image.imageURL} alt={image.alt} />
              </div>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}

export default CareTrust;
