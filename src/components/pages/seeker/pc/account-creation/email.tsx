import AccountCreationEmailForm from '@/components/pages/seeker/three-step-account-creation/email';
import { ServiceType } from '@/__generated__/globalTypes';

function AccountCreationEmailFormPC() {
  return <AccountCreationEmailForm serviceType={ServiceType.PET_CARE} />;
}

export default AccountCreationEmailFormPC;
