import { careDateToGQLFormat } from '@/components/pages/seeker/account-creation/account-creation';
import { SERVICE_TYPE_BY_VERTICAL } from '@/components/pages/seeker/three-step-account-creation/constants';
import { CARE_DATES, VerticalsAbbreviation } from '@/constants';
import { CareKind, CareKindToSubServiceType } from '@/types/seekerCC';
import { EnrollmentSource, HOW_DID_YOU_HEAR_ABOUT_US } from '@/__generated__/globalTypes';

export interface SeekerCreatePayload {
  vertical: VerticalsAbbreviation;
  zipcode: string;
  firstName: string;
  lastName: string;
  email: string;
  howDidYouHearAboutUs?: string;
  careKind?: CareKind;
  careDate?: CARE_DATES;
  referrerCookie?: string;
}

const getSubServiceType = (vertical: VerticalsAbbreviation, careKind: CareKind) => {
  switch (vertical) {
    case 'CC':
    case 'DC':
      return {
        subServiceType: CareKindToSubServiceType[careKind as CareKind],
      };
    case 'IB':
      return {
        subServiceType: CareKindToSubServiceType[careKind as CareKind],
        enrollmentSource: EnrollmentSource.INSTANT_BOOK,
      };
    default:
      return {};
  }
};

export const getSeekerAccountCreatePayload = ({
  vertical,
  zipcode,
  firstName,
  lastName,
  email,
  howDidYouHearAboutUs,
  careKind,
  careDate,
  referrerCookie,
}: SeekerCreatePayload) => ({
  variables: {
    input: {
      firstName,
      lastName,
      email,
      zipcode,
      howDidYouHearAboutUs: (howDidYouHearAboutUs as HOW_DID_YOU_HEAR_ABOUT_US) || undefined,
      serviceType: SERVICE_TYPE_BY_VERTICAL[vertical],
      careDate: careDate ? careDateToGQLFormat(careDate) : null,
      referrerCookie,
      ...(careKind ? getSubServiceType(vertical, careKind) : {}),
    },
  },
});
