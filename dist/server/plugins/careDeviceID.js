"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const api_1 = require("@opentelemetry/api");
function register(fastify) {
    fastify.addHook('onRequest', async function hook(req) {
        const extractedBaggage = api_1.propagation.getBaggage(api_1.context.active());
        const baggageEntry = extractedBaggage?.getEntry('careDeviceID') ?? null;
        const careDeviceID = baggageEntry?.value;
        if (careDeviceID) {
            req.raw.careDeviceId = careDeviceID;
        }
    });
}
exports.register = register;
exports.default = register;
