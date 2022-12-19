import { DaycareProviderProfile, Months } from '@/types/seekerCC';
import { CenterType, DayCareAttendingDays } from '@/__generated__/globalTypes';
import dayjs from 'dayjs';
import { CommunityDetail } from '@/types/seeker';

type DayCareAttendingDay = keyof DayCareAttendingDays;

/**
 * Map list of days to an object of days with boolean attributes
 *
 * @param attendingDays List of days
 */
const mapAttendingDays = function mapAttendingDays(
  attendingDays: DayCareAttendingDay[]
): DayCareAttendingDays {
  const attendingDaysList: DayCareAttendingDays = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  attendingDays.forEach((attendingDay) => {
    attendingDaysList[attendingDay] = true;
  });
  return attendingDaysList;
};

/**
 * Map list of months and years to list of dates in format "YYYY-MM-DD"
 *
 * @param childrenDoB List of months and years
 */
const mapChildrenDoB = function mapChildrenDoB(
  childrenDoB: { year: string; month: string }[]
): string[] {
  return childrenDoB.map((childDoB) => {
    const monthOfBirth: number = parseInt(childDoB.month, 10);
    let dateOfBirth = `${childDoB.year}-`;
    dateOfBirth += monthOfBirth < 10 ? `0${monthOfBirth}-15` : `${monthOfBirth}-15`;
    return dateOfBirth;
  });
};

function mapMonthToDate(month: string, firstDayOfMonth = false) {
  let startDate = dayjs();
  const currentMonthIndex = startDate.month();
  const startMonthIndex = Months.findIndex((next) => next.value === month);
  startDate = startDate.month(startMonthIndex);

  if (currentMonthIndex > startMonthIndex) {
    startDate = startDate.add(1, 'year');
  }

  if (!firstDayOfMonth || currentMonthIndex === startMonthIndex) {
    startDate = startDate.add(1, 'day');
  } else {
    startDate = startDate.set('date', 1);
  }

  return `${startDate.year()}-${(startDate.month() + 1).toString().padStart(2, '0')}-${startDate
    .date()
    .toString()
    .padStart(2, '0')}`;
}

const hash256 = async (text: string | null) => {
  if (
    text === null ||
    typeof window.TextEncoder !== 'function' ||
    typeof window.crypto !== 'object'
  ) {
    return '';
  }

  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
};

export type LeadCount = {
  centerType?: CenterType;
};

const getLeadCountSMB = (leadCountList: (CommunityDetail | DaycareProviderProfile)[]) => {
  return (
    leadCountList.filter(
      (leadCountItem) => leadCountItem.centerType === CenterType.SMALL_MEDIUM_BUSINESS
    ).length ?? 0
  );
};

const getLeadCountNational = (leadCountList: (CommunityDetail | DaycareProviderProfile)[]) => {
  return (
    leadCountList.filter(
      (leadCountItem) => leadCountItem.centerType === CenterType.NATIONAL_ACCOUNT
    ).length ?? 0
  );
};

export {
  mapAttendingDays,
  mapChildrenDoB,
  mapMonthToDate,
  hash256,
  getLeadCountSMB,
  getLeadCountNational,
};
