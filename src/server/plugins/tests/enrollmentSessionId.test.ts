/**
 * @jest-environment node
 */

import { fastify, FastifyRequest, FastifyReply } from 'fastify';
import { register } from '../enrollmentSessionId';

describe('enrollmentSessionId', () => {
  function createFastifyInstance() {
    const handlerSpy = jest.fn().mockImplementation(async function handler(_request, reply) {
      reply.send({ hello: 'world' });
    });

    const fastifyInstance = fastify({
      logger: false,
    });

    fastifyInstance.get('/foo', handlerSpy);

    return { handlerSpy, fastifyInstance };
  }

  it('should create a new ID if no cookie is provided', async () => {
    const { fastifyInstance, handlerSpy } = createFastifyInstance();

    await register(fastifyInstance, { dev: true });

    await fastifyInstance.inject('/foo');

    expect(handlerSpy).toHaveBeenCalled();

    const request: FastifyRequest = handlerSpy.mock.calls[0][0];
    expect(request.raw.enrollmentSessionId).toMatch(
      /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
    );
  });

  it('should read the ID from the cookie if provided', async () => {
    const { fastifyInstance, handlerSpy } = createFastifyInstance();

    await register(fastifyInstance, { dev: true });

    await fastifyInstance.inject({
      path: '/foo',
      headers: { cookie: 'enrollment-session-id=bar' },
    });

    expect(handlerSpy).toHaveBeenCalled();

    const request: FastifyRequest = handlerSpy.mock.calls[0][0];
    expect(request.raw.enrollmentSessionId).toEqual('bar');
  });

  it('should persist the ID in a cookie', async () => {
    const { fastifyInstance, handlerSpy } = createFastifyInstance();

    await register(fastifyInstance, { dev: true });

    await fastifyInstance.inject({
      path: '/foo',
      headers: { cookie: 'enrollment-session-id=bar' },
    });

    expect(handlerSpy).toHaveBeenCalled();

    const reply: FastifyReply = handlerSpy.mock.calls[0][1];
    expect(reply.getHeader('set-cookie')).toEqual(
      'enrollment-session-id=bar;max-age=31536000;path=/;samesite=Lax;'
    );
  });

  it('should persist the ID in a cookie with the `secure` attribute when dev:false', async () => {
    const { fastifyInstance, handlerSpy } = createFastifyInstance();

    await register(fastifyInstance, { dev: false });

    await fastifyInstance.inject({
      path: '/foo',
      headers: { cookie: 'enrollment-session-id=bar' },
    });

    expect(handlerSpy).toHaveBeenCalled();

    const reply: FastifyReply = handlerSpy.mock.calls[0][1];
    expect(reply.getHeader('set-cookie')).toEqual(
      'enrollment-session-id=bar;max-age=31536000;path=/;secure;samesite=Lax;'
    );
  });
});
