import useQueryParamData from '@/components/hooks/useQueryParamData';
import HousekeepingDatePage from '@/pages/seeker/hk/housekeeping-date';

function HousekeepingIndex() {
  useQueryParamData();
  return <HousekeepingDatePage />;
}

export default HousekeepingIndex;
