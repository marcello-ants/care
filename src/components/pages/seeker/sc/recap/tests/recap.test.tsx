import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY } from '@/components/request/GQL';
import { MockedProvider } from '@apollo/client/testing';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import Recap from '../recap';

const defaultZipCode = '90001';
const getNumberOfSeniorCareFacilitiesNearbyMock = {
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
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.useFakeTimers();

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '90001',
    city: 'Los Angeles',
    state: 'CA',
    typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
  },
};

const getByChildText = () => {
  const firstNode = screen.getByText((content) =>
    content.startsWith('Looking for senior caregivers')
  );
  if (!firstNode) return "Couldn't find node with text starting with 'Expect a call from'.";

  const parent = firstNode.parentElement;
  if (!parent) return 'Could not find parent node.';

  const children = parent.childNodes;
  const stringBuilder: string[] = [];
  children.forEach(({ textContent }) => textContent && stringBuilder.push(textContent));

  // Replace &nbsp; with actual spaces for testing purposes
  return stringBuilder.join('').replace(new RegExp('\u00a0', 'g'), ' ');
};

describe('Recap page', () => {
  let mockRouter: any = null;

  const renderComponent = (initialInnerState: AppState, ldFlags?: FeatureFlags | undefined) => {
    return render(
      <MockedProvider mocks={[getNumberOfSeniorCareFacilitiesNearbyMock]} addTypename={false}>
        <AppStateProvider initialStateOverride={initialInnerState}>
          <FeatureFlagsProvider flags={ldFlags || {}}>
            <Recap />
          </FeatureFlagsProvider>
        </AppStateProvider>
      </MockedProvider>
    );
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/seeker/sc',
      asPath: '/seeker/sc',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent(initialState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('match strings in document', () => {
    const { container } = renderComponent(initialState);
    expect(screen.getByText(/Looking for senior caregivers/)).toBeInTheDocument();
    expect(container).toHaveTextContent(
      'Did you know? 100% of caregivers on Care.com are background checked'
    );
  });

  it('routes to the account creation page', () => {
    renderComponent(initialState);

    act(() => {
      jest.runAllTimers();
    });
    expect(mockRouter.push).toHaveBeenCalledWith('/seeker/sc/account-creation');
  });

  it('should get text strings with correct values if city and state are NOT empty for not sure option', () => {
    const invalidState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.NOT_SURE,
      },
    };
    renderComponent(invalidState);
    expect(getByChildText()).toContain('Looking for senior caregivers in Los Angeles, CA');
  });

  it('should render default Did You Know Copy', () => {
    const invalidState: AppState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: '90001',
        city: '',
        state: '',
        helpTypes: [],
        typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
      },
    };
    const { container } = renderComponent(invalidState);
    expect(screen.getByText(/Looking for senior caregivers/)).toBeInTheDocument();
    expect(container).toHaveTextContent(/Did you know\? 100% of caregivers on Care.com.*/);
  });
});
