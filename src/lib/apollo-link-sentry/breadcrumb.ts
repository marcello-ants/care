import { FetchResult, Operation } from '@apollo/client/core';
import { Breadcrumb as SentryBreadcrumb } from '@sentry/nextjs';
import { OperationDefinitionNode } from 'graphql';
import { SentryLinkOptions } from './options';

export interface BreadcrumbData {
  url?: string;
  operationName?: string;
  fetchResult?: FetchResult;
  error?: Error;
}

export interface GraphQLBreadcrumb extends SentryBreadcrumb {
  data: BreadcrumbData;
}

export function makeBreadcrumb(
  operation: Operation,
  options: SentryLinkOptions
): GraphQLBreadcrumb {
  const data: BreadcrumbData = {
    url: options.uri,
    operationName: operation.operationName,
  };

  const definition = operation.query.definitions[0] as OperationDefinitionNode;

  return {
    type: 'http',
    category: `graphql.${definition.operation}`,
    data,
  };
}
