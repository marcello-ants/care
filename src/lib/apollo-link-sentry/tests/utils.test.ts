import { getApiErrors } from '../utils';

describe('SentryLink Utils', () => {
  describe('#getApiErrors', () => {
    it('should not include empty fields', () => {
      const extensions = {
        apiErrors: [{ zip: ['Zip Code is empty.'] }, { GLOBAL_ERROR: [] }],
      };
      const apiErrors = getApiErrors(extensions);
      expect(apiErrors).not.toBeNull();
      expect(apiErrors!.GLOBAL_ERROR).not.toBeDefined();
    });

    it('should return null if apiErrors only contains empty values', () => {
      const extensions = {
        apiErrors: [{ zip: [] }, { GLOBAL_ERROR: [] }],
      };
      const apiErrors = getApiErrors(extensions);
      expect(apiErrors).toBeNull();
    });
  });
});
