import React from 'react';
import { useRouter } from 'next/router';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { VerticalsAbbreviation } from '@/constants';
import { initialAppState } from '@/state';
import AuthService, { getUserEmail } from '@/lib/AuthService';
import { TealiumUtagService, TealiumData } from '@/utilities/utagHelper';
import { AppState } from '@/types/app';
import { AppStateProvider } from '@/components/AppState';
import { useTealiumTrackingOnPasswordScreen } from '../useTealiumTrackingOnPasswordScreen';

const TEST_EMAIL = 'hello@care.com';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/utilities/utagHelper', () => ({
  __esModule: true,
  TealiumUtagService: {
    view: jest.fn(),
  },
}));

jest.mock('@/utilities/account-creation-utils', () => ({
  __esModule: true,
  hash256: jest.fn(() => Promise.resolve('testHash256')),
}));

const tealiumMock = TealiumUtagService.view as jest.Mock;

jest.mock('@/lib/AuthService');
(getUserEmail as jest.Mock).mockImplementation(() => TEST_EMAIL);
(AuthService as jest.Mock).mockImplementation(() => ({
  getStore: jest.fn(() => ({
    profile: {
      email: TEST_EMAIL,
    },
  })),
}));

const czenJSessionId = '123123';
const memberId = '987987';
let mockRouter: any | null = null;

function mountHook(vertical: VerticalsAbbreviation) {
  const initialState: AppState = {
    ...initialAppState,
    flow: {
      ...initialAppState.flow,
      memberId,
      czenJSessionId,
    },
  };
  const pathname = '/seeker/hk/account-creation/password';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return renderHook(() => useTealiumTrackingOnPasswordScreen(vertical), {
    wrapper: ({ children }) => (
      <AppStateProvider initialStateOverride={initialState}>{children}</AppStateProvider>
    ),
  });
}

const tealiumCases: [VerticalsAbbreviation, string][] = [
  ['HK', 'HOUSEKEEP'],
  ['PC', 'PETCAREXX'],
  ['TU', 'TUTORINGX'],
  ['CC', 'CHILDCARE'],
  ['DC', 'CHILDCARE'],
  ['SC', 'SENIRCARE'],
  ['IB', 'Unknown SubService Id'],
];

const initialTealiumData: TealiumData = {
  memberId,
  tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
  sessionId: czenJSessionId,
  email: TEST_EMAIL,
  emailSHA256: 'testHash256',
  slots: [
    '/us-subscription/conversion/seeker/basic/signup/',
    '/us-subscription/conversion/seeker/basic/signup/cj/',
    '/us-subscription/conversion/seeker/basic/signup/impact/',
  ],
  intent: 'WITHIN_A_WEEK',
  memberType: 'seeker',
  overallStatus: 'basic',
  serviceId: 'HK',
  subServiceId: 'HOUSEKEEP',
};

describe('useTealiumTracking', () => {
  it.each(tealiumCases)(
    `sends the right data for Tealium event in %s vertical`,
    async (serviceId, subServiceId) => {
      const isUnknownIntent = serviceId === 'SC' || serviceId === 'IB';
      const tealiumData: TealiumData = {
        ...initialTealiumData,
        serviceId,
        subServiceId,
        intent: isUnknownIntent ? 'Unknown Vertical' : `${initialTealiumData.intent}`,
      };

      mountHook(serviceId);
      await waitFor(() => expect(tealiumMock).toHaveBeenCalledWith(tealiumData));
    }
  );
});
