// External Dependencies
import React from 'react';
import { render } from '@testing-library/react';

// Custom Dependencies
import { MapConfig } from '@/types/map';
import CustomGoogleMap from '../googleMap';

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      GOOGLE_MAPS_KEY: 'GOOGLE_MAPS_KEY',
    },
  };
});

jest.mock('@react-google-maps/api', () => {
  return {
    useJsApiLoader: jest.fn().mockReturnValue({}),
    Marker: () => <div />,
    GoogleMap: () => (
      <div>
        <div className="mock-google-maps" />
      </div>
    ),
  };
});

// Google Map Component Test Suite
describe('Google Map Component', () => {
  const config: MapConfig = {
    options: {
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    },
    setAutomaticBounds: true,
  };
  const data = {
    center: {
      lat: 30.238168,
      lng: -97.774496,
    },
    markers: [
      {
        position: {
          lat: 30.238168,
          lng: -97.774496,
        },
        name: 'Sun, Moon &amp; Stars Learning Center - 1',
      },
    ],
  };
  let asFragment: any | null = null;

  const renderMapComponent = () => {
    const view = render(<CustomGoogleMap config={config} data={data} />);
    ({ asFragment } = view);
  };

  beforeEach(() => {
    window.google = {
      // @ts-ignore
      maps: {
        LatLngBounds: jest.fn(),
        Point: jest.fn(),
        Size: jest.fn(),
      },
    };
  });

  it('should match snapshot', () => {
    renderMapComponent();
    expect(asFragment()).toMatchSnapshot();
  });
});
