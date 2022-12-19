import { FastifyRequest } from 'fastify';
import { SERVER_FEATURE_FLAGS } from '@/constants';
import shouldEnableSentryTracing from '../sentryTracing';

describe('server/shouldEnableSentryTracing', () => {
  let req: Partial<FastifyRequest> = {
    careContext: {},
  };

  const flags: any = {};
  beforeEach(() => {
    flags[SERVER_FEATURE_FLAGS.SENTRY_TRACE_TRANSACTION] = true;

    const ldClientMock = {
      variationDetail: jest
        .fn()
        .mockImplementation((flag) => Promise.resolve({ value: flags[flag] })),
    };
    req = {
      careContext: {
        // @ts-ignore
        ldClient: ldClientMock,
        ldUser: { key: '12345' },
      },
    };
  });

  it('should return true when the flag is true', async () => {
    expect(await shouldEnableSentryTracing(req as FastifyRequest)).toBe(true);
  });

  it('should return false when the flag is false', async () => {
    flags[SERVER_FEATURE_FLAGS.SENTRY_TRACE_TRANSACTION] = false;
    expect(await shouldEnableSentryTracing(req as FastifyRequest)).toBe(false);
  });

  it('should return false when the launch darkly client is not on the request', async () => {
    req.careContext = {};
    expect(await shouldEnableSentryTracing(req as FastifyRequest)).toBe(false);
  });

  it('should return false when the request is lacking a context object', async () => {
    delete req.careContext;
    expect(await shouldEnableSentryTracing(req as FastifyRequest)).toBe(false);
  });
});
