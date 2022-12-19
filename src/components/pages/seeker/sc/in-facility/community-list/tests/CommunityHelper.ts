/* eslint-disable camelcase */
import { seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults } from '@/__generated__/seniorCareAssistedLivingProviders';
import { CommunityDetail as CommunityDetailType } from '@/types/seeker';
import { CenterType, DistanceUnit, SeniorCommunityType } from '@/__generated__/globalTypes';

// eslint-disable-next-line import/prefer-default-export
export const communityResponse: seniorCareAssistedLivingProviders_seniorCareAssistedLivingProviders_ProviderSearchSuccess_providerSearchResults[] =
  [
    {
      __typename: 'ProviderResult',
      distanceFromSearchCenter: {
        __typename: 'PreciseDistance',
        value: 8.883927,
        unit: DistanceUnit.MILES,
      },
      provider: {
        __typename: 'Provider',
        license: {
          __typename: 'License',
          certified: true,
        },
        id: 'bdad2d61-6279-4811-b83f-0e859ae95loobb3',
        name: 'Signature Senior Living',
        centerType: CenterType.SMALL_MEDIUM_BUSINESS,
        description:
          'Your comfort and happiness are our top priority at Boston Adult Care Center. When living at this community, residents can participate in small, organized group activities unique to the residents’ lives. Our residents live safe and comfortable due to 24/7 on-site',
        address: {
          __typename: 'Address',
          addressLine1: '11012 Harris Branch Parkway',
          state: 'MA',
          city: 'Boston',
          latitude: 42.37607126469243,
          longitude: -71.05198950936281,
          zip: '78754',
        },
        images: [
          {
            __typename: 'ProfileImage',
            urlSmall: '/app/enrollment/community-list/1.jpg',
            urlMedium: '/app/enrollment/community-list/1-mid.jpg',
          },
        ],
        seniorAssistedLivingCenter: {
          __typename: 'SeniorAssistedLivingCenter',
          offerings: [
            {
              __typename: 'SeniorCareOffering',
              monthlyRent: {
                __typename: 'Money',
                amount: '2000',
                currencyCode: 'USD',
              },
              communityType: SeniorCommunityType.ASSISTED_LIVING,
            },
            {
              __typename: 'SeniorCareOffering',
              monthlyRent: {
                __typename: 'Money',
                amount: '2500',
                currencyCode: 'USD',
              },
              communityType: SeniorCommunityType.INDEPENDENT_LIVING,
            },
          ],
          attributes: {
            __typename: 'AssistedLivingCenterAttributes',
            communityTypes: {
              __typename: 'LivingCenterCommunityTypes',
              assistedLiving: true,
              continuingCare: false,
              independentLiving: true,
              memoryCare: false,
            },
            careServices: {
              __typename: 'SeniorAssistedLivingCenterCareServices',
              alsCare: true,
              callSystemTwentyFourHours: false,
              dailyLivingAssistance: false,
              diabetesCare: false,
              healthCareProviderCoordination: false,
              hospiceCare: false,
              insulinInjections: false,
              mealPreparationAndService: false,
              medicationManagement: false,
              memoryCare: false,
              mentalWellnessCare: false,
              mildCognitiveImpairmentCare: false,
              nursingTwelveToSixteenHours: true,
              nursingTwentyFourHours: true,
              parkinsonsCare: false,
              physicalTherapy: false,
              preventativeHealthScreenings: false,
              rehabilitationProgram: false,
              respiteCare: false,
              strokeCare: false,
              supervisionTwentyFourHours: true,
              transportationArrangement: false,
              transportationArrangementMedical: true,
            },
            foodAmenities: {
              __typename: 'SeniorAssistedLivingCenterFoodAmenities',
              allMealsProvided: true,
              anytimeDining: false,
              diabetic: false,
              glutenFree: true,
              guestMeals: true,
              halaal: false,
              kosher: false,
              lowOrNoSodium: false,
              noSugar: false,
              professionalChef: false,
              roomService: false,
              someMealsProvided: false,
              specialDietaryRestrictions: false,
              vegan: false,
              vegetarian: false,
            },
            facilityAmenities: {
              __typename: 'SeniorAssistedLivingCenterFacilityAmenities',
              barberOrBeautySalon: false,
              cafeOrBistro: false,
              computerCenter: false,
              diningRoom: false,
              fitnessRoom: false,
              gameRoom: false,
              garden: false,
              library: false,
              marketOnSite: false,
              outdoorPatio: false,
              outdoorSpace: false,
              privateDiningRooms: false,
              religiousOrMeditationCenter: false,
              spaOrJacuzzi: false,
              swimmingPool: true,
              wellnessCenter: false,
            },
            onSiteServices: {
              __typename: 'SeniorAssistedLivingCenterOnSiteServices',
              beautician: true,
              concierge: false,
              familyEducationAndSupport: false,
              housekeeping: false,
              laundryOrDryCleaning: false,
              moveInCoordination: false,
            },
          },
        },
      },
    },
  ];

export const testingCommunity: CommunityDetailType = {
  id: 'bdad2d61-6279-4811-b83f-0e859ae95loobb3',
  name: 'Signature Senior Living',
  location: 'Boston, MA',
  distanceFromSearchCenter: '8.9mi',
  baseCost: 2500,
  centerType: CenterType.SMALL_MEDIUM_BUSINESS,
  images: [
    {
      small: '/app/enrollment/community-list/1.jpg',
      medium: '/app/enrollment/community-list/1-mid.jpg',
    },
  ],
  careServices: [
    'ALS Care',
    '12-16 hours nursing',
    '24-hour nursing',
    '24-hour supervision',
    'Medical transportation arrangement',
  ],
  onSiteServices: ['Beautician'],
  facilityAmenities: ['Swimming pool'],
  foodAmenities: ['All meals provided', 'Gluten free', 'Guest meals'],
  description:
    'Your comfort and happiness are our top priority at Boston Adult Care Center. When living at this community, residents can participate in small, organized group activities unique to the residents’ lives. Our residents live safe and comfortable due to 24/7 on-site',

  latitude: 42.37607126469243,
  longitude: -71.05198950936281,
  communityTypes: [
    {
      title: 'Assisted living',
      available: true,
    },
    {
      title: 'Continuing care',
      available: false,
    },
    {
      title: 'Independent living',
      available: true,
    },
    {
      title: 'Memory care',
      available: false,
    },
  ],
  address: '11012 Harris Branch Parkway',
  state: 'MA',
  city: 'Boston',
  zip: '78754',
};

export const testingCommunityNoMatchingCommunityType: CommunityDetailType = {
  id: 'bdad2d61-6279-4811-b83f-0e859ae95loobb3',
  name: 'Signature Senior Living',
  location: 'Boston, MA',
  distanceFromSearchCenter: '8.9mi',
  baseCost: 2000,
  centerType: CenterType.SMALL_MEDIUM_BUSINESS,
  images: [
    {
      small: '/app/enrollment/community-list/1.jpg',
      medium: '/app/enrollment/community-list/1-mid.jpg',
    },
  ],
  careServices: [
    'ALS Care',
    '12-16 hours nursing',
    '24-hour nursing',
    '24-hour supervision',
    'Medical transportation arrangement',
  ],
  onSiteServices: ['Beautician'],
  facilityAmenities: ['Swimming pool'],
  foodAmenities: ['All meals provided', 'Gluten free', 'Guest meals'],
  description:
    'Your comfort and happiness are our top priority at Boston Adult Care Center. When living at this community, residents can participate in small, organized group activities unique to the residents’ lives. Our residents live safe and comfortable due to 24/7 on-site',

  latitude: 42.37607126469243,
  longitude: -71.05198950936281,
  communityTypes: [
    {
      title: 'Assisted living',
      available: true,
    },
    {
      title: 'Continuing care',
      available: false,
    },
    {
      title: 'Independent living',
      available: true,
    },
    {
      title: 'Memory care',
      available: false,
    },
  ],
  address: '11012 Harris Branch Parkway',
  state: 'MA',
  city: 'Boston',
  zip: '78754',
};
