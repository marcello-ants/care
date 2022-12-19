import { SessionStorageHelper } from '@/utilities/SessionStorageHelper';
import { initialAppState } from '@/state';
import { SHORT_ENROLLMENT_ROUTES } from '@/constants';
import getVertical from '../verticalUtils';

jest.mock('@/utilities/SessionStorageHelper', () => {
  const original = jest.requireActual('@/utilities/SessionStorageHelper');

  return {
    __esModule: true,
    SessionStorageHelper: {
      ...original.SessionStorageHelper,
      isAvailable: jest.fn(),
      getItem: jest.fn(),
    },
  };
});

describe('verticalUtils', () => {
  describe('getVertical', () => {
    let windowSpy: jest.SpyInstance;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    it('should detect /seeker/cc as child care', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/seeker/cc/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Childcare');
    });

    it('should detect /seeker/dc as child care', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/seeker/dc/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Childcare');
    });

    it('should detect /provider/cc as child care', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/provider/cc/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Childcare');
    });

    it('should detect /seeker/dc as senior care', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/seeker/sc/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Seniorcare');
    });

    it('should detect /seeker/hk as housekeeping', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/seeker/hk/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Housekeeping');
    });

    it('should detect /seeker/pc as pet care', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/seeker/pc/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Petcare');
    });

    it('should detect /seeker/tu as tutoring', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          pathname: 'https://example.com/seeker/tu/somepath',
        },
      }));

      const result = getVertical();
      expect(result).toBe('Tutoring');
    });

    it('should detect/short-enrollment as short-enrollment current vertical value', () => {
      const customState = {
        ...initialAppState,
        seeker: { ...initialAppState.seeker, vertical: 'Daycare' },
      };
      (SessionStorageHelper.isAvailable as jest.Mock).mockReturnValue(true);
      (SessionStorageHelper.getItem as jest.Mock).mockReturnValue(JSON.stringify(customState));

      windowSpy.mockImplementation(() => ({
        location: {
          pathname: `https://example.com${SHORT_ENROLLMENT_ROUTES.PASSWORD}`,
        },
      }));

      const result = getVertical();
      expect(result).toBe('Daycare');
    });

    it('should allow the path to be passed in', () => {
      const result = getVertical('/app/enrollment/seeker/cc');
      expect(result).toBe('Childcare');
    });
  });
});
