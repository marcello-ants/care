import { convertTimeToDateTime } from '@/state/seeker/reducerHelpers';
import { initialState } from '@/state/seekerHK';
import { initialState as seekerCC } from '@/state/seekerCC';

import { DEFAULT_JOB_END_TIME, DEFAULT_JOB_START_TIME } from '@/types/common';
import dayjs from 'dayjs';
import { reducer } from '../reducer';

describe('job reducer', () => {
  it('time for job time should be 14.00 - 15.00', () => {
    const currentReducer = reducer(initialState, {
      type: 'job_setJobTimes',
      start: '14:00',
      end: '21:00',
    });
    expect(seekerCC.jobPost.jobDateTime.time.startTime).not.toBe('14:00');
    expect(currentReducer.jobPost.jobDateTime.time.startTime).toBe('14:00');
    expect(currentReducer.jobPost.jobDateTime.time.endTime).toBe('21:00');
  });

  it('time should be one hour more if the end time is the same as the start time', () => {
    const start = '14:00';
    const end = '14:00';
    const currentReducer = reducer(initialState, {
      type: 'job_setJobTimes',
      start,
      end,
    });
    const today = dayjs();
    const endTimeConverted = convertTimeToDateTime(today, end);
    expect(seekerCC.jobPost.jobDateTime.time.endTime).not.toBe(
      endTimeConverted.add(1, 'hour').format('HH:mm')
    );
    expect(currentReducer.jobPost.jobDateTime.time.endTime).toBe(
      endTimeConverted.add(1, 'hour').format('HH:mm')
    );
  });

  it('jobType should be recurring', () => {
    const currentReducer = reducer(initialState, {
      type: 'job_setJobType',
      jobType: 'recurring',
    });
    expect(currentReducer.jobPost.jobType).toBe('recurring');
  });

  it('should set the correct data on case job_setSpecificTimes set range time', () => {
    const expectedResult = { end: '11:00', start: '15:00' };
    const state = {
      ...initialState,
      jobPost: {
        recurring: {
          schedule: {
            sunday: { blocks: [{ end: '11:00', start: '15:00' }] },
          },
          careTimes: {
            morning: true,
          },
        },
      },
    };
    const currentReducer = reducer(state, {
      type: 'job_setSpecificTimes',
      isSpecificTimes: true,
    });
    expect(currentReducer.jobPost.recurring.schedule.sunday.blocks[0]).toEqual(expectedResult);
  });

  it('should set the correct data on case job_setSpecificTimes if time is not selected with careTimes', () => {
    const expectedResult = {
      end: '12:00',
      start: '06:00',
    };
    const state = {
      ...initialState,
      jobPost: {
        recurring: {
          schedule: {
            sunday: { blocks: [] },
          },
          careTimes: {
            morning: true,
          },
        },
      },
    };
    const currentReducer = reducer(state, {
      type: 'job_setSpecificTimes',
      isSpecificTimes: true,
    });
    expect(currentReducer.jobPost.recurring.schedule.sunday.blocks[0]).toEqual(expectedResult);
  });

  it('should set the correct data on case job_setSpecificTimes if time is not selected without careTimes', () => {
    const expectedResult = {
      end: DEFAULT_JOB_END_TIME,
      start: DEFAULT_JOB_START_TIME,
    };
    const state = {
      ...initialState,
      jobPost: {
        recurring: {
          schedule: {
            sunday: { blocks: [] },
          },
          careTimes: {
            morning: false,
          },
        },
      },
    };
    const currentReducer = reducer(state, {
      type: 'job_setSpecificTimes',
      isSpecificTimes: true,
    });
    expect(currentReducer.jobPost.recurring.schedule.sunday.blocks[0]).toEqual(expectedResult);
  });
});
