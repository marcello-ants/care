import React from 'react';
import { makeStyles } from '@material-ui/core';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@apollo/client';
import { Typography } from '@care/react-component-lib';
import { getNumberOfNewJobsNearby } from '@/__generated__/getNumberOfNewJobsNearby';
import { GET_NUMBER_OF_JOBS_NEARBY } from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { DistanceUnit } from '@/__generated__/globalTypes';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';

const useStyles = makeStyles((theme) => ({
  messageContainerStyle: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  messageStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.care?.navy[600],
    width: 198,
    height: 198,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  messageTextStyle: {
    top: '22%',
    left: '18%',
    width: 125,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  countStyle: {
    margin: 0,
  },
  descriptionStyle: {
    lineHeight: '17px',
    fontWeight: 'bold',
  },
}));

const defaultMapOptions = {
  disableDefaultUI: true,
  minZoom: 13,
};

const defaultLatitude = 37.773972;
const defaultLongitude = -122.431297;

const containerStyle = {
  maxWidth: 410,
  height: 290,
};

interface JobMapProps {
  lat?: number | null;
  lng?: number | null;
  distance: number;
  zipcode: string;
  serviceType: string;
}

function JobMap({ lat, lng, zipcode, distance, serviceType }: JobMapProps) {
  if (!window) return null;

  const classes = useStyles();
  const { data: jobsData } = useQuery<getNumberOfNewJobsNearby>(GET_NUMBER_OF_JOBS_NEARBY, {
    variables: {
      zipcode,
      radius: { value: distance, unit: DistanceUnit.MILES },
      serviceType,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    skip: zipcode.length < 5,
  });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD1SEu0JBu7nD1-26zsIBoMM8TM79jKahw',
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: lat || defaultLatitude, lng: lng || defaultLongitude }}
      zoom={13}
      options={defaultMapOptions}>
      <>
        {jobsData ? (
          <div className={classes.messageContainerStyle} data-testid="job-map-label">
            <div className={classes.messageStyle}>
              <Typography variant="subtitle2" className={classes.messageTextStyle}>
                <Typography careVariant="display1" className={classes.countStyle}>
                  {jobsData?.getNumberOfNewJobsNearby || 0}
                </Typography>
                <span className={classes.descriptionStyle}>child care jobs are near you!</span>
              </Typography>
            </div>
          </div>
        ) : null}
      </>
    </GoogleMap>
  ) : (
    <OverlaySpinner isOpen wrapped />
  );
}

JobMap.defaultProps = {
  lat: defaultLatitude,
  lng: defaultLongitude,
};

export default JobMap;
