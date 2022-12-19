import { BringOptions } from '@/types/seekerHK';
import { CARE_DATES } from '@/constants';

import { reducer, initialState } from '../reducer';

describe('seeker housekeeping reducer', () => {
  describe('Post A Job', () => {
    it('should check case setHousekeepingDate is setting housekeepingDate', () => {
      const currentReducer = reducer(initialState, {
        type: 'setHousekeepingDate',
        careDate: CARE_DATES.JUST_BROWSING,
      });

      expect(currentReducer.careDate).toBe(CARE_DATES.JUST_BROWSING);
    });

    it("should set seeker's name if hk_setSeekerName action is called", () => {
      const [firstName, lastName] = ['First', 'Last'];

      const currentReducer = reducer(initialState, {
        type: 'hk_setSeekerName',
        firstName,
        lastName,
      });

      expect(currentReducer.firstName).toBe(firstName);
      expect(currentReducer.lastName).toBe(lastName);
    });

    it('should set bedrooms when setBedrooms action is called', () => {
      const bedroomsNum = 1;
      const currentReducer = reducer(initialState, {
        type: 'setBedrooms',
        bedroomsNum,
      });
      expect(currentReducer.bedrooms).toBe(1);
    });

    it('should set bathrooms when setBathrooms action is called', () => {
      const bathroomsNum = 3;
      const currentReducer = reducer(initialState, {
        type: 'setBathrooms',
        bathroomsNum,
      });
      expect(currentReducer.bathrooms).toBe(3);
    });
    it('should set bring options when setBringOptions action is called', () => {
      const bringOptions = [BringOptions.EQUIPMENT];
      const currentReducer = reducer(initialState, {
        type: 'setBringOptions',
        bringOptions,
      });
      expect(currentReducer.bringOptions).toHaveLength(1);
      expect(currentReducer.bringOptions[0]).toBe('EQUIPMENT');
    });
  });
});
