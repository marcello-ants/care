import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { caregivers as hkCaregivers } from '@/components/pages/seeker/sc/recap/recap';
import { SEEKER_HOUSEKEEPING_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useSeekerState } from '@/components/AppState';
import RecapPage from '@/components/pages/RecapPage/RecapPage';

function InterstitialWithReviews() {
  const router = useRouter();
  // check change to account creation TODO
  const nextRoute = SEEKER_HOUSEKEEPING_ROUTES.ACCOUNT_CREATION_EMAIL;

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        screen_name: 'recapHousekeeping',
      },
    });
  }, []);

  const { city, state } = useSeekerState();
  const cityAndStateExist = city && state;
  const locationHeader = `${city}, ${state}`;
  const locationText = cityAndStateExist ? ` in ${locationHeader}` : '';
  const title = `Looking for housekeepers${locationText}...`;
  const infoText = 'Did you know? 100% of housekeepers on Care.com are background checked';
  const loadingHandler = () => router.push(nextRoute);

  return (
    <RecapPage
      title={title}
      info={infoText}
      onComplete={loadingHandler}
      caregivers={hkCaregivers}
    />
  );
}

export default InterstitialWithReviews;
