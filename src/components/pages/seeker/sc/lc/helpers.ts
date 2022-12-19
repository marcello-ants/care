import { Caregiver } from '@/components/features/caregiversPreview/CaregiverCard';
import { MinimalProviderProfile } from '@/types/seeker';

export function formatProviders(providers: MinimalProviderProfile[]) {
  let result = '';
  providers.forEach((provider, index) => {
    if (providers.length === 1) {
      result += provider.displayName;
    } else if (index !== providers.length - 1 && providers.length > 2) {
      result += `${provider.displayName}, `;
    } else if (index !== providers.length - 1 && providers.length <= 2) {
      result += `${provider.displayName} `;
    } else {
      result += `and ${provider.displayName}`;
    }
  });
  return result;
}

export function providerProfileToCaregiver(providerProfile: MinimalProviderProfile): Caregiver {
  return {
    displayName: providerProfile.displayName,
    avgReviewRating: providerProfile.averageRating,
    numberOfReviews: providerProfile.numberReviews,
    yearsOfExperience: providerProfile.yearsOfExperience,
    imageURL: providerProfile.imgSource,
    signUpDate: providerProfile.signUpDate,
  };
}

const MAX_PROVIDERS_TO_SHOW = 5;

export function providersToShow(allProviders: MinimalProviderProfile[] = []) {
  return allProviders.length > MAX_PROVIDERS_TO_SHOW
    ? allProviders.slice(0, MAX_PROVIDERS_TO_SHOW)
    : allProviders;
}
