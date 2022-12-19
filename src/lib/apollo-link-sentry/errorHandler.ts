import { captureException, captureMessage, Severity } from '@sentry/nextjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CaptureContext } from '@sentry/types';
import { isError } from '@sentry/utils';

export default function captureExceptionOrMessage(error: any, captureContext?: CaptureContext) {
  if (isError(error)) {
    captureException(error, captureContext);
  } else {
    captureMessage(error.message ? error.message : error.toString(), {
      level: Severity.Error,
      ...captureContext,
    });
  }
}
