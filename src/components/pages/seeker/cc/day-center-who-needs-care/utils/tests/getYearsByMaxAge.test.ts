import { getYearsByMaxAge } from '@/components/pages/seeker/cc/day-center-who-needs-care/utils';
import MockDate from 'mockdate';

describe('getYearsByMaxAge Fn', () => {
  // Set current date  date Jun 14, 2022
  MockDate.set('2022-06-14');
  it('should return years array starting from 2011 till 2022 for maxAge 12', () => {
    expect(getYearsByMaxAge(12)).toEqual([
      '2022',
      '2021',
      '2020',
      '2019',
      '2018',
      '2017',
      '2016',
      '2015',
      '2014',
      '2013',
      '2012',
      '2011',
    ]);
  });
  it('should return years array starting from 2019 till 2022 for maxAge 4', () => {
    expect(getYearsByMaxAge(4)).toEqual(['2022', '2021', '2020', '2019']);
  });
});
