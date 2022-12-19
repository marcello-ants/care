import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { isValidZipCode } from '@/utilities/globalValidations';

import Header from '@/components/Header';
import ZipInput from '@/components/ZipInput';
import useEnterKey from '@/components/hooks/useEnterKey';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import { Location } from '@/types/common';
import { LTCG_ROUTES, LTCG_INELIGIBLES_ACRONYM_STATES } from '@/constants';
import { useAppDispatch, useLtcgState } from '@/components/AppState';

const useStyles = makeStyles((theme) => ({
  subHeader: {
    marginTop: theme.spacing(3),
  },
}));

function WherePage() {
  const classes = useStyles();
  const router = useRouter();
  const { location } = useLtcgState();
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('where', 'ltcg experience');
  }, []);

  const handleNext = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        screen_name: 'where',
        source: 'ltcg experience',
        cta_clicked: 'next',
        enrollment_step: 'location',
      },
    });

    const { state: addressState } = location!;
    if (!Object.keys(LTCG_INELIGIBLES_ACRONYM_STATES).includes(addressState)) {
      router.push(LTCG_ROUTES.WHEN);
    } else {
      router.push(LTCG_ROUTES.LOCATION_INELIGIBLE);
    }
  };
  const handleZipInputChange = (newLocation: Location) => {
    dispatch({ type: 'setLtcgLocation', location: newLocation });
  };
  const handleError = (e: boolean) => {
    setError(e);
  };

  const isNextDisabled = !isValidZipCode(location?.zipcode ?? '') || error;

  useEnterKey(!isNextDisabled, handleNext);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>Let’s get you started finding the right caregiver.</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.subHeader}>
          Where do you need care?
        </Typography>
        <ZipInput location={location} onError={handleError} onChange={handleZipInputChange} />
      </Grid>
      <Grid item xs={12}>
        <CareComButtonContainer mt={2}>
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isNextDisabled}>
            Next
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
}

export default WherePage;
