import { GraphQLError } from 'graphql';

// eslint-disable-next-line import/prefer-default-export
export function isInvalidAuthTokenInErrors(errors: ReadonlyArray<GraphQLError>): boolean {
  const result = errors.find((error: GraphQLError) => {
    return error.extensions?.code === 'UNAUTHENTICATED';
  });
  return result !== undefined;
}
