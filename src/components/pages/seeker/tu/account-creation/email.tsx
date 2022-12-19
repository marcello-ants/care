import AccountCreationEmailForm from '@/components/pages/seeker/three-step-account-creation/email';
import { ServiceType } from '@/__generated__/globalTypes';

function AccountCreationEmailFormTU() {
  return <AccountCreationEmailForm serviceType={ServiceType.TUTORING} />;
}

export default AccountCreationEmailFormTU;
