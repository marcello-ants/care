import PostAJobSchedulePage from '@/components/pages/seeker/schedule/schedule';
import { ServiceType } from '@/__generated__/globalTypes';
import { SEEKER_CHILD_CARE_PAJ_ROUTES } from '@/constants';

function PostAJobSchedulePageCC() {
  return (
    <PostAJobSchedulePage
      serviceType={ServiceType.CHILD_CARE}
      nextPageURL={SEEKER_CHILD_CARE_PAJ_ROUTES.CAREGIVER_ATTRIBUTES}
    />
  );
}

export default PostAJobSchedulePageCC;
