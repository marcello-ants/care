import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ServiceType, DistanceUnit } from '../../../../../__generated__/globalTypes';
import { GET_NUMBER_OF_JOBS_NEARBY } from '../../../../request/GQL';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'; // eslint-disable-line
import JobMap from '../JobMap';

jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const jobsResponse = [
  {
    request: {
      query: GET_NUMBER_OF_JOBS_NEARBY,
      variables: {
        zipcode: '02108',
        radius: { value: 15, unit: DistanceUnit.MILES },
        serviceType: ServiceType.CHILD_CARE,
      },
    },
    result: {
      data: {
        getNumberOfNewJobsNearby: 5,
      },
    },
  },
  {
    request: {
      query: GET_NUMBER_OF_JOBS_NEARBY,
      variables: {
        zipcode: '02100',
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

describe('Job Map Component', () => {
  let asFragment: any | null = null;
  let rerender: any | null = null;

  const renderComponent = async ({
    latitude = 37.773972,
    longitude = -122.431297,
    zipcode = '02108',
    distance = 15,
    mocks = jobsResponse,
  }) => {
    const view = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JobMap
          lat={latitude}
          lng={longitude}
          zipcode={zipcode}
          distance={distance}
          serviceType={ServiceType.CHILD_CARE}
        />
      </MockedProvider>
    );
    ({ asFragment, rerender } = view);
  };

  it('should match snapshot', async () => {
    await renderComponent({});
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render label', async () => {
    renderComponent({});
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    const label = screen.getByTestId('job-map-label');
    expect(label).toHaveTextContent('5child care jobs are near you!');
  });

  it('should not render label if there is no response from GraphQL', async () => {
    renderComponent({});
    const label = screen.queryByTestId('job-map-label');
    expect(label).not.toBeInTheDocument();
  });

  it('should update label on location change', async () => {
    renderComponent({});
    let label = await screen.findByTestId('job-map-label');
    expect(label).toHaveTextContent('5child care jobs are near you!');
    rerender(
      <MockedProvider mocks={jobsResponse} addTypename={false}>
        <JobMap
          lat={3}
          lng={5}
          zipcode="02100"
          distance={15}
          serviceType={ServiceType.CHILD_CARE}
        />
      </MockedProvider>
    );

    label = await screen.findByTestId('job-map-label');
    expect(label).toHaveTextContent('50child care jobs are near you!');
  });
});
