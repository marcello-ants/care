import { CareDate, YesOrNoAnswer, HomePayExpectedHireTimeFrame } from '@/__generated__/globalTypes';
import { Location } from '@/types/common';

export enum InsuranceCarrierEnum {
  CNA = 'CNA',
  JOHN_HANCOCK = 'JOHN_HANCOCK',
  METLIFE = 'METLIFE',
  BANKERS_LIFE = 'BANKERS_LIFE',
  TRANS_AMERICA = 'TRANS_AMERICA',
  MUTUAL_OF_OMAHA = 'MUTUAL_OF_OMAHA',
  SENIOR_HEALTH_INSURANCE_COMPANY_OF_PENNSYLVANIA = 'SENIOR_HEALTH_INSURANCE_COMPANY_OF_PENNSYLVANIA',
  UNSURE = 'UNSURE',
  NONE = 'NONE',
}

export const InsuranceCarrierMap: { [key in InsuranceCarrierEnum]: string } = {
  [InsuranceCarrierEnum.CNA]: 'CNA',
  [InsuranceCarrierEnum.JOHN_HANCOCK]: 'John Hancock',
  [InsuranceCarrierEnum.METLIFE]: 'MetLife',
  [InsuranceCarrierEnum.BANKERS_LIFE]: 'Bankers Life',
  [InsuranceCarrierEnum.TRANS_AMERICA]: 'Transamerica',
  [InsuranceCarrierEnum.MUTUAL_OF_OMAHA]: 'Mutual of Omaha',
  [InsuranceCarrierEnum.SENIOR_HEALTH_INSURANCE_COMPANY_OF_PENNSYLVANIA]:
    'Senior Health Insurance Company of Pennsylvania',
  [InsuranceCarrierEnum.UNSURE]: "I'm not sure",
  [InsuranceCarrierEnum.NONE]: 'None of the above',
};

export type WhenOptions = Exclude<CareDate, 'WITHIN_A_WEEK'>;
export const WhenOptionsMap: { [key in WhenOptions]: string } = {
  [CareDate.RIGHT_NOW]: 'As soon as possible',
  [CareDate.WITHIN_A_MONTH]: 'Within the next month',
  [CareDate.JUST_BROWSING]: "I'm just browsing",
};

export const expectedHireTimeFrameIdsMap: {
  [key in WhenOptions]: HomePayExpectedHireTimeFrame | null;
} = {
  [CareDate.RIGHT_NOW]: HomePayExpectedHireTimeFrame.AS_SOON_AS_POSSIBLE,
  [CareDate.WITHIN_A_MONTH]: HomePayExpectedHireTimeFrame.WITHIN_A_MONTH,
  [CareDate.JUST_BROWSING]: null,
};

interface LTCGHomePayProspect {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
}
export interface LtcgState {
  careDate?: CareDate;
  caregiverNeeded?: YesOrNoAnswer;
  insuranceCarrier?: InsuranceCarrierEnum;
  location?: Location;
  homePayProspect?: LTCGHomePayProspect;
}

export type LtcgAction =
  | { type: 'setLtcgCareDate'; careDate: WhenOptions }
  | { type: 'setLtcgCaregiverNeeded'; caregiverNeeded: YesOrNoAnswer }
  | { type: 'setLtcgLocation'; location: Location }
  | { type: 'setLtcgInsuranceCarrier'; insuranceCarrier: InsuranceCarrierEnum }
  | { type: 'setLtcgHomePayProspect'; homePayProspect: LTCGHomePayProspect };
