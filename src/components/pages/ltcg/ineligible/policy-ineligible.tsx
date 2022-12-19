import React, { useEffect } from 'react';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useLtcgState } from '@/components/AppState';
import { InsuranceCarrierEnum } from '@/types/ltcg';

import IneligibleLayout from './IneligibleLayout';
import ReachOutBanner from './reach-out-banner';

const CarrierIneligible = () => {
  const { insuranceCarrier } = useLtcgState();
  const headerText =
    insuranceCarrier === InsuranceCarrierEnum.UNSURE
      ? 'Unfortunately, we’ll need to know your policy carrier.'
      : 'We’re still working with your carrier on getting set up.';

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('policy-ineligible', 'ltcg experience');
  }, []);

  return (
    <IneligibleLayout icon="info" headerText={headerText}>
      <ReachOutBanner
        bannerText="Call us to learn more about our offering so you can discuss it with your carrier."
        phoneNumber="877-367-1959"
      />
    </IneligibleLayout>
  );
};

export default CarrierIneligible;
