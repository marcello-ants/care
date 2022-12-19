import { useState, useEffect } from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import Header from '@/components/Header';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import ZipInput from '@/components/ZipInput';
import useEnterKey from '@/components/hooks/useEnterKey';
import { Location } from '@/types/common';
import Head from 'next/head';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(2, 0),
    marginBottom: theme.spacing(57),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

interface Props {
  headerText?: string;
  handleNext: () => void;
}

const LocationPage = ({ headerText, handleNext }: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { zipcode, city, state } = useSeekerState();
  const [error, setError] = useState(false);
  const [validateOnClick, setValidateOnClick] = useState(false);
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const handleError = (e: boolean) => {
    setError(e);
  };
  const onZipInputChange = (location: Location) => {
    dispatch({ type: 'setZipcode', zipcode: location.zipcode });
    dispatch({ type: 'setCityAndState', city: location.city, state: location.state });
  };

  useEffect(() => {
    if (!shouldGoNext) {
      return;
    }

    setValidateOnClick(true);

    if (error) {
      return;
    }
    handleNext();
  }, [shouldGoNext, city, error]);

  useEnterKey(true, () => setShouldGoNext(true));

  return (
    <>
      <Head>
        <title>Where do you need care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>{headerText}</Header>
        </Grid>
        <Grid item xs={12}>
          <ZipInput
            location={{ zipcode, city, state }}
            onError={handleError}
            onChange={onZipInputChange}
            validateOnLostFocusOrClick
            validateOnClick={validateOnClick}
            setValidateOnClick={setValidateOnClick}
            setShouldGoNext={setShouldGoNext}
          />
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            onClick={() => setShouldGoNext(true)}
            variant="contained"
            color="primary"
            fullWidth
            size="large">
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

LocationPage.defaultProps = {
  headerText: "Let's confirm where you'll need help.",
};

export default LocationPage;
