import { GetServerSideProps } from 'next';

/**
 * This function is meant to be used on Next.JS pages that shouldn't be publicly accessible in prod
 * via https://www.care.com but rather via internal URL (ex: https://enrollment-mfe.useast1.prod.omni.carezen.net).
 *
 * To apply this to a page, assign this to the page's getServerSideProps export.
 *
 * Ex:
 *
 * export const getServerSideProps = internalOnly();
 *
 * If your page already has a getServerSideProps function, you can pass it in:
 *
 * Ex:
 *
 * export const getServerSideProps = internalOnly(myGetServerSideProps);
 *
 */
export default function internalOnly(
  getServerSidePropsFunc?: GetServerSideProps
): GetServerSideProps {
  return async (context) => {
    const { headers } = context.req;

    // if the request was handled by akamai, the x-crcm-request-id header will be present
    // https://wiki.infra.carezen.net/pages/viewpage.action?spaceKey=tech&title=Akamai+Headers+and+Cookies
    const fromAkamai = typeof headers['x-crcm-request-id'] === 'string';

    // the x-forwarded-host header indicates which host the originating request came from
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host
    const forwardedHost = headers['x-forwarded-host'];
    const fromCareDotCom = forwardedHost === 'www.care.com';

    // if akamai handled the request and it's missing the x-forwarded-host header
    // or the request originated from www.care.com then return a 404.
    if (fromAkamai && (!forwardedHost || fromCareDotCom)) {
      return {
        notFound: true,
      };
    }

    if (getServerSidePropsFunc) {
      return getServerSidePropsFunc(context);
    }

    return {
      props: {},
    };
  };
}
