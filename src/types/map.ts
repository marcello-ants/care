import { GoogleMapProps, MarkerProps } from '@react-google-maps/api';

// Types
export type MapConfig = {
  options?: GoogleMapProps['options'];
  setAutomaticBounds?: boolean;
  containerClassName?: string;
};

export type Marker = MarkerProps;

type Markers = Marker[];

export type MapData = {
  center?: GoogleMapProps['center'];
  markers: Markers;
};
