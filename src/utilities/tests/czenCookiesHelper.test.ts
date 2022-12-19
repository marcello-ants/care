import { getCzenVisitorId, getCzenSessionId } from '../czenCookiesHelper';

describe('czenCookiesHelper', () => {
  let prevCookie: string;
  beforeEach(() => {
    prevCookie = document.cookie;
  });
  afterEach(() => {
    document.cookie = prevCookie;
  });

  describe('getCzenSessionId', () => {
    it('should return the czenSessionId', () => {
      document.cookie = 'csc=12345';
      expect(getCzenSessionId()).toBe('12345');
    });
  });

  describe('getCzenVisitorId', () => {
    it('should return the czenVisitorId', () => {
      document.cookie = 'n_vis=67890';
      expect(getCzenVisitorId()).toBe('67890');
    });
  });
});
