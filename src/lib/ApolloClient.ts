import { useMemo } from 'react';
import { SourceLocation } from 'graphql';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ServerError,
  ServerParseError,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import Cookies from 'universal-cookie';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import getConfig from 'next/config';
import { logger } from '@sentry/utils';
import captureExceptionOrMessage from '@/lib/apollo-link-sentry/errorHandler';
import { Authenticable } from './AuthService';
import { SKIP_AUTH_CONTEXT_KEY } from '../constants';
import { SentryLink } from './apollo-link-sentry';
import shouldRetry from './ApolloRetryFunction';

const { publicRuntimeConfig } = getConfig();

let apolloClient: any;
let auth: Authenticable;
let cookieFlowEnabled = false;

function createApolloClient(props: any) {
  const httpLink = createUploadLink({
    uri: publicRuntimeConfig.GRAPHQL_URL,
    credentials: 'same-origin',
  });

  const authLink = setContext(async (operation, prevContext) => {
    let shouldUseAuthCookie = false;
    if (cookieFlowEnabled) {
      const cookie = new Cookies();
      shouldUseAuthCookie = Boolean(cookie.get('csc-session-ttl'));
    }

    const { headers } = prevContext;
    if (auth && prevContext[SKIP_AUTH_CONTEXT_KEY] !== true && !shouldUseAuthCookie) {
      const hasAuthToken = Boolean(auth.getStore());
      if (hasAuthToken && !auth.validToken(15)) {
        try {
          await auth.renewToken();
        } catch (e) {
          logger.error({ event: 'renewTokenFailure', renewTokenError: e });
          captureExceptionOrMessage(e);
        }
      }

      const authData = auth.getStore() || {};
      return {
        headers: {
          ...headers,
          authorization: authData.access_token ? `Bearer ${authData.access_token}` : '',
        },
      };
    }
    return { headers };
  });

  const cache = new InMemoryCache();

  const getLocationsString = (locations: readonly SourceLocation[] | undefined) => {
    let locationString = '';

    if (locations) {
      locationString = locations
        .map(({ column, line }) => `Line ${line} - Column ${column}`)
        .join(' | ');
    }

    return locationString;
  };

  const getPathString = (pathArray: readonly (string | number)[] | undefined) => {
    let pathString = '';
    if (pathArray) {
      pathString = pathArray.map((path) => `${path}`).join(' | ');
    }
    return pathString;
  };

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    const elapsed = Math.floor(performance.now() - operation.getContext().start);
    const dev = process.env.NODE_ENV !== 'production';
    const gqlPayload = {
      operationName: operation.operationName,
      variables: dev ? operation.variables : undefined,
      elapsed,
    };

    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path, extensions = {} }) => {
        const pathString = getPathString(path);
        const locationString = getLocationsString(locations);
        const errorMsg = `[GraphQL error]: Message: ${message}, ${
          locationString ? `Location: ${locationString},` : ''
        } ${pathString ? `Path: ${pathString}` : ''}`;
        const errorData = {
          errorMsg,
          path: pathString,
          payload: gqlPayload,
          serverError: {
            ...extensions,
          },
        };
        return props.onError('GraphQL error', errorData);
      });
    }

    if (networkError) {
      const { name, message, stack } = networkError;
      const { result, statusCode } = networkError as Partial<ServerError>;
      const { bodyText } = networkError as Partial<ServerParseError>;

      const errorData = {
        errorMsg: `[Network error ${operation.operationName}]: ${message}`,
        payload: gqlPayload,
        serverError: {
          name,
          message,
          stack,
          bodyText,
          statusCode,
          ...result,
        },
      };
      props.onError('Network error', errorData);
    }
  });

  const timeStartLink = new ApolloLink((operation, forward) => {
    operation.setContext({ start: performance.now() });
    return forward(operation);
  });

  const sentryLink = new SentryLink({
    uri: publicRuntimeConfig.GRAPHQL_URL,
  });

  const retryLink = new RetryLink({
    attempts: shouldRetry,
  });

  const link = ApolloLink.from([
    timeStartLink,
    authLink,
    sentryLink,
    errorLink,
    retryLink,
    httpLink as unknown as ApolloLink, // temporary fix for the types https://github.com/jaydenseric/apollo-upload-client/issues/213#issuecomment-670089925
  ]);

  return new ApolloClient({
    name: publicRuntimeConfig.APP_NAME,
    version: publicRuntimeConfig.APP_VERSION,
    ssrMode: typeof window === 'undefined',
    link,
    cache,
  });
}

export function initializeApollo(initialState: any) {
  const apolloClientState = apolloClient ?? createApolloClient(initialState);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = apolloClientState.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    apolloClientState.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return apolloClientState;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = apolloClientState;

  return apolloClientState;
}

export function useApollo(initialState: any, authService: Authenticable, cookieEnabled?: boolean) {
  auth = authService;

  if (typeof cookieEnabled === 'boolean') {
    cookieFlowEnabled = cookieEnabled;
  }

  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
