import { parse } from 'graphql';

import { makeBreadcrumb } from '../breadcrumb';

describe('makeBreadcrumb', () => {
  it('should create a breadcrumb', () => {
    const document = parse(`query Foo { foo }`);

    const breadcrumb = makeBreadcrumb(
      {
        operationName: 'Foo',
        query: document,
        variables: {},
        extensions: {},
        setContext: () => ({}),
        getContext: () => ({
          cache: {
            data: {
              data: {},
            },
          },
          foo: {
            bar: {},
          },
        }),
      },
      { uri: '/graphql' }
    );

    expect(breadcrumb.type).toBe('http');
    expect(breadcrumb.category).toBe('graphql.query');
    expect(breadcrumb.data.operationName).toBe('Foo');
  });
});
