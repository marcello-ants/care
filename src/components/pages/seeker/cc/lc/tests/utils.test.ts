import { mapGQLToProviderProfiles } from '@/components/pages/seeker/cc/lc/utils';

const gqlProviders = [
  {
    caregiver: {
      avgReviewRating: 0,
      numberOfReviews: 0,
      yearsOfExperience: 1,
      hasCareCheck: true,
      responseTime: 8,
      member: {
        address: {
          city: 'Boston',
          state: 'MA',
        },
        displayName: 'Lisa N.',
        imageURL: 'url1',
        legacyId: '23135',
      },
      signUpDate: null,
      profiles: {
        commonCaregiverProfile: {
          id: '1',
        },
        childCareCaregiverProfile: {
          bio: {
            experienceSummary: 'bio',
          },
          payRange: {
            hourlyRateFrom: {
              amount: '10',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              amount: '20',
              currencyCode: 'USD',
            },
          },
          qualities: {
            certifiedNursingAssistant: false,
            certifiedRegisterNurse: false,
            certifiedTeacher: false,
            childDevelopmentAssociate: false,
            comfortableWithPets: false,
            cprTrained: false,
            crn: false,
            doesNotSmoke: false,
            doula: false,
            earlyChildDevelopmentCoursework: false,
            earlyChildhoodEducation: false,
            firstAidTraining: false,
            nafccCertified: false,
            ownTransportation: false,
            specialNeedsCare: false,
            trustlineCertifiedCalifornia: false,
          },
          supportedServices: {
            carpooling: false,
            craftAssistance: false,
            errands: false,
            groceryShopping: false,
            laundryAssistance: false,
            lightHousekeeping: false,
            mealPreparation: false,
            swimmingSupervision: false,
            travel: false,
          },
        },
      },
    },
  },
];

const expectedParsedProviders = [
  {
    averageRating: 0,
    biography: 'bio',
    cityAndState: 'Boston, MA',
    displayName: 'Lisa N.',
    distanceFromSeeker: 1,
    imgSource: 'url1',
    maxRate: '20',
    memberId: '1',
    minRate: '10',
    numberOfReviews: 0,
    qualities: {
      certifiedNursingAssistant: false,
      certifiedRegisterNurse: false,
      certifiedTeacher: false,
      childDevelopmentAssociate: false,
      comfortableWithPets: false,
      cprTrained: false,
      crn: false,
      doesNotSmoke: false,
      doula: false,
      earlyChildDevelopmentCoursework: false,
      earlyChildhoodEducation: false,
      firstAidTraining: false,
      nafccCertified: false,
      ownTransportation: false,
      specialNeedsCare: false,
      trustlineCertifiedCalifornia: false,
    },
    services: {
      carpooling: false,
      craftAssistance: false,
      errands: false,
      groceryShopping: false,
      laundryAssistance: false,
      lightHousekeeping: false,
      mealPreparation: false,
      swimmingSupervision: false,
      travel: false,
    },
    yearsOfExperience: 1,
  },
];

describe('mapGQLToProviderProfiles', () => {
  it('maps provider profiles correctly', () => {
    expect(mapGQLToProviderProfiles(gqlProviders)).toEqual(expectedParsedProviders);
  });
});
