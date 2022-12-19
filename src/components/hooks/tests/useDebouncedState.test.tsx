import { renderHook } from '@testing-library/react-hooks';
import useDebouncedState from '../useDebouncedState';

describe('useDebouncedState hook', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should update only after the timer ends', () => {
    const initialValue = 0;
    const timeout = 5;
    const { result, rerender } = renderHook(({ value }) => useDebouncedState(value, timeout), {
      initialProps: {
        value: initialValue,
        timeout,
      },
    });

    rerender({ value: 2, timeout });
    expect(result.current).toBe(0);
    jest.advanceTimersByTime(5);
    expect(result.current).toBe(2);
  });
});
