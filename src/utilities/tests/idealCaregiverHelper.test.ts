import { GraphQLError } from 'graphql';
import { isInvalidAuthTokenInErrors } from '../idealCaregiverHelper';

describe('Ideal Caregiver Helper', () => {
  it('Finds Invalid Auth Token in Errors', () => {
    const matchingError: GraphQLError = {
      extensions: { code: 'UNAUTHENTICATED' },
      locations: undefined,
      message: 'Invalid AuthToken',
      name: '',
      nodes: undefined,
      originalError: undefined,
      path: undefined,
      positions: undefined,
      source: undefined,
      stack: '',
    };
    const errors: ReadonlyArray<GraphQLError> = [matchingError];
    const result = isInvalidAuthTokenInErrors(errors);

    expect(result).toEqual(true);
  });

  it('Does Not Find Invalid Auth Token in Errors', () => {
    const notMatchingError: GraphQLError = {
      extensions: {},
      locations: undefined,
      message: 'Other error',
      name: '',
      nodes: undefined,
      originalError: undefined,
      path: undefined,
      positions: undefined,
      source: undefined,
      stack: '',
    };
    const errors: ReadonlyArray<GraphQLError> = [notMatchingError];
    const result = isInvalidAuthTokenInErrors(errors);

    expect(result).toEqual(false);
  });
});
