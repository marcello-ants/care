import { ClientLogger } from '@care/utils';
import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { BASE_PATH, LOGGING_PATH },
} = getConfig();

const Logger = new ClientLogger({
  endpoint: `${BASE_PATH}${LOGGING_PATH}`,
  onError: Sentry.captureException,
});

export default Logger;
