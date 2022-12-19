import PostAJobSchedulePage from '@/components/pages/seeker/schedule/schedule';
import { ServiceType } from '@/__generated__/globalTypes';
import { SEEKER_TUTORING_PAJ_ROUTES } from '@/constants';

function PostAJobSchedulePageTU() {
  return (
    <PostAJobSchedulePage
      serviceType={ServiceType.TUTORING}
      nextPageURL={SEEKER_TUTORING_PAJ_ROUTES.GOALS}
    />
  );
}

export default PostAJobSchedulePageTU;
