import getConfig from 'next/config';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import UpgradeAndMessagePage from '@/components/pages/seeker/lc/upgrade-and-message-page';

import { CC_RATE_CARD_PATH } from '@/constants';
import { useSeekerCCState } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const UpgradeAndMessage = () => {
  const { lcFavoritedProviders } = useSeekerCCState();

  return (
    <UpgradeAndMessagePage
      providerProfiles={lcFavoritedProviders}
      onUpgradeClick={() => {
        AnalyticsHelper.logEvent({
          name: 'CTA Interacted',
          data: {
            screen_name: 'Upgrade and Message',
            num_of_caregivers: lcFavoritedProviders.length,
            cta_clicked: 'Next',
          },
        });

        window.location.assign(CC_RATE_CARD_PATH);
      }}
      onSkipClick={() => {
        AnalyticsHelper.logEvent({
          name: 'CTA Interacted',
          data: {
            screen_name: 'Upgrade and Message',
            num_of_caregivers: lcFavoritedProviders.length,
            cta_clicked: 'Skip',
          },
        });

        window.location.assign(CZEN_GENERAL);
      }}
    />
  );
};

UpgradeAndMessage.Layout = FullWidthLayout;

export default UpgradeAndMessage;
