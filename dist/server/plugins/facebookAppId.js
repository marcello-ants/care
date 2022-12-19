"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
function register(fastify, { FACEBOOK_APP_ID }) {
    fastify.addHook('onRequest', async function hook(req) {
        req.raw.facebookAppId = FACEBOOK_APP_ID.value;
    });
}
exports.register = register;
exports.default = register;
