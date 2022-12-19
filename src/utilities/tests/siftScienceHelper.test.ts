import { cloneDeep } from 'lodash-es';
import { trackPageViewInSiftScience } from '../siftScienceHelper';
import { initialAppState } from '../../state';
import { AppState } from '../../types/app';

const testSessionId = 'testSessionId';

const testMemberId = 'testMemberId';
let testAppState: AppState;

const siftMock = jest.fn();

describe('Sift Science Helper', () => {
  beforeEach((): void => {
    if (Object.prototype.hasOwnProperty.call(window, '_sift')) {
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      delete window._sift;
    }
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    window._sift = {
      push: siftMock,
    };

    testAppState = cloneDeep(initialAppState);
  });

  afterEach((): void => {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    window._sift = undefined;

    siftMock.mockClear();
  });
  it('Records events to sift science', () => {
    trackPageViewInSiftScience(testAppState);

    expect(siftMock).toHaveBeenCalledTimes(2);
    expect(siftMock).toHaveBeenCalledWith(['_setUserId', '']);
    expect(siftMock).toHaveBeenCalledWith(['_trackPageview']);
  });

  it('Records events to sift science with memberId present', () => {
    testAppState.flow.memberId = testMemberId;
    trackPageViewInSiftScience(testAppState);

    expect(siftMock).toHaveBeenCalledTimes(2);
    expect(siftMock).toHaveBeenCalledWith(['_setUserId', testMemberId]);
    expect(siftMock).toHaveBeenCalledWith(['_trackPageview']);
  });

  it('Records events to sift science with memberId  and cookie present', () => {
    testAppState.flow.memberId = testMemberId;
    testAppState.flow.czenJSessionId = testSessionId;
    trackPageViewInSiftScience(testAppState);

    expect(siftMock).toHaveBeenCalledTimes(3);
    expect(siftMock).toHaveBeenCalledWith(['_setSessionId', testSessionId]);
    expect(siftMock).toHaveBeenCalledWith(['_setUserId', testMemberId]);
    expect(siftMock).toHaveBeenCalledWith(['_trackPageview']);
  });
});
