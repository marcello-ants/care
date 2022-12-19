import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation,
  ObservableSubscription,
} from '@apollo/client/core';
import { GraphQLError } from 'graphql';
import { addBreadcrumb, captureException } from '@sentry/nextjs';

import { makeBreadcrumb } from './breadcrumb';
import { defaultOptions, SentryLinkOptions } from './options';
import {
  contextFromExtensions,
  getApiErrors,
  handleNetworkError,
  severityForResult,
  toGraphQLError,
} from './utils';

export class SentryLink extends ApolloLink {
  private readonly options: SentryLinkOptions;

  constructor(options: SentryLinkOptions = defaultOptions) {
    super();
    this.options = options;
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
    const { operationName } = operation;

    const breadcrumb = makeBreadcrumb(operation, this.options);

    return new Observable<FetchResult>((originalObserver) => {
      let subscription: ObservableSubscription;
      try {
        subscription = forward(operation).subscribe({
          next: (result) => {
            breadcrumb.level = severityForResult(result);
            addBreadcrumb(breadcrumb);

            if (result.errors) {
              result.errors.forEach((error) => {
                let gqlError = error;
                if (!(gqlError instanceof GraphQLError)) {
                  // typically these errors will be plain JS objects (via JSON.parse)
                  // convert it back into a GraphqlError object so Sentry recognizes it as an error
                  gqlError = toGraphQLError(error);
                }

                const apiErrors = getApiErrors(gqlError.extensions);
                if (apiErrors) {
                  const firstField = Object.keys(apiErrors)[0];
                  gqlError.message = apiErrors[firstField];
                }

                captureException(gqlError, {
                  contexts: {
                    extensions: contextFromExtensions(gqlError.extensions),
                  },
                  tags: {
                    operation: operationName,
                  },
                });
              });
            }

            originalObserver.next(result);
          },
          complete: () => {
            originalObserver.complete();
          },
          error: (networkError) => {
            handleNetworkError(networkError, breadcrumb, originalObserver);
          },
        });
      } catch (e) {
        // if there's an errorLink further down the chain, then it'll catch this error instead and call the error function above
        // https://github.com/apollographql/apollo-client/blob/v3.3.7/src/link/error/index.ts#L87-L90

        handleNetworkError(e as Error, breadcrumb, originalObserver);
      }

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    });
  }
}

export { excludeGraphQLFetch } from './excludeGraphQLFetch';
