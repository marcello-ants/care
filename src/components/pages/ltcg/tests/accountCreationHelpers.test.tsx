import { enrollSeekerForEnterpriseClientVariables } from '@/__generated__/enrollSeekerForEnterpriseClient';
import { HOW_DID_YOU_HEAR_ABOUT_US, ServiceType } from '@/__generated__/globalTypes';
import { initialAppState } from '@/state';
import { LtcgState } from '@/types/ltcg';

import { AccountFormValues, buildLTCGEnrollmentVariables } from '../accountCreationHelpers';

describe('LTCG account creation helpers', () => {
  it('returns the variables for the enrollSeekerForEnterpriseClient mutation', () => {
    const formValues: AccountFormValues = {
      firstName: 'Jon',
      lastName: 'Doe',
      address: '5th street',
      zip: '10001',
      dateOfBirth: '1993-07-10',
      email: 'tim@care.com',
      password: 'test456',
      phoneNumber: '+15128675309',
      howDidYouHearAboutUs: HOW_DID_YOU_HEAR_ABOUT_US.BANNER_AD,
      isPasswordSinglePage: true,
    };
    const ltcgState: LtcgState = {
      ...initialAppState.ltcg,
      location: { zipcode: '20002', city: 'Austin', state: 'TX' },
    };

    const actualResult = buildLTCGEnrollmentVariables(formValues, ltcgState);

    const expectedResult: enrollSeekerForEnterpriseClientVariables = {
      employeeEnrollmentDetails: {
        group: 'LTCG',
        employeeInformation: {
          firstName: 'Jon',
          lastName: 'Doe',
          address: '5th street',
          zip: '20002',
          dateOfBirth: '1993-07-10',
          email: 'tim@care.com',
          password: 'test456',
          phoneNumber: '+15128675309',
          primaryService: ServiceType.SENIOR_CARE,
        },
      },
    };
    expect(actualResult).toStrictEqual(expectedResult);
  });
});
