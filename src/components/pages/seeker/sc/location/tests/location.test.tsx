import { fireEvent, waitFor, act, screen } from '@testing-library/react';

import {
  GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
  GET_ZIP_CODE_SUMMARY,
  SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
} from '@/components/request/GQL';
import useFlowHelper from '@/components/hooks/useFlowHelper';

import { preRenderPage } from '@/__setup__/testUtil';
import {
  SeniorCareRecipientCondition,
  SeniorCommunityType,
  SENIOR_CARE_TYPE,
} from '@/__generated__/globalTypes';
import { initialAppState } from '@/state';
import { FLOWS, SEEKER_IN_FACILITY_ROUTES, SEEKER_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';

import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { AppState } from '@/types/app';
import Location from '../location';

const SALC_ZIPCODE = '92075';
const CARING_ZIPCODE = '73301';
const zipcodeMock = (zipcode: string) => ({
  request: {
    query: GET_ZIP_CODE_SUMMARY,
    variables: {
      zipcode,
    },
  },
  result: {
    data: {
      getZipcodeSummary: {
        city: 'Los Angeles',
        state: 'CA',
        zipcode,
        latitude: 33.9733,
        longitude: -118.2487,
        __typename: 'ZipcodeSummary',
      },
    },
  },
});

const getSeniorCareAssistedLivingProvidersMock = {
  request: {
    query: SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
    variables: {
      zipcode: SALC_ZIPCODE,
      source: 'USC',
      facilityType: SeniorCommunityType.INDEPENDENT_LIVING,
    },
  },
  result: {
    data: {
      seniorCareAssistedLivingProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: 'd12b50d0-9370-4c4e-9f30-7b05e4dbf28f',
        providerSearchResults: [
          {
            distanceFromSearchCenter: {
              unit: 'MILES',
              value: 8.949739776575674,
            },
            provider: {
              name: 'ACTIVCARE AT BRESSI RANCH',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: '435012c0-2eab-4b8b-a22d-24e805bec843',
              images: [],
              address: {
                city: 'CARLSBAD',
                state: 'California',
                latitude: 33.1257895,
                longitude: -117.2553947,
                __typename: 'Address',
              },
              license: {
                certified: false,
                __typename: 'License',
              },
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
                    alsCare: false,
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
                    nursingTwelveToSixteenHours: false,
                    nursingTwentyFourHours: false,
                    parkinsonsCare: false,
                    physicalTherapy: false,
                    preventativeHealthScreenings: false,
                    rehabilitationProgram: false,
                    transportationArrangement: false,
                    transportationArrangementMedical: false,
                    respiteCare: false,
                    strokeCare: false,
                    supervisionTwentyFourHours: false,
                    __typename: 'SeniorAssistedLivingCenterCareServices',
                  },
                  communityTypes: {
                    assistedLiving: true,
                    continuingCare: false,
                    independentLiving: true,
                    memoryCare: false,
                    __typename: 'LivingCenterCommunityTypes',
                  },
                  facilityAmenities: {
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
                    swimmingPool: false,
                    spaOrJacuzzi: false,
                    wellnessCenter: false,
                    __typename: 'SeniorAssistedLivingCenterFacilityAmenities',
                  },
                  foodAmenities: {
                    allMealsProvided: false,
                    anytimeDining: false,
                    diabetic: false,
                    glutenFree: false,
                    guestMeals: false,
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
                    __typename: 'SeniorAssistedLivingCenterFoodAmenities',
                  },
                  onSiteServices: {
                    beautician: false,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                    __typename: 'SeniorAssistedLivingCenterOnSiteServices',
                  },
                  __typename: 'AssistedLivingCenterAttributes',
                },
                offerings: [],
                __typename: 'SeniorAssistedLivingCenter',
              },
              __typename: 'Provider',
            },
            __typename: 'ProviderResult',
          },
          {
            distanceFromSearchCenter: {
              unit: 'MILES',
              value: 8.949739776575674,
            },
            provider: {
              name: 'ACTIVCARE AT BRESSI RANCH',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: 'afc29491-6d87-4f32-9bff-a4f35300766f',
              images: [],
              address: {
                city: 'CARLSBAD',
                state: 'California',
                latitude: 33.1257895,
                longitude: -117.2553947,
                __typename: 'Address',
              },
              license: {
                certified: false,
                __typename: 'License',
              },
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
                    alsCare: false,
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
                    nursingTwelveToSixteenHours: false,
                    nursingTwentyFourHours: false,
                    parkinsonsCare: false,
                    physicalTherapy: false,
                    preventativeHealthScreenings: false,
                    rehabilitationProgram: false,
                    transportationArrangement: false,
                    transportationArrangementMedical: false,
                    respiteCare: false,
                    strokeCare: false,
                    supervisionTwentyFourHours: false,
                    __typename: 'SeniorAssistedLivingCenterCareServices',
                  },
                  communityTypes: {
                    assistedLiving: true,
                    continuingCare: false,
                    independentLiving: true,
                    memoryCare: false,
                    __typename: 'LivingCenterCommunityTypes',
                  },
                  facilityAmenities: {
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
                    swimmingPool: false,
                    spaOrJacuzzi: false,
                    wellnessCenter: false,
                    __typename: 'SeniorAssistedLivingCenterFacilityAmenities',
                  },
                  foodAmenities: {
                    allMealsProvided: false,
                    anytimeDining: false,
                    diabetic: false,
                    glutenFree: false,
                    guestMeals: false,
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
                    __typename: 'SeniorAssistedLivingCenterFoodAmenities',
                  },
                  onSiteServices: {
                    beautician: false,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                    __typename: 'SeniorAssistedLivingCenterOnSiteServices',
                  },
                  __typename: 'AssistedLivingCenterAttributes',
                },
                offerings: [],
                __typename: 'SeniorAssistedLivingCenter',
              },
              __typename: 'Provider',
            },
            __typename: 'ProviderResult',
          },
          {
            distanceFromSearchCenter: {
              unit: 'MILES',
              value: 8.949739776575674,
            },
            provider: {
              name: 'ACTIVCARE AT 4S RANCH',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: 'c6739a70-f334-4009-bd63-b153f9c34818',
              images: [
                {
                  urlSmall: 'https://dn8v0guplrley.cloudfront.net/image_6470_small.png?1628701573',
                  urlMedium:
                    'https://dn8v0guplrley.cloudfront.net/image_6470_medium.png?1628701573',
                  __typename: 'ProfileImage',
                },
              ],
              address: {
                city: 'San Diego',
                state: 'California',
                latitude: 33.0194658,
                longitude: -117.1094699,
                __typename: 'Address',
              },
              license: null,
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
                    alsCare: false,
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
                    transportationArrangement: false,
                    transportationArrangementMedical: false,
                    respiteCare: false,
                    strokeCare: false,
                    supervisionTwentyFourHours: true,
                    __typename: 'SeniorAssistedLivingCenterCareServices',
                  },
                  communityTypes: {
                    assistedLiving: false,
                    continuingCare: false,
                    independentLiving: false,
                    memoryCare: false,
                    __typename: 'LivingCenterCommunityTypes',
                  },
                  facilityAmenities: {
                    barberOrBeautySalon: true,
                    cafeOrBistro: false,
                    computerCenter: false,
                    diningRoom: true,
                    fitnessRoom: true,
                    gameRoom: false,
                    garden: false,
                    library: false,
                    marketOnSite: false,
                    outdoorPatio: false,
                    outdoorSpace: false,
                    privateDiningRooms: true,
                    religiousOrMeditationCenter: false,
                    swimmingPool: false,
                    spaOrJacuzzi: false,
                    wellnessCenter: false,
                    __typename: 'SeniorAssistedLivingCenterFacilityAmenities',
                  },
                  foodAmenities: {
                    allMealsProvided: true,
                    anytimeDining: false,
                    diabetic: false,
                    glutenFree: true,
                    guestMeals: true,
                    halaal: false,
                    kosher: false,
                    lowOrNoSodium: false,
                    noSugar: true,
                    professionalChef: false,
                    roomService: true,
                    someMealsProvided: true,
                    specialDietaryRestrictions: false,
                    vegan: false,
                    vegetarian: false,
                    __typename: 'SeniorAssistedLivingCenterFoodAmenities',
                  },
                  onSiteServices: {
                    beautician: true,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                    __typename: 'SeniorAssistedLivingCenterOnSiteServices',
                  },
                  __typename: 'AssistedLivingCenterAttributes',
                },
                offerings: [
                  {
                    monthlyRent: {
                      amount: '6000',
                      currencyCode: 'USD',
                      __typename: 'Money',
                    },
                    communityType: 'ASSISTED_LIVING',
                    __typename: 'SeniorCareOffering',
                  },
                ],
                __typename: 'SeniorAssistedLivingCenter',
              },
              __typename: 'Provider',
            },
            __typename: 'ProviderResult',
          },
          {
            distanceFromSearchCenter: {
              unit: 'MILES',
              value: 8.949739776575674,
            },
            provider: {
              name: 'ACTIVCARE AT BRESSI RANCH',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: 'afc29491-6d87-4f32-9bff-a4f35300766e',
              images: [],
              address: {
                city: 'CARLSBAD',
                state: 'California',
                latitude: 33.1257895,
                longitude: -117.2553947,
                __typename: 'Address',
              },
              license: {
                certified: false,
                __typename: 'License',
              },
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
                    alsCare: false,
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
                    nursingTwelveToSixteenHours: false,
                    nursingTwentyFourHours: false,
                    parkinsonsCare: false,
                    physicalTherapy: false,
                    preventativeHealthScreenings: false,
                    rehabilitationProgram: false,
                    transportationArrangement: false,
                    transportationArrangementMedical: false,
                    respiteCare: false,
                    strokeCare: false,
                    supervisionTwentyFourHours: false,
                    __typename: 'SeniorAssistedLivingCenterCareServices',
                  },
                  communityTypes: {
                    assistedLiving: true,
                    continuingCare: false,
                    independentLiving: true,
                    memoryCare: false,
                    __typename: 'LivingCenterCommunityTypes',
                  },
                  facilityAmenities: {
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
                    swimmingPool: false,
                    spaOrJacuzzi: false,
                    wellnessCenter: false,
                    __typename: 'SeniorAssistedLivingCenterFacilityAmenities',
                  },
                  foodAmenities: {
                    allMealsProvided: false,
                    anytimeDining: false,
                    diabetic: false,
                    glutenFree: false,
                    guestMeals: false,
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
                    __typename: 'SeniorAssistedLivingCenterFoodAmenities',
                  },
                  onSiteServices: {
                    beautician: false,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                    __typename: 'SeniorAssistedLivingCenterOnSiteServices',
                  },
                  __typename: 'AssistedLivingCenterAttributes',
                },
                offerings: [],
                __typename: 'SeniorAssistedLivingCenter',
              },
              __typename: 'Provider',
            },
            __typename: 'ProviderResult',
          },
          {
            distanceFromSearchCenter: {
              unit: 'MILES',
              value: 8.949739776575674,
            },
            provider: {
              name: 'ACTIVCARE AT BRESSI RANCH',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: 'afc29491-6d87-4f32-9bff-a4f35300766d',
              images: [],
              address: {
                city: 'CARLSBAD',
                state: 'California',
                latitude: 33.1257895,
                longitude: -117.2553947,
                __typename: 'Address',
              },
              license: {
                certified: false,
                __typename: 'License',
              },
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
                    alsCare: false,
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
                    nursingTwelveToSixteenHours: false,
                    nursingTwentyFourHours: false,
                    parkinsonsCare: false,
                    physicalTherapy: false,
                    preventativeHealthScreenings: false,
                    rehabilitationProgram: false,
                    transportationArrangement: false,
                    transportationArrangementMedical: false,
                    respiteCare: false,
                    strokeCare: false,
                    supervisionTwentyFourHours: false,
                    __typename: 'SeniorAssistedLivingCenterCareServices',
                  },
                  communityTypes: {
                    assistedLiving: true,
                    continuingCare: false,
                    independentLiving: false,
                    memoryCare: false,
                    __typename: 'LivingCenterCommunityTypes',
                  },
                  facilityAmenities: {
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
                    swimmingPool: false,
                    spaOrJacuzzi: false,
                    wellnessCenter: false,
                    __typename: 'SeniorAssistedLivingCenterFacilityAmenities',
                  },
                  foodAmenities: {
                    allMealsProvided: false,
                    anytimeDining: false,
                    diabetic: false,
                    glutenFree: false,
                    guestMeals: false,
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
                    __typename: 'SeniorAssistedLivingCenterFoodAmenities',
                  },
                  onSiteServices: {
                    beautician: false,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                    __typename: 'SeniorAssistedLivingCenterOnSiteServices',
                  },
                  __typename: 'AssistedLivingCenterAttributes',
                },
                offerings: [],
                __typename: 'SeniorAssistedLivingCenter',
              },
              __typename: 'Provider',
            },
            __typename: 'ProviderResult',
          },
        ],
      },
    },
  },
};

const getNumberOfSeniorCareFacilitiesNearbyMock = {
  request: {
    query: GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
    variables: {
      zipcode: CARING_ZIPCODE,
      notSure: true,
      independentLivingFacilities: false,
      assistedLivingFacilities: false,
      memoryCareFacilities: false,
    },
  },
  result: {
    data: {
      getNumberOfSeniorCareFacilitiesNearby: {
        __typename: 'GetNumberOfSeniorCareFacilitiesNearbySuccess',
        count: 6,
      },
    },
  },
};

const getSeniorCareAssistedLivingProvidersbyMockEmpty = {
  request: {
    query: SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
    variables: {
      zipcode: CARING_ZIPCODE,
      source: 'USC',
      facilityType: SeniorCommunityType.ASSISTED_LIVING,
    },
  },
  result: {
    data: {
      seniorCareAssistedLivingProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: 'd12b50d0-9370-4c4e-9f30-7b05e4dbf28f',
        providerSearchResults: [],
      },
    },
  },
};

const getNumberOfSeniorCareFacilitiesNearbyMockEmpty = {
  request: {
    query: GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
    variables: {
      zipcode: CARING_ZIPCODE,
      notSure: true,
      independentLivingFacilities: false,
      assistedLivingFacilities: false,
      memoryCareFacilities: false,
    },
  },
  result: {
    data: {
      getNumberOfSeniorCareFacilitiesNearby: {
        __typename: 'GetNumberOfSeniorCareFacilitiesNearbySuccess',
        count: 0,
      },
    },
  },
};

jest.mock('@/components/hooks/useFlowHelper', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Location', () => {
  it('matches snapshot', async () => {
    const { renderFn } = preRenderPage();
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });
    const { asFragment } = renderFn(Location);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    const { renderFn } = preRenderPage();
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });
    renderFn(Location);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText('Where are you looking for care?')).toBeInTheDocument();
  });

  it('routes to the /recap route', async () => {
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER.name });

    const mocks = [zipcodeMock(CARING_ZIPCODE)];
    const { renderFn, routerMock } = preRenderPage({ appState: initialAppState, mocks });
    renderFn(Location);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: CARING_ZIPCODE } });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });

    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_ROUTES.RECAP);
    });
  });

  it('routes to the /payment-type page after city and state are available, and there are SALC facilities', async () => {
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [zipcodeMock(SALC_ZIPCODE), getSeniorCareAssistedLivingProvidersMock];
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        flow: {
          ...initialAppState.flow,
          userHasAccount: true,
        },
      },
      mocks,
    });
    renderFn(Location);

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.change(textField, { target: { value: SALC_ZIPCODE } });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });
    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE);
    });
  });

  it('routes to the /payment-type page after city and state are available, and there are CARING facilities', async () => {
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [
      zipcodeMock(CARING_ZIPCODE),
      getSeniorCareAssistedLivingProvidersbyMockEmpty,
      getNumberOfSeniorCareFacilitiesNearbyMock,
    ];
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        flow: {
          ...initialAppState.flow,
          userHasAccount: true,
        },
      },
      mocks,
    });
    renderFn(Location);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.change(textField, { target: { value: CARING_ZIPCODE } });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });

    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE);
    });
  });

  it('routes to the /no-inventory page after city and state are available, and there are no SALC & CARING facilities', async () => {
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [
      zipcodeMock(CARING_ZIPCODE),
      getSeniorCareAssistedLivingProvidersbyMockEmpty,
      getNumberOfSeniorCareFacilitiesNearbyMockEmpty,
    ];
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          condition: SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
          caringFacilityCountNearBy: 0,
        },
        flow: {
          ...initialAppState.flow,
          userHasAccount: true,
        },
      },
      mocks,
    });
    renderFn(Location);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: CARING_ZIPCODE } });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });

    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.NO_INVENTORY);
    });
  });

  it('routes to the /payment-type page after city and state are available AND there are SALC facilities', async () => {
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [zipcodeMock(SALC_ZIPCODE), getSeniorCareAssistedLivingProvidersMock];
    const { renderFn, routerMock } = preRenderPage({
      appState: { ...initialAppState },
      mocks,
    });
    renderFn(Location);

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.change(textField, { target: { value: SALC_ZIPCODE } });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });
    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE);
    });
  });

  it('routes to the /describe-loved-one page after city and state are available AND there are SALC facilities AND RECOMMENDATION_OPTIMIZATION FF is on variant', async () => {
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [zipcodeMock(SALC_ZIPCODE), getSeniorCareAssistedLivingProvidersMock];
    const { renderFn, routerMock } = preRenderPage({
      appState: { ...initialAppState },
      mocks,
      flags: {
        [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
          reason: { kind: 'variant' },
          value: true,
          variationIndex: 1,
        },
      },
    });
    renderFn(Location);

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.change(textField, { target: { value: SALC_ZIPCODE } });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });
    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE);
    });
  });

  it('triggers both analytic events during in-home seeker enrollment when feature flag is on', async () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledLocation');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');

    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [zipcodeMock(SALC_ZIPCODE), getSeniorCareAssistedLivingProvidersMock];
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
        },
      },
      mocks,
      flags: {
        [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
          reason: { kind: 'FALLTRHOUGH' },
          value: 'variant',
          variationIndex: 1,
        },
      },
    });
    renderFn(Location);

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.change(textField, { target: { value: SALC_ZIPCODE } });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });
    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE);
    });

    expect(amplitudeListener).toHaveBeenCalled();
    expect(amplitudeListener.mock.calls[0][0]?.data).toMatchObject({
      city: 'Los Angeles',
      state: 'CA',
    });

    expect(ampliListener).toHaveBeenCalled();
    expect(ampliListener.mock.calls[0][0]).toMatchObject({
      city: 'Los Angeles',
      state: 'CA',
    });

    amplitudeListener.mockClear();
    ampliListener.mockClear();
  });

  it('triggers only non-ampli analytic events during in-home seeker enrollment when feature flag is off', async () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledLocation');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');

    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER_IN_FACILITY.name });

    const mocks = [zipcodeMock(SALC_ZIPCODE), getSeniorCareAssistedLivingProvidersMock];
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
        },
      },
      mocks,
    });
    renderFn(Location);

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    fireEvent.change(textField, { target: { value: SALC_ZIPCODE } });
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });
    nextButton.click();

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE);
    });

    expect(amplitudeListener).toHaveBeenCalled();
    expect(amplitudeListener.mock.calls[0][0]?.data).toMatchObject({
      city: 'Los Angeles',
      state: 'CA',
    });

    expect(ampliListener).not.toHaveBeenCalled();
  });

  it('Should render correctly for in-home flow without FF', () => {
    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        flowName: FLOWS.SEEKER.name,
      },
    };
    (useFlowHelper as jest.Mock).mockReturnValue({ currentFlow: FLOWS.SEEKER.name });
    jest.spyOn(AnalyticsHelper, 'logTestExposure');
    const { renderFn } = preRenderPage({ appState });
    renderFn(Location);

    expect(
      screen.queryByText(
        /Senior living communities are a good option for those looking to balance care and community./
      )
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Where are you looking for care?/)).toBeInTheDocument();
    expect(AnalyticsHelper.logTestExposure).not.toBeCalled();
  });
});
