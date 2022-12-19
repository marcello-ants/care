// External Dependencies
import { ApolloError, useMutation } from '@apollo/client';

// Internal Dependencies
import { DAYCARE_CRM_EVENT_CREATE } from '@/components/request/GQL';
import {
  czenCrmEventCreateLeadsSubmitted,
  czenCrmEventCreateLeadsSubmittedVariables,
  czenCrmEventCreateLeadsSubmitted_czenCrmEventCreateLeadsSubmitted as czenCrmEventCreateLeadsSubmittedResponse,
} from '@/__generated__/czenCrmEventCreateLeadsSubmitted';
import logger from '@/lib/clientLogger';

// Utility functions

/**
 * Logs error to Splunk in case response is success = false.
 *
 * @param response Mutation response.
 */
function handleCreateCrmEventDaycareSuccess(response: czenCrmEventCreateLeadsSubmittedResponse) {
  if (!response.success) {
    logger.error({ event: 'crmEventDaycareCreationFailed' });
  }
}

/**
 * Logs GraphQL error to Splunk.
 *
 * @param graphQLError GraphQL Error.
 */
function handleCreateCrmEventDaycareFailure(graphQLError: ApolloError) {
  logger.error({ event: 'crmEventDaycareCreationFailed', error: graphQLError });
}

/**
 * Creates wrapper around DAYCARE_CRM_EVENT_CREATE mutation.
 */
export default function useCrmEventDaycare() {
  // Mutation
  const [createCrmEventDaycare] = useMutation<
    czenCrmEventCreateLeadsSubmitted,
    czenCrmEventCreateLeadsSubmittedVariables
  >(DAYCARE_CRM_EVENT_CREATE, {
    onCompleted(response) {
      const { czenCrmEventCreateLeadsSubmitted: result } = response;
      handleCreateCrmEventDaycareSuccess(result);
    },
    onError(graphQLError) {
      handleCreateCrmEventDaycareFailure(graphQLError);
    },
  });

  // Wrapper
  const createCrmEventDaycareWrapper: typeof createCrmEventDaycare = (
    createCrmEventDaycareOptions?
  ) => {
    return createCrmEventDaycare(createCrmEventDaycareOptions);
  };

  return createCrmEventDaycareWrapper;
}
