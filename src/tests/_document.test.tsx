import { SERVER_FEATURE_FLAGS } from '../constants';
import CustomDocument from '../pages/_document';

jest.mock('next/document', () => {
  const actual = jest.requireActual<typeof import('next/document')>('next/document');
  class FakeDocument extends actual.default {}
  FakeDocument.getInitialProps = jest.fn().mockResolvedValue({});

  return {
    __esModule: true,
    ...actual,
    default: FakeDocument,
  };
});

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      cdnRoot: 'https://www.care.com',
    },
    serverRuntimeConfig: {
      SPLUNK_RUM_BEACON_URL: '',
      SPLUNK_RUM_KEY: '',
      SPLUNK_RUM_APP_NAME: '',
      SPLUNK_RUM_ENV: '',
      SIFT_SCIENCE_ACCOUNT_ID: '',
      SIFT_SCIENCE_ENABLED: '',
    },
  };
});

describe('_document Page', () => {
  describe('#getInitialProps', () => {
    let ctx: any;
    const flags: any = {};

    beforeEach(() => {
      flags[SERVER_FEATURE_FLAGS.SPLUNK_RUM_EVAL] = 'on';
      flags[SERVER_FEATURE_FLAGS.SENTRY_SESSION_REPLAY] = false;

      const ldClientMock = {
        variationDetail: jest
          .fn()
          .mockImplementation((flag) => Promise.resolve({ value: flags[flag] })),
      };

      ctx = {
        renderPage: jest.fn().mockReturnValue({ html: {}, head: {} }),
        req: {
          careContext: {
            ldClient: ldClientMock,
            ldUser: {},
            sentryTraceTransaction: true,
            nonce: '123',
          },
        },
      };
    });

    it('should return sentryTraceTransaction from context', async () => {
      let initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentryTraceTransaction: true,
        })
      );

      ctx.req.careContext.sentryTraceTransaction = false;
      initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentryTraceTransaction: false,
        })
      );
    });

    it("should return sentryTraceTransaction as false when it's not on the context", async () => {
      delete ctx.req.careContext.sentryTraceTransaction;
      const initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentryTraceTransaction: false,
        })
      );
    });

    it('should return the result of the SPLUNK_RUM_EVAL flag as on', async () => {
      let initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          splunkRumEval: 'on',
        })
      );

      flags[SERVER_FEATURE_FLAGS.SPLUNK_RUM_EVAL] = 'off';
      initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          splunkRumEval: 'off',
        })
      );
    });

    it('should return splunkRumEval as off when the ldClient is not on the context', async () => {
      delete ctx.req.careContext.ldClient;
      const initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          splunkRumEval: 'off',
        })
      );
    });

    it('should return splunkRumEval as off when the context is missing', async () => {
      delete ctx.req.careContext;
      const initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          splunkRumEval: 'off',
        })
      );
    });

    it('should return sentrySessionReplay according to whether the SENTRY_SESSION_REPLAY flag is on', async () => {
      let initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentrySessionReplay: false,
        })
      );

      flags[SERVER_FEATURE_FLAGS.SENTRY_SESSION_REPLAY] = true;
      initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentrySessionReplay: true,
        })
      );
    });

    it('should return sentrySessionReplay: false when the context is missing', async () => {
      delete ctx.req.careContext;
      const initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentrySessionReplay: false,
        })
      );
    });

    it('should return sentrySessionReplay: false when the ldClient is not on the context', async () => {
      delete ctx.req.careContext.ldClient;
      const initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          sentrySessionReplay: false,
        })
      );
    });

    it('should return nonce from context', async () => {
      let initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          cspNonce: '123',
        })
      );

      ctx.req.careContext.sentryTraceTransaction = false;
      initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          cspNonce: '123',
        })
      );
    });

    it('should append nonce to jss-server-side style', async () => {
      let initialProps = await CustomDocument.getInitialProps(ctx);
      expect(initialProps).toEqual(
        expect.objectContaining({
          cspNonce: '123',
        })
      );

      ctx.req.careContext.sentryTraceTransaction = false;
      initialProps = await CustomDocument.getInitialProps(ctx);
      // @ts-ignore
      expect(initialProps.styles[0].props.nonce).toEqual('123');
    });
  });
});
