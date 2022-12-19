import { ServiceTypes } from '@/types/seekerPC';
import { CARE_DATES } from '@/constants';
import { reducer, initialState } from '../reducer';

describe('seeker pet care reducer', () => {
  it('should set pet care date when setPetCareDate action is called', () => {
    const currentReducer = reducer(initialState, {
      type: 'setPetCareDate',
      careDate: CARE_DATES.RIGHT_NOW,
    });

    expect(currentReducer.careDate).toBe(CARE_DATES.RIGHT_NOW);
  });

  it('should set pats amount', () => {
    const pets = {
      dogs: 1,
      cats: 2,
      other: 3,
    };
    const currentReducer = reducer(initialState, {
      type: 'setPetsNumber',
      pets,
    });

    expect(currentReducer.pets.dogs).toBe(pets.dogs);
    expect(currentReducer.pets.cats).toBe(pets.cats);
    expect(currentReducer.pets.other).toBe(pets.other);
  });

  it('should set service types', () => {
    const serviceType = ServiceTypes.SITTING;
    const currentReducer = reducer(initialState, {
      type: 'setServiceType',
      serviceType,
    });

    expect(currentReducer.serviceType).toBe(serviceType);
  });

  it("should set seeker's name when action pc_setSeekerName is called", () => {
    const [firstName, lastName] = ['First', 'Last'];

    const currentReducer = reducer(initialState, {
      type: 'pc_setSeekerName',
      firstName,
      lastName,
    });

    expect(currentReducer.firstName).toBe(firstName);
    expect(currentReducer.lastName).toBe(lastName);
  });
});
