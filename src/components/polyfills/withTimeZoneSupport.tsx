import { ComponentType, FC, useEffect, useState } from 'react';
import OverlaySpinner from '@/components/OverlaySpinner';

let needsPolyfill: boolean | undefined;

// eslint-disable-next-line import/prefer-default-export
export const withTimeZoneSupport = <P extends object>(Component: ComponentType<P>): FC<P> => {
  if (typeof needsPolyfill === 'undefined') {
    try {
      needsPolyfill =
        new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).length === 0;
    } catch (e) {
      needsPolyfill = true;
    }
  }

  function TimeZoneSupport(props: P) {
    const [isLoading, setIsLoading] = useState(needsPolyfill);

    useEffect(() => {
      if (needsPolyfill) {
        import('@/utilities/datetimeFormatPolyfill').then(() => {
          setIsLoading(false);
        });
      }
    }, []);

    if (isLoading) {
      return <OverlaySpinner isOpen wrapped />;
    }

    return <Component {...props} />;
  }

  TimeZoneSupport.displayName = `withTimeZoneSupport(${Component.displayName || Component.name})`;

  return TimeZoneSupport;
};
