import { useRouter } from 'next/router';
import Location from '@/components/Location';
import { SEEKER_PET_CARE_ROUTES } from '@/constants';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { useSeekerState } from '@/components/AppState';

export default function LocationPage() {
  const { push } = useRouter();
  const { zipcode, city, state } = useSeekerState();
  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Location', {
      zip: zipcode,
      city,
      state,
    });
    push(SEEKER_PET_CARE_ROUTES.RECAP);
  };

  return <Location handleNext={handleNext} />;
}
