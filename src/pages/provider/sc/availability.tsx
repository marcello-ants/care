import { useApolloClient } from '@apollo/client';
import { SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE } from '@/components/request/GQL';
import {
  seniorCareProviderAvailabilityUpdate,
  seniorCareProviderAvailabilityUpdateVariables,
} from '@/__generated__/seniorCareProviderAvailabilityUpdate';
import Availability from '@/components/pages/provider/sc/availability';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import { PROVIDER_ROUTES } from '@/constants';
import { Recurring } from '@/types/common';
import { generateProviderAvailabilityUpdateInput } from '@/utilities/gqlPayloadHelper';

function AvailabilityPage() {
  const apolloClient = useApolloClient();
  const providerState = useProviderState();
  const dispatch = useAppDispatch();

  const onNextClick = async (recurring: Recurring) => {
    dispatch({ type: 'setProviderRecurringData', data: recurring });
    const input = generateProviderAvailabilityUpdateInput(providerState, recurring);
    let successful;
    try {
      const { data } = await apolloClient.mutate<
        seniorCareProviderAvailabilityUpdate,
        seniorCareProviderAvailabilityUpdateVariables
      >({
        mutation: SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE,
        variables: { input },
      });
      successful =
        data?.seniorCareProviderAvailabilityUpdate.__typename ===
        'SeniorCareProviderAvailabilityUpdateSuccess';
    } catch (e) {
      successful = false;
    }
    return successful;
  };
  return (
    <Availability
      nextRoute={PROVIDER_ROUTES.HEADLINE_BIO}
      providerState={providerState}
      onNextClick={onNextClick}
    />
  );
}

export default AvailabilityPage;
