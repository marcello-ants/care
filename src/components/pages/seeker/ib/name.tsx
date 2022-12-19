import getConfig from 'next/config';
import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { useSeekerCCState } from '@/components/AppState';
import { BOOKING_MFE_IB_ASSESSMENT } from '@/constants';

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

function AccountCreationNameFormIB() {
  const seekerCCState = useSeekerCCState();
  const nextPageUrl = `${CZEN_GENERAL}${BOOKING_MFE_IB_ASSESSMENT}?enrollFlow=true`;
  return (
    <AccountCreationNameForm
      vertical="IB"
      verticalState={seekerCCState}
      nextPageURL={nextPageUrl}
    />
  );
}

export default AccountCreationNameFormIB;
