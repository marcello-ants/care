import { captureMessage, Severity } from '@sentry/nextjs';
import Logger from '../lib/clientLogger';

// Builds the URL - pulled it out for prettier formatting
const trackClickUrl = (memberUuid: string) => {
  return `/trackClick.do?contentType=mfeClick&contentId=${memberUuid}`;
};

const logClickEvent = async (memberUuid: string, fromApp: boolean = true) => {
  const clickRequestStartTime = performance.now();
  const logTag = fromApp ? '_app' : 'authCallback';
  const response = await fetch(trackClickUrl(memberUuid));
  const elapsed = performance.now() - clickRequestStartTime;

  if (response.status !== undefined) {
    Logger.info({
      tags: [logTag],
      msg: 'Finished logging post-auth click event',
      elapsed,
    });

    if (response.status !== 204) {
      const msg = 'Unexpected non-204 response status from click event API';

      captureMessage(msg, {
        level: Severity.Error,
        tags: {
          'response.status': response.status,
        },
      });

      Logger.error({
        tags: [logTag],
        msg,
        'response.status': response.status,
      });
    }
  }
};

export default logClickEvent;
