import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { caregivers as tutors } from '@/components/pages/seeker/sc/recap/recap';
import { SEEKER_TUTORING_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useSeekerState, useSeekerTUState } from '@/components/AppState';
import RecapPage from '@/components/pages/RecapPage/RecapPage';
import { TutoringTypeOptions } from '@/types/seekerTU';

function InterstitialWithReviews() {
  const router = useRouter();
  // @TODO check change to account creation
  const nextRoute = SEEKER_TUTORING_ROUTES.ACCOUNT_CREATION_EMAIL;

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        screen_name: 'recapTutoring',
      },
    });
  }, []);

  const { city, state } = useSeekerState();
  const { tutoringType } = useSeekerTUState();
  const hasLocationData = city && state;
  const isLocalTutoring = tutoringType === TutoringTypeOptions.IN_PERSON;
  const locationHeaderText = `${city}, ${state}`;
  const personalizedText = hasLocationData && isLocalTutoring ? ` in ${locationHeaderText}` : '...';
  const tutorsTitle = `Looking for tutors just for you${personalizedText}`;
  const didYouKnowText = 'Did you know? 100% of tutors on Care.com are background checked';

  return (
    <RecapPage
      info={didYouKnowText}
      title={tutorsTitle}
      onComplete={() => router.push(nextRoute)}
      caregivers={tutors}
    />
  );
}

export default InterstitialWithReviews;
