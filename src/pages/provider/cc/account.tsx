import React from 'react';
import { ServiceType } from '@/__generated__/globalTypes';
import { useProviderCCState, useAppDispatch } from '@/components/AppState';
import { PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import AccountPage from '@/components/features/accountCreation/ProviderAccountPage';
import logger from '@/lib/clientLogger';

function AccountWrapper() {
  const { zipcode, distance, initialAccountCreationAttempted } = useProviderCCState();
  const dispatch = useAppDispatch();

  const onBeforeSubmit = () => {
    if (!initialAccountCreationAttempted) {
      dispatch({
        type: 'setProviderCCInitialAccountCreationAttempted',
        initialAccountCreationAttempted: true,
      });
      logger.info({ event: 'providerAccountCreationInitialAttempt' });
    }
    logger.info({ event: 'providerAccountCreationAttempt' });
  };

  return (
    <AccountPage
      onBeforeSubmit={onBeforeSubmit}
      serviceType={ServiceType.CHILD_CARE}
      nextRoute={PROVIDER_CHILD_CARE_ROUTES.STEPS}
      missingZipRoute={PROVIDER_CHILD_CARE_ROUTES.INDEX}
      zipcode={zipcode}
      distance={distance}
    />
  );
}

export default AccountWrapper;
