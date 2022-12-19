import { Grid, makeStyles } from '@material-ui/core';
import { Typography, Slider } from '@care/react-component-lib';

const useStyles = makeStyles((theme) => ({
  careTypeContainer: {
    margin: theme.spacing(2, 0, 2, 0),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2, 0, 2, 0),
    },
  },
  perHourText: {
    // this should be using variant info1 but currently its unavailable
    textAlign: 'center',
    color: theme.palette.grey[600],
    fontSize: '0.75rem',
    lineHeight: '16px',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
    },
  },
  minimumWageText: {
    color: theme.palette.grey[600],
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  value: number | [number, number];
  min: number;
  max: number;
  average: number;
  onChange: (newValue: number | number[]) => void;
}

const PayForCareSlider = ({ value, min, max, onChange, average }: Props) => {
  const classes = useStyles();
  const showMinWageWarning = Array.isArray(value) && value[0] <= min;

  const averageText = `$${average.toFixed(2)} is the average in your area`;

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2" className={classes.careTypeContainer}>
          {averageText}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          unit="max per hour"
          prefix="$"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
        />
      </Grid>
      {showMinWageWarning && (
        <Typography variant="body2" className={classes.minimumWageText}>
          Pay range starts at your area&apos;s minimum wage.
        </Typography>
      )}
    </>
  );
};

export default PayForCareSlider;
