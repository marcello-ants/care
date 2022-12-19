import { AppContext } from 'next/app';
import { LDEvaluationDetail, LDFlagValue, LDUser } from 'launchdarkly-node-server-sdk';

import App, { getInitialProps as AppGetInitialProps } from '@/pages/_app';
import { useRouter } from 'next/router';
import { render } from '@testing-library/react';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import amplitude from 'amplitude-js';
import { ApiKey } from '@/__generated__/ampli';

jest.mock('@/lib/AuthService');

jest.mock('next/config', () =>
  jest.fn().mockReturnValue({
    publicRuntimeConfig: {
      ANALYTICS_ENABLED: 'true',
      AMPLITUDE_API_KEY: 'mock api key',
    },
  })
);

jest.mock('../constants', () => ({
  ...(jest.requireActual('../constants') as object),
  CLIENT_FEATURE_FLAGS: {
    A: 'a',
    B: 'b',
    DOES_NOT_EXIST: 'does not exist',
  },
}));

jest.mock('next/router', () => ({
  ...(jest.requireActual('next/router') as object),
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockLdClient = {
  async variationDetail(
    key: string,
    user: LDUser,
    defaultValue: LDFlagValue
  ): Promise<LDEvaluationDetail> {
    switch (key) {
      case 'a':
        return {
          value: 'aValue',
          variationIndex: 0,
          reason: {
            kind: 'FALLTHROUGH',
          },
        };

      case 'b':
        return {
          value: 'bValue',
          variationIndex: 1,
          reason: {
            kind: 'FALLTHROUGH',
          },
        };

      default:
        return {
          // despite the LDEvaluationDetail type claiming that `variationIndex` is either a number or undefined
          // when evaluation fails, it's actually `null`
          variationIndex: null as any,
          value: defaultValue,
          reason: {
            kind: 'ERROR',
            errorKind: 'FLAG_NOT_FOUND',
          },
        };
    }
  },
};

describe('App - a', () => {
  let mockRouter: any | null = null;

  beforeEach(() => {
    mockRouter = {
      query: { param: [] },
      pathname: '/seeker/sc/caregivers-near-you',
      asPath: '/seeker/sc/caregivers-near-you',
      beforePopState: (cb: Function) => {
        cb({ url: '/seeker/sc/caregivers-near-you' });
      },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });
  describe('component', () => {
    it('should render snapshot', () => {
      const LDFlags: FeatureFlags = {};
      const MyMockComponent = () => <div>Hello World</div>;
      const { asFragment } = render(
        <App
          pageProps={{}}
          enrollmentSessionId="123"
          err={{ name: 'a', message: 'a' }}
          referrerCookie={undefined}
          czenVisitorId={undefined}
          czenJSessionId={undefined}
          czenSessionId={undefined}
          ldClientFlags={LDFlags}
          router={mockRouter}
          Component={MyMockComponent}
          czenAuthCookieExists={false}
          careDeviceId="123"
          hasMemberCookie={false}
          cookieAuthContext={undefined}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it('should trigger trackClick when rendered if cookieAuthContext has a memberUuid', () => {
      const originalFetch = global.fetch;
      global.fetch = jest
        .fn()
        .mockReturnValue(new Promise((resolve) => setTimeout(() => resolve({ status: 204 }), 10)));

      const MyMockComponent = () => <div>Hello World</div>;
      const mockCookieAuthContext = {
        isLoggedIn: true,
        memberUuid: 'memberUuid',
        isImpersonated: false,
      };

      render(
        <App
          pageProps={{}}
          enrollmentSessionId="123"
          err={{ name: 'a', message: 'a' }}
          referrerCookie={undefined}
          czenVisitorId={undefined}
          czenJSessionId={undefined}
          czenSessionId={undefined}
          ldClientFlags={{}}
          router={mockRouter}
          Component={MyMockComponent}
          czenAuthCookieExists={false}
          careDeviceId="123"
          hasMemberCookie={false}
          cookieAuthContext={mockCookieAuthContext}
        />
      );

      expect(global.fetch).toHaveBeenCalledWith(
        `/trackClick.do?contentType=mfeClick&contentId=memberUuid`
      );

      global.fetch = originalFetch;
    });

    it('should setDefaultUserProps for both analytic helpers when feature flag is on', () => {
      const ampliListener = jest.spyOn(AmpliHelper, 'setDefaultUserProps');
      const amplitudeListener = jest.spyOn(AnalyticsHelper, 'setDefaultUserProps');

      const LDFlags: FeatureFlags = {
        [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
          variationIndex: 1,
          value: 'variant',
          reason: { kind: 'FALLTHROUGH' },
        },
      };

      const MyMockComponent = () => <div>Hello World</div>;
      render(
        <App
          pageProps={{}}
          enrollmentSessionId="123"
          err={{ name: 'a', message: 'a' }}
          referrerCookie={undefined}
          czenVisitorId={undefined}
          czenJSessionId={undefined}
          czenSessionId={undefined}
          ldClientFlags={LDFlags}
          router={mockRouter}
          Component={MyMockComponent}
          czenAuthCookieExists={false}
          careDeviceId="123"
          hasMemberCookie={false}
          cookieAuthContext={undefined}
        />
      );

      expect(ampliListener).toHaveBeenCalledTimes(1);
      expect(amplitudeListener).toHaveBeenCalledTimes(1);
    });

    it('should initialize the default amplitude instance when feature flag is off', () => {
      const MyMockComponent = () => <div>Hello World</div>;
      render(
        <App
          pageProps={{}}
          enrollmentSessionId="123"
          err={{ name: 'a', message: 'a' }}
          referrerCookie={undefined}
          czenVisitorId={undefined}
          czenJSessionId={undefined}
          czenSessionId={undefined}
          ldClientFlags={{}}
          router={mockRouter}
          Component={MyMockComponent}
          czenAuthCookieExists={false}
          careDeviceId="123"
          hasMemberCookie={false}
          cookieAuthContext={undefined}
        />
      );

      const defaultAmplitudeInstance = amplitude.getInstance();
      expect(defaultAmplitudeInstance).not.toBeUndefined();
      expect((defaultAmplitudeInstance.options as any).apiKey).toEqual('mock api key');
    });

    it('should initialize two difference amplitude instances when feature flag is on', () => {
      const LDFlags: FeatureFlags = {
        [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
          variationIndex: 1,
          value: 'variant',
          reason: { kind: 'FALLTHROUGH' },
        },
      };

      const MyMockComponent = () => <div>Hello World</div>;
      render(
        <App
          pageProps={{}}
          enrollmentSessionId="123"
          err={{ name: 'a', message: 'a' }}
          referrerCookie={undefined}
          czenVisitorId={undefined}
          czenJSessionId={undefined}
          czenSessionId={undefined}
          ldClientFlags={LDFlags}
          router={mockRouter}
          Component={MyMockComponent}
          czenAuthCookieExists={false}
          careDeviceId="123"
          hasMemberCookie={false}
          cookieAuthContext={undefined}
        />
      );

      const defaultAmplitudeInstance = amplitude.getInstance();
      const ampliAmplitudeInstance = amplitude.getInstance('ampli-instance');

      expect(defaultAmplitudeInstance).not.toBeUndefined();
      expect(ampliAmplitudeInstance).not.toBeUndefined();
      expect(defaultAmplitudeInstance).not.toEqual(ampliAmplitudeInstance);
      expect((defaultAmplitudeInstance.options as any).apiKey).toEqual('mock api key');
      expect((ampliAmplitudeInstance.options as any).apiKey).toEqual(ApiKey.development);
    });
  });

  describe('#getInitialProps', () => {
    let previousCookieImpl: PropertyDescriptor | undefined;

    beforeEach(() => {
      // override the `document.cookie` implementation to return null so that `universal-cookie` doesn't think
      // we're running in a browser and disregard the cookies provided via `req.headers.cookie`
      previousCookieImpl = Object.getOwnPropertyDescriptor(document, 'cookie');
      Object.defineProperty(document, 'cookie', {
        get: jest.fn().mockImplementation(() => null),
        configurable: true,
      });
    });

    afterEach(() => {
      if (previousCookieImpl) {
        Object.defineProperty(document, 'cookie', previousCookieImpl);
      }
    });

    it('should extract the referrerCookie value from the request', async () => {
      const req = {
        headers: {
          cookie: 'foo=bar; rc=7%2C20210109104350',
        },
      };

      const initialProps = await AppGetInitialProps({ ctx: { req } } as AppContext);
      expect(initialProps).toHaveProperty('referrerCookie', '7%2C20210109104350');
    });

    it('should return a null referrerCookie when no rc cookie is provided with the request', async () => {
      const req = {
        headers: {
          cookie: 'foo=bar',
        },
      };

      const initialProps = await AppGetInitialProps({ ctx: { req } } as AppContext);
      expect(initialProps).toHaveProperty('referrerCookie', undefined);
    });

    it('should evaluate all client feature flags and inject a map of evaluation results into the props', async () => {
      const req = {
        url: 'https://www.dev.carezen.net',
        headers: {},
        careContext: {
          ldClient: mockLdClient,
          ldUser: {},
        },
      };

      const res = {
        setHeader: jest.fn(),
      };

      const initialProps = await AppGetInitialProps({ ctx: { req, res } } as any);
      expect(initialProps).toHaveProperty('ldClientFlags', {
        a: {
          value: 'aValue',
          variationIndex: 0,
          reason: {
            kind: 'FALLTHROUGH',
          },
        },
        b: {
          value: 'bValue',
          variationIndex: 1,
          reason: {
            kind: 'FALLTHROUGH',
          },
        },
        'does not exist': {
          variationIndex: null,
          reason: {
            kind: 'ERROR',
            errorKind: 'FLAG_NOT_FOUND',
          },
        },
      });
      expect(res.setHeader).not.toHaveBeenCalledWith('set-cookie', expect.stringMatching(/^ffov=/));
    });

    it('should return hasMemberCookie: true when the csc-session cookie is present on the request', async () => {
      const req = {
        headers: {
          cookie:
            'foo=bar; csc-session=uqs0m8VJcgF70PPOi0P80cHt53kIW1Arf7TJZjiNH7eqfBxezbua1ZUCsk877Js/0V4pXco9e6s5COl4PgdXYA==',
        },
      };

      const initialProps = await AppGetInitialProps({ ctx: { req } } as AppContext);
      expect(initialProps).toHaveProperty('hasMemberCookie', true);
    });

    it('should return hasMemberCookie: false when the csc-session cookie is not present on the request', async () => {
      const req = {
        headers: {
          cookie: 'foo=bar;',
        },
      };

      const initialProps = await AppGetInitialProps({ ctx: { req } } as AppContext);
      expect(initialProps).toHaveProperty('hasMemberCookie', false);
    });

    it("should return cookieAuthContext.isLoggedIn = true when there's session data", async () => {
      const req = {
        headers: {},
        careContext: {
          session: { state: 'authenticated', jwt: { sub: 'memberUuid' } },
        },
      };

      const initialProps = await AppGetInitialProps({ ctx: { req } } as AppContext);
      expect(initialProps).toHaveProperty('cookieAuthContext', {
        isLoggedIn: true,
        memberUuid: 'memberUuid',
        isImpersonated: false,
      });
    });
  });
});
