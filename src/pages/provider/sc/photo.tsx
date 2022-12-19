/* istanbul ignore next */
import { PROVIDER_ROUTES } from '@/constants';
import { useAppDispatch, useProviderState } from '@/components/AppState';
import Photo from '@/components/pages/provider/sc/photo/photo';

const header = 'You are 8x more likely to get hired with a photo!';

function PhotoPage() {
  const dispatch = useAppDispatch();
  const providerState = useProviderState();

  const onImageUpdate = (url: string, thumbnailUrl: string) =>
    dispatch({ type: 'setProviderMemberPhoto', photo: { url, thumbnailUrl } });

  return (
    <Photo
      header={header}
      nextRoute={PROVIDER_ROUTES.JOBS_MATCHING}
      onImageUpdate={onImageUpdate}
      thumbnail={providerState?.photo?.thumbnailUrl}
      eventPrefix="provider"
    />
  );
}

export default PhotoPage;
