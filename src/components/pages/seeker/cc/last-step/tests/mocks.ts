export const topCaregiverMock = {
  caregiver: {
    profileURL: 'https://www.dev.carezen.net/p/childcaremors/cc',
    avgReviewRating: 0,
    numberOfReviews: 0,
    yearsOfExperience: 4,
    hasCareCheck: true,
    responseTime: 0,
    member: {
      address: { city: 'Waltham', state: 'MA' },
      displayName: 'Childcaremor S.',
      firstName: 'Childcaremor',
      imageURL:
        'https://d1b5nxorgx1bbz.cloudfront.net/aws-uat47/photo/135X135/12/812_Ly2oStBuvI4buRomfD4oBstHutgTKB760',
      legacyId: '16383',
      id: '2d798888-e397-4caa-9930-0f0e4175ff80',
    },
    profiles: {
      commonCaregiverProfile: { id: '5550' },
      childCareCaregiverProfile: {
        bio: {
          experienceSummary:
            'CHILDCAREexperienceSummaryCHILDCARE Having passion in early childhood education, I strive to help children to grow healthy, in a safe environment, and be disciplined and conscious enough to become a full member of their families, communities, and their own countries. UUzOKT',
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
          ownTransportation: true,
          specialNeedsCare: false,
          trustlineCertifiedCalifornia: false,
        },
        supportedServices: {
          carpooling: true,
          craftAssistance: true,
          errands: false,
          groceryShopping: false,
          laundryAssistance: false,
          lightHousekeeping: true,
          mealPreparation: true,
          swimmingSupervision: true,
          travel: true,
        },
        payRange: {
          hourlyRateFrom: { amount: '10', currencyCode: 'USD' },
          hourlyRateTo: { amount: '20', currencyCode: 'USD' },
        },
      },
    },
    seniorCareProviderProfile: {
      bio: 'CHILDCAREexperienceSummaryCHILDCARE Having passion in early childhood education, I strive to help children to grow healthy, in a safe environment, and be disciplined and conscious enough to become a full member of their families, communities, and their own countries. UUzOKT',
      services: null,
      payRange: {
        hourlyRateFrom: { amount: '10', currencyCode: 'USD' },
        hourlyRateTo: { amount: '20', currencyCode: 'USD' },
      },
      qualities: ['OWN_TRANSPORTATION'],
    },
    signUpDate: '2021-05-14T08:31:00.000Z',
  },
  distanceFromRequestZip: { unit: 'MILES', value: 2.18 },
};

export default {
  topCaregiverMock,
};
