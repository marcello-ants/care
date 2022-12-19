import { generateSCTestAwareGetTopCaregiversInput } from '@/components/pages/seeker/sc/getTopCaregiversHelper';
import { HelpType } from '@/types/seeker';

const getTopCaregiversPartialParams = {
  zipcode: '78665',
  rate: { minimum: 5, maximum: 10, legalMinimum: 5 },
  helpTypes: [HelpType.HOUSEHOLD, HelpType.PERSONAL, HelpType.SPECIALIZED, HelpType.TRANSPORTATION],
};

const getTopCaregiversPartialParamsNoHelpTypes = {
  zipcode: '78665',
  rate: { minimum: 5, maximum: 10, legalMinimum: 5 },
  helpTypes: undefined,
};

describe('GetTopCaregivers Helper', () => {
  it('should generate the correct input when L+C test is OFF and L+C fifteen max params is OFF', () => {
    const result = generateSCTestAwareGetTopCaregiversInput(
      undefined,
      getTopCaregiversPartialParams,
      10,
      undefined
    );

    expect(result).toEqual({
      hasCareCheck: true,
      hourlyRate: null,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      numResults: 10,
      qualities: null,
      serviceID: 'SENIOR_CARE',
      services: null,
      zipcode: '78665',
    });
  });

  it('should generate the correct input when L+C test is OFF and L+C fifteen max params is ON', () => {
    const result = generateSCTestAwareGetTopCaregiversInput(
      undefined,
      getTopCaregiversPartialParams,
      10,
      1
    );

    expect(result).toEqual({
      hasCareCheck: true,
      hourlyRate: null,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      numResults: 15,
      qualities: null,
      serviceID: 'SENIOR_CARE',
      services: null,
      zipcode: '78665',
    });
  });
  it('should generate the correct input when L+C test is ON variant=1 and L+C fifteen max params is ON', () => {
    const result = generateSCTestAwareGetTopCaregiversInput(
      1,
      getTopCaregiversPartialParams,
      10,
      1
    );

    expect(result).toEqual({
      daysSinceLastActive: undefined,
      enableFuzzySearch: undefined,
      hasApprovedActivePhoto: true,
      hasCareCheck: true,
      hourlyRate: null,
      isActiveAccount: undefined,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      minimumAvgReviewRating: undefined,
      numResults: 15,
      qualities: null,
      serviceID: 'SENIOR_CARE',
      services: null,
      zipcode: '78665',
    });
  });
  it('should generate the correct input when L+C test is ON variant=2 and L+C max fifteen params is ON', () => {
    const result = generateSCTestAwareGetTopCaregiversInput(
      2,
      getTopCaregiversPartialParams,
      10,
      1
    );

    expect(result).toEqual({
      daysSinceLastActive: 30,
      hasApprovedActivePhoto: true,
      hasCareCheck: true,
      hourlyRate: {
        maximum: {
          amount: '10',
          currencyCode: 'USD',
        },
        minimum: {
          amount: '5',
          currencyCode: 'USD',
        },
      },
      isActiveAccount: true,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      numResults: 15,
      qualities: ['ALZHEIMERS_OR_DEMENTIA_EXPERIENCE'],
      serviceID: 'SENIOR_CARE',
      services: ['TRANSPORTATION', 'ERRANDS', 'LIGHT_HOUSECLEANING', 'BATHING'],
      zipcode: '78665',
    });
  });
  it('should generate the correct input when L+C test is ON variant=2 and no help types and L+C fifteen max params is ON', () => {
    const result = generateSCTestAwareGetTopCaregiversInput(
      2,
      getTopCaregiversPartialParamsNoHelpTypes,
      10,
      1
    );

    expect(result).toEqual({
      daysSinceLastActive: 30,
      hasApprovedActivePhoto: true,
      hasCareCheck: true,
      hourlyRate: {
        maximum: {
          amount: '10',
          currencyCode: 'USD',
        },
        minimum: {
          amount: '5',
          currencyCode: 'USD',
        },
      },
      isActiveAccount: true,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      numResults: 15,
      qualities: null,
      serviceID: 'SENIOR_CARE',
      services: null,
      zipcode: '78665',
    });
  });

  it('should generate the correct input when L+C test is ON variant=2 and maxDistanceFromSeeker=20 (second request attempt) and L+C fifteen max params is ON', () => {
    const result = generateSCTestAwareGetTopCaregiversInput(
      2,
      getTopCaregiversPartialParams,
      20,
      1
    );

    expect(result).toEqual({
      daysSinceLastActive: 30,
      enableFuzzySearch: true,
      hasApprovedActivePhoto: true,
      hasCareCheck: true,
      hourlyRate: {
        maximum: {
          amount: '10',
          currencyCode: 'USD',
        },
        minimum: {
          amount: '5',
          currencyCode: 'USD',
        },
      },
      isActiveAccount: true,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 20,
      },
      numResults: 15,
      qualities: ['ALZHEIMERS_OR_DEMENTIA_EXPERIENCE'],
      serviceID: 'SENIOR_CARE',
      services: ['TRANSPORTATION', 'ERRANDS', 'LIGHT_HOUSECLEANING', 'BATHING'],
      zipcode: '78665',
    });
  });
});
