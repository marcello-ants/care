import React from 'react';
import {
  buildTags,
  mapCaregiverProfiles,
  updateInfoContainerHeight,
  updateInfoContainerHeightProps,
} from '@/components/pages/seeker/sc/lc/caregiver-profile/caregiverProfileHelper';
import {
  SeniorCareAttributeTags,
  SeniorCareListedAttributes,
  SeniorCareProviderProfile,
} from '@/types/seeker';
import { getTopCaregivers } from '@/__generated__/getTopCaregivers';
import {
  DistanceUnit,
  SeniorCareProviderQuality,
  SeniorCareServiceProvidedType,
} from '@/__generated__/globalTypes';

const GET_TOP_CAREGIVERS_SUCCESSFUL_RESPONSE: getTopCaregivers = {
  topCaregivers: [
    {
      __typename: 'TopCaregiver',
      caregiver: {
        __typename: 'Caregiver',
        avgReviewRating: 0,
        numberOfReviews: 0,
        yearsOfExperience: 3,
        hasCareCheck: true,
        responseTime: 8,
        member: {
          __typename: 'Member',
          address: {
            __typename: 'Address',
            city: 'Austin',
            state: 'TX',
          },
          displayName: 'Amy R.',
          firstName: 'Amy',
          imageURL:
            'https://d1eh3xlhhug380.cloudfront.net/aws-stage8/photo/135X135/15/27671115_m2eLRCSGeUEk9VMuh3X23csDAkO1m010',
          legacyId: '31411255',
          id: '22cefa16-9030-4a94-bce1-cd9ccd393380',
        },
        seniorCareProviderProfile: {
          __typename: 'SeniorCareProviderProfile',
          bio: 'I have a masters degree in speech language pathology and I have 3 years of experience caring for the elderly.',
          services: ['PERSONAL_CARE' as SeniorCareServiceProvidedType],
          payRange: {
            __typename: 'PayRange',
            hourlyRateFrom: {
              __typename: 'Money',
              amount: '15',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              __typename: 'Money',
              amount: '25',
              currencyCode: 'USD',
            },
          },
          qualities: [
            'OWN_TRANSPORTATION' as SeniorCareProviderQuality,
            'DOES_NOT_SMOKE' as SeniorCareProviderQuality,
            'COMFORTABLE_WITH_PETS' as SeniorCareProviderQuality,
            'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE' as SeniorCareProviderQuality,
          ],
        },
        profileURL: 'https://www.care.com/p/amyk3/sc',
        signUpDate: '2020-06-17T11:48:00.000Z',
        profiles: {
          __typename: 'CaregiverProfiles',
          commonCaregiverProfile: {
            __typename: 'CommonCaregiverProfile',
            id: '1',
          },
          childCareCaregiverProfile: {
            __typename: 'ChildCareCaregiverProfile',
            bio: {
              __typename: 'Bio',
              experienceSummary: 'bio',
            },
            payRange: {
              __typename: 'PayRange',
              hourlyRateFrom: {
                __typename: 'Money',
                amount: '10',
                currencyCode: 'USD',
              },
              hourlyRateTo: {
                __typename: 'Money',
                amount: '20',
                currencyCode: 'USD',
              },
            },
            qualities: {
              __typename: 'ChildCareCaregiverQualities',
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
              __typename: 'ChildCareCaregiverServices',
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
      distanceFromRequestZip: {
        __typename: 'PreciseDistance',
        unit: 'MILES' as DistanceUnit,
        value: 6.64,
      },
    },
    {
      __typename: 'TopCaregiver',
      caregiver: {
        __typename: 'Caregiver',
        avgReviewRating: 0,
        numberOfReviews: 0,
        yearsOfExperience: 2,
        hasCareCheck: true,
        responseTime: 6,
        member: {
          __typename: 'Member',
          address: {
            __typename: 'Address',
            city: 'Austin',
            state: 'TX',
          },
          displayName: 'Susan Q.',
          firstName: 'Susan',
          imageURL:
            'https://d1eh3xlhhug380.cloudfront.net/aws-stage8/photo/135X135/42/39675042_Ui0dEQpj8uaEnOcroshQyBrpnCIYc00',
          legacyId: '24069461',
          id: '37789095-0a52-4194-b991-3f3d8fad8cc7',
        },
        seniorCareProviderProfile: {
          __typename: 'SeniorCareProviderProfile',
          bio: 'I have been a nanny and caregiver professionally for 2 yrs. Helping others is what I like to do and can add joy to anyones day. I multitask very well and would like to help with errands, grocery , drs. appts., bills and conversation and companionship',
          services: null,
          payRange: {
            __typename: 'PayRange',
            hourlyRateFrom: {
              __typename: 'Money',
              amount: '20',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              __typename: 'Money',
              amount: '25',
              currencyCode: 'USD',
            },
          },
          qualities: null,
        },
        profileURL: 'https://www.care.com/p/susanw451/sc',
        signUpDate: '2020-06-17T11:48:00.000Z',
        profiles: {
          __typename: 'CaregiverProfiles',
          commonCaregiverProfile: {
            __typename: 'CommonCaregiverProfile',
            id: '2',
          },
          childCareCaregiverProfile: {
            __typename: 'ChildCareCaregiverProfile',
            bio: {
              __typename: 'Bio',
              experienceSummary: 'bio',
            },
            payRange: {
              __typename: 'PayRange',
              hourlyRateFrom: {
                __typename: 'Money',
                amount: '10',
                currencyCode: 'USD',
              },
              hourlyRateTo: {
                __typename: 'Money',
                amount: '20',
                currencyCode: 'USD',
              },
            },
            qualities: {
              __typename: 'ChildCareCaregiverQualities',
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
              __typename: 'ChildCareCaregiverServices',
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
      distanceFromRequestZip: {
        __typename: 'PreciseDistance',
        unit: 'MILES' as DistanceUnit,
        value: 6.64,
      },
    },
    {
      __typename: 'TopCaregiver',
      caregiver: {
        __typename: 'Caregiver',
        avgReviewRating: 0,
        numberOfReviews: 0,
        yearsOfExperience: 10,
        hasCareCheck: true,
        responseTime: 0,
        member: {
          __typename: 'Member',
          address: {
            __typename: 'Address',
            city: 'Austin',
            state: 'TX',
          },
          displayName: 'Michael V.',
          firstName: 'Michael',
          imageURL:
            'https://d1eh3xlhhug380.cloudfront.net/aws-stage8/photo/135X135/52/39649152_yn8nyLaTwHOClZrmZG0JjdR9nKhFg1800',
          legacyId: '2687118',
          id: 'f5fce048-9f04-4d46-ab6f-51d426514326',
        },
        seniorCareProviderProfile: {
          __typename: 'SeniorCareProviderProfile',
          bio: 'I have been a caregiver for 10+ years working with an Autistic young adult as well as a young adult with a brain injury. I worked ft for 7 years with a retired stroke victim. He was limited to a wheelchair when we first met and was able to get him walking with minimal assistance with a quad cane. Daily duties included transferring, bathing and hygiene assistance, stretching, therapy, light laundry and meal preparation as well as running errands, Dr and therapy appointments as well as visiting friends and family. I am very patient and passionate about this work and always go the extra mile.',
          services: [
            'PERSONAL_CARE' as SeniorCareServiceProvidedType,
            'BATHING' as SeniorCareServiceProvidedType,
          ],
          payRange: {
            __typename: 'PayRange',
            hourlyRateFrom: {
              __typename: 'Money',
              amount: '10',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              __typename: 'Money',
              amount: '20',
              currencyCode: 'USD',
            },
          },
          qualities: [
            'OWN_TRANSPORTATION' as SeniorCareProviderQuality,
            'DOES_NOT_SMOKE' as SeniorCareProviderQuality,
            'COMFORTABLE_WITH_PETS' as SeniorCareProviderQuality,
            'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE' as SeniorCareProviderQuality,
          ],
        },
        profileURL: 'https://www.care.com/p/michaelo92/sc',
        signUpDate: '2020-06-17T11:48:00.000Z',
        profiles: {
          __typename: 'CaregiverProfiles',
          commonCaregiverProfile: {
            __typename: 'CommonCaregiverProfile',
            id: '3',
          },
          childCareCaregiverProfile: {
            __typename: 'ChildCareCaregiverProfile',
            bio: {
              __typename: 'Bio',
              experienceSummary: 'bio',
            },
            payRange: {
              __typename: 'PayRange',
              hourlyRateFrom: {
                __typename: 'Money',
                amount: '10',
                currencyCode: 'USD',
              },
              hourlyRateTo: {
                __typename: 'Money',
                amount: '20',
                currencyCode: 'USD',
              },
            },
            qualities: {
              __typename: 'ChildCareCaregiverQualities',
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
              __typename: 'ChildCareCaregiverServices',
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
      distanceFromRequestZip: {
        __typename: 'PreciseDistance',
        unit: 'MILES' as DistanceUnit,
        value: 9.34,
      },
    },
  ],
};
describe('Caregiver Profile Helper', () => {
  describe('updateInfoContainerHeightProps', () => {
    it('should test  if no refs exist', () => {
      const noRefObj: updateInfoContainerHeightProps = {
        buttonsRef: null,
        containerInfoRef: null,
        innerContainerInfoRef: null,
        isDesktopOrUp: false,
        currentProfileIndex: 0,
      };
      updateInfoContainerHeight(noRefObj);
      expect(noRefObj.buttonsRef).toBe(null);

      noRefObj.buttonsRef = { current: {} } as React.RefObject<HTMLDivElement>;
      updateInfoContainerHeight(noRefObj);
      expect(noRefObj.containerInfoRef).toBe(null);

      noRefObj.containerInfoRef = { current: {} } as React.RefObject<HTMLDivElement>;
      updateInfoContainerHeight(noRefObj);
      expect(noRefObj.innerContainerInfoRef).toBe(null);
    });

    it('should apply the styles if the buttons are not visible', () => {
      const buttonsRef = {
        current: {
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const containerInfoRef = {
        current: {
          style: {},
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const innerContainerInfoRef = {
        current: {
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const notVisibleButtons: updateInfoContainerHeightProps = {
        buttonsRef,
        containerInfoRef,
        innerContainerInfoRef,
        isDesktopOrUp: true,
        currentProfileIndex: 0,
      };

      updateInfoContainerHeight(notVisibleButtons);

      expect(notVisibleButtons?.containerInfoRef?.current?.style?.maxHeight).toBe('348px');
      expect(notVisibleButtons?.containerInfoRef?.current?.style?.overflow).toBe('auto');
    });

    it('should remove the styles if is in desktop and buttons are visible', () => {
      const buttonsRef = {
        current: {
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 500,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const containerInfoRef = {
        current: {
          style: {},
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const innerContainerInfoRef = {
        current: {
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const notVisibleButtons: updateInfoContainerHeightProps = {
        buttonsRef,
        containerInfoRef,
        innerContainerInfoRef,
        isDesktopOrUp: true,
        currentProfileIndex: 0,
      };

      updateInfoContainerHeight(notVisibleButtons);

      expect(notVisibleButtons?.containerInfoRef?.current?.style?.maxHeight).toBe('none');
      expect(notVisibleButtons?.containerInfoRef?.current?.style?.overflow).toBe('none');
    });

    it('should remove the styles if is in mobile and buttons are visible', () => {
      const buttonsRef = {
        current: {
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 500,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const containerInfoRef = {
        current: {
          style: {},
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const innerContainerInfoRef = {
        current: {
          getBoundingClientRect: () => {
            return {
              height: 48,
              bottom: 900,
            };
          },
        },
      } as React.RefObject<HTMLDivElement>;

      const notVisibleButtons: updateInfoContainerHeightProps = {
        buttonsRef,
        containerInfoRef,
        innerContainerInfoRef,
        isDesktopOrUp: false,
        currentProfileIndex: 0,
      };

      updateInfoContainerHeight(notVisibleButtons);

      expect(notVisibleButtons?.containerInfoRef?.current?.style?.maxHeight).toBe('none');
      expect(notVisibleButtons?.containerInfoRef?.current?.style?.overflow).toBe('none');
    });
  });

  it('getCaregiverProfiles successfully', () => {
    const result = mapCaregiverProfiles(
      GET_TOP_CAREGIVERS_SUCCESSFUL_RESPONSE,
      undefined,
      undefined
    );

    expect(result).toEqual([
      {
        attributeTags: ['Non-smoker'],
        averageRating: 0,
        biography:
          'I have a masters degree in speech language pathology and I have 3 years of experience caring for the elderly.',
        cityAndState: 'Austin, TX',
        displayName: 'Amy R.',
        distanceFromSeeker: 6.64,
        hasCareCheck: true,
        imgSource:
          'https://d1eh3xlhhug380.cloudfront.net/aws-stage8/photo/135X135/15/27671115_m2eLRCSGeUEk9VMuh3X23csDAkO1m010',
        listedAttributes: ['Memory care', 'Personal care'],
        maxRate: '25',
        memberId: '31411255',
        memberUUID: '22cefa16-9030-4a94-bce1-cd9ccd393380',
        minRate: '15',
        numberReviews: 0,
        responseTime: 8,
        seoProfileId: 'amyk3',
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
        yearsOfExperience: 3,
      },
      {
        attributeTags: [],
        averageRating: 0,
        biography:
          'I have been a nanny and caregiver professionally for 2 yrs. Helping others is what I like to do and can add joy to anyones day. I multitask very well and would like to help with errands, grocery , drs. appts., bills and conversation and companionship',
        cityAndState: 'Austin, TX',
        displayName: 'Susan Q.',
        distanceFromSeeker: 6.64,
        hasCareCheck: true,
        imgSource:
          'https://d1eh3xlhhug380.cloudfront.net/aws-stage8/photo/135X135/42/39675042_Ui0dEQpj8uaEnOcroshQyBrpnCIYc00',
        listedAttributes: [],
        maxRate: '25',
        memberId: '24069461',
        memberUUID: '37789095-0a52-4194-b991-3f3d8fad8cc7',
        minRate: '20',
        numberReviews: 0,
        responseTime: 6,
        seoProfileId: 'susanw451',
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
        yearsOfExperience: 2,
      },
      {
        attributeTags: ['Non-smoker'],
        averageRating: 0,
        biography:
          'I have been a caregiver for 10+ years working with an Autistic young adult as well as a young adult with a brain injury. I worked ft for 7 years with a retired stroke victim. He was limited to a wheelchair when we first met and was able to get him walking with minimal assistance with a quad cane. Daily duties included transferring, bathing and hygiene assistance, stretching, therapy, light laundry and meal preparation as well as running errands, Dr and therapy appointments as well as visiting friends and family. I am very patient and passionate about this work and always go the extra mile.',
        cityAndState: 'Austin, TX',
        displayName: 'Michael V.',
        distanceFromSeeker: 9.34,
        hasCareCheck: true,
        imgSource:
          'https://d1eh3xlhhug380.cloudfront.net/aws-stage8/photo/135X135/52/39649152_yn8nyLaTwHOClZrmZG0JjdR9nKhFg1800',
        listedAttributes: ['Memory care', 'Personal care', 'Bathing and dressing'],
        maxRate: '20',
        memberId: '2687118',
        memberUUID: 'f5fce048-9f04-4d46-ab6f-51d426514326',
        minRate: '10',
        numberReviews: 0,
        responseTime: 0,
        seoProfileId: 'michaelo92',
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
        yearsOfExperience: 10,
      },
    ]);
  });

  it('buildTags successfully', () => {
    const currentProvider: SeniorCareProviderProfile = {
      memberId: '123',
      memberUUID: '51f52b5f-df83-4c8b-a10a-acda9de6542e',
      imgSource: 'test',
      displayName: 'Joseph D.',
      cityAndState: 'Austin, TX',
      distanceFromSeeker: 1,
      averageRating: undefined,
      numberReviews: 0,
      yearsOfExperience: 1,
      minRate: '14',
      maxRate: '25',
      hasCareCheck: true,
      attributeTags: [SeniorCareAttributeTags.nursingAssistant],
      biography: 'hello',
      listedAttributes: [
        SeniorCareListedAttributes.hospiceServices,
        SeniorCareListedAttributes.companionship,
      ],
      seoProfileId: 'j123',
      signUpDate: new Date('2020-06-17T11:48:00.000Z'),
    };
    const className: string = 'test';

    const [tag1, tag2] = buildTags(currentProvider, className);
    expect(tag1.key).toEqual('CareCheck');
    expect(tag2.key).toEqual(SeniorCareAttributeTags.nursingAssistant);
  });
});
