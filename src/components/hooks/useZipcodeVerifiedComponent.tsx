import { useRouter } from 'next/router';
import { useEffect } from 'react';
import logger from '@/lib/clientLogger';
import { useSeekerState } from '../AppState';

export const withZipcodeVerification = (
  Component: React.ComponentType,
  loggerMessage: string,
  redirectUrl: string
) => {
  function WithZipcodeVerification(props: {}) {
    const router = useRouter();
    const seekerState = useSeekerState();
    const isValid = Boolean(seekerState.zipcode);

    useEffect(() => {
      if (!isValid) {
        logger.warn({ event: loggerMessage });
        router.push(redirectUrl);
      }
    }, [isValid]);

    return isValid ? <Component {...props} /> : null;
  }

  WithZipcodeVerification.displayName = `withZipcodeVerification(${
    Component.displayName || Component.name
  })`;

  return WithZipcodeVerification;
};
