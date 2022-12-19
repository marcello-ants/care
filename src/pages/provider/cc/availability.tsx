import { useApolloClient } from '@apollo/client';
import { PROVIDER_AVAILABILITY_UPDATE } from '@/components/request/GQL';
import {
  providerAvailabilityUpdate,
  providerAvailabilityUpdateVariables,
} from '@/__generated__/providerAvailabilityUpdate';
import { ServiceType } from '@/__generated__/globalTypes';
import Availability from '@/components/pages/provider/sc/availability';
import { useProviderCCState, useAppDispatch } from '@/components/AppState';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { Recurring } from '@/types/common';
import { generateProviderAvailabilityUpdateInput } from '@/utilities/gqlPayloadHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

function AvailabilityPage() {
  const apolloClient = useApolloClient();
  const providerState = useProviderCCState();
  const dispatch = useAppDispatch();
  const featureFlags = useFeatureFlags();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const isFreeGated = providerCCFreeGatedExperience && providerState.freeGated;

  const onNextClick = async (recurring: Recurring) => {
    dispatch({ type: 'setProviderCCRecurringData', data: recurring });

    const input = generateProviderAvailabilityUpdateInput(providerState, recurring);
    let successful;
    try {
      const { data } = await apolloClient.mutate<
        providerAvailabilityUpdate,
        providerAvailabilityUpdateVariables
      >({
        mutation: PROVIDER_AVAILABILITY_UPDATE,
        variables: { input: { ...input, serviceType: ServiceType.CHILD_CARE } },
      });
      successful =
        data?.providerAvailabilityUpdate.__typename === 'ProviderAvailabilityUpdateSuccess';
    } catch (e) {
      successful = false;
    }
    return successful;
  };

  return (
    <Availability
      nextRoute={PROVIDER_CHILD_CARE_ROUTES.PROFILE}
      providerState={providerState}
      onNextClick={onNextClick}
      isFreeGated={isFreeGated}
    />
  );
}

export default AvailabilityPage;
