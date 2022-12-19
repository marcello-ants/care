import { FastifyRequest } from 'fastify';
import { SERVER_FEATURE_FLAGS } from '../constants';

export default async function shouldEnableSentryTracing(req: FastifyRequest) {
  let sentryTraceTransaction = false;

  const { ldClient, ldUser } = req.careContext || {};
  if (ldClient && ldUser) {
    ({ value: sentryTraceTransaction } = await ldClient.variationDetail(
      SERVER_FEATURE_FLAGS.SENTRY_TRACE_TRANSACTION,
      ldUser,
      false
    ));
  }

  return sentryTraceTransaction;
}
