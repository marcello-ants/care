import fastifyTracingPlugin from '@care/fastify-tracing'; // needs to be first in the list so it can properly hook `http` and other libs with tracing
import fastify, { FastifyRequest } from 'fastify';
import Path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fastifyAuthenticationPlugin from '@care/fastify-authentication';
import fastifyContextPlugin from '@care/fastify-context';
import fastifyLoggingPlugin, * as FastifyLogging from '@care/fastify-logging';
import fastifyLaunchDarklyPlugin from '@care/fastify-launchdarkly';
import fastifyNextJsPlugin from '@care/fastify-nextjs';
import fastifyBrowserSecurityPlugin from '@care/fastify-browser-security';
import { readFromDir } from '@care/secrets';
import getConfig from 'next/config';
import * as EnrollmentSessionIdPlugin from './plugins/enrollmentSessionId';
import * as FacebookAppIdPlugin from './plugins/facebookAppId';
import * as CareDeviceIdPlugin from './plugins/careDeviceID';

import requestLoggerProps from './requestLoggerProps';
import shouldEnableSentryTracing from './sentryTracing';
import { configureLDUser } from './configureLDUser';

const LAUNCH_DARKLY_INIT_TIMEOUT = 5000;

(async () => {
  const port = parseInt(process.env.PORT || '3000', 10);
  // dev only serves to differentiate locally running vs deployed
  const dev = process.env.NODE_ENV !== 'production';

  const deploymentEnv = process.env.DEPLOYMENT_ENVIRONMENT ?? 'local';

  const fastifyInstance = fastify({
    // use a longer timeout than the default (10s) when running in dev mode to give Next.js enough time to start
    pluginTimeout: dev ? 180000 : undefined,
    trustProxy: true,

    genReqId: (req) => {
      return req.headers['x-crcm-request-id']?.toString() ?? uuidv4();
    },

    ...FastifyLogging.config({
      pinoLoggerOptions: {
        // TODO: refactor our Loggly dashboards/alerts to use level labels and remove this override (SC-870)
        formatters: {
          level: (label, number) => {
            return { level: number };
          },
        },

        level: process.env.LOG_LEVEL ?? 'info',

        // prevent PII/sensitive data from being logged with failed GraphQL requests
        redact: [
          'payload.variables.password',
          'payload.variables.input.password',
          'payload.variables.email',
          'payload.variables.input.email',
          'payload.variables.input.firstName',
          'payload.variables.input.lastName',
        ],
      },
    }),
  });

  await fastifyInstance.register(fastifyContextPlugin);
  EnrollmentSessionIdPlugin.register(fastifyInstance, { dev });
  await fastifyInstance.register(fastifyLoggingPlugin);
  await fastifyInstance.register(fastifyTracingPlugin);
  await fastifyInstance.register(fastifyAuthenticationPlugin);

  const loggerPlugin = fastifyInstance.careContext[FastifyLogging.PLUGIN_NAME];
  if (!loggerPlugin) {
    throw new Error(`"${FastifyLogging.PLUGIN_NAME}" plugin not found`);
  }

  loggerPlugin.addRequestPropsProvider(requestLoggerProps);

  const logger = fastifyInstance.log;

  if (!process.env.SECRETS_PATH) {
    throw new Error('SECRETS_PATH env var was not provided');
  }

  const secretsPath = Path.isAbsolute(process.env.SECRETS_PATH)
    ? process.env.SECRETS_PATH
    : Path.join(__dirname, '..', '..', process.env.SECRETS_PATH);

  const secrets = await readFromDir(secretsPath);

  logger.info({ msg: 'Loaded secrets', secretNames: Object.keys(secrets) });

  const { LAUNCH_DARKLY_SDK_KEY, FACEBOOK_APP_ID } = secrets;

  if (!LAUNCH_DARKLY_SDK_KEY) {
    throw new Error('LAUNCH_DARKLY_SDK_KEY secret not found');
  }

  if (!FACEBOOK_APP_ID) {
    throw new Error('FACEBOOK_APP_ID secret not found');
  }

  await fastifyInstance.register(fastifyLaunchDarklyPlugin, {
    sdkKey: LAUNCH_DARKLY_SDK_KEY.value,
    waitFor: LAUNCH_DARKLY_INIT_TIMEOUT,
    ldUserDecorator: configureLDUser,
  });

  FacebookAppIdPlugin.register(fastifyInstance, { FACEBOOK_APP_ID });
  CareDeviceIdPlugin.register(fastifyInstance);

  fastifyInstance.addHook('onRequest', async (req: FastifyRequest) => {
    req.careContext.sentryTraceTransaction = await shouldEnableSentryTracing(req);
  });

  await fastifyInstance.register(fastifyNextJsPlugin, {
    nextServerOptions: { dev },
    clientLoggingPath: '/api/logs',
  });

  const { APP_NAME, APP_VERSION } = getConfig().publicRuntimeConfig;
  await fastifyInstance.register(fastifyBrowserSecurityPlugin, {
    csrf: { enabled: false },
    securityHeaders: {
      enabled: !dev,
      options: {
        appName: APP_NAME,
        appVersion: APP_VERSION,
        appEnv: deploymentEnv,
        cspReportOnly: deploymentEnv === `dev` || deploymentEnv === `local`,
      },
    },
  });

  await fastifyInstance.listen(port, '0.0.0.0');
})();
