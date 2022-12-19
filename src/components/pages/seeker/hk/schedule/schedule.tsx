import PostAJobSchedulePage from '@/components/pages/seeker/schedule/schedule';
import { ServiceType } from '@/__generated__/globalTypes';
import { SEEKER_HOUSEKEEPING_ROUTES } from '@/constants';

function PostAJobSchedulePageHK() {
  return (
    <PostAJobSchedulePage
      serviceType={ServiceType.HOUSEKEEPING}
      nextPageURL={SEEKER_HOUSEKEEPING_ROUTES.LAST_STEP}
    />
  );
}

export default PostAJobSchedulePageHK;
