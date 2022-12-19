import { init } from '@sentry/nextjs';

type SentryOptions = Parameters<typeof init>[0];
type BeforeBreadcrumbCallback = NonNullable<SentryOptions['beforeBreadcrumb']>;

// eslint-disable-next-line import/prefer-default-export
export function excludeGraphQLFetch(graphqlEndpoint: string): BeforeBreadcrumbCallback {
  return (breadcrumb) => {
    if (breadcrumb.category === 'fetch') {
      const url: string = breadcrumb.data?.url ?? '';

      if (url === graphqlEndpoint) {
        return null;
      }
    }

    return breadcrumb;
  };
}
