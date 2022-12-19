// External dependencies
import dayjs from 'dayjs';

// Internal dependencies dependencies
import { MONTHS } from '@/constants';
import { getYearsByMaxAge, MAX_AGE } from './getYearsByMaxAge';

// Types &  Interfaces
interface MonthOption {
  value: string;
  name: string;
}

// Constants
const MONTHS_FROM_NOW = 9;
const MONTH_OPTIONS = MONTHS.map(
  (month, i): MonthOption => ({
    value: String(i + 1),
    name: month,
  })
);

/**
 * Get Months and Years options based on selected values
 * @param childMonth - selected month input value
 * @param childYear - selected year input value
 * @returns { months: MonthOption[], years: string[] } - next input options
 */
export function getBirthAvailableMonthsAndYears(
  childMonth: string,
  childYear: string,
  allow9MonthsOutFromNow?: boolean
): { months: MonthOption[]; years: string[] } {
  const YEARS = getYearsByMaxAge(MAX_AGE);

  let years = YEARS;
  let maxMonth = 12;

  if (allow9MonthsOutFromNow) {
    const now = dayjs();
    const currentYear = now.year();

    const latestDate = now.add(MONTHS_FROM_NOW, 'month');
    const latestDateMonth = latestDate.month() + 1;
    const maxYearIsNextYear = latestDate.year() > currentYear;
    const nextYear = String(currentYear + 1);

    years = maxYearIsNextYear ? [nextYear].concat(YEARS) : YEARS;

    if (
      childYear &&
      (Number(childYear) > currentYear || (Number(childYear) === currentYear && !maxYearIsNextYear))
    ) {
      maxMonth = latestDateMonth;
    }

    if (childMonth) {
      const latestMonthIsMoreOrEqualToSelected = latestDateMonth >= Number(childMonth);
      if (maxYearIsNextYear) {
        years = latestMonthIsMoreOrEqualToSelected ? [nextYear].concat(YEARS) : YEARS;
      } else {
        years = latestMonthIsMoreOrEqualToSelected ? YEARS : YEARS.slice(1);
      }
    }
  }

  return {
    years,
    months: MONTH_OPTIONS.slice(0, maxMonth),
  };
}
