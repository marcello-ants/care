import GET_TOP_CAREGIVERS from '../components/request/TopCaregiversGQL';

export const topCaregiversMock = (
  numResults: number,
  showPersonalization: boolean,
  hasApprovedActivePhotoOverride?: boolean
) => {
  return {
    request: {
      query: GET_TOP_CAREGIVERS,
      variables: {
        zipcode: '10004',
        serviceID: 'SENIOR_CARE',
        numResults,
        ...(showPersonalization
          ? {
              daysSinceLastActive: 30,
              hasApprovedActivePhoto: true,
              hourlyRate: {
                maximum: { amount: '22', currencyCode: 'USD' },
                minimum: { amount: '14', currencyCode: 'USD' },
              },
              hasCareCheck: true,
              qualities: null,
              services: null,
              isActiveAccount: true,
              maxDistanceFromSeeker: {
                unit: 'MILES',
                value: 10,
              },
            }
          : {
              ...(hasApprovedActivePhotoOverride
                ? { hasApprovedActivePhoto: hasApprovedActivePhotoOverride }
                : {}),
              hourlyRate: null,
              hasCareCheck: true,
              qualities: null,
              services: null,
              maxDistanceFromSeeker: {
                unit: 'MILES',
                value: 10,
              },
            }),
      },
    },
    result: {
      data: {
        topCaregivers: [
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
                firstName: 'Lisa',
                imageURL: 'url1',
                legacyId: '23135',
                id: 'fa15e15c-99b5-4a73-9783-c625b9452c08',
              },
              seniorCareProviderProfile: {
                bio: 'Information',
                services: ['ERRANDS', 'LIGHT_HOUSECLEANING', 'MEAL_PREPARATION'],
                payRange: {
                  hourlyRateFrom: {
                    amount: '15',
                    currencyCode: 'USD',
                  },
                  hourlyRateTo: {
                    amount: '25',
                    currencyCode: 'USD',
                  },
                },
                qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
              },
              profileURL: 'https://www.care.com/p/lisao9238/sc',
              signUpDate: '2021-06-17T11:48:00.000Z',
              profiles: {
                commonCaregiverProfile: {
                  id: '1',
                },
                childCareCaregiverProfile: {
                  bio: {
                    experienceSummary: 'bio',
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
                },
              },
            },
            distanceFromRequestZip: {
              unit: 'MILES',
              value: 1.2,
            },
          },
          {
            caregiver: {
              avgReviewRating: 5,
              numberOfReviews: 4,
              yearsOfExperience: 2,
              hasCareCheck: true,
              responseTime: 8,
              member: {
                address: {
                  city: 'Boston',
                  state: 'MA',
                },
                displayName: 'Margaret D.',
                firstName: 'Margaret',
                imageURL: 'url2',
                legacyId: '69817',
                id: '7c67b19d-a07b-413f-ae41-5a520af9db0a1',
              },
              seniorCareProviderProfile: {
                bio: '',
                services: ['ERRANDS', 'LIGHT_HOUSECLEANING', 'MEAL_PREPARATION'],
                payRange: {
                  hourlyRateFrom: {
                    amount: '15',
                    currencyCode: 'USD',
                  },
                  hourlyRateTo: {
                    amount: '25',
                    currencyCode: 'USD',
                  },
                },
                qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
              },
              profileURL: 'https://www.care.com/p/margareta141/sc',
              signUpDate: '2021-06-17T11:48:00.000Z',
              profiles: {
                commonCaregiverProfile: {
                  id: '2',
                },
                childCareCaregiverProfile: {
                  bio: {
                    experienceSummary: 'bio',
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
                },
              },
            },
            distanceFromRequestZip: {
              unit: 'MILES',
              value: 1.2,
            },
          },

          {
            caregiver: {
              avgReviewRating: 0,
              numberOfReviews: 0,
              yearsOfExperience: 1,
              hasCareCheck: true,
              responseTime: 8,
              member: {
                address: {
                  city: 'Austin',
                  state: 'TX',
                },
                displayName: 'Jerry N.',
                firstName: 'Jerry',
                imageURL: 'url1',
                legacyId: '23131245',
                id: 'f74e314b-3d87-408a-b213-1afa191f0f19',
              },
              seniorCareProviderProfile: {
                bio: 'Information',
                services: ['ERRANDS', 'LIGHT_HOUSECLEANING', 'MEAL_PREPARATION'],
                payRange: {
                  hourlyRateFrom: {
                    amount: '15',
                    currencyCode: 'USD',
                  },
                  hourlyRateTo: {
                    amount: '25',
                    currencyCode: 'USD',
                  },
                },
                qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
              },
              profileURL: 'https://www.care.com/p/lisao9238/sc',
              signUpDate: '2021-06-17T11:48:00.000Z',
              profiles: {
                commonCaregiverProfile: {
                  id: '3',
                },
                childCareCaregiverProfile: {
                  bio: {
                    experienceSummary: 'bio',
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
                },
              },
            },
            distanceFromRequestZip: {
              unit: 'MILES',
              value: 1.2,
            },
          },
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
                displayName: 'Lenny N.',
                firstName: 'Lenny',
                imageURL: 'url1',
                legacyId: '231412735',
                id: '053a5ca5-7272-4e8e-b3f2-47b91a48b096',
              },
              seniorCareProviderProfile: {
                bio: 'Information',
                services: ['ERRANDS', 'LIGHT_HOUSECLEANING', 'MEAL_PREPARATION'],
                payRange: {
                  hourlyRateFrom: {
                    amount: '15',
                    currencyCode: 'USD',
                  },
                  hourlyRateTo: {
                    amount: '25',
                    currencyCode: 'USD',
                  },
                },
                qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
              },
              profileURL: 'https://www.care.com/p/lisao9238/sc',
              signUpDate: '2021-06-17T11:48:00.000Z',
              profiles: {
                commonCaregiverProfile: {
                  id: '4',
                },
                childCareCaregiverProfile: {
                  bio: {
                    experienceSummary: 'bio',
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
                },
              },
            },
            distanceFromRequestZip: {
              unit: 'MILES',
              value: 1.2,
            },
          },
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
                displayName: 'Larry N.',
                firstName: 'Larry',
                imageURL: 'url1',
                legacyId: '71423135',
                id: '0659efbd-b6a7-4ea0-9ed7-fcb54fbecfd4',
              },
              seniorCareProviderProfile: {
                bio: 'Information',
                services: ['ERRANDS', 'LIGHT_HOUSECLEANING', 'MEAL_PREPARATION'],
                payRange: {
                  hourlyRateFrom: {
                    amount: '15',
                    currencyCode: 'USD',
                  },
                  hourlyRateTo: {
                    amount: '25',
                    currencyCode: 'USD',
                  },
                },
                qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
              },
              profileURL: 'https://www.care.com/p/lisao9238/sc',
              signUpDate: '2021-06-17T11:48:00.000Z',
              profiles: {
                commonCaregiverProfile: {
                  id: '5',
                },
                childCareCaregiverProfile: {
                  bio: {
                    experienceSummary: 'bio',
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
                },
              },
            },
            distanceFromRequestZip: {
              unit: 'MILES',
              value: 1.2,
            },
          },
        ],
      },
    },
  };
};

export const topCaregiversMockNoResults = (numResults: number, showPersonalization: boolean) => {
  return {
    request: {
      query: GET_TOP_CAREGIVERS,
      variables: {
        zipcode: '10004',
        serviceID: 'SENIOR_CARE',
        numResults,
        ...(showPersonalization
          ? {
              daysSinceLastActive: 30,
              enableFuzzySearch: true,
              hasApprovedActivePhoto: true,
              hourlyRate: {
                maximum: { amount: '22', currencyCode: 'USD' },
                minimum: { amount: '14', currencyCode: 'USD' },
              },
              hasCareCheck: true,
              qualities: null,
              services: null,
              isActiveAccount: true,
              maxDistanceFromSeeker: {
                unit: 'MILES',
                value: 10,
              },
            }
          : {
              hourlyRate: null,
              hasCareCheck: true,
              qualities: null,
              services: null,
              maxDistanceFromSeeker: {
                unit: 'MILES',
                value: 10,
              },
            }),
      },
    },
    result: {
      data: {
        topCaregivers: [],
      },
    },
  };
};
