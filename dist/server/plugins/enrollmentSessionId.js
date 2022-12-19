"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const uuid_1 = require("uuid");
const customCookiesHelper_1 = require("../../utilities/customCookiesHelper");
const constants_1 = require("../../constants");
/**
 * Registers an `onRequest` handler that will read the `enrollment-session-id` cookie from the request, create a new
 * ID if no cookie is present, and then persist the ID on the client via a `set-cookie` response header.p
 * @param fastify
 * @param dev
 */
function register(fastify, { dev }) {
    fastify.addHook('onRequest', async function hook(req, reply) {
        // extract or create the enrollmentSessionId
        const cookies = new universal_cookie_1.default(req.headers.cookie);
        const enrollmentSessionId = cookies.get(constants_1.ENROLLMENT_SESSION_ID_COOKIE_NAME) || (0, uuid_1.v4)();
        req.raw.enrollmentSessionId = enrollmentSessionId;
        // persist the enrollmentSessionId via a cookie on the client
        const cookieBodyEnrollmentSessionId = (0, customCookiesHelper_1.generateIdCookieBody)({
            cookieName: constants_1.ENROLLMENT_SESSION_ID_COOKIE_NAME,
            cookieValue: enrollmentSessionId,
            secure: !dev,
            // using `Lax` instead of `Strict` so the session cookie will be sent to our app after the user completes the OIDC auth flow,
            // which currently runs on a separate domain (`auth.careapis.com`) than our web apps
            samesite: 'Lax',
        });
        reply.header('set-cookie', cookieBodyEnrollmentSessionId);
    });
}
exports.register = register;
exports.default = register;
