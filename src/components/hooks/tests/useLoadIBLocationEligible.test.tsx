import { preRenderHook } from '@/__setup__/testUtil';
import { GET_INSTANT_BOOK_LOCATION_ELIGIBLE } from '@/components/request/GQL';
import { useLoadInstantBookEligibleLocation } from '@/components/hooks/useLoadIBLocationEligible';
import { initialAppState } from '@/state';
import { cloneDeep } from 'lodash-es';
import { AppState } from '@/types/app';
import { useAppDispatch } from '@/components/AppState';
import logger from '@/lib/clientLogger';

jest.mock('@/components/AppState', () => ({
  ...jest.requireActual('@/components/AppState'),
  useAppDispatch: jest.fn(),
}));

describe('useLoadIBLocationEligible', () => {
  const appState: AppState = cloneDeep(initialAppState);
  const appDispatch = jest.fn();
  const zipcode = '02453';
  appState.seeker.zipcode = zipcode;

  const request = {
    query: GET_INSTANT_BOOK_LOCATION_ELIGIBLE,
    variables: {
      zipcode,
    },
  };

  const querySuccess = {
    request,
    result: {
      data: {
        getInstantBookLocationEligible: {
          __typename: 'GetInstantBookLocationEligibleSuccess',
          eligible: true,
        },
      },
    },
  };

  const queryError = {
    request,
    error: new Error('oops'),
  };
  (useAppDispatch as jest.Mock).mockReturnValue(appDispatch);

  it('Should handle success when zip code is eligible, dispatching the result in the store state', async () => {
    const { renderFn } = preRenderHook({
      mocks: [querySuccess],
      appState,
    });

    const { waitForNextUpdate } = renderFn(() => useLoadInstantBookEligibleLocation());
    await waitForNextUpdate();

    expect(appDispatch).toHaveBeenCalledWith({
      type: 'cc_setIbEligibleLocation',
      eligible: true,
    });
  });

  it('should handle error call by logging in the error', async () => {
    const { renderFn } = preRenderHook({
      mocks: [queryError],
      appState,
    });

    const { waitForNextUpdate } = renderFn(() => useLoadInstantBookEligibleLocation());
    await waitForNextUpdate();

    expect(logger.error).toHaveBeenCalledWith({ event: 'getInstantBookLocationEligibleError' });
  });
});
