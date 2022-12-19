interface TimeFormats {
  label: string;
  value: string;
}

interface TimeFormatsMap {
  [key: string]: TimeFormats;
}

// this function builds all the possible values for the time slider
// the values range from "00:00" to "24:00" (0.0 to 24.0 for the MUI component)
// and the corresponding labels (i.e. "12:00 am") are created using the Intl API
function buildTimeFormatsMap(locale: string | undefined): TimeFormatsMap {
  const labelFormatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
  });

  const timeFormatsMap: TimeFormatsMap = {};

  const date = new Date();
  for (let hr = 0; hr < 24; hr += 1) {
    const paddedHr = String(hr).padStart(2, '0');
    date.setHours(hr, 0);
    timeFormatsMap[`${hr}`] = {
      label: labelFormatter.format(date),
      value: `${paddedHr}:00`,
    };
    date.setMinutes(30);
    timeFormatsMap[`${hr}.5`] = {
      label: labelFormatter.format(date),
      value: `${paddedHr}:30`,
    };
  }

  // treating 24:00 as a one-off as we want to display 11:59pm instead of 12:00pm
  date.setMinutes(59);
  timeFormatsMap[24] = {
    label: labelFormatter.format(date),
    value: '24:00',
  };

  return timeFormatsMap;
}

const timeFormatMapsCache: { [key: string]: TimeFormatsMap } = {};
export function useTimeFormatsMap(locale: string | undefined) {
  const localeKey = typeof locale === 'undefined' ? 'default' : locale;
  if (!timeFormatMapsCache[localeKey]) {
    timeFormatMapsCache[localeKey] = buildTimeFormatsMap(
      localeKey === 'default' ? undefined : localeKey
    );
  }
  return timeFormatMapsCache[localeKey];
}

// we store times as a "HH:mm" string
// but the MUI slider requires numbers for the values
// so this function converts the string to HH.(mm/60)
export function toSliderValue(value: string): number {
  const [hour, minutes] = value.split(':');
  return Number(hour) + Number(minutes) / 60;
}

// convenience function for doing the above with a start and end time array
// which is how MUI sends & receives values for a range slider
export function toSliderValues(values: string[]): number[] {
  const [startTime, endTime] = values;
  return [toSliderValue(startTime), toSliderValue(endTime)];
}

// currently this is only being used in availability component
// this will turn "5.5" to "5:30" or 5 to "5:00" which is pretty much the opposite of toSliderValue
export function fromSliderToString(num: number): string {
  return Number.isInteger(num) ? `${num}:00` : `${Math.floor(num)}:30`;
}

export function getFormattedTimeRange(locale: string | undefined, values: string[]) {
  const timeFormatsMap = useTimeFormatsMap(locale);
  const sliderValues = toSliderValues(values);

  return `${timeFormatsMap[sliderValues[0]].label} - ${timeFormatsMap[sliderValues[1]].label}`;
}
