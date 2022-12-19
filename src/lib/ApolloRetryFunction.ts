import { captureMessage, Severity } from '@sentry/nextjs';
import { RetryFunction } from '@apollo/client/link/retry/retryFunction';

const MAX_ATTEMPTS = 5;

/**
 * Returns true if the provided error is a retryable network error and we've not exhausted the maximum number of attempts,
 * false otherwise.
 * @param attempts
 * @param operation
 * @param error
 */
const shouldRetry: RetryFunction = function shouldRetry(attempts, operation, error) {
  const isNetworkError = error instanceof TypeError; // TypeError is the type thrown by `fetch` for network-related errors
  const retryable = isNetworkError && attempts < MAX_ATTEMPTS; // try the request up to 5 times

  if (retryable) {
    const typeError = error as TypeError;
    captureMessage('Retryable network failure', {
      level: Severity.Info,
      tags: {
        attempts,
        operation: operation.operationName,
        errorName: typeError.name,
        errorMessage: typeError.message,
      },
      extra: {
        errorStack: typeError.stack,
      },
    });
  }

  return retryable;
};

export default shouldRetry;
