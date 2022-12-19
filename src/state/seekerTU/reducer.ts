/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import produce from 'immer';
import { SeekerTUAction, SeekerTUState, AgeLevel, TutoringTypeOptions } from '@/types/seekerTU';
import { CARE_DATES } from '@/constants';
import { initialJobState } from '@/types/common';
import { JobAction } from '@/types/job';
import { reducer as jobReducer } from '@/state/job';

export const initialState: SeekerTUState = {
  careDate: CARE_DATES.WITHIN_A_WEEK,
  ageLevel: AgeLevel.HIGH_SCHOOL,
  selectedSubjects: [],
  tutoringType: TutoringTypeOptions.ONLINE,
  firstName: '',
  lastName: '',
  jobPost: { ...initialJobState, goals: [] },
  enrollmentSource: 'VHP Tutoring',
};

export const seekerTUReducer = produce((draft: SeekerTUState, action: SeekerTUAction) => {
  switch (action.type) {
    case 'setAgeLevel':
      draft.ageLevel = action.ageLevel;
      return draft;
    case 'setSelectedSubjects':
      draft.selectedSubjects = action.value;
      return draft;
    case 'setTutoringType':
      draft.tutoringType = action.tutoringType;
      return draft;
    case 'setTutoringDate':
      draft.careDate = action.careDate;
      return draft;
    case 'tu_setSeekerName':
      draft.firstName = action.firstName;
      draft.lastName = action.lastName;
      return draft;
    case 'setGoals':
      draft.jobPost.goals = action.goals;
      return draft;
    case 'tu_setEnrollmentSource':
      draft.enrollmentSource = action.value;
      return draft;
    default:
      return draft;
  }
});

export const reducer = (state: SeekerTUState, action: SeekerTUAction | JobAction) => {
  if (action.reducer?.type === 'job_reducer' && action.reducer?.prefix === 'tu') {
    return jobReducer(state, action as JobAction);
  }
  return seekerTUReducer(state, action as SeekerTUAction);
};
