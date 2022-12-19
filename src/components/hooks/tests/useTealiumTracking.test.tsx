import React from 'react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { renderHook } from '@testing-library/react-hooks';

import { initialAppState } from '../../../state';
import { AppStateProvider } from '../../AppState';
import { AppState } from '../../../types/app';
import { TealiumUtagService } from '../../../utilities/utagHelper';
import useTealiumTracking from '../useTealiumTracking';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('../../../utilities/utagHelper', () => ({
  __esModule: true,
  TealiumUtagService: {
    view: jest.fn(),
    link: jest.fn(),
    track: jest.fn(),
  },
}));

const czenJSessionId = '123123';
const memberId = '987987';
const initialState: AppState = cloneDeep(initialAppState);
const appState = {
  ...initialState,
  flow: {
    ...initialState.flow,
    memberId,
    czenJSessionId,
  },
};
let mockRouter: any | null = null;
let mockView: jest.Mock | null = null;

function mountHook(slots: string[]) {
  const pathname = '/seeker/cc/care-location';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return renderHook(() => useTealiumTracking(slots), {
    wrapper: ({ children }) => (
      <AppStateProvider initialStateOverride={appState}>{children}</AppStateProvider>
    ),
  });
}

describe('useTealiumTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockView = TealiumUtagService.view as jest.Mock;
  });

  it('tealium view event is triggered with slots when component mounts', () => {
    const slots: string[] = [];
    mountHook(slots);
    expect(mockView).toHaveBeenCalledWith({
      memberId,
      sessionId: czenJSessionId,
      slots,
    });
  });

  it('tealium view event does not trigger on re-render', () => {
    const slots: string[] = [];
    const utils = mountHook(slots);
    expect(mockView).toHaveBeenCalledWith({
      memberId,
      sessionId: czenJSessionId,
      slots,
    });
    utils.rerender();
    expect(mockView).toHaveBeenCalledTimes(1);
  });
});
