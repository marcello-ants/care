// External Dependencies
import React from 'react';
import { useRouter } from 'next/router';
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { DistanceUnit } from '@/__generated__/globalTypes';

// Internal Dependencies
import AuthService from '@/lib/AuthService';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch, useAppState } from '@/components/AppState';
import { AppState } from '@/types/app';
import { CHILD_CARE_PROVIDER } from '@/components/request/GQL';
import { mapMonthToDate } from '@/utilities/account-creation-utils';
import useDayCareProviders from '../useDayCareProviders';

// Variables + Mocks
let mockRouter: any | null = null;
jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const getStoreMock = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    getStore: getStoreMock,
  };
});

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      OIDC_STS_AUTHORITY: 'OIDC_STS_AUTHORITY',
      OIDC_CLIENT_ID: 'OIDC_CLIENT_ID',
      OIDC_RESPONSE_TYPE: 'OIDC_RESPONSE_TYPE',
      OIDC_CLIENT_SCOPE: 'OIDC_CLIENT_SCOPE',
      OIDC_CALLBACK_PATH: 'OIDC_CALLBACK_PATH',
      OIDC_LOGOUT_URL: 'OIDC_LOGOUT_URL',
    },
  };
});

// Test Data
const TRACKING_ID_MOCK = '573b1cdf-e027-42cd-b7c1-3df2f95d2ce3';
const TEST_DATA_EMAIL = '123@care.com';
const TEST_DATA_ZIPCODE = '99682';
const TEST_DATA_SOURCE = 'USC';
const TEST_DATA_CHILDREN_DOB = [
  {
    year: '2020',
    month: '07',
  },
];
const TEST_DATA_START_DATE = 'AUGUST';
const TEST_DATA_DISTANCE_TRAVEL = { distance: 2, unit: DistanceUnit.MILES };

const TEST_RESPONSE_PROVIDERS = [
  {
    __typename: 'Provider',
    address: {
      __typename: 'Address',
      addressLine1: '7235 Heritage Springs Dr.',
      addressLine2: '',
      city: 'West Chester',
      latitude: 44.20299985,
      longitude: -93.8121825538615,
      state: 'Ohio',
      zip: '45069',
    },
    avgReviewRating: 3,
    description: 'Welcome to Country Hills Montessori West Chester location.',
    hasCoordinates: true,
    id: 'a715ce18-f71e-4389-b667-587dcf8be0a1',
    logo: null,
    images: [
      {
        __typename: 'ProfileImages',
        urlOriginal:
          'https://s3.amazonaws.com/galore-staging/provider_avatar_509_original.png?1618443093',
      },
    ],
    license: {
      __typename: 'License',
      administrativeArea: 'Ohio',
      certified: true,
      externalUrl: 'http://childcaresearch.ohio.gov/',
      name: 'Child Care',
      verifiedDate: null,
    },
    name: 'Country Hills Montessori - West Chester 2',
    reviews: [
      {
        __typename: 'Review',
        date: null,
        rating: 3,
        reviewer: { __typename: 'Reviewer', firstName: 'John', lastName: 'Jones' },
        text: 'Great people and great with our kids.',
      },
    ],
    selected: true,
  },
];

const TEST_RESPONSE_PROVIDERS_MISSING_DATA = [
  {
    __typename: 'Provider',
    address: {
      __typename: 'Address',
      addressLine1: '7235 Heritage Springs Dr.',
      addressLine2: '',
      city: 'West Chester',
      latitude: null,
      longitude: null,
      state: 'Ohio',
      zip: '45069',
    },
    avgReviewRating: 0,
    description: 'Welcome to Country Hills Montessori West Chester location.',
    hasCoordinates: false,
    id: 'a715ce18-f71e-4389-b667-587dcf8be0a1',
    logo: null,
    images: [
      {
        __typename: 'ProfileImages',
        urlOriginal:
          'https://s3.amazonaws.com/galore-staging/provider_avatar_509_original.png?1618443093',
      },
    ],
    license: {
      __typename: 'License',
      administrativeArea: 'Ohio',
      certified: true,
      externalUrl: 'http://childcaresearch.ohio.gov/',
      name: 'Child Care',
      verifiedDate: null,
    },
    name: 'Country Hills Montessori - West Chester 2',
    reviews: null,
    selected: true,
  },
];

const TEST_RESPONSE_PROVIDERS_MISSING_DATA_NO_ADDRESS = [
  {
    __typename: 'Provider',
    address: null,
    avgReviewRating: 0,
    description: 'Welcome to Country Hills Montessori West Chester location.',
    hasCoordinates: false,
    id: 'a715ce18-f71e-4389-b667-587dcf8be0a1',
    logo: null,
    images: [
      {
        __typename: 'ProfileImages',
        urlOriginal:
          'https://s3.amazonaws.com/galore-staging/provider_avatar_509_original.png?1618443093',
      },
    ],
    license: {
      __typename: 'License',
      administrativeArea: 'Ohio',
      certified: true,
      externalUrl: 'http://childcaresearch.ohio.gov/',
      name: 'Child Care',
      verifiedDate: null,
    },
    name: 'Country Hills Montessori - West Chester 2',
    reviews: null,
    selected: true,
  },
];

// Mocks
const getChildCareProviders = {
  request: {
    query: CHILD_CARE_PROVIDER,
    variables: {
      zipcode: TEST_DATA_ZIPCODE,
      source: TEST_DATA_SOURCE,
      childrenDoB: ['2020-07-15'],
      careStartDate: mapMonthToDate(TEST_DATA_START_DATE, true),
      distanceWillingToTravel: {
        value: TEST_DATA_DISTANCE_TRAVEL.distance,
        unit: TEST_DATA_DISTANCE_TRAVEL.unit,
      },
    },
  },
  result: {
    data: {
      findChildCareProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: TRACKING_ID_MOCK,
        providers: [
          {
            __typename: 'Provider',
            id: 'a715ce18-f71e-4389-b667-587dcf8be0a1',
            description: 'Welcome to Country Hills Montessori West Chester location.',
            name: 'Country Hills Montessori - West Chester 2',
            logo: null,
            images: [
              {
                __typename: 'ProfileImages',
                urlOriginal:
                  'https://s3.amazonaws.com/galore-staging/provider_avatar_509_original.png?1618443093',
              },
            ],
            address: {
              __typename: 'Address',
              addressLine1: '7235 Heritage Springs Dr.',
              addressLine2: '',
              city: 'West Chester',
              latitude: 44.20299985,
              longitude: -93.8121825538615,
              state: 'Ohio',
              zip: '45069',
            },
            reviews: [
              {
                __typename: 'Review',
                text: 'Great people and great with our kids.',
                date: null,
                rating: 3,
                reviewer: {
                  __typename: 'Reviewer',
                  firstName: 'John',
                  lastName: 'Jones',
                },
              },
            ],
            license: {
              __typename: 'License',
              name: 'Child Care',
              verifiedDate: null,
              certified: true,
              externalUrl: 'http://childcaresearch.ohio.gov/',
              administrativeArea: 'Ohio',
            },
          },
        ],
      },
    },
  },
};

const getChildCareProvidersMissingData = {
  request: {
    query: CHILD_CARE_PROVIDER,
    variables: {
      zipcode: TEST_DATA_ZIPCODE,
      source: TEST_DATA_SOURCE,
      childrenDoB: ['2020-07-15'],
      careStartDate: mapMonthToDate(TEST_DATA_START_DATE, true),
      distanceWillingToTravel: {
        value: TEST_DATA_DISTANCE_TRAVEL.distance,
        unit: TEST_DATA_DISTANCE_TRAVEL.unit,
      },
    },
  },
  result: {
    data: {
      findChildCareProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: TRACKING_ID_MOCK,
        providers: [
          {
            __typename: 'Provider',
            id: 'a715ce18-f71e-4389-b667-587dcf8be0a1',
            description: 'Welcome to Country Hills Montessori West Chester location.',
            name: 'Country Hills Montessori - West Chester 2',
            logo: null,
            images: [
              {
                __typename: 'ProfileImages',
                urlOriginal:
                  'https://s3.amazonaws.com/galore-staging/provider_avatar_509_original.png?1618443093',
              },
            ],
            address: {
              __typename: 'Address',
              addressLine1: '7235 Heritage Springs Dr.',
              addressLine2: '',
              city: 'West Chester',
              latitude: null,
              longitude: null,
              state: 'Ohio',
              zip: '45069',
            },
            reviews: null,
            license: {
              __typename: 'License',
              name: 'Child Care',
              verifiedDate: null,
              certified: true,
              externalUrl: 'http://childcaresearch.ohio.gov/',
              administrativeArea: 'Ohio',
            },
          },
        ],
      },
    },
  },
};

const getChildCareProvidersMissingDataNoAddress = {
  request: {
    query: CHILD_CARE_PROVIDER,
    variables: {
      zipcode: TEST_DATA_ZIPCODE,
      source: TEST_DATA_SOURCE,
      childrenDoB: ['2020-07-15'],
      careStartDate: mapMonthToDate(TEST_DATA_START_DATE, true),
      distanceWillingToTravel: {
        value: TEST_DATA_DISTANCE_TRAVEL.distance,
        unit: TEST_DATA_DISTANCE_TRAVEL.unit,
      },
    },
  },
  result: {
    data: {
      findChildCareProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: TRACKING_ID_MOCK,
        providers: [
          {
            __typename: 'Provider',
            id: 'a715ce18-f71e-4389-b667-587dcf8be0a1',
            description: 'Welcome to Country Hills Montessori West Chester location.',
            name: 'Country Hills Montessori - West Chester 2',
            logo: null,
            images: [
              {
                __typename: 'ProfileImages',
                urlOriginal:
                  'https://s3.amazonaws.com/galore-staging/provider_avatar_509_original.png?1618443093',
              },
            ],
            address: null,
            reviews: null,
            license: {
              __typename: 'License',
              name: 'Child Care',
              verifiedDate: null,
              certified: true,
              externalUrl: 'http://childcaresearch.ohio.gov/',
              administrativeArea: 'Ohio',
            },
          },
        ],
      },
    },
  },
};

// Utility functions
function getAppState(): AppState {
  return {
    ...initialAppState,
  };
}

function mountHook(state?: AppState, mocks?: MockedResponse[]) {
  const pathname = '/seeker/cc/care-location';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  getStoreMock.mockReturnValue({ profile: { email: TEST_DATA_EMAIL } });

  return renderHook(
    () => {
      useDayCareProviders(
        TEST_DATA_ZIPCODE,
        TEST_DATA_CHILDREN_DOB,
        TEST_DATA_START_DATE,
        TEST_DATA_DISTANCE_TRAVEL
      );
      return {
        state: useAppState(),
        dispatch: useAppDispatch(),
      };
    },
    {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename>
          <AppStateProvider initialStateOverride={state || initialAppState}>
            {children}
          </AppStateProvider>
        </MockedProvider>
      ),
    }
  );
}

describe('useDayCareProviders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets daycare recommendations and shouldShowMap flag in app state', async () => {
    const state = getAppState();
    const { result, waitForValueToChange } = mountHook(state, [getChildCareProviders]);

    await waitForValueToChange(() => {
      return result.current.state.seekerCC.dayCare.recommendations;
    });

    const { recommendations, shouldShowMap } = result.current.state.seekerCC.dayCare;

    expect(recommendations).toEqual(TEST_RESPONSE_PROVIDERS);
    expect(shouldShowMap).toBeTruthy();
  });

  it('sets daycare recommendations and shouldShowMap flag in app state with missing data from the API', async () => {
    const state = getAppState();
    const { result, waitForValueToChange } = mountHook(state, [getChildCareProvidersMissingData]);

    await waitForValueToChange(() => {
      return result.current.state.seekerCC.dayCare.recommendations;
    });

    const { recommendations, shouldShowMap, recommendationsTrackingId } =
      result.current.state.seekerCC.dayCare;

    expect(recommendations).toEqual(TEST_RESPONSE_PROVIDERS_MISSING_DATA);
    expect(shouldShowMap).toBeFalsy();
    expect(recommendationsTrackingId).toEqual(TRACKING_ID_MOCK);
  });

  it('sets daycare recommendations and shouldShowMap flag in app state with much more missing data from the API', async () => {
    const state = getAppState();
    const { result, waitForValueToChange } = mountHook(state, [
      getChildCareProvidersMissingDataNoAddress,
    ]);

    await waitForValueToChange(() => {
      return result.current.state.seekerCC.dayCare.recommendations;
    });

    const { recommendations, shouldShowMap, recommendationsTrackingId } =
      result.current.state.seekerCC.dayCare;

    expect(recommendations).toEqual(TEST_RESPONSE_PROVIDERS_MISSING_DATA_NO_ADDRESS);
    expect(shouldShowMap).toBeFalsy();
    expect(recommendationsTrackingId).toEqual(TRACKING_ID_MOCK);
  });
});
