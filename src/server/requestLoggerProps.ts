import Cookies from 'universal-cookie';
import { FastifyRequest } from 'fastify';
import DeviceDetector from 'device-detector-js';
import { EventProps } from '@care/fastify-logging';
import { CSC_SESSION_COOKIE_NAME, CZEN_VISITOR_COOKIE_KEY } from '../constants';

const deviceDetector = new DeviceDetector();

/**
 * Returns an object with properties that will be merged into all events logged via `req.log`.
 * @param req
 */
export default function requestLoggerProps(req: FastifyRequest): EventProps {
  const props: EventProps = {};
  const cookies = new Cookies(req.headers.cookie);

  props.czenVisitorId = cookies.get(CZEN_VISITOR_COOKIE_KEY);
  props.hasSessionCookie = Boolean(cookies.get(CSC_SESSION_COOKIE_NAME));

  const deviceDetectorResult = deviceDetector.parse(req.headers['user-agent'] ?? '');
  props.deviceType = deviceDetectorResult.device?.type;

  return props;
}
