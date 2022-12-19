/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import produce from 'immer';
import { SeekerHKAction, SeekerHKState } from '@/types/seekerHK';
import { reducer as jobReducer } from '@/state/job';
import { JobAction } from '@/types/job';
import { initialJobState } from '@/types/common';
import { CARE_DATES } from '@/constants';

export const initialState: SeekerHKState = {
  careDate: CARE_DATES.WITHIN_A_WEEK,
  jobPost: initialJobState,
  enrollmentSource: 'VHP Housekeeping',
  tasks: [],
  firstName: '',
  lastName: '',
  bathrooms: 2,
  bedrooms: 2,
  bringOptions: [],
};

export const seekerHKReducer = produce((draft: SeekerHKState, action: SeekerHKAction) => {
  switch (action.type) {
    case 'setHousekeepingDate':
      draft.careDate = action.careDate;
      return draft;
    case 'hk_setSeekerName':
      draft.firstName = action.firstName;
      draft.lastName = action.lastName;
      return draft;
    case 'setTasks':
      draft.tasks = action.tasks;
      return draft;
    case 'setBathrooms':
      draft.bathrooms = action.bathroomsNum;
      return draft;
    case 'setBedrooms':
      draft.bedrooms = action.bedroomsNum;
      return draft;
    case 'setBringOptions':
      draft.bringOptions = action.bringOptions;
      return draft;
    case 'hk_setEnrollmentSource':
      draft.enrollmentSource = action.value;
      return draft;
    default:
      return draft;
  }
});

export const reducer = (state: SeekerHKState, action: SeekerHKAction | JobAction) => {
  if (action.reducer?.type === 'job_reducer' && action.reducer?.prefix === 'hk') {
    return jobReducer(state, action as JobAction);
  }
  return seekerHKReducer(state, action as SeekerHKAction);
};
