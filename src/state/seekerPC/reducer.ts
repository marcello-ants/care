/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import produce from 'immer';
import { SeekerPCAction, SeekerPCState } from '@/types/seekerPC';
import { initialJobState } from '@/types/common';
import { CARE_DATES } from '@/constants';
import { reducer as jobReducer } from '@/state/job';
import { JobAction } from '@/types/job';

export const initialState: SeekerPCState = {
  careDate: CARE_DATES.WITHIN_A_WEEK,
  pets: {
    dogs: 0,
    cats: 0,
    other: 0,
  },
  jobPost: initialJobState,
  firstName: '',
  lastName: '',
  serviceType: '',
  enrollmentSource: 'VHP Pet care',
  additionalServices: [],
};

export const seekerPCReducer = produce((draft: SeekerPCState, action: SeekerPCAction) => {
  switch (action.type) {
    case 'setPetsNumber':
      draft.pets = action.pets;
      return draft;
    case 'setPetCareDate':
      draft.careDate = action.careDate;
      return draft;
    case 'setServiceType':
      draft.serviceType = action.serviceType;
      return draft;
    case 'pc_setSeekerName':
      draft.firstName = action.firstName;
      draft.lastName = action.lastName;
      return draft;
    case 'pc_setEnrollmentSource':
      draft.enrollmentSource = action.value;
      return draft;
    default:
      return draft;
  }
});

export const reducer = (state: SeekerPCState, action: SeekerPCAction | JobAction) => {
  if (action.reducer?.type === 'job_reducer' && action.reducer?.prefix === 'pc') {
    return jobReducer(state, action as JobAction);
  }
  return seekerPCReducer(state, action as SeekerPCAction);
};
