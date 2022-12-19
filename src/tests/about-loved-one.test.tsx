import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import AboutLovedOne from '@/pages/about-loved-one';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { SeniorCareRecipientRelationshipType, SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import userEvent from '@testing-library/user-event';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateOverride = cloneDeep(initialAppState);

const topCaregiversMock = {
  request: {
    query: GET_TOP_CAREGIVERS,
    variables: {
      zipcode: '10004',
      serviceID: 'SENIOR_CARE',
      numResults: 6,
      hourlyRate: null,
      hasCareCheck: true,
      qualities: null,
      services: null,
      maxDistanceFromSeeker: null,
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
              id: 'd8aef9f6-a067-4332-a084-606ff368bd4a',
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
            signUpDate: null,
            profiles: {
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
          distanceFromRequestZip: {
            unit: 'MILES',
            value: 1.2,
          },
        },
      ],
    },
  },
};

const personalizedResult = {
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
            id: 'd8aef9f6-a067-4332-a084-606ff368bd4a',
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
          signUpDate: null,
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
    ],
  },
};
let personalizedMock10MilesCalled = false;
const topCaregiversPersonalizedMock10Miles = {
  request: {
    query: GET_TOP_CAREGIVERS,
    variables: {
      zipcode: '10004',
      serviceID: 'SENIOR_CARE',
      numResults: 10,
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
    },
  },
  result: () => {
    personalizedMock10MilesCalled = true;
    return personalizedResult;
  },
};

let personalizedMock20MilesCalled = false;
const topCaregiversPersonalizedMock20Miles = {
  request: {
    query: GET_TOP_CAREGIVERS,
    variables: {
      zipcode: '10004',
      serviceID: 'SENIOR_CARE',
      numResults: 10,
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
        value: 20,
      },
    },
  },
  result: () => {
    personalizedMock20MilesCalled = true;
    return personalizedResult;
  },
};

describe('AboutLovedOne page', () => {
  const mockedWhoNeedsCare = (
    mockWhoNeedsCare = 'SELF',
    mockSelfNeedsCare = false,
    mockComesFromFlow = true,
    // TODO: This is for AB testing and will likely get removed once a flow has been decided
    mockSeekerWhoNeedsCare = 'SELF'
  ) => {
    const override: AppState = {
      ...initialStateOverride,

      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: mockSeekerWhoNeedsCare as SeniorCareRecipientRelationshipType,
        jobPost: {
          ...initialStateOverride.seeker.jobPost,
          lovedOne: {
            ...initialStateOverride.seeker.jobPost.lovedOne,
            whoNeedsCare: mockWhoNeedsCare as SeniorCareRecipientRelationshipType,
          },
          selfNeedsCare: mockSelfNeedsCare,
          comesFromFlow: mockComesFromFlow,
          zip: '10004',
        },
      },
    };

    return override;
  };

  const renderComponent = (initialState: AppState, initialFlagState: FeatureFlags = {}) => {
    return render(
      <FeatureFlagsProvider flags={initialFlagState}>
        <MockedProvider
          mocks={[
            topCaregiversMock,
            topCaregiversPersonalizedMock10Miles,
            topCaregiversPersonalizedMock20Miles,
          ]}>
          <AppStateProvider initialStateOverride={initialState}>
            <AboutLovedOne />
          </AppStateProvider>
        </MockedProvider>
      </FeatureFlagsProvider>
    );
  };

  beforeEach(() => {
    const router = {
      push: jest.fn(),
      pathname: '/about-loved-one/',
    };
    (useRouter as jest.Mock).mockReturnValue(router);

    personalizedMock10MilesCalled = false;
    personalizedMock20MilesCalled = false;
  });

  afterEach(() => {
    cleanup();
  });

  it('should match snapshot', () => {
    const initialState = mockedWhoNeedsCare('SELF', true);
    const { asFragment } = renderComponent(initialState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display correct copy when both "SELF" and "selfNeedsCare" are both true', () => {
    const initialState = mockedWhoNeedsCare('SELF', true);
    renderComponent(initialState);
    expect(screen.getByText(/Do you/i)).toBeInTheDocument();
    expect(screen.getByText(/about you/i)).toBeInTheDocument();
  });

  it('should display correct copy when "SELF" and "selfNeedsCare" are either true', () => {
    const initialState = mockedWhoNeedsCare('SELF', false);
    renderComponent(initialState);
    expect(screen.getByText(/Do you/i)).toBeInTheDocument();
    expect(screen.getByText(/about you/i)).toBeInTheDocument();
  });

  it('should not display checkboxes when coming from CZEN and selfNeedsCare equals true', () => {
    const initialState = mockedWhoNeedsCare('SELF', true, false);
    renderComponent(initialState);
    expect(screen.queryByText(/Myself/i)).not.toBeInTheDocument();
  });

  it('should display checkboxes when not coming from CZEN', () => {
    const initialState = mockedWhoNeedsCare('SELF', false, true);
    renderComponent(initialState);
    expect(screen.getByText(/Myself/i)).toBeInTheDocument();
  });

  it('should display "Myself" checkbox when coming from CZEN ands selfNeedsCare equals false', () => {
    const initialState = mockedWhoNeedsCare('SELF', false, false);
    renderComponent(initialState);
    expect(screen.queryByText(/Myself/i)).not.toBeInTheDocument();
  });

  it('should call 10 miles then 20 miles for personalized results', async () => {
    expect(personalizedMock10MilesCalled).toEqual(false);
    expect(personalizedMock20MilesCalled).toEqual(false);

    const initialState = mockedWhoNeedsCare('SELF', true);
    const secondaryVariantLCFlagState: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.LEAD_CONNECT_PROVIDER_NETWORK]: {
        value: 2,
        variationIndex: 2,
        reason: {
          kind: 'secondary test variant',
        },
      },
    };
    renderComponent(initialState, secondaryVariantLCFlagState);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await waitFor(() => expect(personalizedMock10MilesCalled).toEqual(true));
    await waitFor(() => expect(personalizedMock20MilesCalled).toEqual(true));
  });

  it('should trigger both analytic events when feature flag is on', () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'jobPostedWhoNeedsCare');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');

    const initialState = mockedWhoNeedsCare('SELF', false, false);
    const inHomeInitialState: Parameters<typeof renderComponent>[0] = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
      },
    };

    const flags: Parameters<typeof renderComponent>[1] = {
      [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
        variationIndex: 1,
        value: 'variant',
        reason: { kind: 'FALLTHROUGH' },
      },
    };

    renderComponent(inHomeInitialState, flags);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    userEvent.click(nextButton);

    expect(ampliListener).toBeCalledTimes(1);
    expect(amplitudeListener).toBeCalledTimes(1);
  });
});
