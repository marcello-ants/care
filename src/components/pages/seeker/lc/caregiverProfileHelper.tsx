import { SEEKER_CC_LEAD_CONNECT_ROUTES } from '@/constants';
import { ProviderProfile } from './types';

export const generateCaregiverPath = (targetCaregiver: ProviderProfile) => {
  const nextCaregiverMemberId = targetCaregiver.memberId;
  const basePath = `${SEEKER_CC_LEAD_CONNECT_ROUTES.CAREGIVER_LIST}/${nextCaregiverMemberId}`;
  return basePath;
};

export const findMatchingIndex = (targetMemberId: string, caregiverProfiles: ProviderProfile[]) => {
  return caregiverProfiles.findIndex((caregiverProfile) => {
    return caregiverProfile.memberId === targetMemberId;
  });
};
