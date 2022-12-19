import { validateHoursPerJob, validateMax, validateMin } from '../Validations';

describe('Job Types validations', () => {
  describe('validateMin', () => {
    it('should return "" for empty line', () => {
      const result = validateMin('');
      expect(result).toBe('');
    });

    it('should return error for NaN', () => {
      const result = validateMin('some string');
      expect(result).toBe('Min value should be a number');
    });

    it('should return "" if in range', () => {
      const result = validateMin('1');
      expect(result).toBe('');
    });

    it('should return error if lower than range', () => {
      const result = validateMin('-1');
      expect(result).toBe('Min value should be in range of 0 - 75');
    });

    it('should return error if higher than range', () => {
      const result = validateMin('76');
      expect(result).toBe('Min value should be in range of 0 - 75');
    });
  });

  describe('validateMax', () => {
    it('should return "" if empty', () => {
      const result = validateMax('', '');
      expect(result).toBe('');
    });

    it('should return error if NaN', () => {
      const result = validateMax('some string', 'another string');
      expect(result).toBe('Max value should be a number');
    });

    it('should return "" if in range', () => {
      const result = validateMax('5', '1');
      expect(result).toBe('');
    });

    it('should return error if lower than range', () => {
      const result = validateMax('-1', '');
      expect(result).toBe('Max value should be in range of 0 - 80');
    });

    it('should return error if higher than range', () => {
      const result = validateMax('81', '');
      expect(result).toBe('Max value should be in range of 0 - 80');
    });

    it('should return error if Max smaller than Min', () => {
      const result = validateMax('1', '5');
      expect(result).toBe('Max value should be bigger than Min');
    });
  });

  describe('validateHoursPerJob', () => {
    it('should return "" for empty line', () => {
      const result = validateHoursPerJob('');
      expect(result).toBe('');
    });

    it('should return error for NaN', () => {
      const result = validateHoursPerJob('some string');
      expect(result).toBe('Value should be a number');
    });

    it('should return "" if in range', () => {
      const result = validateHoursPerJob('1');
      expect(result).toBe('');
    });

    it('should return error if lower than range', () => {
      const result = validateHoursPerJob('0');
      expect(result).toBe('Value should be in range of 1 - 8');
    });

    it('should return error if higher than range', () => {
      const result = validateHoursPerJob('9');
      expect(result).toBe('Value should be in range of 1 - 8');
    });
  });
});
