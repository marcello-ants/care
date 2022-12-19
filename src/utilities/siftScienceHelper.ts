import { AppState } from '../types/app';

// eslint-disable-next-line import/prefer-default-export
export function trackPageViewInSiftScience(state: AppState) {
  // eslint-disable-next-line no-underscore-dangle
  if (window._sift) {
    // eslint-disable-next-line no-underscore-dangle
    const siftScience = window._sift;
    if (state.flow.memberId) {
      siftScience.push(['_setUserId', state.flow.memberId]);
    } else {
      siftScience.push(['_setUserId', '']);
    }
    if (state.flow.czenJSessionId) {
      siftScience.push(['_setSessionId', state.flow.czenJSessionId]);
    }
    siftScience.push(['_trackPageview']);
  }
}
