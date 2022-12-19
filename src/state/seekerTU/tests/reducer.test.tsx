import { CARE_DATES } from '@/constants';
import { Goals, Subjects } from '@/types/seekerTU';
import { reducer, initialState } from '../reducer';

describe('seeker tutoring reducer', () => {
  it('should set tutoring date when setTutoringCareDate action is called', () => {
    const currentReducer = reducer(initialState, {
      type: 'setTutoringDate',
      careDate: CARE_DATES.RIGHT_NOW,
    });
    expect(currentReducer.careDate).toBe(CARE_DATES.RIGHT_NOW);
  });

  it('should set first name and last name', () => {
    const currentReducer = reducer(initialState, {
      type: 'tu_setSeekerName',
      firstName: 'first name',
      lastName: 'last name',
    });
    expect(currentReducer.firstName).toBe('first name');
    expect(currentReducer.lastName).toBe('last name');
  });
  it('should set subjects when setSelectedSubjects action is called', () => {
    const currentReducer = reducer(initialState, {
      type: 'setSelectedSubjects',
      value: [Subjects.MATH],
    });
    expect(currentReducer.selectedSubjects[0]).toBe(Subjects.MATH);
  });
  it('should set tutoring goals when setGoals action is called', () => {
    const currentReducer = reducer(initialState, {
      type: 'setGoals',
      goals: [Goals.HOMEWORK_HELP],
    });
    expect(currentReducer.jobPost.goals[0]).toBe(Goals.HOMEWORK_HELP);
  });
});
