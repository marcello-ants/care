import Head from 'next/head';
import { Select } from '@care/react-component-lib';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Header from '@/components/Header';
import { useAppDispatch, useSeekerHKState } from '@/components/AppState';
import { BRING_OPTIONS } from '@/types/seekerHK';
import useNextRoute from '@/components/hooks/useNextRoute';
import { ChangeEvent } from 'react';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: theme.spacing(0, 1, 1),
  },
  heading: {
    marginBottom: theme.spacing(4),
  },
  subtitle: {
    margin: theme.spacing(1, 0, 2),
  },
  countersWrapper: {
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
  },
  counter: {
    margin: theme.spacing(0, 0, 4),
    width: '90%',
  },
  bringOptionsWrapper: {
    marginBottom: theme.spacing(4),
  },
  bringOptions: {
    margin: theme.spacing(1, 1),
  },
}));

interface RoomsCounterProps {
  name: string;
  min?: number;
  max?: number;
  initialVal?: number;
  currentValue: number;
  onChange: any;
  className?: string;
}

const RoomsCounter = (props: RoomsCounterProps) => {
  const { min, max, name, initialVal, onChange, currentValue, className } = props;
  const minValue = min as number;
  const maxValue = max as number;
  const values = [minValue];
  for (let i = minValue + 1; i <= maxValue; i += 1) {
    values.push(i);
  }

  return (
    <>
      <InputLabel id={`label-${name}`}>{name}</InputLabel>
      <Select
        onChange={onChange}
        labelId={`label-${name}`}
        name={name}
        defaultValue={() => currentValue ?? initialVal}
        className={className}>
        {values.map((value) => {
          return (
            <MenuItem key={`${name}-${value}`} value={value} selected={value === currentValue}>
              {value}
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

RoomsCounter.defaultProps = {
  min: 1,
  max: 10,
  initialVal: 2,
  className: '',
};

const NextButton = (props: any) => {
  const { onClick } = props;
  return (
    <Button size="large" color="primary" variant="contained" fullWidth onClick={onClick}>
      Next
    </Button>
  );
};

const HousekeeperWhatPage = () => {
  const classes = useStyles();
  const stateHK = useSeekerHKState();
  const { bringOptions, bathrooms, bedrooms } = stateHK;
  const dispatch = useAppDispatch();
  const { pushNextRoute } = useNextRoute();

  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Details', {
      bedroom_count: bedrooms,
      bathroom_count: bathrooms,
      bring_options: bringOptions.map(
        (option) => BRING_OPTIONS.find((el) => el.value === option)?.label
      ),
    });
    pushNextRoute();
  };
  const handleBedroomSelectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const bedroomsNum = e?.target?.value as unknown as number;
    dispatch({ type: 'setBedrooms', bedroomsNum });
  };
  const handleBathroomSelectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const bathroomsNum = e?.target?.value as unknown as number;
    dispatch({ type: 'setBathrooms', bathroomsNum });
  };
  const handleBringOptionsChange = (event: any) => {
    const currentOptions = [...bringOptions];
    const elementName = event?.currentTarget.name;
    const elementChecked = event?.currentTarget.checked;
    if (elementChecked) {
      currentOptions?.push(elementName);
    } else {
      currentOptions?.splice(currentOptions?.indexOf(elementName), 1);
    }
    dispatch({ type: 'setBringOptions', bringOptions: currentOptions });
  };

  return (
    <>
      <Head>
        <title>What housekeeper should know?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.heading}>
          <Header>Tell us what your housekeeper should know about your home.</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" color="textPrimary" className={classes.subtitle}>
            How many bedrooms and bathrooms?
          </Typography>
        </Grid>
        <Grid container className={classes.countersWrapper}>
          <Grid item xs={6}>
            <RoomsCounter
              name="Bedrooms"
              initialVal={2}
              currentValue={bedrooms}
              className={classes.counter}
              onChange={handleBedroomSelectChange}
            />
          </Grid>
          <Grid item xs={6}>
            <RoomsCounter
              name="Bathrooms"
              initialVal={2}
              currentValue={bathrooms}
              className={classes.counter}
              onChange={handleBathroomSelectChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" color="textPrimary" className={classes.subtitle}>
            What should your housekeeper bring?
          </Typography>
        </Grid>
        <Grid item xs className={classes.bringOptionsWrapper}>
          <FormGroup>
            {BRING_OPTIONS.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name={option.value}
                    checked={bringOptions.includes(option.value)}
                    onChange={handleBringOptionsChange}
                  />
                }
                label={option.label}
                labelPlacement="start"
                className={classes.bringOptions}
                key={option.value}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <NextButton onClick={handleNext} />
        </Grid>
      </Grid>
    </>
  );
};

export default HousekeeperWhatPage;
