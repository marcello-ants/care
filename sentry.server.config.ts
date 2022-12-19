// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import initSentry from './sentry.init';

initSentry({
  tracesSampler: (samplingContext) => {
    // always sample requests where the parent is being sampled
    if (samplingContext.parentSampled) {
      return true;
    }

    return samplingContext.request?.careContext?.sentryTraceTransaction ?? false;
  },
});
