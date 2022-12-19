import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { caregivers as pcCaregivers } from '@/components/pages/seeker/sc/recap/recap';
import { SEEKER_PET_CARE_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useSeekerState } from '@/components/AppState';
import RecapPage from '@/components/pages/RecapPage/RecapPage';

function InterstitialWithReviews() {
  const router = useRouter();
  // @TODO check change to account creation
  const nextRoute = SEEKER_PET_CARE_ROUTES.ACCOUNT_CREATION_EMAIL;

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        screen_name: 'recapPetcare',
      },
    });
  }, []);

  const { city, state } = useSeekerState();
  const hasCityAndState = city && state;
  const cityAndStateHeader = `${city}, ${state}`;
  const locationText = hasCityAndState ? ` in ${cityAndStateHeader}` : '';
  const title = `Looking for pet caregivers${locationText}...`;
  const pcInfo = 'Did you know? 100% of pet caregivers on Care.com are background checked';

  return (
    <RecapPage
      title={title}
      info={pcInfo}
      onComplete={() => router.push(nextRoute)}
      caregivers={pcCaregivers}
    />
  );
}

export default InterstitialWithReviews;
