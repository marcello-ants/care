import { waitFor } from '@testing-library/react';
import { CenterType, DayCareAttendingDays } from '@/__generated__/globalTypes';
import { DaycareProviderProfile } from '@/types/seekerCC';
import {
  mapAttendingDays,
  mapChildrenDoB,
  mapMonthToDate,
  hash256,
  getLeadCountSMB,
  getLeadCountNational,
} from '../account-creation-utils';

type DayCareAttendingDay = keyof DayCareAttendingDays;

describe('Account creation utils', () => {
  it('maps list of attending days', () => {
    const input: DayCareAttendingDay[] = ['monday', 'tuesday', 'wednesday'];
    expect(mapAttendingDays(input)).toEqual({
      friday: false,
      monday: true,
      saturday: false,
      sunday: false,
      thursday: false,
      tuesday: true,
      wednesday: true,
    });
  });

  describe('mapChildrenDoB', () => {
    it('maps children date of births', () => {
      const input = [{ month: '02', year: '2019' }];
      expect(mapChildrenDoB(input)).toEqual(['2019-02-15']);
    });

    it('maps children date of births when month is two digits', () => {
      const input = [{ month: '11', year: '2019' }];
      expect(mapChildrenDoB(input)).toEqual(['2019-11-15']);
    });
  });

  describe('mapMonthToDate', () => {
    it('returns date for month for the current year when selecting future month', () => {
      const timestamp = Date.parse('2021-04-12');
      jest.useFakeTimers('modern').setSystemTime(new Date(timestamp).getTime());
      expect(mapMonthToDate('MAY')).toEqual('2021-05-12');
      jest.useRealTimers();
    });

    it('returns date for month for next year when selecting previous month', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-12-12').getTime());
      expect(mapMonthToDate('JANUARY')).toEqual('2022-01-12');
      jest.useRealTimers();
    });

    it('returns date for next month when selecting last day of the current month', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-04-31').getTime());
      expect(mapMonthToDate('APRIL')).toEqual('2021-05-01');
      jest.useRealTimers();
    });

    it('returns first day of month when param firstDayOfMonth is true', () => {
      jest.useFakeTimers('modern').setSystemTime(new Date('2021-04-24').getTime());
      expect(mapMonthToDate('JUNE', true)).toEqual('2021-06-01');
      jest.useRealTimers();
    });
  });

  describe('hash256', () => {
    it('hash256 returns an empty string when null is passed', async () => {
      await waitFor(() => {
        hash256(null).then((hash) => {
          expect(hash).toEqual('');
        });
      });
    });

    it('hash256 returns a string when email is passed', async () => {
      await waitFor(() => {
        hash256('test@email.test').then((hash) => {
          expect(typeof hash).toBe('string');
        });
      });
    });
  });

  describe('getLeadCountSMB', () => {
    const leadCountZeroSMBMock: DaycareProviderProfile[] = [
      {
        __typename: 'Provider',
        centerType: CenterType.INVALID,
        name: 'testName',
        avgReviewRating: 24,
        selected: true,
        hasCoordinates: false,
        id: 'testId',
        description: 'test description',
        logo: null,
        images: null,
        address: null,
        reviews: null,
        license: null,
      },
    ];
    const leadCountSMBMock: DaycareProviderProfile[] = [
      {
        __typename: 'Provider',
        centerType: CenterType.SMALL_MEDIUM_BUSINESS,
        name: 'testName',
        avgReviewRating: 24,
        selected: true,
        hasCoordinates: false,
        id: 'testId',
        description: 'test description',
        logo: null,
        images: null,
        address: null,
        reviews: null,
        license: null,
      },
    ];

    it('getLeadCountSMB returns zero if no SMB present', async () => {
      expect(getLeadCountSMB(leadCountZeroSMBMock)).toEqual(0);
    });

    it('getLeadCountSMB returns correct SMB count', async () => {
      expect(getLeadCountSMB(leadCountSMBMock)).toEqual(1);
    });
  });

  describe('getLeadCountNational', () => {
    const leadCountZeroNationalMock: DaycareProviderProfile[] = [
      {
        __typename: 'Provider',
        centerType: CenterType.INVALID,
        name: 'testName',
        avgReviewRating: 24,
        selected: true,
        hasCoordinates: false,
        id: 'testId',
        description: 'test description',
        logo: null,
        images: null,
        address: null,
        reviews: null,
        license: null,
      },
    ];
    const leadCountNationalMock: DaycareProviderProfile[] = [
      {
        __typename: 'Provider',
        centerType: CenterType.NATIONAL_ACCOUNT,
        name: 'testName',
        avgReviewRating: 24,
        selected: true,
        hasCoordinates: false,
        id: 'testId',
        description: 'test description',
        logo: null,
        images: null,
        address: null,
        reviews: null,
        license: null,
      },
    ];

    it('getLeadCountNational returns zero if no National present', async () => {
      expect(getLeadCountNational(leadCountZeroNationalMock)).toEqual(0);
    });

    it('getLeadCountNational returns correct National count', async () => {
      expect(getLeadCountNational(leadCountNationalMock)).toEqual(1);
    });
  });
});
