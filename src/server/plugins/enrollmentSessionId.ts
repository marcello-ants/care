import { FastifyInstance } from 'fastify';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import { generateIdCookieBody } from '../../utilities/customCookiesHelper';
import { ENROLLMENT_SESSION_ID_COOKIE_NAME } from '../../constants';

interface PluginOptions {
  dev: boolean;
}

/**
 * Registers an `onRequest` handler that will read the `enrollment-session-id` cookie from the request, create a new
 * ID if no cookie is present, and then persist the ID on the client via a `set-cookie` response header.p
 * @param fastify
 * @param dev
 */
export function register(fastify: FastifyInstance, { dev }: PluginOptions) {
  fastify.addHook('onRequest', async function hook(req, reply) {
    // extract or create the enrollmentSessionId
    const cookies = new Cookies(req.headers.cookie);
    const enrollmentSessionId = cookies.get(ENROLLMENT_SESSION_ID_COOKIE_NAME) || uuidv4();
    req.raw.enrollmentSessionId = enrollmentSessionId;

    // persist the enrollmentSessionId via a cookie on the client
    const cookieBodyEnrollmentSessionId: string = generateIdCookieBody({
      cookieName: ENROLLMENT_SESSION_ID_COOKIE_NAME,
      cookieValue: enrollmentSessionId,
      secure: !dev,

      // using `Lax` instead of `Strict` so the session cookie will be sent to our app after the user completes the OIDC auth flow,
      // which currently runs on a separate domain (`auth.careapis.com`) than our web apps
      samesite: 'Lax',
    });

    reply.header('set-cookie', cookieBodyEnrollmentSessionId);
  });
}

export default register;
