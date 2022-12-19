import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography } from '@care/react-component-lib';
import { AddressInput } from '@/__generated__/globalTypes';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import { logIbHomeAddressEvent } from '@/utilities/analyticsPagesUtils';
import Header from '@/components/Header';
import AddressSearch from '@/components/AddressSearch';

const useStyles = makeStyles((theme) => ({
  banner: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  header: {
    marginBottom: theme.spacing(1),
  },
  addressInputContainer: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  nextButtonContainer: {
    marginTop: theme.spacing(2),
  },
}));

const AddressPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const pageName = 'Home Address';
  const dispatch = useAppDispatch();
  const {
    instantBook: {
      homeAddress,
      displayAddress: { homeAddress: displayHomeAddress },
    },
  } = useSeekerCCState();

  const setHomeAddress = (sitterAddress: AddressInput) => {
    dispatch({ type: 'cc_setIbHomeAddress', address: sitterAddress });
  };
  const setDisplayHomeAddress = (displayAddress: string) => {
    dispatch({ type: 'cc_setIbDisplayHomeAddress', displayAddress });
  };

  const handleNext = () => {
    if (homeAddress.addressLine1 && homeAddress.zip) {
      logIbHomeAddressEvent();
      router.push(SEEKER_INSTANT_BOOK_ROUTES.NAME);
    }
  };

  return (
    <>
      <Head>
        <title>What’s your home address?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.header}>
          <Header>What’s your home address?</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="textPrimary">
            Your address won&apos;t be visible on your profile.
          </Typography>
        </Grid>

        <Box className={classes.addressInputContainer}>
          <AddressSearch
            seekerAddress={homeAddress}
            setSeekerAddress={setHomeAddress}
            displayAddress={displayHomeAddress}
            setDisplayAddress={setDisplayHomeAddress}
            pageName={pageName}
          />
        </Box>

        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddressPage;
