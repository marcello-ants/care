import { useQuery } from '@apollo/client';

import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { useSeekerState } from '@/components/AppState';
import {
  getCaregiverCountForJob,
  getCaregiverCountForJobVariables,
} from '@/__generated__/getCaregiverCountForJob';
import { ChildCareSearchCriteria, ServiceType } from '@/__generated__/globalTypes';
import { GET_CAREGIVER_COUNT_FOR_JOB } from '../request/GQL';

const minimumProvidersToDisplay = 15;

export interface GetProviderCountResponse {
  numOfProviders: number;
  displayProviderMessage: boolean;
}

export default function useProviderCount(
  serviceType: ServiceType,
  childCareSearchCriteria?: ChildCareSearchCriteria
): GetProviderCountResponse {
  const seekerState = useSeekerState();
  const { zipcode } = seekerState;

  const { loading, data, error } = useQuery<
    getCaregiverCountForJob,
    getCaregiverCountForJobVariables
  >(GET_CAREGIVER_COUNT_FOR_JOB, {
    variables: {
      zipcode,
      serviceType,
      childCareSearchCriteria,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  const providersNearbySuccessful = !error && Number.isInteger(data?.getCaregiverCountForJob.count);

  let numOfProviders = 0;
  if (providersNearbySuccessful && data) {
    numOfProviders = data.getCaregiverCountForJob.count as number;
  }

  return {
    numOfProviders,
    displayProviderMessage: !error && !loading && numOfProviders > minimumProvidersToDisplay,
  };
}
