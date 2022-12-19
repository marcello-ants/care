import { VerticalsAbbreviation } from '@/constants';
import { SeekerHKState } from '@/types/seekerHK';
import { SeekerPCState } from '@/types/seekerPC';
import { SeekerTUState } from '@/types/seekerTU';
import { SeekerCCState } from '@/types/seekerCC';
import { Dispatch, SetStateAction } from 'react';

export type SetSeekerNameAction =
  | 'cc_setSeekerName'
  | 'hk_setSeekerName'
  | 'pc_setSeekerName'
  | 'tu_setSeekerName';

export type SeekerVerticalState = SeekerCCState | SeekerHKState | SeekerPCState | SeekerTUState;

export interface AccountCreationFormPropsBase {
  vertical: VerticalsAbbreviation;
  nextPageURL: string;
}

export interface AccountCreationNameFormProps extends AccountCreationFormPropsBase {
  verticalState: SeekerVerticalState;
}

export interface AccountCreationGeneralFormProps extends AccountCreationFormPropsBase {
  setFormikSubmittingFalse: () => void;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
}

export interface FormNameValues {
  firstName: string;
  lastName: string;
  email: string;
  howDidYouHearAboutUs?: string;
}
