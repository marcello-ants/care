import BioPage from '@/components/pages/provider/headline-bio';
import { useProviderCCState, useAppDispatch } from '@/components/AppState';
import { PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { ServiceType } from '@/__generated__/globalTypes';

const examples = [
  'Your prior child care experience',
  'Why you love working with children',
  'Any additional relevant information',
];

const Bio = () => {
  const dispatch = useAppDispatch();
  const { headline, bio, freeGated } = useProviderCCState();

  const setHeadline = (newHeadline: string) =>
    dispatch({ type: 'setCCHeadline', headline: newHeadline });
  const setBio = (newBio: string) => dispatch({ type: 'setCCBio', bio: newBio });

  return (
    <BioPage
      title="My bio"
      headline={headline}
      bio={bio}
      freeGated={freeGated}
      onBioChange={setBio}
      onHeadlineChange={setHeadline}
      nextRoute={PROVIDER_CHILD_CARE_ROUTES.PHOTO}
      examples={examples}
      serviceType={ServiceType.CHILD_CARE}
    />
  );
};

export default Bio;
