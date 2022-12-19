import { DefaultCareKind } from '@/types/seekerCC';
import { EnrollmentSource, ServiceType, SubServiceType } from '@/__generated__/globalTypes';
import { getSeekerAccountCreatePayload } from '../getSeekerAccountCreatePayload';

const FIRST_NAME = 'John';
const LAST_NAME = 'Doe';
const EMAIL = 'email@success.com';
const ZIP_CODE = '02453';

describe('Construct seeker payload', () => {
  it(`returns the correct payload data for CC`, () => {
    const payload = getSeekerAccountCreatePayload({
      vertical: 'CC',
      careKind: DefaultCareKind.NANNIES_RECURRING_BABYSITTERS,
      zipcode: ZIP_CODE,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: EMAIL,
    });

    expect(payload).toEqual({
      variables: {
        input: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          zipcode: ZIP_CODE,
          howDidYouHearAboutUs: undefined,
          serviceType: ServiceType.CHILD_CARE,
          careDate: null,
          referrerCookie: undefined,
          subServiceType: SubServiceType.NANNY_OR_BABYSITTER,
        },
      },
    });
  });
  it(`returns the correct payload data for DC`, () => {
    const payload = getSeekerAccountCreatePayload({
      vertical: 'DC',
      careKind: DefaultCareKind.DAY_CARE_CENTERS,
      zipcode: ZIP_CODE,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: EMAIL,
    });

    expect(payload).toEqual({
      variables: {
        input: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          zipcode: ZIP_CODE,
          howDidYouHearAboutUs: undefined,
          serviceType: ServiceType.CHILD_CARE,
          careDate: null,
          referrerCookie: undefined,
          subServiceType: SubServiceType.DAY_CARE,
        },
      },
    });
  });
  it(`returns the correct payload data for IB`, () => {
    const payload = getSeekerAccountCreatePayload({
      vertical: 'IB',
      careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
      zipcode: ZIP_CODE,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: EMAIL,
    });

    expect(payload).toEqual({
      variables: {
        input: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          zipcode: ZIP_CODE,
          howDidYouHearAboutUs: undefined,
          serviceType: ServiceType.CHILD_CARE,
          careDate: null,
          referrerCookie: undefined,
          subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
          enrollmentSource: EnrollmentSource.INSTANT_BOOK,
        },
      },
    });
  });
});
