import BioPage from '@/components/pages/provider/headline-bio';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import { PROVIDER_ROUTES } from '@/constants';

const examples = [
  'Your prior senior care experience',
  'Why you love working with seniors',
  'Any additional relevant information',
];

const Bio = () => {
  const dispatch = useAppDispatch();
  const { headline, bio } = useProviderState();

  const setHeadline = (newHeadline: string) =>
    dispatch({ type: 'setHeadline', headline: newHeadline });
  const setBio = (newBio: string) => dispatch({ type: 'setBio', bio: newBio });

  return (
    <BioPage
      title="Help your profile stand out!"
      headline={headline}
      bio={bio}
      onBioChange={setBio}
      onHeadlineChange={setHeadline}
      nextRoute={PROVIDER_ROUTES.PHOTO}
      examples={examples}
    />
  );
};

export default Bio;
