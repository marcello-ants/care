import { captureMessage } from '@sentry/nextjs';
import { Operation } from '@apollo/client/core';
import shouldRetry from '../ApolloRetryFunction';

jest.mock('@sentry/nextjs');

describe('ApolloRetryFunction', () => {
  const dummyOperation: Operation = {
    query: {} as any,
    variables: {},
    operationName: 'foo',
    extensions: {},
    setContext: () => {
      return {};
    },
    getContext: () => {
      return {};
    },
  };

  beforeEach(() => {
    (captureMessage as jest.Mock).mockReset();
  });

  it('returns false if no error', () => {
    const result = shouldRetry(1, dummyOperation, null);
    expect(result).toEqual(false);
  });

  it('returns false for non-TypeError', () => {
    const result = shouldRetry(1, dummyOperation, new Error('a non-retryable error'));
    expect(result).toEqual(false);
  });

  it('returns false if over max attempts', () => {
    const result = shouldRetry(5, dummyOperation, new TypeError('a retryable error'));
    expect(result).toEqual(false);
  });

  it('returns true if under max atempts for TypeError', () => {
    const result = shouldRetry(1, dummyOperation, new TypeError('a retryable error'));
    expect(result).toEqual(true);

    const shouldRetry2 = shouldRetry(4, dummyOperation, new TypeError('a retryable error'));
    expect(shouldRetry2).toEqual(true);
  });

  it('should call Sentry.captureMesage when request will be retried', () => {
    shouldRetry(1, dummyOperation, new TypeError('a retryable error'));

    expect(captureMessage).toHaveBeenCalled();
  });

  it('should not call Sentry.captureMesage when request will not be retried', () => {
    shouldRetry(1, dummyOperation, new Error('a non-retryable error'));
    expect(captureMessage).not.toHaveBeenCalled();
  });
});
