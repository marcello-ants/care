import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { useSeekerCCState } from '@/components/AppState';
import { SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import { useIsEligibleAndTestVariantForNameBeforeEmail } from '@/components/hooks/useNameBeforeEmail';

function AccountCreationNameFormCC() {
  const seekerCCState = useSeekerCCState();
  const isEligibleAndTestVariantForNameBeforeEmail =
    useIsEligibleAndTestVariantForNameBeforeEmail();
  const nextPageUrl = isEligibleAndTestVariantForNameBeforeEmail
    ? SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL
    : SEEKER_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD;
  return (
    <AccountCreationNameForm
      vertical="CC"
      verticalState={seekerCCState}
      nextPageURL={nextPageUrl}
    />
  );
}

export default AccountCreationNameFormCC;
