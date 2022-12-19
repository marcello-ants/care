import { GetServerSidePropsContext } from 'next';
import internalOnly from '../internalOnly';

describe('internalOnly', () => {
  let fakeContext: GetServerSidePropsContext;

  beforeEach(() => {
    fakeContext = {
      // @ts-ignore we only care about the headers
      req: {
        headers: {},
      },
    };
  });

  it("should return an empty props object when the special headers aren't present", async () => {
    expect(await internalOnly()(fakeContext)).toEqual({ props: {} });
  });

  it('should return an empty props object when the request has some of the special headers', async () => {
    fakeContext.req.headers['x-crcm-request-id'] = '12345';
    fakeContext.req.headers['x-forwarded-host'] = 'www.dev.carezen.net';

    expect(await internalOnly()(fakeContext)).toEqual({ props: {} });
  });

  it('should return notFound when the request has the special headers', async () => {
    fakeContext.req.headers['x-crcm-request-id'] = '12345';
    fakeContext.req.headers['x-forwarded-host'] = 'www.care.com';

    expect(await internalOnly()(fakeContext)).toEqual({ notFound: true });
  });

  it('should return notFound when the request is missing x-forwarded-host', async () => {
    fakeContext.req.headers['x-crcm-request-id'] = '12345';

    expect(await internalOnly()(fakeContext)).toEqual({ notFound: true });
  });

  it("should call the provided getServerSideProps when passed and the special headers aren't present", async () => {
    const getServerSideProps = jest.fn().mockResolvedValue({ props: { foo: 'bar' } });

    expect(await internalOnly(getServerSideProps)(fakeContext)).toEqual({ props: { foo: 'bar' } });
    expect(getServerSideProps).toHaveBeenCalled();
  });

  it('should not call the provided getServerSideProps when passed and the special headers are present', async () => {
    const getServerSideProps = jest.fn().mockResolvedValue({ props: { foo: 'bar' } });
    fakeContext.req.headers['x-crcm-request-id'] = '12345';
    fakeContext.req.headers['x-forwarded-host'] = 'www.care.com';

    expect(await internalOnly(getServerSideProps)(fakeContext)).toEqual({ notFound: true });
    expect(getServerSideProps).not.toHaveBeenCalled();
  });
});
