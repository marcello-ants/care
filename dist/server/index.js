"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_tracing_1 = __importDefault(require("@care/fastify-tracing")); // needs to be first in the list so it can properly hook `http` and other libs with tracing
const fastify_1 = __importDefault(require("fastify"));
const fastify_helmet_1 = __importDefault(require("fastify-helmet"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const csp_1 = require("@care/csp");
const fastify_context_1 = __importDefault(require("@care/fastify-context"));
const fastify_logging_1 = __importStar(require("@care/fastify-logging")), FastifyLogging = fastify_logging_1;
const fastify_launchdarkly_1 = __importDefault(require("@care/fastify-launchdarkly"));
const fastify_nextjs_1 = __importDefault(require("@care/fastify-nextjs"));
const secrets_1 = require("@care/secrets");
const config_1 = __importDefault(require("next/config"));
const EnrollmentSessionIdPlugin = __importStar(require("./plugins/enrollmentSessionId"));
const FacebookAppIdPlugin = __importStar(require("./plugins/facebookAppId"));
const CareDeviceIdPlugin = __importStar(require("./plugins/careDeviceID"));
const requestLoggerProps_1 = __importDefault(require("./requestLoggerProps"));
const sentryTracing_1 = __importDefault(require("./sentryTracing"));
const LAUNCH_DARKLY_INIT_TIMEOUT = 5000;
(async () => {
    const port = parseInt(process.env.PORT || '3000', 10);
    // dev only serves to differentiate locally running vs deployed
    const dev = process.env.NODE_ENV !== 'production';
    const deploymentEnv = process.env.DEPLOYMENT_ENVIRONMENT ?? 'local';
    const fastifyInstance = (0, fastify_1.default)({
        // use a longer timeout than the default (10s) when running in dev mode to give Next.js enough time to start
        pluginTimeout: dev ? 180000 : undefined,
        trustProxy: true,
        genReqId: (req) => {
            return req.headers['x-crcm-request-id']?.toString() ?? (0, uuid_1.v4)();
        },
        ...FastifyLogging.config({
            pinoLoggerOptions: {
                // TODO: refactor our Loggly dashboards/alerts to use level labels and remove this override (SC-870)
                formatters: {
                    level: (label, number) => {
                        return { level: number };
                    },
                },
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
    await fastifyInstance.register(fastify_context_1.default);
    EnrollmentSessionIdPlugin.register(fastifyInstance, { dev });
    await fastifyInstance.register(fastify_logging_1.default);
    await fastifyInstance.register(fastify_tracing_1.default);
    const loggerPlugin = fastifyInstance.careContext[FastifyLogging.PLUGIN_NAME];
    if (!loggerPlugin) {
        throw new Error(`"${FastifyLogging.PLUGIN_NAME}" plugin not found`);
    }
    loggerPlugin.addRequestPropsProvider(requestLoggerProps_1.default);
    const logger = fastifyInstance.log;
    if (!process.env.SECRETS_PATH) {
        throw new Error('SECRETS_PATH env var was not provided');
    }
    const secretsPath = path_1.default.isAbsolute(process.env.SECRETS_PATH)
        ? process.env.SECRETS_PATH
        : path_1.default.join(__dirname, '..', '..', process.env.SECRETS_PATH);
    const secrets = await (0, secrets_1.readFromDir)(secretsPath);
    logger.info({ msg: 'Loaded secrets', secretNames: Object.keys(secrets) });
    const { LAUNCH_DARKLY_SDK_KEY, FACEBOOK_APP_ID } = secrets;
    if (!LAUNCH_DARKLY_SDK_KEY) {
        throw new Error('LAUNCH_DARKLY_SDK_KEY secret not found');
    }
    if (!FACEBOOK_APP_ID) {
        throw new Error('FACEBOOK_APP_ID secret not found');
    }
    await fastifyInstance.register(fastify_launchdarkly_1.default, {
        sdkKey: LAUNCH_DARKLY_SDK_KEY.value,
        waitFor: LAUNCH_DARKLY_INIT_TIMEOUT,
        ldUserDecorator: async (req, user) => {
            const decoratedUser = user;
            const { enrollmentSessionId, careDeviceId } = req.raw;
            if (careDeviceId) {
                // use careDeviceId as the key even if the user happens to be authenticated
                decoratedUser.key = careDeviceId;
            }
            if (enrollmentSessionId) {
                decoratedUser.custom = { ...user.custom, enrollmentSessionId };
            }
        },
    });
    FacebookAppIdPlugin.register(fastifyInstance, { FACEBOOK_APP_ID });
    CareDeviceIdPlugin.register(fastifyInstance);
    const requestHandler = async (req, reply) => {
        req.careContext.sentryTraceTransaction = await (0, sentryTracing_1.default)(req);
        req.careContext.scriptNonce = reply.cspNonce?.script;
        req.careContext.styleNonce = reply.cspNonce?.style;
    };
    await fastifyInstance.register(fastify_nextjs_1.default, {
        nextServerOptions: { dev },
        requestHandler,
        clientLoggingPath: '/api/logs',
    });
    const releaseApp = (0, config_1.default)().publicRuntimeConfig?.SENTRY_APP_RELEASE;
    const csp = {
        directives: {
            ...csp_1.cspMfe.directives,
            'report-uri': [
                `https://o466311.ingest.sentry.io/api/5818515/security/?sentry_key=529254163d86481bbadbff29cb417900&sentry_release=${encodeURIComponent(releaseApp)}&sentry_environment=${encodeURIComponent(deploymentEnv)}`,
            ],
        },
    };
    // TODO: Future work is to replace `fastify-helment` with
    // @Care maintained plugin "@care/fastify-helmet"
    // which centralizes the setting of CSP and other Security features
    await fastifyInstance.register(fastify_helmet_1.default, {
        enableCSPNonces: !dev,
        frameguard: {
            action: 'DENY',
        },
        contentSecurityPolicy: dev ? false : csp,
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin',
        },
    });
    await fastifyInstance.listen(port, '0.0.0.0');
})();
