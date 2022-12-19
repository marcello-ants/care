// Internal dependencies
import { FLOWS } from '@/constants';
import { FastifyRequest } from 'fastify';
import { LDUser } from 'launchdarkly-node-server-sdk';
import { configureLDUser } from '../configureLDUser';

// Utils
const requestBaseMock = {
  raw: {
    enrollmentSessionId: 'enrollmentSessionId',
    careDeviceId: 'careDeviceId',
  },
};

const requestMockWithURL = (url: string) =>
  ({
    ...requestBaseMock,
    url,
  } as FastifyRequest);

const mockUser = {
  key: 'key',
  anonymous: true,
  custom: {},
} as LDUser;

const testCases = [
  {
    req: requestMockWithURL(FLOWS.SEEKER_IN_FACILITY.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'SENIOR_CARE',
        userType: 'SEEKER',
        vertical: 'Seniorcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.SEEKER.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'SENIOR_CARE',
        userType: 'SEEKER',
        vertical: 'Seniorcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.SEEKER_INSTANT_BOOK.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'CHILD_CARE',
        userType: 'SEEKER',
        vertical: 'Childcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.SEEKER_CHILD_CARE.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'CHILD_CARE',
        userType: 'SEEKER',
        vertical: 'Childcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.PROVIDER.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'SENIOR_CARE',
        userType: 'SITTER',
        vertical: 'Seniorcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.CHILD_CARE_PROVIDER.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'CHILD_CARE',
        userType: 'SITTER',
        vertical: 'Childcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.SEEKER_HOUSEKEEPING.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'HOUSEKEEPING',
        userType: 'SEEKER',
        vertical: 'Housekeeping',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.SEEKER_PET_CARE.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'PET_CARE',
        userType: 'SEEKER',
        vertical: 'Petcare',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.SEEKER_TUTORING.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'TUTORING',
        userType: 'SEEKER',
        vertical: 'Tutoring',
      },
      key: 'careDeviceId',
    },
  },
  {
    req: requestMockWithURL(FLOWS.LTCG.path),
    user: mockUser,
    expectedUser: {
      anonymous: true,
      custom: {
        enrollmentSessionId: 'enrollmentSessionId',
        serviceId: 'SENIOR_CARE',
        userType: 'SEEKER',
        vertical: 'Seniorcare',
      },
      key: 'careDeviceId',
    },
  },
];

describe('configureLDUser', () => {
  it.each(testCases)(
    'given $req.url as current url, should set user vertical as $expectedUser.custom.vertical, userType as $expectedUser.custom.userType and serviceId as $expectedUser.custom.serviceId',
    ({ req, user, expectedUser }) => {
      const userCopy = { ...user, custom: { ...user.custom } };

      configureLDUser(req, userCopy);

      expect(userCopy).toStrictEqual(expectedUser);
    }
  );
});
