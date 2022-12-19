import * as yup from 'yup';
import { ServiceType } from '@/__generated__/globalTypes';
import { VerticalsAbbreviation } from '@/constants';

export const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name needs to have at least two letters.')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name needs to have at least two letters.')
    .required('Last name is required'),
});

export const SERVICE_TYPE_BY_VERTICAL: { [key: string]: ServiceType } = {
  HK: ServiceType.HOUSEKEEPING,
  PC: ServiceType.PET_CARE,
  TU: ServiceType.TUTORING,
  CC: ServiceType.CHILD_CARE,
  DC: ServiceType.CHILD_CARE,
  IB: ServiceType.CHILD_CARE,
  SC: ServiceType.SENIOR_CARE,
};

export const ERROR_CREATING_ACCOUNT = 'An error occurred creating your account, please try again.';

export const FACEBOOK_VERTICALS_ALLOWANCE = ['CC'];
export const HDYHAU_VERTICALS_ALLOWANCE: VerticalsAbbreviation[] = ['HK', 'TU', 'PC', 'DC'];
