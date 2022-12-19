/* eslint-disable camelcase */
import logger from '@/lib/clientLogger';
import { CZEN_BLOCKLIST_PATH } from '@/constants';
import { seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateError_errors } from '@/__generated__/seniorCareSeekerCreate';
import { seekerCreate_seekerCreate_SeekerCreateError_errors } from '@/__generated__/seekerCreate';
import { seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateError_errors } from '@/__generated__/seniorCareProviderCreate';
import { SeekerState } from '@/types/seeker';
import { AppDispatch } from '@/types/app';

// eslint-disable-next-line import/prefer-default-export
export function handleAccountCreationValidationErrors(
  errors:
    | seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateError_errors[]
    | seniorCareProviderCreate_seniorCareProviderCreate_SeniorCareProviderCreateError_errors[]
    | seekerCreate_seekerCreate_SeekerCreateError_errors[],
  handleError: (arg0: string | null) => void
) {
  errors.forEach((err) => {
    if (err.__typename === 'MemberBlocklistedError') {
      logger.info({ event: 'blocklistedMember' });
      window.location.assign(CZEN_BLOCKLIST_PATH);
    } else {
      handleError(err.message);
      logger.info(err.message || 'Error trying to create user', {
        tags: ['GraphQL error', 'Account creation'],
        __typename: err.__typename,
      });
    }
  });
}

export function handleAccountCreationValidationErrorsIB(
  errors: seekerCreate_seekerCreate_SeekerCreateError_errors[] | string,
  handleError: (arg0: string | null) => void,
  state: SeekerState,
  dispatch: AppDispatch
) {
  const loggerEventMessage = state.initialAccountCreationFailed
    ? 'seekerIBAccountCreationFailed'
    : 'seekerIBAccountCreationFailedInitialAttempt';
  if (!state.initialAccountCreationFailed) {
    dispatch({ type: 'setInitialAccountCreationFailed', initialAccountCreationFailed: true });
  }

  if (typeof errors === 'string') {
    logger.error({ event: loggerEventMessage, error: errors });
    handleError(errors);
  } else {
    errors.forEach((err) => {
      if (err.__typename === 'MemberBlocklistedError') {
        logger.error({ event: 'blocklistedMemberIB' });
        window.location.assign(CZEN_BLOCKLIST_PATH);
      } else {
        handleError(err.message);
        logger.error({
          event: loggerEventMessage,
          error: err.message || 'Error trying to create user',
          tags: ['GraphQL error', 'Account creation'],
          __typename: err.__typename,
        });
      }
    });
  }
}
