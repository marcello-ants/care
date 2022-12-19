import { SeniorCommunityType } from '@/__generated__/globalTypes';
// eslint-disable-next-line camelcase
import { seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings } from '@/__generated__/seniorCareAssistedLivingProviders';
import {
  parseSeniorCareAssistedLivingProviders,
  parseBaseCost,
} from '../SeniorCareAssistedLivingProvidersHelper';
import {
  testingCommunity,
  communityResponse,
  testingCommunityNoMatchingCommunityType,
} from './CommunityHelper';

describe('SeniorCareAssistedLivingProvidersHelper', () => {
  it('should parse correctly the community response with target community match', () => {
    expect(parseSeniorCareAssistedLivingProviders(communityResponse, 'INDEPENDENT_LIVING')).toEqual(
      [testingCommunity]
    );
  });
  it('should parse when zero monthly rent in all offerings', () => {
    // eslint-disable-next-line camelcase
    const offerings: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults_provider_seniorAssistedLivingCenter_offerings[] =
      [
        {
          __typename: 'SeniorCareOffering',
          monthlyRent: {
            __typename: 'Money',
            amount: '0',
            currencyCode: 'USD',
          },
          communityType: SeniorCommunityType.ASSISTED_LIVING,
        },
        {
          __typename: 'SeniorCareOffering',
          monthlyRent: {
            __typename: 'Money',
            amount: '0',
            currencyCode: 'USD',
          },
          communityType: SeniorCommunityType.ASSISTED_LIVING,
        },
      ];
    expect(parseBaseCost(offerings, SeniorCommunityType.ASSISTED_LIVING)).toEqual(undefined);
  });
  it('should parse correctly the community response with NO target community match', () => {
    expect(parseSeniorCareAssistedLivingProviders(communityResponse, 'MEMORY_CARE')).toEqual([
      testingCommunityNoMatchingCommunityType,
    ]);
  });
});
