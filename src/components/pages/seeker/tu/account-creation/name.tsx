import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { useSeekerTUState } from '@/components/AppState';
import { SEEKER_TUTORING_ROUTES } from '@/constants';

function AccountCreationNameFormTU() {
  const seekerTUState = useSeekerTUState();

  return (
    <AccountCreationNameForm
      vertical="TU"
      verticalState={seekerTUState}
      nextPageURL={SEEKER_TUTORING_ROUTES.ACCOUNT_PASSWORD}
    />
  );
}

export default AccountCreationNameFormTU;
