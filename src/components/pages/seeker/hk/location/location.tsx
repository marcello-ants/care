import Location from '@/components/Location';
import { SEEKER_HOUSEKEEPING_ROUTES } from '@/constants';
import { useRouter } from 'next/router';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { useSeekerState } from '@/components/AppState';

export default function LocationPage() {
  const { zipcode, city, state } = useSeekerState();
  const { push } = useRouter();
  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Location', {
      zip: zipcode,
      city,
      state,
    });
    push(SEEKER_HOUSEKEEPING_ROUTES.RECAP);
  };
  return <Location handleNext={handleNext} />;
}
