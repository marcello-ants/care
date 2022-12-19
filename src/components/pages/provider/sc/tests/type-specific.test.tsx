import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { initialAppState } from '@/state';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import TypeSpecific from '@/pages/provider/sc/type-specific';
import { SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const initialStateClone = cloneDeep(initialAppState);
const initialState = {
  ...initialStateClone,
};

describe('provider type-specific page', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;

  const mocks = [
    {
      request: {
        query: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
        variables: {
          input: {
            careTypeToProvide: [],
          },
        },
      },
      result: {
        data: {
          seniorCareProviderAttributesUpdate: {
            __typename: 'SeniorCareProviderAttributesUpdateSuccess',
          },
        },
      },
    },
  ];

  const renderComponent = () => {
    const view = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AppStateProvider initialStateOverride={initialState}>
          <TypeSpecific />
        </AppStateProvider>
      </MockedProvider>
    );
    ({ asFragment } = view);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/sc/',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    asFragment = null;
  });

  it('matches snapshot', () => {
    renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText(/What type of care do you want to provide/i)).toBeInTheDocument();
  });
  it('routes to the pay range page', async () => {
    renderComponent();
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith('/provider/sc/experience-level')
    );
  });
});
