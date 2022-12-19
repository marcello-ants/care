import AccountCreationEmailForm from '@/components/pages/seeker/three-step-account-creation/email';
import { ServiceType } from '@/__generated__/globalTypes';

function AccountCreationEmailFormHK() {
  return <AccountCreationEmailForm serviceType={ServiceType.HOUSEKEEPING} />;
}

export default AccountCreationEmailFormHK;
