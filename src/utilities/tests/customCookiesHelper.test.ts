import { v4 as uuidv4 } from 'uuid';
import { generateIdCookieBody } from '../customCookiesHelper';
import { ENROLLMENT_SESSION_ID_COOKIE_NAME } from '../../constants';

describe('customCookies Helper', () => {
  it('Checks the generated cookie body without security attribute', () => {
    const enrollmentSessionId = uuidv4();
    // Checking if the samesite is retrieving correctly the passed value.
    const nonPRDCookieWithSameSiteLaxBodyString = generateIdCookieBody({
      cookieName: ENROLLMENT_SESSION_ID_COOKIE_NAME,
      cookieValue: enrollmentSessionId,
      samesite: 'Lax',
    });
    expect(nonPRDCookieWithSameSiteLaxBodyString).toEqual(
      `enrollment-session-id=${enrollmentSessionId};max-age=31536000;path=/;samesite=Lax;`
    );
    // Checking when samesite is None and Secure false.
    expect(() => {
      generateIdCookieBody({
        cookieName: ENROLLMENT_SESSION_ID_COOKIE_NAME,
        cookieValue: enrollmentSessionId,
        samesite: 'None',
      });
    }).toThrow('SameSite None cannot be set when secure attribute is not enabled.');
  });

  it('Checks the generated cookie body with security attribute', () => {
    const enrollmentSessionId = uuidv4();
    const productionCookieBodyString = generateIdCookieBody({
      cookieName: ENROLLMENT_SESSION_ID_COOKIE_NAME,
      cookieValue: enrollmentSessionId,
      secure: true,
    });
    expect(productionCookieBodyString).toEqual(
      `enrollment-session-id=${enrollmentSessionId};max-age=31536000;path=/;secure;samesite=Strict;`
    );
  });
});
