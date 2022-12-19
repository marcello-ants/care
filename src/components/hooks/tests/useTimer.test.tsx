import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import useTimer from '../useTimer';

jest.mock('next/router', () => ({
  __esModule: true,
}));

describe('useTimer', () => {
  it('should call the passed callback function', async () => {
    const callback = jest.fn();
    renderHook(() => useTimer(callback, 1000));
    await waitFor(() => expect(callback).toBeCalledTimes(1), { timeout: 2000 });
  });
});
