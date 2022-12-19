import dayjs from 'dayjs';
import { AGE_RANGES, ISO_FORMAT } from '../constants';

export function currentDate() {
  return new Date(Date.now());
}

export function convertDateToISOString(date: Date): string {
  return dayjs(date).format(ISO_FORMAT);
}

export function convertDOBToAgeRange(dob: string | null): string {
  // For "I'm expecting" case
  if (dob === null) return AGE_RANGES.newborn;

  const ageInMonths = dayjs(currentDate()).diff(dob, 'month');

  /* eslint-disable no-else-return */
  if (ageInMonths < 7) {
    // 0-6 month
    return AGE_RANGES.newborn;
  } else if (ageInMonths < 48) {
    // 7 month to 4 years
    return AGE_RANGES.toddler;
  } else if (ageInMonths < 84) {
    // 4-6 years
    return AGE_RANGES.earlySchool;
  } else if (ageInMonths < 132) {
    // 7-11 years
    return AGE_RANGES.elementarySchool;
  }
  // 12+ years
  return AGE_RANGES.teen;
}
