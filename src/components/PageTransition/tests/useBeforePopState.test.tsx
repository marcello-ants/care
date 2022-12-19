import { useRouter } from 'next/router';
import { act, renderHook } from '@testing-library/react-hooks';
import { POST_A_JOB_ROUTES } from '@/constants';
import useBeforePopState from '../useBeforePopState';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('useBeforePopState hook', () => {
  let beforePopStateCallback: () => boolean;
  beforeEach(() => {
    const mockRouter = {
      route: POST_A_JOB_ROUTES.ONE_TIME,
      beforePopState(cb: () => boolean) {
        beforePopStateCallback = cb;
      },
      pathname: POST_A_JOB_ROUTES.ONE_TIME,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should return isPoppingState: false initially', () => {
    const { result } = renderHook(() => useBeforePopState());
    expect(result.current.isPoppingState).toBe(false);
  });

  it('should return isPoppingState: true when navigating back', () => {
    const { result, rerender } = renderHook(() => useBeforePopState());

    act(() => {
      beforePopStateCallback();
    });

    rerender();
    expect(result.current.isPoppingState).toBe(true);
  });
});
