import { FastifyInstance } from 'fastify';
import { context, propagation, Baggage } from '@opentelemetry/api';

export function register(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async function hook(req) {
    const extractedBaggage: Baggage | undefined = propagation.getBaggage(context.active());
    const baggageEntry = extractedBaggage?.getEntry('careDeviceID') ?? null;
    const careDeviceID = baggageEntry?.value;
    if (careDeviceID) {
      req.raw.careDeviceId = careDeviceID;
    }
  });
}

export default register;
