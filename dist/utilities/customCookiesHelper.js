"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIdCookieBody = void 0;
/**
 * Returns cookie body EnrollmentSessionId into a string
 */
function generateIdCookieBody({ cookieName, cookieValue, maxAge = 60 * 60 * 24 * 365, path = '/', secure, samesite = 'Strict', }) {
    if (samesite === 'None' && !secure) {
        throw new Error('SameSite None cannot be set when secure attribute is not enabled.');
    }
    const secureAttribute = secure ? 'secure;' : '';
    return `${cookieName}=${cookieValue};max-age=${maxAge};path=${path};${secureAttribute}samesite=${samesite};`;
}
exports.generateIdCookieBody = generateIdCookieBody;
