import { Secret } from '@care/secrets';
import { FastifyInstance } from 'fastify';

type PluginOptions = {
  FACEBOOK_APP_ID: Secret;
};

export function register(fastify: FastifyInstance, { FACEBOOK_APP_ID }: PluginOptions) {
  fastify.addHook('onRequest', async function hook(req) {
    req.raw.facebookAppId = FACEBOOK_APP_ID.value;
  });
}

export default register;
