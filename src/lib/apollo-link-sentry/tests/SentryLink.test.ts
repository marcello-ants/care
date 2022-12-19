import { ApolloLink, execute, Observable, ServerError, toPromise } from '@apollo/client/core';
import { init, configureScope, Severity } from '@sentry/nextjs';
import { GraphQLError, parse } from 'graphql';
import sentryTestkit from 'sentry-testkit';
import { waitFor } from '@testing-library/react';
import { GraphQLBreadcrumb } from '../breadcrumb';

import { SentryLink } from '../index';

const { testkit, sentryTransport } = sentryTestkit();

describe('SentryLink', () => {
  beforeAll(() => {
    init({
      dsn: 'https://mydsn@sentry.io/123456790',
      transport: sentryTransport,
      defaultIntegrations: false,
    });
  });

  beforeEach(() => {
    testkit.reset();

    configureScope((scope) => {
      scope.clearBreadcrumbs();
    });
  });

  it('should attach a breadcrumb for each apolloOperation', async () => {
    const result = { data: { foo: true } };
    const withResult = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.next(result);
            observer.complete();
          })
      ),
    ]);

    const error = new Error();
    const withError = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(() => {
        return new Observable((observer) => observer.error(error));
      }),
    ]);

    await toPromise(execute(withResult, { query: parse(`query SuccessQuery { foo }`) }));
    await expect(
      toPromise(execute(withError, { query: parse(`mutation FailureMutation { bar }`) }))
    ).rejects.toThrow();

    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.breadcrumbs).toHaveLength(2);

    const [success, failure] = report.breadcrumbs as Array<GraphQLBreadcrumb>;

    expect(success.category).toBe('graphql.query');
    expect(success.level).toBe(Severity.Info);
    expect(success.data.operationName).toBe('SuccessQuery');

    expect(failure.category).toBe('graphql.mutation');
    expect(failure.level).toBe(Severity.Error);
    expect(failure.data.operationName).toBe('FailureMutation');
  });

  it('should mark results with errors with level error', async () => {
    const link = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.next({
              errors: [new GraphQLError('some message')],
            });
            observer.complete();
          })
      ),
    ]);

    await toPromise(execute(link, { query: parse(`query Foo { foo }`) }));
    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.breadcrumbs).toHaveLength(1);

    const [breadcrumb] = report.breadcrumbs;
    expect(breadcrumb.level).toBe(Severity.Error);
  });

  it('should capture networkErrors', async () => {
    const error = new Error('they set us up the bomb');
    const withError = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(() => {
        return new Observable((observer) => observer.error(error));
      }),
    ]);

    await expect(
      toPromise(execute(withError, { query: parse(`mutation FailureMutation { bar }`) }))
    ).rejects.toThrow();

    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.error).toBeDefined();
    expect(report.error?.message).toBe('they set us up the bomb');
    expect(report.tags).toEqual(expect.objectContaining({ operation: 'FailureMutation' }));
  });

  it('should use the message from result.errors for networkErrors when available', async () => {
    const error = new Error('bad thing happened');
    (error as ServerError).result = {
      errors: [{ message: 'they set us up the bomb' }],
    };
    const withError = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(() => {
        return new Observable((observer) => observer.error(error));
      }),
    ]);

    await expect(
      toPromise(execute(withError, { query: parse(`mutation FailureMutation { bar }`) }))
    ).rejects.toThrow();

    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.error).toBeDefined();
    expect(report.error?.message).toBe('they set us up the bomb');
  });

  it('should add apiErrors to context when available', async () => {
    const graphQLError = new GraphQLError('unexpected error', null, null, null, null, null, {
      code: 'SOME_CODE',
      errorno: 1234,
      apiErrors: [
        {
          general: ['invalid access token'],
        },
      ],
      exception: {
        code: 'SOME_CODE',
      },
    });
    const link = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.next({
              errors: [graphQLError],
            });
            observer.complete();
          })
      ),
    ]);

    await toPromise(execute(link, { query: parse(`query Foo { foo }`) }));

    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    const { contexts } = report.originalReport;
    expect(contexts).toEqual(
      expect.objectContaining({
        extensions: {
          code: 'SOME_CODE',
          errorno: 1234,
          apiErrors: {
            general: 'invalid access token',
          },
        },
      })
    );
  });

  it('should capture the error when the error is a plain object', async () => {
    const link = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.next({
              errors: [
                {
                  message: 'oh noes!',
                  extensions: {},
                  locations: undefined,
                  name: 'some error',
                  nodes: undefined,
                  path: undefined,
                  source: undefined,
                  positions: undefined,
                  originalError: undefined,
                },
              ],
            });
            observer.complete();
          })
      ),
    ]);

    await toPromise(execute(link, { query: parse(`query Foo { foo }`) }));

    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.error?.message).toBe('oh noes!');
  });

  it('should capture errors thrown in the link chain', async () => {
    const link = ApolloLink.from([
      new SentryLink(),
      new ApolloLink(() => {
        throw new Error('boom!');
      }),
    ]);

    await expect(toPromise(execute(link, { query: parse(`query Foo { foo }`) }))).rejects.toThrow(
      'boom!'
    );

    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.error).toBeDefined();
    expect(report.error?.message).toBe('boom!');
    expect(report.tags).toEqual(expect.objectContaining({ operation: 'Foo' }));
  });
});
