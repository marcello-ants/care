import { formatAmplitudeDate, formatAmplitudeTime } from '../analyticsHelper';

jest.unmock('../analyticsHelper');
jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      ANALYTICS_ENABLED: true,
      AMPLITUDE_API_KEY: 'key',
    },
  };
});

describe('AnalyticsHelper', () => {
  describe('formatAmplitudeDate', () => {
    it('should return empty line for null', () => {
      const result = formatAmplitudeDate(null);
      expect(result).toBe('');
    });

    it('should return date', () => {
      const result = formatAmplitudeDate('Tue May 18 2021 12:53:36 GMT+0300');
      expect(result).toBe('05182021');
    });
  });

  describe('formatAmplitudeTime', () => {
    it('should return time', () => {
      const result = formatAmplitudeTime('12:53:36');
      expect(result).toBe('12:53 PM');
    });
  });
});
