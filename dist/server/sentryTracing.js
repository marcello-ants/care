"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
async function shouldEnableSentryTracing(req) {
    let sentryTraceTransaction = false;
    const { ldClient, ldUser } = req.careContext || {};
    if (ldClient && ldUser) {
        ({ value: sentryTraceTransaction } = await ldClient.variationDetail(constants_1.SERVER_FEATURE_FLAGS.SENTRY_TRACE_TRANSACTION, ldUser, false));
    }
    return sentryTraceTransaction;
}
exports.default = shouldEnableSentryTracing;
