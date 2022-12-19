// External Dependencies
import React, { useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { merge } from 'lodash-es';
import getConfig from 'next/config';

// Internal Dependencies
import logger from '@/lib/clientLogger';
import { MapConfig, MapData } from '@/types/map';
import defaultConfig from './config';

// Type
type GoogleMapProperties = {
  config: MapConfig;
  data: MapData;
};

const {
  publicRuntimeConfig: { GOOGLE_MAPS_KEY },
} = getConfig();

/**
 * Creates custom Google Map with the specified configurations and data.
 *
 * @param props {GoogleMapProperties} Google Map properties.
 * @returns JSX Google Map.
 */
/* istanbul ignore next */
function CustomGoogleMap(props: GoogleMapProperties) {
  const { config, data } = props;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_KEY,
  });

  // Build final map config
  const mapConfig = merge(defaultConfig, config);

  const [map, setMap] = React.useState<google.maps.Map | null>();

  const onLoad = (mapInstance: google.maps.Map) => {
    if (config.setAutomaticBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      data.markers.forEach((marker) => {
        bounds.extend(marker.position);
      });
      mapInstance.fitBounds(bounds);
      setMap(mapInstance);
    }
  };

  const onUnmount = () => {
    setMap(null);
  };

  useEffect(() => {
    if (loadError) {
      logger.error({ event: 'googleMapLoadError', googleMapError: loadError });
    }
  }, []);

  useEffect(() => {
    if (map && data.markers.length === 1) {
      setTimeout(() => map.setZoom(mapConfig.zoomLevel), 250);
    }
  }, [map, data.markers.length]);

  return isLoaded ? (
    <GoogleMap
      mapContainerClassName={mapConfig.containerClassName}
      zoom={mapConfig.zoomLevel}
      options={mapConfig.options}
      center={data.center}
      onLoad={onLoad}
      onUnmount={onUnmount}>
      {data.markers.map((marker) => (
        <Marker key={marker.title} {...marker} />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(CustomGoogleMap);
