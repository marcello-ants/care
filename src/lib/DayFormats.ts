import { DayOfWeek } from '@/types/common';

interface DayFormats {
  day: DayOfWeek; // wednesday
  longLabel: string; // Wednesday
  shortLabel: string; // Wed
  narrowLabel: string; // W
}

// Date.prototype.getDay() returns 0 - 6 (0 for Sunday, 1 for Monday, ...)
// this array maps those indicies to their corresponding DayOfWeek
export const DAYS: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

// this function will iterate through the days of the week, grabbing their corresponding names & abbreviations, based off locale
function buildDayFormats(locale: string | undefined): DayFormats[] {
  const longFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const shortFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const narrowFormatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });

  // arbitrary sunday that's in the past
  const date = new Date(2020, 0, 5);

  // use the formatters to populate the labels for each day
  // TODO: this array also dictates the order the days are rendered. should this change based on country/locale?
  return DAYS.map((day) => {
    const formats = {
      day,
      longLabel: longFormatter.format(date),
      shortLabel: shortFormatter.format(date),
      narrowLabel: narrowFormatter.format(date),
    };
    date.setDate(date.getDate() + 1);
    return formats;
  }) as DayFormats[];
}

const dayLabelsCache: { [key: string]: DayFormats[] } = {};
// eslint-disable-next-line import/prefer-default-export
export function useDayFormats(locale: string | undefined) {
  const localeKey = typeof locale === 'undefined' ? 'default' : locale;
  if (!dayLabelsCache[localeKey]) {
    dayLabelsCache[localeKey] = buildDayFormats(localeKey === 'default' ? undefined : localeKey);
  }
  return dayLabelsCache[localeKey];
}
