import {
  SEEKER_CREATE,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
} from '@/components/request/GQL';
import { FLOWS } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { EnrollmentSource, ServiceType, SubServiceType } from '@/__generated__/globalTypes';
import { GraphQLError } from 'graphql';

export const TEST_DATA_SUCCESS_EMAIL = 'MYemail12@success.com';
export const TEST_DATA_ZIP_CODE = '02452';
export const TEST_DATA_FIRSTNAME = 'John';
export const TEST_DATA_LASTNAME = 'Snow';
export const TEST_DATE_CARE_DATE = 'WITHIN_A_WEEK';
export const TEST_WRONG_PASSWORD = 'passpasspass';

export const initialState: AppState = {
  ...initialAppState,
  flow: {
    ...initialAppState.flow,
    flowName: FLOWS.SEEKER_INSTANT_BOOK_SHORT.name,
  },

  seekerCC: {
    ...initialAppState.seekerCC,
    firstName: TEST_DATA_FIRSTNAME,
    lastName: TEST_DATA_LASTNAME,
    instantBook: {
      ...initialAppState.seekerCC.instantBook,
      homeAddress: {
        ...initialAppState.seekerCC.instantBook.homeAddress,
        zip: TEST_DATA_ZIP_CODE,
      },
    },
  },
};

export const ibShortEnrollmentState: AppState = {
  ...initialAppState,
  flow: {
    ...initialAppState.flow,
    flowName: FLOWS.SEEKER_INSTANT_BOOK_SHORT.name,
  },

  seekerCC: {
    ...initialAppState.seekerCC,
    firstName: TEST_DATA_FIRSTNAME,
    lastName: TEST_DATA_LASTNAME,
    instantBook: {
      ...initialAppState.seekerCC.instantBook,
      homeAddress: {
        ...initialAppState.seekerCC.instantBook.homeAddress,
        zip: TEST_DATA_ZIP_CODE,
      },
    },
  },
};

export const existingEmailValidationMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: TEST_DATA_SUCCESS_EMAIL,
    },
  },
  result: {
    data: {
      validateMemberEmail: {
        errors: [
          {
            __typename: 'MemberEmailAlreadyRegistered',
            message: 'This email is already registered.',
          },
        ],
      },
    },
  },
};

export const passwordValidationMock = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: TEST_WRONG_PASSWORD,
    },
  },
  result: {
    data: {
      validateMemberPassword: {
        errors: [
          {
            __typename: 'MemberPasswordInvalidTerms',
            message: "Don't use a repeating sequence of 1,2,3 or 4 characters for your password.",
          },
        ],
      },
    },
  },
};

export const seekerCreateWithoutReferrerCookieSuccessMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
        zipcode: TEST_DATA_ZIP_CODE,
        careDate: TEST_DATE_CARE_DATE,
        enrollmentSource: EnrollmentSource.INSTANT_BOOK,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        __typename: 'SeekerCreateSuccess',
        authToken: 'pPMAzhsSOJx5ZxZAy_e27*n28NNwBug4D0III1hM1Dw.',
        memberId: '4747',
      },
    },
  },
};

export const seekerCreateWithoutReferrerCookieFailureMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
        zipcode: TEST_DATA_ZIP_CODE,
        careDate: TEST_DATE_CARE_DATE,
        enrollmentSource: EnrollmentSource.INSTANT_BOOK,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        errors: [
          {
            __typename: 'MemberCreateError',
            message: 'MemberCreateError',
          },
        ],
        __typename: 'SeekerCreateError',
      },
    },
  },
};

export const seekerCreateWithoutReferrerCookieFailurePasswordMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
        zipcode: TEST_DATA_ZIP_CODE,
        careDate: TEST_DATE_CARE_DATE,
        password: TEST_DATA_SUCCESS_EMAIL,
        enrollmentSource: EnrollmentSource.INSTANT_BOOK,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        errors: [
          {
            __typename: 'MemberCreateError',
            message: 'MemberCreateError',
          },
        ],
        __typename: 'SeekerCreateError',
      },
    },
  },
};

export const seekerCreateWithoutReferrerCookieGraphQLFailureMock = {
  request: {
    query: SEEKER_CREATE,
    variables: {
      input: {
        email: TEST_DATA_SUCCESS_EMAIL,
        firstName: TEST_DATA_FIRSTNAME,
        lastName: TEST_DATA_LASTNAME,
        serviceType: ServiceType.CHILD_CARE,
        subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
        zipcode: TEST_DATA_ZIP_CODE,
        careDate: TEST_DATE_CARE_DATE,
        enrollmentSource: EnrollmentSource.INSTANT_BOOK,
      },
    },
  },
  errors: [new GraphQLError('GraphQLError')],
};

export const passwordErrorMock = {
  ...seekerCreateWithoutReferrerCookieFailureMock,
  request: {
    ...seekerCreateWithoutReferrerCookieFailureMock.request,
    variables: {
      ...seekerCreateWithoutReferrerCookieFailureMock.request.variables,
      input: {
        ...seekerCreateWithoutReferrerCookieFailureMock.request.variables.input,
        password: TEST_DATA_SUCCESS_EMAIL,
      },
    },
  },
  result: {
    data: {
      seekerCreate: {
        ...seekerCreateWithoutReferrerCookieFailureMock.result.data.seekerCreate,
        errors: [
          {
            message: 'Please dont use your name or email address in your password.',
            __typename: 'MemberPasswordInvalidTerms',
          },
        ],
      },
    },
  },
};
