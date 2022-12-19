import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { useSeekerPCState } from '@/components/AppState';
import { SEEKER_PET_CARE_ROUTES } from '@/constants';

function AccountCreationNameFormPC() {
  const seekerPCState = useSeekerPCState();

  return (
    <AccountCreationNameForm
      vertical="PC"
      verticalState={seekerPCState}
      nextPageURL={SEEKER_PET_CARE_ROUTES.ACCOUNT_PASSWORD}
    />
  );
}

export default AccountCreationNameFormPC;
