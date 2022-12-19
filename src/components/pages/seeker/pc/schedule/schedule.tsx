import PostAJobSchedulePage from '@/components/pages/seeker/schedule/schedule';
import { ServiceType } from '@/__generated__/globalTypes';
import { SEEKER_PET_CARE_PAJ_ROUTES } from '@/constants';

function PostAJobSchedulePagePC() {
  return (
    <PostAJobSchedulePage
      serviceType={ServiceType.PET_CARE}
      nextPageURL={SEEKER_PET_CARE_PAJ_ROUTES.LAST_STEP}
    />
  );
}

export default PostAJobSchedulePagePC;
