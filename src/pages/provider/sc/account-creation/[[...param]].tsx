import React from 'react';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import { PROVIDER_ROUTES } from '@/constants';
import { ServiceType } from '@/__generated__/globalTypes';
import AccountPage from '@/components/features/accountCreation/ProviderAccountPage';
import logger from '@/lib/clientLogger';

function AccountCreationPage() {
  const dispatch = useAppDispatch();
  const { zipcode, distance, initialAccountCreationAttempted } = useProviderState();

  const onBeforeSubmit = () => {
    if (!initialAccountCreationAttempted) {
      dispatch({
        type: 'setProviderInitialAccountCreationAttempted',
        initialAccountCreationAttempted: true,
      });
      logger.info({ event: 'providerAccountCreationInitialAttempt' });
    }
    logger.info({ event: 'providerAccountCreationAttempt' });
  };

  return (
    <AccountPage
      onBeforeSubmit={onBeforeSubmit}
      serviceType={ServiceType.SENIOR_CARE}
      nextRoute={PROVIDER_ROUTES.ACCOUNT_CREATED}
      zipcode={zipcode}
      distance={distance}
      missingZipRoute={PROVIDER_ROUTES.INDEX}
    />
  );
}

export default AccountCreationPage;
