import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';
import { useSeekerState } from '@/components/AppState';
import LcHeader from '@/components/LcHeader';
import CaregiversPreview from '@/components/features/caregiversPreview/CaregiversPreview';
import { SEEKER_LEAD_CONNECT_ROUTES } from '@/constants';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import LcContainer from '@/components/LcContainer';
import { providersToShow, providerProfileToCaregiver } from '../helpers';

const useStyles = makeStyles((theme) => ({
  lcContainer: {
    marginTop: theme.spacing(3),
  },
}));

function Recap() {
  const classes = useStyles();
  const router = useRouter();
  const {
    leadAndConnect: { acceptedProviders },
  } = useSeekerState();

  const caregiverNoun = acceptedProviders.length === 1 ? 'caregiver' : 'caregivers';

  return (
    <>
      <LcHeader
        isVisible
        header={`Great! You've ${`added ${acceptedProviders.length} ${caregiverNoun} to your list`}`}
      />
      <LcContainer classes={{ root: classes.lcContainer }}>
        <CaregiversPreview
          caregivers={providersToShow(acceptedProviders).map(providerProfileToCaregiver)}
          avatarProps={{ variant: 'rounded' }}
          onComplete={() => router.push(SEEKER_LEAD_CONNECT_ROUTES.UPGRADE_OR_SKIP)}
        />
      </LcContainer>
    </>
  );
}

Recap.Layout = FullWidthLayout;

export default Recap;
