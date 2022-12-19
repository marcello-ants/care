import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import logger from '@/lib/clientLogger';
import { SKIP_AUTH_CONTEXT_KEY } from '../../constants';
import {
  getCaregiversNearby,
  getCaregiversNearbyVariables,
} from '../../__generated__/getCaregiversNearby';
import { ServiceType, SubServiceType } from '../../__generated__/globalTypes';
import { GET_CAREGIVERS_NEARBY } from '../request/GQL';

const minimumCaregiversToDisplay = 15;
const preferredCountCaregiversToDisplay = 50;

const narrowestRadiusToSearch = 1;
const widestRadiusToSearch = 20;
const radiusSearchOrder = [narrowestRadiusToSearch, 3, 5, 10, widestRadiusToSearch];

export interface GetCaregiversNearbyResponse {
  displayCaregiverMessage: boolean;
  numCaregivers: number;
  currentSearchRadius: number;
}

export default function useNearbyCaregivers(
  zipcode: string,
  serviceType?: ServiceType,
  subServiceType?: SubServiceType
): GetCaregiversNearbyResponse {
  const [highestNumCaregivers, setHighestNumCaregivers] = useState(0);
  const service = serviceType || ServiceType.SENIOR_CARE;
  const subService = subServiceType || null;

  const { loading, data, error, refetch, variables } = useQuery<
    getCaregiversNearby,
    getCaregiversNearbyVariables
  >(GET_CAREGIVERS_NEARBY, {
    skip: !zipcode,
    variables: {
      zipcode,
      serviceType: service,
      radius: narrowestRadiusToSearch,
      subServiceType: subService,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!zipcode) {
      logger.warn({ event: 'useNearbyCaregiversZipcodeMissing', service, subService });
    }
  }, []);

  const caregiversNearbySuccessful = !error && Number.isInteger(data?.getCaregiversNearby);

  let caregiverNearbyCount = 0;
  if (caregiversNearbySuccessful && data) {
    caregiverNearbyCount = data.getCaregiversNearby;

    if (caregiverNearbyCount > highestNumCaregivers) {
      setHighestNumCaregivers(caregiverNearbyCount);
    } else {
      // overwrite caregiverNearbyCount to account for the current render
      caregiverNearbyCount = highestNumCaregivers;
    }
  }

  const atLeastFifteenCaregiversNearby = caregiverNearbyCount >= minimumCaregiversToDisplay;

  const atLeastFiftyCaregiversNearby = caregiverNearbyCount >= preferredCountCaregiversToDisplay;

  const prevRadius = variables?.radius ?? widestRadiusToSearch;
  if (
    caregiversNearbySuccessful &&
    !atLeastFiftyCaregiversNearby &&
    prevRadius < widestRadiusToSearch &&
    radiusSearchOrder.includes(prevRadius)
  ) {
    const nextRadiusIndex = radiusSearchOrder.indexOf(prevRadius) + 1;
    const nextRadius = radiusSearchOrder[nextRadiusIndex];

    refetch({
      zipcode,
      serviceType: service,
      radius: nextRadius,
      subServiceType: subService,
    });
  }

  const minimumCaregiversMet =
    atLeastFiftyCaregiversNearby ||
    (atLeastFifteenCaregiversNearby && prevRadius === widestRadiusToSearch);

  const displayCaregiverMessage =
    !loading && !error && caregiversNearbySuccessful && minimumCaregiversMet;

  return {
    displayCaregiverMessage,
    numCaregivers: caregiverNearbyCount,
    currentSearchRadius: prevRadius,
  };
}
