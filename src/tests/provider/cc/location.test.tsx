import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, waitFor, act, screen, RenderResult } from '@testing-library/react';
import { useRouter } from 'next/router';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'; // eslint-disable-line

import { AppStateProvider } from '@/components/AppState';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { initialAppState } from '@/state';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { GET_ZIP_CODE_SUMMARY, GET_NUMBER_OF_JOBS_NEARBY } from '../../../components/request/GQL';
import { ServiceType, DistanceUnit } from '../../../__generated__/globalTypes';
import LocationPage from '../../../pages/provider/cc/location';

const testZipCode = '02108';

jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('LocationPage', () => {
  let renderResult: RenderResult;
  let mockRouter: any | null = null;

  const featureFlagsMockTrue = {
    [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
      value: true,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
  };

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/cc/location',
      query: {},
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: testZipCode,
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'ZipcodeSummary',
              city: 'Los Angeles',
              state: 'CA',
              zipcode: testZipCode,
              latitude: 3,
              longitude: 3,
            },
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: testZipCode,
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: '900',
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: '',
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
    ];

    renderResult = render(
      <AppStateProvider initialStateOverride={initialAppState}>
        <MockedProvider mocks={mocks} addTypename>
          <FeatureFlagsProvider flags={featureFlagsMockTrue}>
            <LocationPage />
          </FeatureFlagsProvider>
        </MockedProvider>
      </AppStateProvider>
    );

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', () => {
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    expect(screen.getByText('Where do you want to work?')).toBeInTheDocument();
  });

  it('should enable next button if zip code is correct', async () => {
    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await waitFor(() => expect(nextButton).toBeDisabled());

    fireEvent.change(textField, { target: { value: testZipCode } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => expect(nextButton).toBeEnabled());
  });

  it('should render label over map', async () => {
    const textField = screen.getByLabelText('ZIP code');

    fireEvent.change(textField, { target: { value: testZipCode } });
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const label = screen.getByTestId('job-map-label');
    expect(label).toHaveTextContent('50child care jobs are near you!');
  });

  it('should show invalid zip code text if zip code is not valid', () => {
    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    fireEvent.change(textField, { target: { value: '900' } });
    expect(nextButton).toBeDisabled();
  });

  it('routes to the /provider/cc/account page after selection and button click', async () => {
    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: testZipCode } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => expect(nextButton).toBeEnabled());

    nextButton.click();

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.ACCOUNT)
    );
  });
});

describe('LocationPage Zip - gql', () => {
  let mockRouter: any | null = null;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/cc/location',
      query: {},
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('should get the location of the zipCode', async () => {
    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: testZipCode,
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'ZipcodeSummary',
              city: 'Los Angeles',
              state: 'CA',
              zipcode: testZipCode,
              latitude: 3,
              longitude: 3,
            },
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: testZipCode,
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: '',
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename>
        <AppStateProvider initialStateOverride={initialAppState}>
          <LocationPage />
        </AppStateProvider>
      </MockedProvider>,
      {}
    );

    const textField = screen.getByLabelText('ZIP code');

    fireEvent.change(textField, { target: { value: testZipCode } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());

    await screen.findByText('Los Angeles, CA');
  });

  it('should get the error text if invalid zipcode', async () => {
    const errorText = 'Enter a valid ZIP code (e.g. "02453")';
    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: '00000',
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'InvalidZipcodeError',
              message: errorText,
            },
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: '',
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
      {
        request: {
          query: GET_NUMBER_OF_JOBS_NEARBY,
          variables: {
            zipcode: '00000',
            radius: { value: 15, unit: DistanceUnit.MILES },
            serviceType: ServiceType.CHILD_CARE,
          },
        },
        result: {
          data: {
            getNumberOfNewJobsNearby: 50,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename>
        <AppStateProvider initialStateOverride={initialAppState}>
          <LocationPage />
        </AppStateProvider>
      </MockedProvider>,
      {}
    );

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: '00000' } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    await waitFor(() => expect(nextButton).toBeDisabled());
    await screen.findByText(errorText);
  });
});
