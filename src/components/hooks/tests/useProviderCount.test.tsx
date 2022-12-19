import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider } from '@apollo/client/testing';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';

import { ServiceType } from '@/__generated__/globalTypes';
import { GET_CAREGIVER_COUNT_FOR_JOB } from '@/components/request/GQL';

import useProviderCount from '../useProviderCount';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '12345',
  },
};

const querySuccessMock = {
  request: {
    query: GET_CAREGIVER_COUNT_FOR_JOB,
    variables: {
      zipcode: '12345',
      serviceType: ServiceType.HOUSEKEEPING,
      childCareSearchCriteria: undefined,
    },
  },
  result: {
    data: {
      getCaregiverCountForJob: { count: 100 },
    },
  },
};

const queryErrorMock = {
  request: {
    query: GET_CAREGIVER_COUNT_FOR_JOB,
    variables: {
      zipcode: '12345',
      serviceType: ServiceType.HOUSEKEEPING,
      childCareSearchCriteria: undefined,
    },
  },
  error: new Error('error'),
};

let mockRouter: any | null = null;

const renderHookWithMocks = (mock: any) => {
  mockRouter = {
    asPath: '',
    pathname: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return renderHook(() => useProviderCount(ServiceType.HOUSEKEEPING), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={[mock]} addTypename={false}>
        <AppStateProvider initialStateOverride={appState}>{children}</AppStateProvider>
      </MockedProvider>
    ),
  });
};

describe('useProviderCount', () => {
  it('should return the number of providers on query success', async () => {
    const { result, waitForNextUpdate } = renderHookWithMocks(querySuccessMock);

    await waitForNextUpdate();

    expect(result.current.numOfProviders).toBe(100);
    expect(result.current.displayProviderMessage).toBe(true);
  });

  it('should disable provider message displaying on query error', async () => {
    const { result, waitForNextUpdate } = renderHookWithMocks(queryErrorMock);

    await waitForNextUpdate();

    expect(result.current.numOfProviders).toBe(0);
    expect(result.current.displayProviderMessage).toBe(false);
  });
});
