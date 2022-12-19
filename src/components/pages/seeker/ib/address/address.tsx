import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Banner, Typography } from '@care/react-component-lib';
import { AddressInput, ServiceType } from '@/__generated__/globalTypes';
import useProviderCount from '@/components/hooks/useProviderCount';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import { logIbAddressEvent } from '@/utilities/analyticsPagesUtils';
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
  const pageName = 'Booking Location';
  const dispatch = useAppDispatch();
  const {
    instantBook: {
      address,
      displayAddress: { bookingAddress: displayBookingAddress },
    },
  } = useSeekerCCState();

  const { numOfProviders, displayProviderMessage } = useProviderCount(ServiceType.CHILD_CARE);

  const setAddress = (sitterAddress: AddressInput) => {
    dispatch({ type: 'cc_setIbAddress', address: sitterAddress });
  };
  const setDisplayBookingAddress = (displayAddress: string) => {
    dispatch({ type: 'cc_setIbDisplayBookingAddress', displayAddress });
  };

  const handleNext = () => {
    if (address.addressLine1 && address.zip) {
      logIbAddressEvent();
      router.push(SEEKER_INSTANT_BOOK_ROUTES.IS_HOME_ADDRESS);
    }
  };

  return (
    <>
      <Head>
        <title>Where should the sitter go?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        {displayProviderMessage && (
          <Box className={classes.banner}>
            <Banner type="information" width="100%" roundCorners fullWidth>
              <Typography variant="body2" data-testid="sitters-banner">
                Nice! {numOfProviders} sitters near you!
              </Typography>
            </Banner>
          </Box>
        )}
        <Grid item xs={12} className={classes.header}>
          <Header>Where should the sitter go?</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="textPrimary">
            Your address will only be shared with a caregiver that you book
          </Typography>
        </Grid>

        <Box className={classes.addressInputContainer}>
          <AddressSearch
            seekerAddress={address}
            setSeekerAddress={setAddress}
            displayAddress={displayBookingAddress}
            setDisplayAddress={setDisplayBookingAddress}
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
