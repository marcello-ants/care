// External Dependencies
import { useMutation } from '@apollo/client';

// Internal Dependencies
import { SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD_CRM_EVENT_CREATE } from '@/components/request/GQL';
import {
  czenCrmEventCreateSALCLeadsSubmitted,
  czenCrmEventCreateSALCLeadsSubmittedVariables,
} from '@/__generated__/czenCrmEventCreateSALCLeadsSubmitted';
import logger from '@/lib/clientLogger';

/**
 * Creates wrapper around SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD_CRM_EVENT_CREATE mutation.
 */
export default function useCrmEventSALC() {
  // Mutation
  const [createCrmEventSALC] = useMutation<
    czenCrmEventCreateSALCLeadsSubmitted,
    czenCrmEventCreateSALCLeadsSubmittedVariables
  >(SENIOR_ASSISTED_LIVING_COMMUNITY_LEAD_CRM_EVENT_CREATE, {
    onCompleted(response) {
      const { czenCrmEventCreateLeadsSubmitted: result } = response;
      if (!result.success) {
        logger.error({ event: 'crmEventSALCCreationFailed' });
      }
    },
    onError(graphQLError) {
      logger.error({ event: 'crmEventSALCCreationFailed', error: graphQLError });
    },
  });

  // Wrapper
  const createCrmEventSALCWrapper: typeof createCrmEventSALC = (createCrmEventSALCOptions?) => {
    return createCrmEventSALC(createCrmEventSALCOptions);
  };

  return createCrmEventSALCWrapper;
}
