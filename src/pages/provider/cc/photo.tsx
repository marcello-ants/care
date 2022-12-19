/* istanbul ignore next */
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { useAppDispatch, useProviderCCState } from '@/components/AppState';
import Photo from '@/components/pages/provider/sc/photo/photo';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

const header = 'You are twice as likely to get hired with a photo!';
const note =
  'If your photo includes children, by uploading and clicking Next, you verify that you are the parent or that you have explicit permission of the parent(s) to include the children in your photo.';

function PhotoPage() {
  const dispatch = useAppDispatch();
  const providerCCState = useProviderCCState();
  const featureFlags = useFeatureFlags();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const isFreeGated = providerCCFreeGatedExperience && providerCCState.freeGated;

  const onImageUpdate = (url: string, thumbnailUrl: string) =>
    dispatch({ type: 'setProviderCCMemberPhoto', photo: { url, thumbnailUrl } });

  return (
    <Photo
      header={header}
      note={note}
      isFreeGated={isFreeGated}
      nextRoute={
        isFreeGated
          ? PROVIDER_CHILD_CARE_ROUTES.APP_DOWNLOAD
          : PROVIDER_CHILD_CARE_ROUTES.JOBS_MATCHING
      }
      onImageUpdate={onImageUpdate}
      thumbnail={providerCCState?.photo?.thumbnailUrl}
      eventPrefix="providerCC"
    />
  );
}

export default PhotoPage;
