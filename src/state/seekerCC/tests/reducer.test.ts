import { reducer, initialState } from '@/state/seekerCC/reducer';
import { DefaultCareKind, SeekerCCState, ServiceIdsForMember, TimeIntent } from '@/types/seekerCC';
import { CARE_DATES } from '@/constants';

describe('Childcare reducer', () => {
  it.each([
    [DefaultCareKind.DAY_CARE_CENTERS, ServiceIdsForMember.dayCare],
    [DefaultCareKind.ONE_TIME_BABYSITTERS, ServiceIdsForMember.babysitter],
    [DefaultCareKind.NANNIES_RECURRING_BABYSITTERS, ServiceIdsForMember.nanny],
    // GROW-1286: when the intent is `undefined` we reset it to the default value
    [DefaultCareKind.NANNIES_RECURRING_BABYSITTERS, undefined as unknown as ServiceIdsForMember],
  ])(
    'Sets `careKind` to %s when action `setCzenServiceIdForMember` is called with %p',
    (expectedCareKind, serviceIdForMember) => {
      const newState = reducer(initialState, {
        type: 'setCzenServiceIdForMember',
        serviceIdForMember,
      });
      expect(newState.careKind).toBe(expectedCareKind);
    }
  );
  it.each([
    [CARE_DATES.IN_1_2_MONTHS, TimeIntent.in1to2Months],
    [CARE_DATES.JUST_BROWSING, TimeIntent.justBrowsing],
    [CARE_DATES.RIGHT_NOW, TimeIntent.rightNow],
    [CARE_DATES.WITHIN_A_WEEK, TimeIntent.withinOneWeek],
    // GROW-1286: when the intent is `undefined` we reset it to the default value
    [CARE_DATES.WITHIN_A_WEEK, undefined as unknown as TimeIntent],
  ])(
    'Sets `careDate` to %s when action `setCzenIntent` is called with %p',
    (expectedCareDate, intent) => {
      const newState = reducer(initialState, {
        type: 'setCzenIntent',
        intent,
      });
      expect(newState.careDate).toBe(expectedCareDate);
    }
  );
  it('should set the correct data on case cc_setIbRateMinimum', () => {
    const expectedResult = 3;
    const currentReducer = reducer(initialState, {
      type: 'cc_setIbRateMinimum',
      minimum: expectedResult,
    });
    expect(currentReducer.instantBook.payRange.minimum.amount).toBe(expectedResult);
  });
  it('should set the correct data on case cc_setIbRateMaxiumum', () => {
    const expectedResult = 30;
    const currentReducer = reducer(initialState, {
      type: 'cc_setIbRateMaxiumum',
      maximum: expectedResult,
    });
    expect(currentReducer.instantBook.payRange.maximum.amount).toBe(expectedResult);
  });
  it('should set instant book seeker address', () => {
    const address = {
      addressLine1: '411 Waverley Oaks Rd',
      city: 'Waltham',
      state: 'MA',
      zip: '02453',
    };
    const currentReducer: SeekerCCState = reducer(initialState, {
      type: 'cc_setIbAddress',
      address,
    });

    expect(currentReducer.instantBook.address).toBe(address);
  });
  it('should set instant book seeker home address', () => {
    const address = {
      addressLine1: '411 Waverley Oaks Rd',
      city: 'Waltham',
      state: 'MA',
      zip: '02453',
    };
    const currentReducer: SeekerCCState = reducer(initialState, {
      type: 'cc_setIbHomeAddress',
      address,
    });

    expect(currentReducer.instantBook.homeAddress).toBe(address);
  });
  it('should set display booking address', () => {
    const currentReducer: SeekerCCState = reducer(initialState, {
      type: 'cc_setIbDisplayBookingAddress',
      displayAddress: 'Test',
    });

    expect(currentReducer.instantBook.displayAddress.bookingAddress).toBe('Test');
  });
  it('should set display home address', () => {
    const currentReducer: SeekerCCState = reducer(initialState, {
      type: 'cc_setIbDisplayHomeAddress',
      displayAddress: 'Test',
    });

    expect(currentReducer.instantBook.displayAddress.homeAddress).toBe('Test');
  });
});
