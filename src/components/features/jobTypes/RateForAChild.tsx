import React, { MouseEventHandler } from 'react';
import { Icon24UtilityClearField } from '@care/react-icons';
import { Grid, makeStyles } from '@material-ui/core';
import { Slider } from '@care/react-component-lib';

const useStyles = makeStyles((theme) => ({
  label: {
    paddingTop: theme.spacing(1),
  },
  removeIcon: {
    paddingTop: theme.spacing(1),
    cursor: 'pointer',
  },
}));

export interface Props {
  className?: string;
  index: number;
  min: number;
  max: number;
  value: number;
  onChange: (value: number | number[]) => void;
  onRemove?: MouseEventHandler<HTMLDivElement>;
}

function RateForAChild({ className, index, onChange, onRemove, min, max, value }: Props) {
  const classes = useStyles();
  return (
    <Grid container item xs={12} className={className}>
      <Grid item xs={3} className={classes.label}>
        {index === 0 ? '1 child' : `${index + 1} children`}
      </Grid>
      <Grid item xs={8}>
        <Slider
          data-testid="rate-slider"
          unit="hr"
          inline
          value={value}
          min={min}
          max={max}
          onChange={onChange}
        />
      </Grid>
      <Grid item container xs={1}>
        {onRemove ? (
          <Grid onClick={onRemove} data-testid="remove-rate" className={classes.removeIcon}>
            <Icon24UtilityClearField />
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}

export default RateForAChild;
