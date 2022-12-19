import AccountCreationNameForm from '@/components/pages/seeker/three-step-account-creation/name';
import { useSeekerCCState } from '@/components/AppState';
import { SEEKER_DAYCARE_CHILD_CARE_ROUTES } from '@/constants';
import { withZipcodeVerification } from '@/components/hooks/useZipcodeVerifiedComponent';

function AccountCreationNameFormDC() {
  const seekerCCState = useSeekerCCState();
  const { recommendations } = seekerCCState.dayCare;
  const nextPage =
    recommendations.length > 0
      ? SEEKER_DAYCARE_CHILD_CARE_ROUTES.RECOMMENDATIONS
      : SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD;

  return (
    <AccountCreationNameForm vertical="DC" verticalState={seekerCCState} nextPageURL={nextPage} />
  );
}

export default withZipcodeVerification(
  AccountCreationNameFormDC,
  'daycareAccountCreationMissingZipcode',
  SEEKER_DAYCARE_CHILD_CARE_ROUTES.LOCATION
);
