// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { Offline as OfflineIntegration } from '@sentry/integrations';
import SentryRRWeb from '@sentry/rrweb';
// @ts-ignore TypeScript is looking in the wrong file to know BrowserTracing is exported
import { BrowserTracing } from '@sentry/nextjs';
import { WINDOW_SENTRY_SESSION_REPLAY_KEY, WINDOW_SENTRY_TRACE_TRANSACTION_KEY } from '@/constants';
import initSentry from './sentry.init';

const integrations = [new BrowserTracing(), new OfflineIntegration()];

if (window[WINDOW_SENTRY_SESSION_REPLAY_KEY] === true) {
  integrations.push(new SentryRRWeb());
}

initSentry({
  integrations,
  tracesSampler: (samplingContext) => {
    // always sample requests where the parent is being sampled
    if (samplingContext.parentSampled) {
      return true;
    }

    return window[WINDOW_SENTRY_TRACE_TRANSACTION_KEY] === true;
  },
});
