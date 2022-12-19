/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import { LtcgState, LtcgAction, InsuranceCarrierEnum } from '@/types/ltcg';

import produce from 'immer';

export const initialState: LtcgState = {
  insuranceCarrier: InsuranceCarrierEnum.CNA,
};

export const reducer = produce((draft: LtcgState, action: LtcgAction) => {
  switch (action.type) {
    case 'setLtcgCareDate':
      draft.careDate = action.careDate;
      return draft;

    case 'setLtcgCaregiverNeeded':
      draft.caregiverNeeded = action.caregiverNeeded;
      return draft;

    case 'setLtcgInsuranceCarrier':
      draft.insuranceCarrier = action.insuranceCarrier;
      return draft;

    case 'setLtcgLocation':
      draft.location = action.location;
      return draft;

    case 'setLtcgHomePayProspect':
      draft.homePayProspect = action.homePayProspect;
      return draft;

    default:
      return draft;
  }
});
