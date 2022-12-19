import getConfig from 'next/config';
import { WINDOW_SPLUNK_TRACE_TRANSACTION_KEY } from '@/constants';

const {
  publicRuntimeConfig: {
    APP_VERSION,
    SPLUNK_RUM_BEACON_URL,
    SPLUNK_RUM_KEY,
    SPLUNK_RUM_APP_NAME,
    SPLUNK_RUM_ENV,
  },
} = getConfig();

if (window[WINDOW_SPLUNK_TRACE_TRANSACTION_KEY] === true && window.SplunkRum) {
  window.SplunkRum.init({
    beaconUrl: SPLUNK_RUM_BEACON_URL,
    rumAuth: SPLUNK_RUM_KEY,
    app: SPLUNK_RUM_APP_NAME,
    environment: SPLUNK_RUM_ENV,
    globalAttributes: {
      'app.version': APP_VERSION,
      'deployment.environment': SPLUNK_RUM_ENV,
    },
  });
}
