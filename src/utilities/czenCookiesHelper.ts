import Cookies from 'universal-cookie';
import { CZEN_SESSION_COOKIE_KEY, CZEN_VISITOR_COOKIE_KEY } from '../constants';

export function getCzenVisitorId() {
  const cookies = new Cookies();
  return cookies.get(CZEN_VISITOR_COOKIE_KEY);
}

export function getCzenSessionId() {
  const cookies = new Cookies();
  return cookies.get(CZEN_SESSION_COOKIE_KEY) ?? undefined;
}
