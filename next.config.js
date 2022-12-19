/* eslint-disable no-console */
const withTM = require('next-transpile-modules')([
  'lodash-es',
  '@googlemaps/js-api-loader',
  'apollo-upload-client',
  'extract-files',
  'yup',
]);
const { withSentryConfig } = require('@sentry/nextjs');
const Fs = require('fs');
const { name, version } = require('./package.json');

const SENTRY_AUTH_TOKEN_SECRET_PATH = '/run/secrets/sentryKey';
const SENTRY_ORG = process.env.SENTRY_ORG || 'care-dot-com';
let sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
if (!sentryAuthToken && Fs.existsSync(SENTRY_AUTH_TOKEN_SECRET_PATH)) {
  console.log(`Reading SENTRY_AUTH_TOKEN from path="${SENTRY_AUTH_TOKEN_SECRET_PATH}"`);
  sentryAuthToken = Fs.readFileSync(SENTRY_AUTH_TOKEN_SECRET_PATH, 'utf8');
}

// the name of the Sentry release to which we'll upload sourcemaps and match stack traces against at runtime
const SENTRY_APP_RELEASE = `${name}@${version}`;

const sentryWebpackPluginOptions = {
  authToken: sentryAuthToken,
  org: SENTRY_ORG,
  project: name,
  release: SENTRY_APP_RELEASE,
  include: ['.next', 'static'],
  urlPrefix: '~/app/enrollment/_next',

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const basePath = '/app/enrollment';
const loggingPath = '/api/logs';

module.exports = withTM(
  withSentryConfig(
    {
      basePath,
      devIndicators: {
        autoPrerender: false,
      },
      productionBrowserSourceMaps: true,
      publicRuntimeConfig: {
        APP_NAME: name,
        APP_VERSION: version,
        BASE_PATH: basePath,
        LOGGING_PATH: loggingPath,
        cdnRoot: process.env.NEXT_PUBLIC_CDN_ROOT,
        GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        OIDC_STS_AUTHORITY: process.env.NEXT_PUBLIC_OIDC_STS_AUTHORITY,
        OIDC_CLIENT_ID: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
        OIDC_RESPONSE_TYPE: process.env.NEXT_PUBLIC_OIDC_RESPONSE_TYPE,
        OIDC_CLIENT_SCOPE: process.env.NEXT_PUBLIC_OIDC_CLIENT_SCOPE,
        OIDC_CALLBACK_PATH: process.env.NEXT_PUBLIC_OIDC_CALLBACK_PATH,
        OIDC_LOGOUT_URL: process.env.NEXT_PUBLIC_OIDC_LOGOUT_URL,
        AMPLITUDE_API_KEY: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
        AMPLITUDE_ENV: process.env.NEXT_PUBLIC_AMPLITUDE_ENV,
        ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
        CZEN_GENERAL_LOGIN: process.env.CZEN_GENERAL_LOGIN,
        CZEN_GENERAL: process.env.CZEN_GENERAL,
        TEALIUM_ENV: process.env.TEALIUM_ENV,
        GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
        SENTRY_ENABLED: process.env.SENTRY_ENABLED,
        SENTRY_ENV: process.env.SENTRY_ENV,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_APP_RELEASE,
        SPLUNK_RUM_BEACON_URL: process.env.SPLUNK_RUM_BEACON_URL,
        SPLUNK_RUM_KEY: process.env.SPLUNK_RUM_KEY,
        SPLUNK_RUM_APP_NAME: process.env.SPLUNK_RUM_APP_NAME,
        SPLUNK_RUM_ENV: process.env.SPLUNK_RUM_ENV,
        GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      },
      serverRuntimeConfig: {
        OIDC_SERVER_CALLBACK_URL: process.env.OIDC_SERVER_CALLBACK_URL,
        OIDC_SERVER_TOKEN_EXCHANGE_URL: process.env.OIDC_SERVER_TOKEN_EXCHANGE_URL,
        OIDC_SERVER_OAUTH_URL: process.env.OIDC_SERVER_OAUTH_URL,

        SIFT_SCIENCE_ACCOUNT_ID: process.env.SIFT_SCIENCE_ACCOUNT_ID,
        SIFT_SCIENCE_ENABLED: process.env.SIFT_SCIENCE_ENABLED,
      },
      sentry: {
        disableClientWebpackPlugin: !sentryAuthToken,
        disableServerWebpackPlugin: !sentryAuthToken,
      },
      swcMinify: true,
      webpack: (config, { isServer }) => {
        // Leave server bundle as-is
        if (isServer) {
          return config;
        }
        // Overwrite current entrypoints
        const origEntry = config.entry;
        const entry = async () => {
          let entries = origEntry;
          if (typeof entries === 'function') {
            entries = await entries();
          }

          const instrumentFile = './splunk-rum.ts';

          // Webpack accepts string, string[] or object as entrypoint values
          // https://webpack.js.org/configuration/entry-context/#entry
          // Generally, in our testing main is just a string value
          // but for completeness/future safety this covers all
          if (typeof entries.main === 'string') {
            entries.main = [entries.main, instrumentFile];
          } else if (Array.isArray(entries.main)) {
            entries.main = [...entries.main, instrumentFile];
          } else {
            let imported = entries.main.import;
            if (typeof imported === 'string') {
              imported = [imported, instrumentFile];
            } else {
              imported = [...imported, instrumentFile];
            }

            entries.main = {
              ...entries.main,
              import: imported,
            };
          }

          return entries;
        };

        // Replace entry in config with new value
        return {
          ...config,
          entry,
        };
      },
    },
    sentryWebpackPluginOptions
  )
);
