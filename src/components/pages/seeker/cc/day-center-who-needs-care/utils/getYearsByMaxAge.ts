import dayjs from 'dayjs';

export const MAX_AGE = 12;

export function getYearsByMaxAge(maxAge: number) {
  const now = dayjs();
  const currentYear = now.year();

  return Array.from({ length: maxAge })
    .fill(null)
    .map((_, i) => String(currentYear - i));
}
