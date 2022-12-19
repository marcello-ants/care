// A convenience function for initializing Sentry on the client and server

import getConfig from 'next/config';
import { init } from '@sentry/nextjs';
import { excludeGraphQLFetch } from '@/lib/apollo-link-sentry';

const {
  publicRuntimeConfig: { GRAPHQL_URL, SENTRY_APP_RELEASE, SENTRY_DSN, SENTRY_ENABLED, SENTRY_ENV },
} = getConfig();

type InitOptions = Parameters<typeof init>[0];

const defaultConfig: Partial<InitOptions> = {
  beforeBreadcrumb: excludeGraphQLFetch(GRAPHQL_URL),
  dsn: SENTRY_DSN,
  environment: SENTRY_ENV,
  release: SENTRY_APP_RELEASE,
};

export default function initSentry(config: Partial<InitOptions> = {}) {
  if (SENTRY_ENABLED === 'true') {
    init({
      ...defaultConfig,
      ...config,
    });
  }
}
