import '@testing-library/jest-dom/extend-expect';

jest.mock('@care/analytics', () => {
  // Mock all but init function
  const actual = jest.requireActual('@care/analytics');
  return Object.keys(actual).reduce((acc, method) => {
    if (method === 'init') {
      acc[method] = actual.init;
    } else {
      acc[method] = jest.fn();
    }

    return acc;
  }, {});
});

jest.mock('@/components/hooks/useResizeObserver', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

jest.mock('@/utilities/utagHelper', () => {
  return {
    TealiumUtagService: { view: () => {} },
  };
});

jest.mock('@/lib/clientLogger');

jest.mock('oidc-client');

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      APP_NAME: 'APP_NAME',
      APP_VERSION: 'APP_VERSION',
      GRAPHQL_URL: 'GRAPHQL_URL',
      OIDC_STS_AUTHORITY: 'OIDC_STS_AUTHORITY',
      OIDC_CLIENT_ID: 'OIDC_CLIENT_ID',
      OIDC_RESPONSE_TYPE: 'OIDC_RESPONSE_TYPE',
      OIDC_CLIENT_SCOPE: 'OIDC_CLIENT_SCOPE',
      OIDC_CALLBACK_PATH: 'OIDC_CALLBACK_PATH',
      OIDC_LOGOUT_URL: 'OIDC_LOGOUT_URL',
      AMPLITUDE_API_KEY: 'AMPLITUDE_API_KEY',
      ANALYTICS_ENABLED: 'ANALYTICS_ENABLED',
      CZEN_GENERAL_LOGIN: 'CZEN_GENERAL_LOGIN',
      CZEN_GENERAL: 'CZEN_GENERAL',
      CZEN_API_KEY: 'CZEN_API_KEY',
      TEALIUM_ENV: 'TEALIUM_ENV',
      SENTRY_ENABLED: 'SENTRY_ENABLED',
      SENTRY_ENV: 'SENTRY_ENV',
      SENTRY_DSN: 'SENTRY_DSN',
      SENTRY_APP_RELEASE: 'SENTRY_APP_RELEASE',
    },
  };
});

beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.localStorage?.clear();
    window.sessionStorage?.clear();
  }
});

// eslint-disable-next-line no-global-assign
global.fetch = jest.fn(() => Promise.resolve({}));

if (typeof document !== 'undefined') {
  const fbScript = document.createElement('script');
  fbScript.id = 'facebook-jssdk';
  document.body.appendChild(fbScript);
}
