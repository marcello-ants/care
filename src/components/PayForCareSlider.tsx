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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function sliderCurrencyValue(amount: number) {
  return currencyFormatter.format(amount);
}

interface Props {
  value: [number, number];
  min: number;
  max: number;
  onChange: (newValue: number | number[]) => void;
}

const PayForCareSlider = ({ value, min, max, onChange }: Props) => {
  const classes = useStyles();
  const showMinWageWarning = value[0] <= min;

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body2" className={classes.careTypeContainer}>
          {`The average range in your area is ${sliderCurrencyValue(min)} - ${sliderCurrencyValue(
            max
          )}.`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider unit=" / hr" prefix="$" min={min} max={max} value={value} onChange={onChange} />
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
