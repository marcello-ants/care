import { useEffect } from 'react';
import { User, UserManager, WebStorageStateStore } from 'oidc-client';
import logger from '@/lib/clientLogger';
import { captureException, captureMessage, Severity } from '@sentry/nextjs';
import { CLIENT_SIDE_ERROR_TAG } from '@/constants';
import logClickEventUtility from '@/utilities/log-click-event';
import OverlaySpinner from '../components/OverlaySpinner';
import { SafeLocalStorage } from '../utilities/localStorageHelper';

const LOG_TAG = 'authCallback';
const MEMBER_UUID_REGEX = /^mem:(.+)$/;

function AuthCallBack() {
  /**
   * Make a request to czen's click tracking API to record a click event for the member that just logged in.
   * @param user
   */
  async function logClickEvent(user: User) {
    const sub = user.profile?.sub;
    if (!sub) {
      const msg = '"sub" value not found in user profile"';
      captureMessage(msg, {
        level: Severity.Error,
      });
      logger.error({
        tags: [LOG_TAG],
        msg,
      });

      return;
    }

    const memberUuid = MEMBER_UUID_REGEX.exec(sub)?.[1];
    if (!memberUuid) {
      const msg = 'Unable to extract member UUID from "sub" field in user profile';
      captureMessage(msg, {
        level: Severity.Error,
      });
      logger.error({
        tags: [LOG_TAG],
        msg,
        sub,
      });

      return;
    }

    await logClickEventUtility(memberUuid, false);
  }

  const redirectMe = (user: User | null) => {
    const url = (user?.state as string) ?? '/';
    window.location.replace(url);
  };
  const open = true;
  useEffect(() => {
    (async function doRedirect() {
      try {
        const manager = new UserManager({
          response_mode: 'query',
          userStore: new WebStorageStateStore({
            prefix: 'czen.oidc.',
            store: SafeLocalStorage.getInstance(),
          }),
        });

        const user = await manager.signinRedirectCallback();

        try {
          await logClickEvent(user);
        } catch (error) {
          captureException(error);
          logger.error({
            tags: [LOG_TAG],
            msg: 'An error occurred logging the click event',
            error: (error as Error).message,
          });
        }

        redirectMe(user);
      } catch (e) {
        logger.error({
          tags: [LOG_TAG, CLIENT_SIDE_ERROR_TAG],
          error: e as Error,
        });
        captureException(e);
        redirectMe(null);
      }
    })();
  }, []);

  return <OverlaySpinner isOpen={open} wrapped />;
}

export default AuthCallBack;
