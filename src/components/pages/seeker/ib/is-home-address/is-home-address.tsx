import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, FormControlLabel, Grid, makeStyles, RadioGroup } from '@material-ui/core';
import { Radio, Typography } from '@care/react-component-lib';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { logIbIsHomeAddressEvent } from '@/utilities/analyticsPagesUtils';
import { IsHomeAddressOptions } from '@/types/seekerCC';
import { initialState } from '@/state/seekerCC';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  nextButtonContainer: {
    marginTop: theme.spacing(4),
  },
}));

const IsHomeAddressPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    isHomeAddress,
    address,
    displayAddress: { bookingAddress: displayBookingAddress },
  } = useSeekerCCState().instantBook;

  const [homeAddressOption, setHomeAddressOption] = useState<IsHomeAddressOptions>(
    isHomeAddress ? IsHomeAddressOptions.YES : IsHomeAddressOptions.NO
  );

  const IS_HOME_ADDRESS_OPTIONS = [
    {
      value: IsHomeAddressOptions.YES,
      label: 'Yes',
    },
    {
      value: IsHomeAddressOptions.NO,
      label: 'No',
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHomeAddressOption(event.target.value as IsHomeAddressOptions);
  };

  const handleNext = () => {
    const selectedAddressOption = homeAddressOption === IsHomeAddressOptions.YES;

    dispatch({
      type: 'cc_setIbIsHomeAddress',
      isHomeAddress: selectedAddressOption,
    });
    dispatch({
      type: 'cc_setIbHomeAddress',
      address: selectedAddressOption ? address : initialState.instantBook.homeAddress,
    });
    dispatch({
      type: 'cc_setIbDisplayHomeAddress',
      displayAddress: selectedAddressOption
        ? displayBookingAddress
        : initialState.instantBook.displayAddress.homeAddress,
    });

    logIbIsHomeAddressEvent(selectedAddressOption);

    const nextRoute = selectedAddressOption
      ? SEEKER_INSTANT_BOOK_ROUTES.NAME
      : SEEKER_INSTANT_BOOK_ROUTES.HOME_ADDRESS;
    router.push(nextRoute);
  };

  return (
    <>
      <Head>
        <title>Is this your home address?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.header}>
          <Typography variant="h2">Is this your home address?</Typography>
        </Grid>

        <RadioGroup name="options" value={homeAddressOption} onChange={handleChange}>
          {IS_HOME_ADDRESS_OPTIONS.map((option) => (
            <FormControlLabel
              control={<Radio />}
              label={option.label}
              value={option.value}
              key={option.value}
            />
          ))}
        </RadioGroup>

        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default IsHomeAddressPage;
