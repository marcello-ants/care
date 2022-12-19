import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { useSeekerHKState } from '@/components/AppState';
import { SEEKER_HOUSEKEEPING_ROUTES } from '@/constants';

function AccountCreationNameFormHK() {
  const seekerHKState = useSeekerHKState();

  return (
    <AccountCreationNameForm
      vertical="HK"
      verticalState={seekerHKState}
      nextPageURL={SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_PASSWORD}
    />
  );
}

export default AccountCreationNameFormHK;
