import { excludeGraphQLFetch } from '../excludeGraphQLFetch';

describe('excludeGraphQLFetch', () => {
  it('should remove fetch operations on GraphQL endpoints', () => {
    expect(
      excludeGraphQLFetch('https://www.care.com/api/graphql')({
        category: 'fetch',
        data: { url: 'https://www.care.com/api/graphql' },
      })
    ).toBeNull();
  });

  it('should default to not assuming GraphQL when missing the URL', () => {
    const breadcrumb = {
      category: 'fetch',
      data: {},
    };

    expect(excludeGraphQLFetch('https://www.care.com/api/graphql')(breadcrumb)).toBe(breadcrumb);
  });

  it('should leave non-GraphQL fetches', () => {
    const breadcrumb = {
      category: 'fetch',
      data: { url: 'https://www.care.com' },
    };
    expect(excludeGraphQLFetch('https://www.care.com/api/graphql')(breadcrumb)).toBe(breadcrumb);
  });

  it('should leave non-fetch breadcrumbs', () => {
    const breadcrumb = { category: 'not-fetch' };
    expect(excludeGraphQLFetch('https://www.care.com/api/graphql')(breadcrumb)).toBe(breadcrumb);
  });
});
