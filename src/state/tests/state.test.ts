import { cloneDeep } from 'lodash-es';
import { AppState } from '../../types/app';
import { initialAppState, isStateVersionCompatible, doesStateHaveDefaultKeys } from '../index';

describe('App State', () => {
  describe('isStateVersionCompatible', () => {
    it('returns true if state version is incompatible', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        version: '0.0.0',
      };

      expect(isStateVersionCompatible(incompleteState)).toBe(false);
    });

    it('returns false if state version is compatible', () => {
      expect(isStateVersionCompatible(initialAppState)).toBe(true);
    });
  });

  describe('doesStateHaveDefaultKeys', () => {
    it('returns false if a default key is missing', () => {
      const incompleteState = cloneDeep(initialAppState);
      // @ts-ignore
      delete incompleteState.seeker.jobPost.rate;

      expect(doesStateHaveDefaultKeys(incompleteState)).toBe(false);
    });

    it('returns true if no keys are missing', () => {
      expect(doesStateHaveDefaultKeys(initialAppState)).toBe(true);
    });
  });
});
