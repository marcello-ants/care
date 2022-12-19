import { QueryLazyOptions } from '@apollo/client';

import { NUMBER_OF_LEAD_CONNECT_RESULTS } from '@/constants';
import { Rate } from '@/types/common';
import { HelpType } from '@/types/seeker';
import { getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import {
  DistanceInput,
  DistanceUnit,
  SeniorCareProviderQuality,
  SeniorCareServiceProvidedType,
  ServiceType,
} from '@/__generated__/globalTypes';

type LazyGetTopCaregiverCall = (
  options?: QueryLazyOptions<getTopCaregiversVariables> | undefined
) => void;

export type GetTopCaregiversPartialParams = {
  zipcode: string;
  rate: Rate | undefined;
  helpTypes: HelpType[] | undefined;
};

type GetTopCaregiversParams = GetTopCaregiversPartialParams & {
  numResults: number;
  maxDistanceFromSeeker?: number;
  hasApprovedActivePhoto?: boolean;
  enableFuzzySearch?: boolean;
  daysSinceLastActive?: number;
  isActiveAccount?: boolean;
  minimumAvgReviewRating?: number;
};

const specializedCarePresent = (helpTypes: HelpType[]): boolean => {
  return helpTypes.includes(HelpType.SPECIALIZED);
};

// Lead+Connect uses a slimmed down mapping
const helpTypesToLeadConnectServices = (helpTypes: HelpType[]) => {
  const services: SeniorCareServiceProvidedType[] = [];

  if (helpTypes.includes(HelpType.TRANSPORTATION)) {
    services.push(SeniorCareServiceProvidedType.TRANSPORTATION);
  }
  if (helpTypes.includes(HelpType.HOUSEHOLD)) {
    services.push(SeniorCareServiceProvidedType.ERRANDS);
    services.push(SeniorCareServiceProvidedType.LIGHT_HOUSECLEANING);
  }

  if (helpTypes.includes(HelpType.PERSONAL)) {
    services.push(SeniorCareServiceProvidedType.BATHING);
  }

  return services;
};

export const generateSCGetTopCaregiversInput = (
  getTopCaregiversParams: GetTopCaregiversParams
): getTopCaregiversVariables => {
  const hourlyRate = getTopCaregiversParams.rate
    ? {
        maximum: {
          amount: String(getTopCaregiversParams.rate.maximum),
          currencyCode: 'USD',
        },
        minimum: {
          amount: String(getTopCaregiversParams.rate.minimum),
          currencyCode: 'USD',
        },
      }
    : null;

  const qualities =
    getTopCaregiversParams.helpTypes && specializedCarePresent(getTopCaregiversParams.helpTypes)
      ? [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE]
      : null;

  const services =
    getTopCaregiversParams.helpTypes && getTopCaregiversParams.helpTypes.length > 0
      ? helpTypesToLeadConnectServices(getTopCaregiversParams.helpTypes)
      : null;

  const maxDistanceFromSeeker: DistanceInput | null = getTopCaregiversParams.maxDistanceFromSeeker
    ? { unit: DistanceUnit.MILES, value: getTopCaregiversParams.maxDistanceFromSeeker }
    : null;
  return {
    zipcode: getTopCaregiversParams.zipcode,
    serviceID: ServiceType.SENIOR_CARE,
    numResults: getTopCaregiversParams.numResults,
    hourlyRate,
    hasCareCheck: true,
    qualities,
    services,
    maxDistanceFromSeeker,
    hasApprovedActivePhoto: getTopCaregiversParams.hasApprovedActivePhoto,
    enableFuzzySearch: getTopCaregiversParams.enableFuzzySearch,
    daysSinceLastActive: getTopCaregiversParams.daysSinceLastActive,
    isActiveAccount: getTopCaregiversParams.isActiveAccount,
    minimumAvgReviewRating: getTopCaregiversParams.minimumAvgReviewRating,
  };
};

export const generateSCTestAwareGetTopCaregiversInput = (
  leadConnectBucket: number | undefined,
  getTopCaregiversPartialParams: GetTopCaregiversPartialParams,
  maxDistanceFromSeeker: number,
  leadConnectFifteenCaregiversBucket: number | undefined
): getTopCaregiversVariables => {
  let getTopCaregiversParams: GetTopCaregiversParams;
  if (leadConnectBucket === 1) {
    // This tests PN unpersonalized
    // Attributes or hourlyRate params AND maxDistanceFromSeeker NOT INCLUDED in the query
    getTopCaregiversParams = {
      ...getTopCaregiversPartialParams,
      rate: undefined,
      helpTypes: undefined,
      numResults: NUMBER_OF_LEAD_CONNECT_RESULTS(leadConnectFifteenCaregiversBucket === 1),
      maxDistanceFromSeeker,
      hasApprovedActivePhoto: true,
    };
  } else if (leadConnectBucket === 2) {
    // This variant tests PN personalization
    // Attributes or hourlyRate params AND maxDistanceFromSeeker INCLUDED in the query
    getTopCaregiversParams = {
      ...getTopCaregiversPartialParams,
      numResults: NUMBER_OF_LEAD_CONNECT_RESULTS(leadConnectFifteenCaregiversBucket === 1),
      maxDistanceFromSeeker,
      hasApprovedActivePhoto: true,
      daysSinceLastActive: 30,
      isActiveAccount: true,
    };

    if (maxDistanceFromSeeker > 10) {
      // We only want to apply fuzzy search on the second request attempt, when the max distance is set to 20
      // This is to avoid getting fuzzy results prematurely, we do full attributes at 10 miles, then fuzzy at 20
      getTopCaregiversParams = {
        ...getTopCaregiversParams,
        enableFuzzySearch: true,
      };
    }
  } else {
    // This variant does no attribute personalization (current functionality)
    // No attributes or hourlyRate params or maxDistanceFromSeeker added to query
    getTopCaregiversParams = {
      ...getTopCaregiversPartialParams,
      rate: undefined,
      helpTypes: undefined,
      numResults: NUMBER_OF_LEAD_CONNECT_RESULTS(leadConnectFifteenCaregiversBucket === 1),
      maxDistanceFromSeeker,
    };
  }

  return generateSCGetTopCaregiversInput(getTopCaregiversParams);
};

export const generateInputAndCallGetTopCaregivers = (
  leadConnectBucket: number | undefined,
  getTopCaregiversPartialParams: GetTopCaregiversPartialParams,
  getTopCaregiver: LazyGetTopCaregiverCall,
  maxDistanceFromSeeker: number,
  leadConnectFifteenCaregiversBucket: number | undefined
) => {
  const getTopCaregiversInput: getTopCaregiversVariables = generateSCTestAwareGetTopCaregiversInput(
    leadConnectBucket,
    getTopCaregiversPartialParams,
    maxDistanceFromSeeker,
    leadConnectFifteenCaregiversBucket
  );

  getTopCaregiver({
    variables: getTopCaregiversInput,
  });
};
