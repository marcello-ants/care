export interface GenerateIdCookieBodyInput {
  cookieName: string;
  cookieValue: string;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  samesite?: 'None' | 'Lax' | 'Strict';
}

/**
 * Returns cookie body EnrollmentSessionId into a string
 */
export function generateIdCookieBody({
  cookieName,
  cookieValue,
  maxAge = 60 * 60 * 24 * 365,
  path = '/',
  secure,
  samesite = 'Strict',
}: GenerateIdCookieBodyInput): string {
  if (samesite === 'None' && !secure) {
    throw new Error('SameSite None cannot be set when secure attribute is not enabled.');
  }
  const secureAttribute = secure ? 'secure;' : '';
  return `${cookieName}=${cookieValue};max-age=${maxAge};path=${path};${secureAttribute}samesite=${samesite};`;
}
