// External dependencies
import mockdate from 'mockdate';

// Internal dependencies
import { getBirthAvailableMonthsAndYears } from '../getBirthAvailableMonthsAndYears';

// Types & Interfaces
/** @description [current date, selected month, selected year, "9 months out" status, expected months, expected first year, expected last year] */
type TTestScenarioProps = [
  string,
  undefined | number,
  undefined | number,
  'enabled' | 'disabled',
  number,
  number,
  number
];

// Constants
const withTimezone = (date: string) => {
  return `${date}T05:00:00Z`;
};

const testScenarios = [
  [withTimezone('2022-01-01'), undefined, undefined, 'disabled', 12, 2011, 2022],
  [withTimezone('2023-01-01'), undefined, undefined, 'disabled', 12, 2012, 2023],
  [withTimezone('2023-06-01'), undefined, undefined, 'disabled', 12, 2012, 2023],
  [withTimezone('2022-01-01'), 1, undefined, 'disabled', 12, 2011, 2022],
  [withTimezone('2023-01-01'), 2, undefined, 'disabled', 12, 2012, 2023],
  [withTimezone('2023-06-01'), 3, undefined, 'disabled', 12, 2012, 2023],
  [withTimezone('2022-01-01'), undefined, 2022, 'disabled', 12, 2011, 2022],
  [withTimezone('2023-01-01'), undefined, 2021, 'disabled', 12, 2012, 2023],
  [withTimezone('2023-06-01'), undefined, 2020, 'disabled', 12, 2012, 2023],
  [withTimezone('2022-01-01'), 1, 2022, 'disabled', 12, 2011, 2022],
  [withTimezone('2023-01-01'), 2, 2021, 'disabled', 12, 2012, 2023],
  [withTimezone('2023-06-01'), 3, 2020, 'disabled', 12, 2012, 2023],

  [withTimezone('2021-12-01'), undefined, undefined, 'enabled', 12, 2010, 2022],
  [withTimezone('2022-01-01'), undefined, undefined, 'enabled', 12, 2011, 2022],
  [withTimezone('2023-06-01'), undefined, undefined, 'disabled', 12, 2012, 2023],

  [withTimezone('2022-01-01'), 1, undefined, 'enabled', 12, 2011, 2022],
  [withTimezone('2022-06-01'), 1, undefined, 'enabled', 12, 2011, 2023],
  [withTimezone('2022-06-01'), 5, undefined, 'enabled', 12, 2011, 2022],
  [withTimezone('2022-01-01'), undefined, 2022, 'enabled', 10, 2011, 2022],
  [withTimezone('2021-12-01'), undefined, 2022, 'enabled', 9, 2010, 2022],
  [withTimezone('2023-06-01'), undefined, 2020, 'enabled', 12, 2012, 2024],
  [withTimezone('2022-01-01'), 1, 2022, 'enabled', 10, 2011, 2022],
  [withTimezone('2023-01-01'), 2, 2021, 'enabled', 12, 2012, 2023],
  [withTimezone('2023-06-01'), 3, 2020, 'enabled', 12, 2012, 2024],
] as TTestScenarioProps[];

describe('getBirthAvailableMonthsAndYears', () => {
  test.each(testScenarios)(
    'given %s as currentDate, %s as selected month, %s as selected year, when "9 months out from now" is %s, then should return an array with first %s months and an array with the years from %s to %s',
    (
      currentDate,
      selectedMonth,
      selectedYear,
      nineMonthsOptionStatus,
      expectedNumberOfMonths,
      expectedFirstYear,
      expectedLastYear
    ) => {
      mockdate.set(currentDate);

      const allow9MonthsOutFromNow = nineMonthsOptionStatus === 'enabled';

      const { months, years } = getBirthAvailableMonthsAndYears(
        selectedMonth ? String(selectedMonth) : '',
        selectedYear ? String(selectedYear) : '',
        allow9MonthsOutFromNow
      );

      // check months
      expect(Array.isArray(months)).toBe(true);
      expect(months.length).toBe(expectedNumberOfMonths);

      months.forEach((item, index) => {
        expect(typeof item.name).toBe('string');
        expect(typeof item.value).toBe('string');
        // make sure the array is ordered
        expect(Number(item.value)).toBe(index + 1);
      });

      // Check years
      expect(Array.isArray(years)).toBe(true);
      const firstYear = years[years.length - 1];
      const lastYear = years[0];

      for (let i = 1; i < years.length; i += 1) {
        expect(years[i]).toMatch(/^[0-9]+$/);

        // make sure the array is ordered
        expect(parseInt(years[i], 10)).toBe(parseInt(lastYear, 10) - i);
      }

      expect(firstYear).toBe(String(expectedFirstYear));
      expect(lastYear).toBe(String(expectedLastYear));
    }
  );
});
