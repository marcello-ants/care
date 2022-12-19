import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { render, act, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { WhenLookingToMoveIntoCommunity } from '@/types/seeker';
import { AppStateProvider } from '@/components/AppState';
import useNextRoute from '@/components/hooks/useNextRoute';
import { GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY } from '@/components/request/GQL';
import { POST_A_JOB_ROUTES } from '@/constants';
import { SeniorCarePaymentSource, SeniorCareRecipientCondition } from '@/__generated__/globalTypes';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import Options from '../options';

const defaultZipCode = '90001';

const mocks = [
  {
    request: {
      query: GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
      variables: {
        zipcode: defaultZipCode,
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
  },
  {
    request: {
      query: GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
      variables: {
        input: {
          zipcode: '90210',
          notSure: true,
          independentLivingFacilities: false,
          assistedLivingFacilities: false,
          memoryCareFacilities: false,
        },
      },
    },
    errors: [new GraphQLError('Error!')],
  },
];

const initialState: AppState = cloneDeep(initialAppState);
const appState = {
  ...initialState,
  seeker: {
    ...initialState.seeker,
    zipcode: defaultZipCode,
  },
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useNextRoute');

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: 'https://www.dev.carezen.net',
    },
  };
});

interface RenderComponent {
  state?: AppState;
  flags?: FeatureFlags;
}

const renderComponent = (options: RenderComponent = {}) => {
  const { state, flags } = options;
  return render(
    <MockedProvider mocks={mocks} addTypename>
      <FeatureFlagsProvider flags={flags || {}}>
        <AppStateProvider initialStateOverride={state || appState}>
          <Options />
        </AppStateProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
};

describe('options screen - in facility', () => {
  let mockRouter: any = null;
  let mockRoute: any = null;

  const { location } = window;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/in-facility/options',
      asPath: '/seeker/sc/in-facility/options',
    };
    mockRoute = {
      pushNextRoute: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useNextRoute as jest.Mock).mockReturnValue(mockRoute);

    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: jest.fn(),
    };
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    mockRoute = null;

    window.location = location;
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders no facilities when paymentType = "GOVERNMENT"', async () => {
    const stateOverride = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: defaultZipCode,
        paymentDetailTypes: [SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM],
      },
    };
    renderComponent({ state: stateOverride });
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    expect(
      screen.getByText(/Unfortunately, no communities on Care.com match your needs./)
    ).toBeInTheDocument();
  });

  it('renders no facilities when condition = "CONSTANT_SUPERVISION_NEEDED"', async () => {
    const stateOverride = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: defaultZipCode,
        condition: SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
      },
    };
    renderComponent({ state: stateOverride });
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    expect(
      screen.getByText(/Unfortunately, no communities on Care.com match your needs./)
    ).toBeInTheDocument();
  });

  it('renders no facilities when no facilities are found', async () => {
    const stateOverride = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '00000',
      },
    };
    renderComponent({ state: stateOverride });
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    expect(
      screen.getByText(/Unfortunately, no communities on Care.com match your needs./)
    ).toBeInTheDocument();
  });

  it('redirects to PAJ page if See options is clicked', async () => {
    renderComponent();
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    expect(screen.getByText('Find an in-home caregiver')).toBeInTheDocument();
    const link = screen.getByRole('button', { name: 'Get started' });
    fireEvent.click(link);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.POST_A_JOB));
  });

  it('render no communities when "12+ months" is selected on urgency page', () => {
    const options = {
      state: {
        ...appState,
        seeker: {
          ...appState.seeker,
          paymentDetailTypes: [SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM],
          whenLookingToMove: WhenLookingToMoveIntoCommunity.TWELVE_MONTHS,
        },
      },
    };
    renderComponent(options);
    expect(
      screen.getByText('Unfortunately, no communities on Care.com match your needs.')
    ).toBeInTheDocument();
  });
});
