import { reducer, initialState } from '../reducer';

describe('ltcg reducer', () => {
  it('should check case setLtcgLocation', () => {
    const location = {
      zipcode: '12543',
      city: 'Los Angeles',
      state: 'California',
    };
    const currentReducer = reducer(initialState, {
      type: 'setLtcgLocation',
      location,
    });

    expect(currentReducer.location).toBe(location);
  });
});
