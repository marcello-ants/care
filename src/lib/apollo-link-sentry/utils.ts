import { FetchResult, ServerError, ServerParseError } from '@apollo/client/core';
import { GraphQLError } from 'graphql';
import { addBreadcrumb, captureException, Severity } from '@sentry/nextjs';

import { GraphQLBreadcrumb } from './breadcrumb';

interface ApiError {
  [key: string]: string[];
}

interface ApiErrorsMap {
  [key: string]: string;
}

export function severityForResult(result: FetchResult): Severity {
  return result.errors && result.errors.length > 0 ? Severity.Error : Severity.Info;
}

export function handleNetworkError(
  networkError: Error | ServerError | ServerParseError,
  breadcrumb: GraphQLBreadcrumb,
  // eslint-disable-next-line no-undef
  observer: ZenObservable.SubscriptionObserver<FetchResult>
) {
  addBreadcrumb({
    ...breadcrumb,
    level: Severity.Error,
  });

  const { result, statusCode } = networkError as Partial<ServerError>;
  const { bodyText } = networkError as Partial<ServerParseError>;

  // if networkError has a message in result.errors, it's usually more informative than networkError.message
  let betterErrorMsg: string = '';
  if (result?.errors) {
    betterErrorMsg = (result.errors as GraphQLError[])
      .map((gqlError) => gqlError.message)
      .join('\n');
  }

  let errorToSend = networkError;
  if (betterErrorMsg) {
    errorToSend = Object.create(networkError);
    errorToSend.message = betterErrorMsg;
  }

  captureException(errorToSend, {
    contexts: {
      errorDetails: {
        bodyText,
        statusCode,
      },
    },
    tags: {
      operation: breadcrumb.data.operationName,
    },
  });

  observer.error(networkError);
}

export function getApiErrors(extensions: GraphQLError['extensions']) {
  const apiErrors: ApiErrorsMap | null = {};

  if (extensions?.apiErrors) {
    (extensions.apiErrors as ApiError[]).forEach((apiError) => {
      Object.keys(apiError).forEach((apiErrorKey) => {
        const apiErrorJoined = apiError[apiErrorKey].join('\n');
        if (apiErrorJoined) {
          apiErrors![apiErrorKey] = apiErrorJoined;
        }
      });
    });
  }

  return Object.keys(apiErrors).length > 0 ? apiErrors : null;
}

export function contextFromExtensions(extensions: GraphQLError['extensions']) {
  const context = { ...extensions };
  if (extensions?.apiErrors) {
    context.apiErrors = getApiErrors(extensions);
  }

  if (extensions?.exception) {
    // this seems to contain redundant data
    delete context.exception;
  }

  return context;
}

export function toGraphQLError(gqlErrorLike: GraphQLError) {
  const gqlError = new GraphQLError(
    gqlErrorLike.message,
    gqlErrorLike.nodes,
    gqlErrorLike.source,
    gqlErrorLike.positions,
    gqlErrorLike.path,
    gqlErrorLike.originalError,
    gqlErrorLike.extensions
  );

  gqlError.stack = gqlErrorLike.stack;

  return gqlError;
}
