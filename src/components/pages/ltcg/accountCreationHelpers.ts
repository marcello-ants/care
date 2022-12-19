import { omit } from 'lodash-es';
import { parsePhoneNumber } from 'libphonenumber-js';
import dayjs from 'dayjs';
import { FormValues } from '@/components/features/accountCreation/accountCreationForm';
import { LtcgState, expectedHireTimeFrameIdsMap } from '@/types/ltcg';
import { enrollSeekerForEnterpriseClientVariables } from '@/__generated__/enrollSeekerForEnterpriseClient';
import { createHomePayProspectVariables } from '@/__generated__/createHomePayProspect';
import {
  YesOrNoAnswer,
  CareDate,
  HomepayCaregiverType,
  HomePayExpectedHireTimeFrame,
  UsStateCode,
  ServiceType,
} from '@/__generated__/globalTypes';

export interface AccountFormValues extends FormValues {
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  zip: string;
}

export const buildLTCGEnrollmentVariables = (
  formValues: AccountFormValues,
  ltcgState: LtcgState
): enrollSeekerForEnterpriseClientVariables => {
  return {
    employeeEnrollmentDetails: {
      group: 'LTCG',
      employeeInformation: {
        // strip off the form values that don't exist on the input
        ...omit(formValues, ['howDidYouHearAboutUs', 'isPasswordSinglePage']),
        // replace / with - so the string follows ISO 8601
        dateOfBirth: dayjs(formValues.dateOfBirth).format('YYYY-MM-DD'),
        zip: ltcgState.location!.zipcode,
        phoneNumber: parsePhoneNumber(formValues.phoneNumber, 'US').format('E.164'),
        primaryService: ServiceType.SENIOR_CARE,
      },
    },
  };
};

export const buildLTCGHomePayProspectVariables = (
  ltcgState: LtcgState
): createHomePayProspectVariables => {
  let expectedHireTimeFrame: HomePayExpectedHireTimeFrame | null = null;
  if (ltcgState.careDate === CareDate.RIGHT_NOW || ltcgState.careDate === CareDate.WITHIN_A_MONTH) {
    expectedHireTimeFrame = expectedHireTimeFrameIdsMap[ltcgState.careDate];
  }
  const { firstName, lastName, email, address, phoneNumber } = ltcgState.homePayProspect || {};
  const parsedPhoneNumber =
    phoneNumber && parsePhoneNumber(phoneNumber, 'US').format('E.164').replace('+1', '');

  return {
    input: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      // replace / with - so the string follows ISO 8601
      address: {
        addressLine1: address || '',
        city: ltcgState.location!.city,
        state: ltcgState.location!.state as UsStateCode,
        zip: ltcgState.location!.zipcode,
      },
      caregiverType: HomepayCaregiverType.SENIOR_CARE,
      phoneNumber: parsedPhoneNumber || '',
      referringSite: 'LTCG',
      hasHired: ltcgState.caregiverNeeded === YesOrNoAnswer.NO,
      planId: 'LtcgNoBilling',
      partnerId: '485',
      expectedHireTimeFrame,
    },
  };
};
