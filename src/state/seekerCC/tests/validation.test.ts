import { cloneDeep } from 'lodash-es';

import { CARE_DATES, SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import { doesSeekerCCStateHaveDefaultKeys, validate } from '../validation';
import { initialState as initialSeekerState } from '../reducer';
import { initialState } from '../index';
import { initialAppState } from '../../index';
import { DefaultCareKind, SeekerCCState } from '../../../types/seekerCC';
import { AppState } from '../../../types/app';

describe('Seeker validation', () => {
  describe('doesStateHaveDefaultKeys', () => {
    it('should return true if default keys are ok', () => {
      expect(doesSeekerCCStateHaveDefaultKeys(initialState)).toBe(true);
    });
    it('should return false if default keys are not ok', () => {
      const incompleteSeekerState: SeekerCCState = cloneDeep(initialSeekerState);
      // @ts-ignore
      delete incompleteSeekerState.careDate;
      expect(doesSeekerCCStateHaveDefaultKeys(incompleteSeekerState)).toBe(false);
    });
  });

  describe('validate', () => {
    const appState = cloneDeep(initialAppState);
    const completelyPopulatedState: AppState = {
      ...appState,
      seeker: {
        ...appState.seeker,
        zipcode: '91911',
        city: 'city',
        state: 'state',
      },
      seekerCC: {
        ...appState.seekerCC,
        careDate: CARE_DATES.WITHIN_A_WEEK,
        careKind: DefaultCareKind.NANNIES_RECURRING_BABYSITTERS,
      },
    };

    it('should return true if the page is not in the map', () => {
      expect(validate(appState, '/test')).toBe(true);
    });

    it('should return true if passing a completely populated state on every page', () => {
      expect(validate(completelyPopulatedState, SEEKER_CHILD_CARE_ROUTES.INDEX)).toBe(true);
      expect(validate(completelyPopulatedState, SEEKER_CHILD_CARE_ROUTES.CARE_DATE)).toBe(true);
    });

    it('should return false if missing default state', () => {
      const incompleteState: AppState = cloneDeep(appState);
      // @ts-ignore
      delete incompleteState.seekerCC.careDate;
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.INDEX)).toBe(false);
    });

    it('should return false if missing zipcode on some pages', () => {
      const incompleteState: AppState = {
        ...appState,
        seeker: {
          ...appState.seeker,
          zipcode: '',
        },
      };

      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.CARE_DATE)).toBe(false);
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.CARE_KIND)).toBe(false);
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.CARE_WHO)).toBe(false);
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT)).toBe(false);
    });

    it('should return false if missing careDate on some pages', () => {
      const incompleteState: AppState = cloneDeep(completelyPopulatedState);
      // @ts-ignore
      incompleteState.seekerCC.careDate = null;
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.CARE_KIND)).toBe(false);
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.CARE_WHO)).toBe(false);
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT)).toBe(false);
    });

    it('should return false if missing careKind on some pages', () => {
      const incompleteState: AppState = cloneDeep(completelyPopulatedState);
      // @ts-ignore
      incompleteState.seekerCC.careKind = null;
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.CARE_WHO)).toBe(false);
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT)).toBe(false);
    });

    it('should return false if missing careExpecting on some pages', () => {
      const incompleteState: AppState = cloneDeep(completelyPopulatedState);
      // @ts-ignore
      incompleteState.seekerCC.careExpecting = undefined;
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT)).toBe(false);
    });

    it('should return false if missing careChildren on some pages', () => {
      const incompleteState: AppState = cloneDeep(completelyPopulatedState);
      // @ts-ignore
      incompleteState.seekerCC.careChildren = null;
      expect(validate(incompleteState, SEEKER_CHILD_CARE_ROUTES.ADDITIONAL_SUPPORT)).toBe(false);
    });
  });
});
