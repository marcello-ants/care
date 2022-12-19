// External dependencies
import { FastifyRequest } from 'fastify';
import { LDUser } from 'launchdarkly-node-server-sdk';

// External dependencies
import getVertical from '../utilities/verticalUtils';
import { VERTICALS_NAMES } from '../constants';

// Type & Interfaces
type ValueOf<T> = T[keyof T];
type TVertical = ValueOf<typeof VERTICALS_NAMES>;
type TServiceIDs = Record<TVertical, string>;

// Constants
const PROVIDER_URL_PATTERN = /^\/provider.+/i;
const SERVICE_IDS = Object.freeze({
  Childcare: 'CHILD_CARE',
  Seniorcare: 'SENIOR_CARE',
  Housekeeping: 'HOUSEKEEPING',
  Petcare: 'PET_CARE',
  Tutoring: 'TUTORING',
} as TServiceIDs);

const configureLDUser = async (req: FastifyRequest, user: LDUser) => {
  const decoratedUser = user;

  const { enrollmentSessionId, careDeviceId } = req.raw;

  if (careDeviceId) {
    // use careDeviceId as the key even if the user happens to be authenticated
    decoratedUser.key = careDeviceId;
  }

  if (enrollmentSessionId) {
    decoratedUser.custom = {
      ...decoratedUser.custom,
      enrollmentSessionId,
    };
  }

  const userType = PROVIDER_URL_PATTERN.test(req.url) ? 'SITTER' : 'SEEKER';
  const vertical = getVertical(req.url) as TVertical;
  const serviceId = SERVICE_IDS[vertical];

  decoratedUser.custom = {
    ...decoratedUser.custom,
    vertical,
    userType,
    serviceId,
  };
};

export { configureLDUser };
