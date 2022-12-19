import requestLoggerProps from '@/server/requestLoggerProps';
import { FastifyRequest } from 'fastify';

describe('server/requestLoggerProps', () => {
  let previousCookieImpl: PropertyDescriptor | undefined;
  let req: Partial<FastifyRequest> = {
    headers: {},
  };

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    req = {
      headers: {},
    };

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

  it('should return the czen visitor ID', () => {
    req.headers!.cookie = 'n_vis=czen-visitor-id; other=cookie';
    const props = requestLoggerProps(req as FastifyRequest);

    expect(props).toEqual(
      expect.objectContaining({
        czenVisitorId: 'czen-visitor-id',
      })
    );
  });

  it('should return a czen visitor ID if  present', () => {
    req.headers!.cookie = 'n_vis=czen-visitor-id; other=cookie';
    const props = requestLoggerProps(req as FastifyRequest);

    expect(props).toEqual(
      expect.objectContaining({
        czenVisitorId: 'czen-visitor-id',
      })
    );
  });

  it('should return the deviceType', () => {
    process.env = OLD_ENV;

    req.headers!['user-agent'] =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    const props = requestLoggerProps(req as FastifyRequest);

    expect(props).toEqual(
      expect.objectContaining({
        deviceType: 'smartphone',
      })
    );
  });

  it('should return whether the request contains a session cookie', () => {
    process.env = OLD_ENV;

    req.headers!.cookie = 'n_vis=czen-visitor-id; other=cookie';
    expect(requestLoggerProps(req as FastifyRequest)).toEqual(
      expect.objectContaining({
        hasSessionCookie: false,
      })
    );

    req.headers!.cookie = 'csc-session=sessionCookie';
    expect(requestLoggerProps(req as FastifyRequest)).toEqual(
      expect.objectContaining({
        hasSessionCookie: true,
      })
    );
  });
});
