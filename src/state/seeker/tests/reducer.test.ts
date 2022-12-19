import produce from 'immer';
import { CareFrequency } from '@/types/seeker';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { reducer, initialState } from '../reducer';

describe('seeker reducer', () => {
  describe('Seeker flow', () => {
    it('should set setSeniorCareFacilityLeadGenerateMutationError to true', () => {
      const currentReducer = reducer(initialState, {
        type: 'setSeniorCareFacilityLeadGenerateMutationError',
        value: true,
      });
      expect(currentReducer.seniorCareFacilityLeadGenerateMutationError).toBe(true);
    });
  });
  describe('Post A Job', () => {
    it('should check case setCareFrequency is setting careFrequency', () => {
      const careFrequency: CareFrequency = 'onetime';
      let currentReducer = reducer(initialState, { type: 'setCareFrequency', careFrequency });
      expect(currentReducer.jobPost.careFrequency).toBe(careFrequency);

      currentReducer = reducer(initialState, {
        type: 'setCareFrequency',
        careFrequency: 'recurring',
      });

      expect(currentReducer.jobPost.oneTime.schedule.start.date).toBe(null);
      expect(currentReducer.jobPost.oneTime.schedule.end.date).toBe(null);
    });
    it('should check case setCareFrequency is setting oneTime schedules to null', () => {
      const careFrequency: CareFrequency = 'recurring';
      const currentReducer = reducer(initialState, { type: 'setCareFrequency', careFrequency });

      expect(currentReducer.jobPost.oneTime.schedule.start.date).toBe(null);
      expect(currentReducer.jobPost.oneTime.schedule.end.date).toBe(null);
    });
    it('should set the correct data on case setOneTimeEndDate', () => {
      const expectedResult = 'dateString';
      const currentReducer = reducer(initialState, {
        type: 'setOneTimeEndDate',
        date: expectedResult,
      });

      expect(currentReducer.jobPost.oneTime.schedule.end.date).toBe(expectedResult);
    });
    it('should set the correct data on case setRateMinimum', () => {
      const expectedResult = 3;
      const currentReducer = reducer(initialState, {
        type: 'setRateMinimum',
        minimum: expectedResult,
      });

      expect(currentReducer.jobPost.rate.minimum).toBe(expectedResult);
    });
    it('should set the correct data on case setRateMaximum', () => {
      const expectedResult = 3;
      const currentReducer = reducer(initialState, {
        type: 'setRateMaximum',
        maximum: expectedResult,
      });

      expect(currentReducer.jobPost.rate.maximum).toBe(expectedResult);
    });
    it('should set the correct data on case setRateLegalMinimum', () => {
      const expectedResult = 3;
      const currentReducer = reducer(initialState, {
        type: 'setRateLegalMinimum',
        legalMinimum: expectedResult,
      });

      expect(currentReducer.jobPost.rate.legalMinimum).toBe(expectedResult);
    });
    it('should set the correct data on case setRateRetrieved', () => {
      const expectedResult = true;
      const currentReducer = reducer(initialState, {
        type: 'setRateRetrieved',
        rateRetrieved: expectedResult,
      });

      expect(currentReducer.jobPost.rate.rateRetrieved).toBe(expectedResult);
    });
    it('should set the correct data on case setScheduleMayVary', () => {
      const expectedResult = true;
      const currentReducer = reducer(initialState, {
        type: 'setScheduleMayVary',
        scheduleMayVary: expectedResult,
      });

      expect(currentReducer.jobPost.recurring.scheduleMayVary).toBe(expectedResult);
    });
    it('should set the correct data on case setPartsOfDay', () => {
      const expectedResult = { morning: true };
      const currentReducer = reducer(initialState, {
        type: 'setPartsOfDay',
        partsOfDay: expectedResult,
      });

      expect(currentReducer.jobPost.recurring.careTimes).toEqual(expectedResult);
    });
    it('should set the correct data on case setLovedOneWhoNeedsCare', () => {
      const expectedResult = 'PARENT' as SeniorCareRecipientRelationshipType;
      const currentReducer = reducer(initialState, {
        type: 'setLovedOneWhoNeedsCare',
        whoNeedsCare: expectedResult,
      });

      expect(currentReducer.jobPost.lovedOne.whoNeedsCare).toEqual(expectedResult);
    });
    it('should set the correct data on case setLovedOneGender', () => {
      const expectedResult = 'MALE';
      const currentReducer = reducer(initialState, {
        type: 'setLovedOneGender',
        gender: expectedResult,
      });

      expect(currentReducer.jobPost.lovedOne.gender).toEqual(expectedResult);
    });
    it('should set the correct data on case setLovedOneAge', () => {
      const expectedResult = 'THIRTIES';
      const currentReducer = reducer(initialState, {
        type: 'setLovedOneAge',
        age: expectedResult,
      });

      expect(currentReducer.jobPost.lovedOne.age).toEqual(expectedResult);
    });
    it('should set the correct data on case setLovedOneDetails', () => {
      const expectedResult = 'details';
      const currentReducer = reducer(initialState, {
        type: 'setLovedOneDetails',
        details: expectedResult,
      });

      expect(currentReducer.jobPost.lovedOne.details).toEqual(expectedResult);
    });
    it('should set the correct data on case setIdealCaregiverDetails', () => {
      const expectedResult = 'details';
      const currentReducer = reducer(initialState, {
        type: 'setIdealCaregiverDetails',
        details: expectedResult,
      });

      expect(currentReducer.jobPost.idealCaregiver.details).toEqual(expectedResult);
    });
    it('should set the correct data on case setSubmissionAttempted', () => {
      const currentReducer = reducer(initialState, {
        type: 'setSubmissionAttempted',
        submissionAttempted: true,
        attempts: 3,
      });

      expect(currentReducer.jobPost.idealCaregiver.submissionAttempted).toBe(true);
      expect(currentReducer.jobPost.idealCaregiver.attempts).toBe(3);
    });
    it('should set the correct data on case setJobStatus', () => {
      const expectedResult = true;
      const currentReducer = reducer(initialState, {
        type: 'setJobStatus',
        jobSuccessful: expectedResult,
      });

      expect(currentReducer.jobPost.jobPostSuccessful).toEqual(expectedResult);
    });
    it('should set the correct data on case setCareType', () => {
      let currentReducer = reducer(initialState, {
        type: 'setCareType',
        careFrequency: 'recurring',
        servicesNeeded: [],
      });

      expect(currentReducer.jobPost.typeOfCare).toBe('COMPANION');

      currentReducer = reducer(initialState, {
        type: 'setCareType',
        careFrequency: 'livein',
        servicesNeeded: [],
      });

      expect(currentReducer.jobPost.typeOfCare).toBe('LIVE_IN');

      currentReducer = reducer(initialState, {
        type: 'setCareType',
        careFrequency: 'recurring',
        servicesNeeded: ['MEDICATION'],
      });

      expect(currentReducer.jobPost.typeOfCare).toBe('HANDS_ON');
    });
    it('should set the correct data on case addDayBlock', () => {
      const expectedResult = { end: '17:00', start: '09:00' };
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [{ end: '18:00', start: '10:00' }] },
        };
        state.jobPost.recurring.specificTimes = true;
      });

      const currentReducer = reducer(initialStateModified, {
        type: 'addDayBlock',
        day: 'sunday',
      });

      expect(currentReducer.jobPost.recurring.schedule.sunday?.blocks[1]).toEqual(expectedResult);
      expect(currentReducer.jobPost.recurring.timesAppliedToAllDays).toBe(false);
    });
    it('should set the correct data on case addDayBlock set range time from Times pills', () => {
      const expectedResult = { end: '12:00', start: '06:00' };
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [{ end: '18:00', start: '10:00' }] },
        };
        state.jobPost.recurring.specificTimes = true;
        state.jobPost.recurring.careTimes = {
          morning: true,
        };
      });

      const currentReducer = reducer(initialStateModified, {
        type: 'addDayBlock',
        day: 'sunday',
      });

      expect(currentReducer.jobPost.recurring.schedule.sunday?.blocks[1]).toEqual(expectedResult);
      expect(currentReducer.jobPost.recurring.timesAppliedToAllDays).toBe(false);
    });
    it('should set the correct data on case addDayBlock set range time from prev schedule', () => {
      const expectedResult = { end: '18:00', start: '10:00' };
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [expectedResult] },
          monday: { blocks: [{ end: '15:00', start: '11:00' }] },
        };
        state.jobPost.recurring.specificTimes = true;
      });

      const currentReducer = reducer(initialStateModified, {
        type: 'addDayBlock',
        day: 'monday',
      });

      expect(currentReducer.jobPost.recurring.schedule.monday?.blocks[0]).toEqual(expectedResult);
      expect(currentReducer.jobPost.recurring.timesAppliedToAllDays).toBe(false);
    });
    it('should set the correct data on case removeDayBlock', () => {
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [{ end: '17:00', start: '12:00' }] },
        };
      });
      const currentReducer = reducer(initialStateModified, {
        type: 'removeDayBlock',
        day: 'sunday',
      });

      expect(currentReducer.jobPost.recurring.schedule).toEqual({});
    });
    it('should set the correct data on case removeDayBlock if index is passed', () => {
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [{ end: '17:00', start: '12:00' }] },
        };
      });
      const currentReducer = reducer(initialStateModified, {
        type: 'removeDayBlock',
        day: 'sunday',
        index: 1,
      });

      expect(currentReducer).toEqual(initialStateModified);
    });
    it('should set the correct data on case updateDayBlock', () => {
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [{ end: '17:00', start: '12:00' }] },
        };
      });
      const expectedResult = { end: '18:00', start: '11:00' };

      const currentReducer = reducer(initialStateModified, {
        type: 'updateDayBlock',
        day: 'sunday',
        index: 0,
        timeBlock: expectedResult,
      });

      expect(currentReducer.jobPost.recurring.schedule.sunday?.blocks[0]).toEqual(expectedResult);
    });
    it('should return true on case applyTimesToAllDays', () => {
      const expectedResult = { end: '18:00', start: '11:00' };
      const initialStateModified = produce(initialState, (draftState) => {
        const state = { ...draftState };
        state.jobPost.recurring.schedule = {
          sunday: { blocks: [expectedResult] },
          monday: { blocks: [{ end: '19:00', start: '10:00' }] },
        };
      });
      const currentReducer = reducer(initialStateModified, {
        type: 'applyTimesToAllDays',
        day: 'sunday',
      });

      expect(currentReducer.jobPost.recurring.schedule.monday?.blocks[0]).toEqual(expectedResult);
      expect(currentReducer.jobPost.recurring.timesAppliedToAllDays).toBe(true);
    });
    it('should return false on case applyTimesToAllDays', () => {
      const currentReducer = reducer(initialState, {
        type: 'applyTimesToAllDays',
        day: 'sunday',
      });

      expect(currentReducer.jobPost.recurring.timesAppliedToAllDays).toBe(false);
    });
  });
});
