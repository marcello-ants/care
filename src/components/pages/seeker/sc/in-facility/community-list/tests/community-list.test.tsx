import React from 'react';
import { useRouter } from 'next/router';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';

import { AppStateProvider } from '@/components/AppState';
import { MockedProvider } from '@apollo/client/testing';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import userEvent from '@testing-library/user-event';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import {
  GET_SEEKER_INFO,
  SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD,
  SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
} from '@/components/request/GQL';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { initialState as seekerInitialState } from '@/state/seeker';
import { initialState as flowInitialState } from '@/state/flow';
import logger from '@/lib/clientLogger';
import {
  CenterType,
  DistanceUnit,
  SeniorCareAgeRangeType,
  SeniorCareRecipientCondition,
  SeniorCareRecipientRelationshipType,
  SeniorCommunityType,
} from '@/__generated__/globalTypes';
import { StylesProvider, StylesOptions } from '@material-ui/styles';

import CommunityList from '../community-list';

const generateClassName: StylesOptions['generateClassName'] = (rule, sheet): string =>
  `${sheet!.options.classNamePrefix}-${rule.key}`;

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const successZip = '78665';

const seniorCareAssistedLivingProvidersMock = {
  request: {
    query: SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
    variables: {
      zipcode: successZip,
      source: 'USC',
      facilityType: SeniorCommunityType.INDEPENDENT_LIVING,
    },
  },
  result: {
    data: {
      seniorCareAssistedLivingProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        providerSearchResults: [
          {
            distanceFromSearchCenter: {
              __typename: 'PreciseDistance',
              value: 8.883927,
              unit: DistanceUnit.MILES,
            },
            provider: {
              __typename: 'Provider',
              name: 'Signature Senior Living',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: 'afc29491-6d87-4f32-9bff-a4f35300766c',
              centerType: CenterType.SMALL_MEDIUM_BUSINESS,
              images: [],
              address: {
                city: 'CARLSBAD',
                state: 'California',
                latitude: 33.1257895,
                longitude: -117.2553947,
                addressLine1: '11012 Harris Branch Parkway',
                zip: '78754',
              },
              license: {
                certified: false,
              },
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
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
                  communityTypes: {
                    assistedLiving: true,
                    continuingCare: false,
                    independentLiving: true,
                    memoryCare: false,
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
                    spaOrJacuzzi: false,
                    swimmingPool: true,
                    wellnessCenter: false,
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
                    noSugar: false,
                    professionalChef: false,
                    roomService: false,
                    someMealsProvided: false,
                    specialDietaryRestrictions: false,
                    vegan: false,
                    vegetarian: false,
                  },
                  onSiteServices: {
                    beautician: true,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                  },
                },
                offerings: [
                  {
                    monthlyRent: {
                      amount: '2000',
                      currencyCode: 'USD',
                    },
                    communityType: 'ASSISTED_LIVING',
                  },
                  {
                    monthlyRent: {
                      amount: '2500',
                      currencyCode: 'USD',
                    },
                    communityType: 'INDEPENDENT_LIVING',
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};

const emptyZip = '99388';
const seniorCareAssistedLivingProvidersEmptyResultsMock = {
  request: {
    query: SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
    variables: {
      zipcode: emptyZip,
      source: 'USC',
      facilityType: SeniorCommunityType.ASSISTED_LIVING,
    },
  },
  result: {
    data: {
      seniorCareAssistedLivingProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        providerSearchResults: [],
      },
    },
  },
};

const errorZip = '78702';
const seniorCareAssistedLivingProvidersMockError = {
  request: {
    query: SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
    variables: {
      zipcode: errorZip,
      source: 'USC',
      facilityType: SeniorCommunityType.ASSISTED_LIVING,
    },
  },
  result: {
    data: {
      seniorCareAssistedLivingProviders: {
        __typename: 'ProviderSearchError',
        message:
          'InternalError: failed to execute query, code: Internal, cause: elastic: Error 400 (Bad Request): all shards failed [type=search_phase_execution_exception]',
      },
    },
  },
};

const SALCCommunities = [
  {
    id: 'b415e178-d3e5-46c9-9545-a959beeec522',
    name: 'Sunrise of Chandler',
    location: 'CHANDLER, AZ',
    distanceFromSearchCenter: '9.4mi',
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
        available: true,
      },
    ],
    baseCost: 1000,
    images: [
      {
        small: 'https://dn8v0guplrley.cloudfront.net/image_6993_small.png?1635349057',
        medium: 'https://dn8v0guplrley.cloudfront.net/image_6993_medium.png?1635349057',
      },
      {
        small: 'https://dn8v0guplrley.cloudfront.net/image_6994_small.png?1635349060',
        medium: 'https://dn8v0guplrley.cloudfront.net/image_6994_medium.png?1635349060',
      },
      {
        small: 'https://dn8v0guplrley.cloudfront.net/image_6995_small.png?1635349062',
        medium: 'https://dn8v0guplrley.cloudfront.net/image_6995_medium.png?1635349062',
      },
      {
        small: 'https://dn8v0guplrley.cloudfront.net/image_6996_small.png?1635349062',
        medium: 'https://dn8v0guplrley.cloudfront.net/image_6996_medium.png?1635349062',
      },
    ],
    careServices: [
      'Daily living assistance',
      'Health care provider coordination',
      'Meal preparation and service',
      'Medication management',
      'Transportation arrangement',
      'Respite care',
    ],
    onSiteServices: ['Housekeeping'],
    description:
      "Sunrise Senior Living provides personalized care based on your unique needs and preferences. Our experienced and compassionate team members get to know you on a deep levelÑallowing them to provide you with a highly tailored experience. While they focus on your care and wellness, you can enjoy life and do more of what you love. In our communities, your days will be filled with friends, engaging activities, homemade meals, and loving caregivers who feel like family. Whether itÕs expressing creativity through art, getting active with fitness classes, or learning something new, you can dive into a variety of programming and social events that appeal to your personal interests. YouÕll feel right at home in beautifully appointed common areas and your comfortable living space that have been expertly designed to help you maintain your independence. YouÕll also love the fresh, homemade meals and seasonal menus. Our talented in-house chefs serve up dishes with your tastes and dietary needs in mindÑincluding any requests or favorites you might have. Based on resident surveys, consumer insights, and industry metrics, national programs have recognized Sunrise's efforts and our commitment to quality care. Sunrise communities have earned more than 230 National Quality AwardsÑmore than any other assisted living provider.",
    latitude: 33.3047068,
    longitude: -111.9409762,
    facilityAmenities: [
      'Barber or beauty salon',
      'Dining room',
      'Outdoor space',
      'Private dining rooms',
    ],
    foodAmenities: ['All meals provided'],
    address: '11012 Harris Branch Parkway',
    state: 'MA',
    city: 'Boston',
    zip: '78754',
  },
];

const seniorAssistedLivingCommunityLeadPublishMockSuccess = {
  request: {
    query: SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD,
    variables: {
      input: {
        providerIds: ['afc29491-6d87-4f32-9bff-a4f35300766c'],
        seekerInfo: {
          email: 'joseph@care.com',
          firstName: 'Joseph',
          id: '123',
          lastName: 'Distler',
          phoneNumber: '(202) 456-1111',
        },
        source: 'ENROLLMENT',
        trackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        zipcode: successZip,
        careRecipientInfo: {
          ageRange: 'EIGHTIES',
          relationship: 'PARENT',
          facilityType: 'INDEPENDENT_LIVING',
        },
      },
    },
  },
  result: {
    data: {
      seniorAssistedLivingCommunityLeadPublish: {
        __typename: 'seniorAssistedLivingCommunityLeadPublishResponse',
        batchId: '98',
      },
    },
  },
};

const seniorAssistedLivingCommunityLeadPublishMockNTHDAYSuccess = {
  request: {
    query: SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD,
    variables: {
      input: {
        providerIds: ['afc29491-6d87-4f32-9bff-a4f35300766c'],
        seekerInfo: {
          email: 'joseph@care.com',
          firstName: 'Joseph',
          id: '123',
          lastName: 'Distler',
          phoneNumber: '(202) 456-1111',
        },
        source: 'NTH DAY',
        trackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        zipcode: successZip,
        careRecipientInfo: {
          ageRange: 'EIGHTIES',
          relationship: 'PARENT',
          facilityType: 'INDEPENDENT_LIVING',
        },
      },
    },
  },
  result: {
    data: {
      seniorAssistedLivingCommunityLeadPublish: {
        __typename: 'seniorAssistedLivingCommunityLeadPublishResponse',
        batchId: '98',
      },
    },
  },
};

const getSeekerInfoMock = {
  request: {
    operationName: 'getSeekerInfo',
    variables: { memberId: '123' },
    query: GET_SEEKER_INFO,
  },
  result: {
    data: {
      getSeeker: {
        member: {
          firstName: 'Joseph',
          lastName: 'Distler',
          contact: {
            primaryPhone: '(202) 456-1111',
            __typename: 'MemberContact',
          },
          email: 'joseph@care.com',
          __typename: 'Member',
        },
        __typename: 'Seeker',
      },
    },
  },
};

describe('in facility community-list', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;
  const realLoggerInfo = logger.info;
  const realLoggerError = logger.error;
  const loggerInfoMock = jest.fn();
  const loggerErrorMock = jest.fn();

  beforeAll(() => {
    logger.info = loggerInfoMock;
    logger.error = loggerErrorMock;
  });

  const renderComponent = (stateOverride: AppState, ldFlags?: FeatureFlags) => {
    const view = render(
      <MockedProvider
        mocks={[
          getSeekerInfoMock,
          seniorAssistedLivingCommunityLeadPublishMockSuccess,
          seniorAssistedLivingCommunityLeadPublishMockNTHDAYSuccess,
          seniorCareAssistedLivingProvidersMock,
          seniorCareAssistedLivingProvidersMockError,
          seniorCareAssistedLivingProvidersEmptyResultsMock,
        ]}
        addTypename={false}>
        <FeatureFlagsProvider flags={ldFlags || {}}>
          <StylesProvider generateClassName={generateClassName}>
            <AppStateProvider initialStateOverride={stateOverride}>
              <CommunityList />
            </AppStateProvider>
          </StylesProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    );
    ({ asFragment } = view);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/in-facility/community-list',
      asPath: '/seeker/sc/in-facility/community-list',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    mockRouter = null;
    asFragment = null;
    loggerInfoMock.mockReset();
    loggerErrorMock.mockReset();
  });

  afterAll(() => {
    logger.info = realLoggerInfo;
    logger.error = realLoggerError;
  });

  it('matches snapshot', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
        SALCCommunities,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Done reviewing/)).toBeVisible(), {
      timeout: 5000,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('Automatically publish leads and routes to payoff view', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
        SALCCommunities,
        SALCSavedFacilitiesIds: ['afc29491-6d87-4f32-9bff-a4f35300766c'],
        SALCTrackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Done reviewing/)).toBeVisible(), {
      timeout: 5000,
    });

    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'seniorAssistedLivingCommunityLeadPublishMutationSuccessful',
      })
    );

    const button = screen.getByText(/Done reviewing/);
    userEvent.click(button);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYOFF)
    );
  });

  it('should set the checkbox as enabled', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });

    const checkbox = screen.getAllByRole('checkbox')[0];

    expect(checkbox).toBeChecked();

    userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('opens drawer on card click', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const card = screen.getByText(/Signature Senior Living/);
    userEvent.click(card);
    const drawer = screen.getByText(/Services and amenities/);
    expect(drawer).toBeInTheDocument();
  });

  it('marks checkbox from drawer when Interested is selected', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const card = screen.getByText(/Signature Senior Living/);

    const checkbox = screen.getAllByRole('checkbox')[0];
    userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    userEvent.click(card);

    const button = screen.getByText(/Interested/);
    userEvent.click(button);
    expect(checkbox).toBeChecked();
  });

  it('unmarks checkbox from drawer when Pass is selected', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const card = screen.getByText(/Signature Senior Living/);

    const checkbox = screen.getAllByRole('checkbox')[0];

    userEvent.click(card);

    const button = screen.getByText(/Pass/);
    userEvent.click(button);
    expect(checkbox).not.toBeChecked();
  });

  it('should disable Request info button if no facilities are checked', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        SALCSavedFacilitiesIds: [],
        SALCCommunities: [],
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox, index) => screen.getAllByRole('checkbox')[index].click());
    const nextButton = screen.getByRole('button', { name: 'Request info' });
    expect(nextButton).toBeDisabled();
  });

  it('should redirect to payoff success page if info was requested already', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        SALCSeniorCareFacilityLeadsPublished: true,
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
      },
    };
    renderComponent(currentState);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYOFF)
    );
  });

  it('should redirect to fallback caring page if error in seniorCareAssistedLivingProviders query', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: errorZip,
        condition: SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };

    renderComponent(currentState);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.CARING_LEADS)
    );
    await waitFor(() =>
      expect(loggerErrorMock).toHaveBeenCalledWith({
        event: 'seniorCareAssistedLivingProviders',
        graphQLError:
          'InternalError: failed to execute query, code: Internal, cause: elastic: Error 400 (Bad Request): all shards failed [type=search_phase_execution_exception]',
      })
    );
  });

  it('should redirect to fallback caring page if zero results', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: emptyZip,
        condition: SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.CARING_LEADS)
    );
    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'seniorCareAssistedLivingProviders',
        message: 'Found zero senior care assisted living providers, redirecting to caring flow.',
      })
    );
  });

  it("prompts for a phone number when it's missing and request info is clicked", async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const button = screen.getByText(/Request info/);
    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/What's the best number for these communities to reach you at?/)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it("prompts for a phone number when it's undefined and request info is clicked", async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          email: 'joseph@care.com',
          firstName: 'Joseph',
          lastName: 'Distler',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    // @ts-ignore
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const button = screen.getByText(/Request info/);
    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/What's the best number for these communities to reach you at?/)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it("prompts for the seeker info (last name and first name) when it's undefined and request info is clicked", async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          email: 'joseph@care.com',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    // @ts-ignore
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const button = screen.getByText(/Request info/);
    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/Share the best contact info for these communities to reach you at./)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('continues with the submission once the missing phone is added', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const button = screen.getByText(/Request info/);
    userEvent.click(button);

    await waitFor(() =>
      expect(
        screen.getByText(/What's the best number for these communities to reach you at?/)
      ).toBeVisible()
    );

    await userEvent.type(screen.getByLabelText('Phone number'), '(202) 456-1111', { delay: 1 });

    const continueBtn = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(continueBtn).toBeEnabled());
    fireEvent.click(continueBtn);

    await waitForElementToBeRemoved(
      screen.queryByText(/What's the best number for these communities to reach you at?/)
    );

    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'seniorAssistedLivingCommunityLeadPublishMutationSuccessful',
      })
    );
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYOFF)
    );
  });

  it('continues with the submission once the missing info is added', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: '',
          lastName: '',
          email: 'joseph@care.com',
          phone: '',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    const button = screen.getByText(/Request info/);
    userEvent.click(button);

    await waitFor(() =>
      expect(
        screen.getByText(/Share the best contact info for these communities to reach you at./)
      ).toBeVisible()
    );

    await userEvent.type(screen.getByLabelText('First name'), 'Joseph', { delay: 1 });
    await userEvent.type(screen.getByLabelText('Last name'), 'Distler', { delay: 1 });
    await userEvent.type(screen.getByLabelText('Phone number'), '(202) 456-1111', { delay: 1 });

    const continueBtn = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(continueBtn).toBeEnabled());
    fireEvent.click(continueBtn);

    await waitForElementToBeRemoved(
      screen.queryByText(/Share the best contact info for these communities to reach you at./)
    );

    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'seniorAssistedLivingCommunityLeadPublishMutationSuccessful',
      })
    );
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYOFF)
    );
  });

  it('should include source of ENROLLMENT when publishing leads', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
        SALCCommunities,
        SALCSavedFacilitiesIds: ['afc29491-6d87-4f32-9bff-a4f35300766c'],
        SALCTrackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Done reviewing/)).toBeVisible(), {
      timeout: 5000,
    });

    const button = screen.getByText(/Done reviewing/);
    userEvent.click(button);

    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'seniorAssistedLivingCommunityLeadPublishMutationSuccessful',
      })
    );
  });

  it('should include source of NTH DAY when publishing leads', async () => {
    const currentState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };
    renderComponent(currentState);

    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });

    const button = screen.getByText(/Request info/);
    userEvent.click(button);

    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'seniorAssistedLivingCommunityLeadPublishMutationSuccessful',
      })
    );
  });

  it('should display header and subheader, different CTA and no checkboxes', async () => {
    const currentState: AppState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
        SALCSavedFacilitiesIds: ['afc29491-6d87-4f32-9bff-a4f35300766c'],
        SALCTrackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        SALCCommunities,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
      },
    };

    renderComponent(currentState);

    await waitFor(
      () =>
        expect(
          screen.getByText(/Here are the suggested communities we'll contact you about./)
        ).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    expect(
      screen.getByText(
        /It can be helpful to review them and start forming a list of questions you might have./
      )
    ).toBeVisible();

    expect(screen.getByText(/Done reviewing/)).toBeVisible();

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: 'Done reviewing' });
    expect(nextButton).toBeEnabled();
  });

  it('should NOT qualify when user is in nth day flow', async () => {
    const currentState: AppState = {
      ...initialAppState,
      seeker: {
        ...seekerInitialState,
        zipcode: successZip,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '(202) 456-1111',
        },
        assistedLivingCenterFacilityCount: 10,
        SALCSavedFacilitiesIds: ['afc29491-6d87-4f32-9bff-a4f35300766c'],
        SALCTrackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        SALCCommunities,
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };

    renderComponent(currentState);
    await waitFor(() => expect(screen.getByText(/Request info/)).toBeVisible(), {
      timeout: 5000,
    });
    expect(
      screen.getByText('Get started with evaluating senior living communities.')
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
