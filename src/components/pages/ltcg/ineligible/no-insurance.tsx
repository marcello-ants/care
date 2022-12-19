import React from 'react';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core';
import { IconIllustrationSmallPolaroids, IconIllustrationSmallHouse } from '@care/react-icons';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';

import { SEEKER_ROUTES, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { useAppDispatch } from '@/components/AppState';
import IconCard from '@/components/IconCard';

import IneligibleLayout from './IneligibleLayout';

const useStyles = makeStyles((theme) => ({
  textTopSpacing: {
    marginTop: theme.spacing(2),
  },
  cardContainer: {
    marginTop: theme.spacing(3),
  },
}));

const LocationIneligible = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const classes = useStyles();

  const handleInHome = () => {
    dispatch({ type: 'setTypeOfCare', typeOfcare: SENIOR_CARE_TYPE.IN_HOME });
    router.push(SEEKER_ROUTES.HELP_TYPE);
  };

  const handleInFacility = () => {
    dispatch({ type: 'setTypeOfCare', typeOfcare: SENIOR_CARE_TYPE.IN_FACILITY });
    router.push(SEEKER_IN_FACILITY_ROUTES.CARE_TRUST);
  };

  return (
    <IneligibleLayout headerText="Without long-term care insurance you can still use Care.com to find an in-home caregiver or a senior living community.">
      <div className={classes.cardContainer}>
        <IconCard
          header="Need to find an in-home caregiver?"
          icon={<IconIllustrationSmallPolaroids size="65px" />}
          iconTitle="Polaroids"
          onClick={handleInHome}
          linkContent="Find a caregiver"
        />
      </div>
      <div className={classes.cardContainer}>
        <IconCard
          header="Need to find a senior living community?"
          icon={<IconIllustrationSmallHouse size="65px" />}
          onClick={handleInFacility}
          linkContent="Find a senior living community"
          iconTitle="House"
        />
      </div>
    </IneligibleLayout>
  );
};

export default LocationIneligible;
