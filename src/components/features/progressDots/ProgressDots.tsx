import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 0,
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    '&:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
    backgroundColor: theme.palette.care?.navy[800],
    transition: `width ${theme.transitions.duration.short}ms, border-radius ${theme.transitions.duration.short}ms`,
  },
  activeDot: {
    width: '16px',
    borderRadius: '22% 22% / 50% 50%',
    transition: `width ${theme.transitions.duration.short}ms, border-radius ${theme.transitions.duration.short}ms`,
  },
}));

interface ProgressDotsProps {
  stepNumber: number;
  totalSteps: number;
  classes?: { root?: string; dot?: string; activeDot?: string };
}

const ProgressDots = ({ stepNumber, totalSteps, ...rest }: ProgressDotsProps) => {
  const dots = [];
  const classes = useStyles({ classes: rest.classes });

  for (let currentStep = 1; currentStep <= totalSteps; currentStep += 1) {
    dots.push({ stepNumber: currentStep, isActive: false });
  }

  return (
    <ul className={classes.root}>
      {dots.map((currentDot) => (
        <li
          key={currentDot.stepNumber}
          className={clsx({
            [classes.dot]: true,
            [classes.activeDot]: stepNumber === currentDot.stepNumber,
          })}
        />
      ))}
    </ul>
  );
};

ProgressDots.defaultProps = {
  classes: {},
};

export default React.memo(ProgressDots);
