/**
 * @jest-environment node
 */

import { fastify } from 'fastify';
import fastifyContextPlugin from '@care/fastify-context';
import fastifyTracingPlugin from '@care/fastify-tracing';
import fastifyLoggingPlugin, * as FastifyLogging from '@care/fastify-logging';
import { DestinationStream } from 'pino';
import { register } from '../careDeviceID';

describe('enrollmentSessionId', () => {
  function createFastifyInstance() {
    const logSpy = jest.fn();
    const flushSyncSpy = jest.fn();

    const fastifyInstance = fastify({
      ...FastifyLogging.config({
        stream: {
          write: logSpy,
          flushSync: flushSyncSpy,
        } as DestinationStream,
      }),
    });
    fastifyInstance.register(fastifyContextPlugin);
    fastifyInstance.register(fastifyLoggingPlugin);
    fastifyInstance.register(fastifyTracingPlugin);

    fastifyInstance.get('/foo', logSpy);

    return { logSpy, fastifyInstance };
  }

  const injectArgs: any = {
    method: 'GET',
    url: '/test',
    headers: {
      baggage: 'careDeviceID=testTesttest',
      authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjVUdTk3R19ueVZJbmtGeC0wQ2xZOFhGcDROUEtFVVgzSGVwTXpZUURmUlE9IiwidHlwIjoiSldUIn0.eyJjbGllbnRfaWQiOiJjemVuLXB1YiIsImV4cCI6MTYxNDU0MDMwNywiaWF0IjoxNjE0NTM2NzA3LCJpbXBlcnNvbmF0ZWQiOiIiLCJpc3MiOiJodHRwOi8vb2F0aGtlZXBlci1wcm94eS8iLCJqdGkiOiJkMzAyZDhlNS05NDFlLTQ1ZDYtYTAyZS05OWMyZTgxNjU1YzIiLCJuYmYiOjE2MTQ1MzY3MDcsInNjcCI6Im9wZW5pZCBjemVuIHByb2ZpbGUiLCJzdWIiOiJtZW06OTdhMzlkZTAtMzM0Zi00NjM0LTkyNWUtYjI1YWJhMmJmZjQ1In0.TSF9XCBhespZFZPvn7J8dor-7dFkskCGv4yhW8usWC1e8iMfs-TfkS067OGZB-GwCwNJUxHzKaueBhiH3YpIy486v0zA-PQS9rvIHZfTVrr3b36f3abGfc0PJb2PIGdEo4H1HwEr1PbhN7NWgWtoM-NjzRYfbst32dh6amaKymitpP7YkisM2d2OO1M5aWhWEfxgwgTQ4U6C_w7nnZuGh-ZAPq1nXGdyRB8xF1LfsAVQe6mpCzp3EF1T7XjmotqjLCbyE-j8UtGV6fgmYMGPCXiprP1J3vAodWY6XOCpjL-JSVEQ5U2jt43W8BopiFCYXxYzQfinj64waSW85t1kgg',
    },
  };

  it('should read the care device ID from the baggage', async () => {
    const { fastifyInstance, logSpy } = createFastifyInstance();

    await register(fastifyInstance);
    await fastifyInstance.inject(injectArgs);

    const jsonLog = JSON.parse(logSpy.mock.calls[0][0]);

    expect(logSpy).toHaveBeenCalled();
    expect(jsonLog['care.device.id']).toEqual('testTesttest');
  });
});
