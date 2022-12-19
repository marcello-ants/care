import { ApolloError, useMutation } from '@apollo/client';
import {
  seniorCareSeekerCreate,
  seniorCareSeekerCreateVariables,
  // eslint-disable-next-line camelcase
  seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateSuccess,
} from '@/__generated__/seniorCareSeekerCreate';
import logger from '@/lib/clientLogger';
import { SENIOR_CARE_SEEKER_CREATE } from '@/components/request/GQL';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { SeekerState } from '@/types/seeker';
import { AppDispatch } from '@/types/app';
import { handleAccountCreationValidationErrors } from '@/utilities/accountCreationValidationErrorHelper';
import { captureMessage, Severity } from '@sentry/nextjs';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

function logAttempt(initialAccountCreationAttempted: boolean, dispatch: AppDispatch) {
  if (!initialAccountCreationAttempted) {
    dispatch({
      type: 'setInitialAccountCreationAttempted',
      initialAccountCreationAttempted: true,
    });
    logger.info({ event: 'seekerAccountCreationInitialAttempt' });
  }
  logger.info({ event: 'seekerAccountCreationAttempt' });
}

function logFailure(initialAccountCreationFailed: boolean, dispatch: AppDispatch) {
  if (!initialAccountCreationFailed) {
    dispatch({ type: 'setInitialAccountCreationFailed', initialAccountCreationFailed: true });
    logger.info({ event: 'seekerAccountCreationFailedInitialAttempt' });
  }
  logger.error({ event: 'seekerAccountCreationFailed' });
  captureMessage('seekerAccountCreationFailed', Severity.Error);
}

interface useSCSeekerCreateOptions {
  seekerState: SeekerState;
  dispatch: AppDispatch;
  onSuccess?: (
    // eslint-disable-next-line camelcase
    response: seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateSuccess
  ) => void;
  onError?: (error?: ApolloError) => void;
  handleErrorMsg: (message: string | null) => void;
}

export default function useSCSeekerCreate(options: useSCSeekerCreateOptions) {
  const { seekerState, dispatch, handleErrorMsg, onError, onSuccess } = options;

  const [seekerCreate] = useMutation<seniorCareSeekerCreate, seniorCareSeekerCreateVariables>(
    SENIOR_CARE_SEEKER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: (response) => {
        const { seniorCareSeekerCreate: res } = response;

        if (res.__typename === 'SeniorCareSeekerCreateError') {
          // Sends logs for validation errors
          logger.info({ event: 'seekerAccountCreationFailedByValidationError' });
          handleAccountCreationValidationErrors(res.errors, handleErrorMsg);
          captureMessage('seekerAccountCreationFailedByValidationError', Severity.Info);

          if (onError) {
            onError();
          }

          return;
        }

        dispatch({
          type: 'setMemberId',
          memberId: res.memberId,
        });
        AnalyticsHelper.setMemberId(res.memberId);

        // Sends log when a seeker account is successfully created
        logger.info({ event: 'seekerAccountCreationSuccessful', memberId: res.memberId });

        if (onSuccess) {
          onSuccess(res);
        }
      },
      onError: () => {
        handleErrorMsg('An error occurred creating your account, please try again.');
        logFailure(seekerState.initialAccountCreationFailed, dispatch);

        if (onError) {
          onError();
        }
      },
    }
  );

  const seekerCreateWrapper: typeof seekerCreate = (seekerCreateOptions?) => {
    logAttempt(seekerState.initialAccountCreationAttempted, dispatch);
    return seekerCreate(seekerCreateOptions);
  };

  return seekerCreateWrapper;
}
