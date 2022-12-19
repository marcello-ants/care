import {
  ProviderProfile,
  ProviderQualities,
  ProviderServices,
} from '@/components/pages/seeker/lc/types';

export const mapGQLToProviderQualities = (gqlQualities: any): ProviderQualities => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...providerQualities } = gqlQualities;

  return providerQualities;
};

export const mapGQLToProviderServices = (gqlServices: any): ProviderServices => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...providerServices } = gqlServices;

  return providerServices;
};

export const mapGQLToProviderProfiles = (gqlTopProviders: any[]): ProviderProfile[] => {
  return gqlTopProviders.map(({ caregiver, distanceFromRequestZip }) => ({
    memberId: caregiver.profiles.commonCaregiverProfile.id,
    memberUUID: caregiver.member.id,
    imgSource: caregiver.member.imageURL,
    qualities: mapGQLToProviderQualities(caregiver.profiles?.childCareCaregiverProfile?.qualities),
    services: mapGQLToProviderServices(
      caregiver.profiles?.childCareCaregiverProfile?.supportedServices
    ),
    displayName: caregiver.member.displayName,
    firstName: caregiver.member.firstName,
    averageRating: caregiver.avgReviewRating,
    numberOfReviews: caregiver.numberOfReviews,
    cityAndState: `${caregiver.member.address.city}, ${caregiver.member.address.state}`,
    distanceFromSeeker: distanceFromRequestZip?.value || 1,
    minRate: caregiver.profiles?.childCareCaregiverProfile?.payRange?.hourlyRateFrom.amount,
    maxRate: caregiver.profiles?.childCareCaregiverProfile?.payRange?.hourlyRateTo.amount,
    yearsOfExperience: caregiver.yearsOfExperience,
    biography: caregiver.profiles?.childCareCaregiverProfile?.bio.experienceSummary ?? '',
  }));
};
