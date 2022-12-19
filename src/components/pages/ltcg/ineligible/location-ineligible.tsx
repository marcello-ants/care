import React, { useEffect } from 'react';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import IneligibleLayout from './IneligibleLayout';
import ReachOutBanner from './reach-out-banner';

const LocationIneligible = () => {
  useEffect(() => {
    AnalyticsHelper.logScreenViewed('location-ineligible', 'ltcg experience');
  }, []);

  return (
    <IneligibleLayout
      icon="close"
      headerText="Unfortunately, we're still building up coverage in your area.">
      <ReachOutBanner bannerText="Reach out to LTCG for more options" phoneNumber="833-894-8576" />
    </IneligibleLayout>
  );
};

export default LocationIneligible;
