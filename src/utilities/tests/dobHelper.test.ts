import { convertDOBToAgeRange } from '../dobHelper';
import { AGE_RANGES } from '../../constants';

describe('convertDOBToAgeRange', () => {
  it('converts DOB to age range correctly', () => {
    const dobs = [null, '2021-01-01', '2020-04-07', '2016-04-20', '2014-04-30', '2009-06-15'];
    const expectedAgeRanges = [
      AGE_RANGES.newborn,
      AGE_RANGES.newborn,
      AGE_RANGES.toddler,
      AGE_RANGES.earlySchool,
      AGE_RANGES.elementarySchool,
      AGE_RANGES.teen,
    ];

    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2021-05-24').valueOf());

    expect(expectedAgeRanges).toEqual(dobs.map((dob) => convertDOBToAgeRange(dob)));
  });
});
