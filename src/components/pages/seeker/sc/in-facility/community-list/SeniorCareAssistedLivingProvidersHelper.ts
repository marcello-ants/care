/* eslint-disable camelcase */
import { startCase, capitalize } from 'lodash-es';
import {
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_address,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_images,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_communityTypes,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_careServices,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_facilityAmenities,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_foodAmenities,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_onSiteServices,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings,
  seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_distanceFromSearchCenter,
} from '@/__generated__/seniorCareAssistedLivingProviders';
import { CommunityDetails, CommunityTypeDetail } from '@/types/seeker';
import { DistanceUnit } from '@/__generated__/globalTypes';

type CommunityTypeKeys =
  keyof seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_communityTypes;

const CommunityTypeLabels: { [key in CommunityTypeKeys]?: string } = {
  assistedLiving: 'Assisted living',
  continuingCare: 'Continuing care',
  independentLiving: 'Independent living',
  memoryCare: 'Memory care',
};

const parseCommunityTypes = (
  communityTypes:
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_communityTypes
    | undefined
): CommunityTypeDetail[] | undefined => {
  const result: CommunityTypeDetail[] = [];
  if (communityTypes) {
    const allValues = Object.entries(communityTypes);
    for (let i = 0; i < allValues.length; i += 1) {
      const [key, value] = allValues[i];
      if (key in CommunityTypeLabels) {
        const label = CommunityTypeLabels[key as CommunityTypeKeys];
        if (label) {
          result.push({ title: label, available: Boolean(value) });
        }
      }
    }
  }
  return result.length > 0 ? result : undefined;
};

const parseLocation = (
  address: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_address | null
) => {
  return address?.city && address?.state ? `${address?.city}, ${address?.state}` : undefined;
};

const parseImages = (
  images:
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_images[]
    | null
) => {
  return images
    ? images
        .filter((image) => {
          return image?.urlSmall?.length && image?.urlMedium?.length;
        })
        .map((image) => {
          return { small: image.urlSmall!, medium: image.urlMedium! };
        })
    : undefined;
};

const getCustomLabelForAttribute = (currentAttribute: string): string => {
  let customLabel = '';

  switch (currentAttribute) {
    case 'alsCare':
      customLabel = 'ALS Care';
      break;
    case 'supervisionTwentyFourHours':
      customLabel = '24-hour supervision';
      break;
    case 'nursingTwentyFourHours':
      customLabel = '24-hour nursing';
      break;
    case 'nursingTwelveToSixteenHours':
      customLabel = '12-16 hours nursing';
      break;
    case 'transportationArrangementMedical':
      customLabel = 'Medical transportation arrangement';
      break;
    default:
      customLabel = capitalize(startCase(currentAttribute));
  }

  return customLabel;
};

const parseAttributesByStartCase = (
  attributes:
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_careServices
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_onSiteServices
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_facilityAmenities
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_attributes_foodAmenities
    | undefined
): string[] | undefined => {
  let result: string[] = [];

  if (attributes) {
    result = Object.entries(attributes).reduce((acc: string[], currentAttribute) => {
      const [key, value] = currentAttribute;

      if (value && key !== '__typename') {
        const label = getCustomLabelForAttribute(key);
        acc.push(label);
      }
      return acc;
    }, []);
  }
  return result.length > 0 ? result : undefined;
};

function compareOfferingsAscendingAmount(
  offeringA: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings,
  offeringB: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings
) {
  return (
    Number(offeringA.monthlyRent?.amount ?? Number.MAX_VALUE) -
    Number(offeringB.monthlyRent?.amount ?? Number.MAX_VALUE)
  );
}

export const parseBaseCost = (
  offerings:
    | seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings[]
    | undefined,
  targetType: String
): number | undefined => {
  if (!offerings || offerings.length < 1) {
    return undefined;
  }
  const currentOfferings = offerings.filter(
    (offering) => (offering?.monthlyRent?.amount ?? '0') !== '0'
  );

  const targetCommunityOfferings = currentOfferings.filter(
    (offering) => offering?.communityType === targetType
  );

  const offeringSelection =
    targetCommunityOfferings.length === 0 ? currentOfferings : targetCommunityOfferings;

  const lowestCostTarget = offeringSelection.sort(compareOfferingsAscendingAmount);
  if (lowestCostTarget[0] !== undefined) {
    return Number(lowestCostTarget[0].monthlyRent?.amount);
  }
  return undefined;
};

export const parseDistance = (
  distance: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_distanceFromSearchCenter
) => {
  const { unit, value } = distance;
  const unitMap = {
    [DistanceUnit.KILOMETERS]: 'km',
    [DistanceUnit.MILES]: 'mi',
  };

  return `${value.toFixed(1)}${unitMap[unit]}`;
};

// eslint-disable-next-line import/prefer-default-export
export const parseSeniorCareAssistedLivingProviders = (
  providerSearchResults: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults[],
  targetType: String
): CommunityDetails => {
  return providerSearchResults.map(({ provider, distanceFromSearchCenter }) => {
    return {
      id: provider.id,
      name: provider.name ?? undefined,
      location: parseLocation(provider.address),
      distanceFromSearchCenter: parseDistance(distanceFromSearchCenter!),
      communityTypes: parseCommunityTypes(
        provider.seniorAssistedLivingCenter?.attributes?.communityTypes
      ),
      baseCost: parseBaseCost(provider.seniorAssistedLivingCenter?.offerings, targetType),
      images: parseImages(provider.images),
      careServices: parseAttributesByStartCase(
        provider.seniorAssistedLivingCenter?.attributes?.careServices
      ),
      onSiteServices: parseAttributesByStartCase(
        provider.seniorAssistedLivingCenter?.attributes?.onSiteServices
      ),
      description: provider.description ?? undefined,
      latitude: provider.address?.latitude ?? undefined,
      longitude: provider.address?.longitude ?? undefined,

      facilityAmenities: parseAttributesByStartCase(
        provider.seniorAssistedLivingCenter?.attributes?.facilityAmenities
      ),
      foodAmenities: parseAttributesByStartCase(
        provider.seniorAssistedLivingCenter?.attributes?.foodAmenities
      ),
      centerType: provider.centerType ?? undefined,
      city: provider.address?.city,
      state: provider.address?.state,
      address: provider.address?.addressLine1,
      zip: provider.address?.zip,
    };
  });
};
