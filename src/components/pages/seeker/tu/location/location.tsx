import LocationPage from '@/components/Location';
import useNextRoute from '@/components/hooks/useNextRoute';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { useSeekerState } from '@/components/AppState';

function LocationPageTU() {
  const { pushNextRoute } = useNextRoute();
  const { zipcode, city, state } = useSeekerState();
  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Location', {
      zip: zipcode,
      city,
      state,
    });
    pushNextRoute();
  };

  return <LocationPage headerText="Where are you located?" handleNext={handleNext} />;
}

export default LocationPageTU;
