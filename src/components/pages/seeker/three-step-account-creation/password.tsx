import Password from '@/components/Password';
import { VerticalsAbbreviation } from '@/constants';
import { useTealiumTrackingOnPasswordScreen } from '@/components/hooks/useTealiumTrackingOnPasswordScreen';

interface PasswordPageProps {
  vertical: VerticalsAbbreviation;
}

export default function PasswordPage({ vertical }: PasswordPageProps) {
  useTealiumTrackingOnPasswordScreen(vertical);

  return <Password vertical={vertical} />;
}
