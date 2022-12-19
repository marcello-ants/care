import OverlaySpinner from '@/components/OverlaySpinner';
import { useEffect, useState } from 'react';
import ContinuousMonitoring from '@/components/pages/provider/ContinuousMonitoring';
import AuthService from '@/lib/AuthService';
import { captureException } from '@sentry/nextjs';
import { logger } from '@sentry/utils';
import { CLIENT_SIDE_ERROR_TAG } from '@/constants';

const DisclosurePage = () => {
  const authService = AuthService();

  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await authService.getUser();

        if (!user) {
          authService.login();
        } else {
          setUid(user.profile.sub.substring(4));
        }
      } catch (e) {
        captureException(e);
        logger.error({ error: e as Error, tags: [CLIENT_SIDE_ERROR_TAG] });
      }
    })();
  }, []);

  if (!uid) return <OverlaySpinner isOpen wrapped />;

  return <ContinuousMonitoring uid={uid} />;
};

export default DisclosurePage;
