import { screen, waitFor } from '@testing-library/react';
import { GraphQLError } from 'graphql';

import { preRenderPage } from '@/__setup__/testUtil';
import { AppState } from '@/types/app';
import { useAppDispatch } from '@/components/AppState';
import { initialAppState } from '@/state';
import { GET_SEEKER_INFO } from '@/components/request/GQL';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { withPotentialMember } from '../withPotentialMember';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

jest.mock('@/components/FeatureFlagsContext', () => ({
  ...(jest.requireActual('@/components/FeatureFlagsContext') as object),
  useFeatureFlags: jest.fn().mockReturnValue({
    flags: {},
  }),
}));

const MEMBER_UUID = 'c8580dcb-ea9c-4bb6-bd0e-e084f09c0bb7';
const MEMBER_ID = '12345';

const GET_SEEKER_INFO_MOCK = {
  request: {
    query: GET_SEEKER_INFO,
    variables: {
      memberId: MEMBER_UUID,
    },
  },
  result: {
    data: {
      getSeeker: {
        member: {
          firstName: 'Tim',
          lastName: 'Allen',
          contact: {
            primaryPhone: '512-5555555',
          },
          email: 'test@test.com',
          legacyId: MEMBER_ID,
        },
      },
    },
  },
};

const GET_SEEKER_INFO_MOCK_NO_LEGACY_ID = {
  request: {
    query: GET_SEEKER_INFO,
    variables: {
      memberId: MEMBER_UUID,
    },
  },
  result: {
    data: {
      getSeeker: {
        member: {
          firstName: 'Tim',
          lastName: 'Allen',
          contact: {
            primaryPhone: '512-5555555',
          },
          email: 'test@test.com',
          legacyId: null,
        },
      },
    },
  },
};

const GET_SEEKER_INFO_MOCK_ERROR = {
  request: {
    query: GET_SEEKER_INFO,
    variables: {
      memberId: MEMBER_ID,
    },
  },
  result: {
    errors: [new GraphQLError('Error!')],
    data: null,
  },
};

describe('withPotentialMember HOC', () => {
  const SimpleComponent = () => <div>Simple Component</div>;
  const WrappedComponent = withPotentialMember(SimpleComponent);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the wrapped component by default', () => {
    const { renderFn } = preRenderPage();
    renderFn(WrappedComponent);
    expect(screen.getByText('Simple Component')).toBeVisible();
  });

  it('renders the wrapped component when the user has an account and a memberUuid is in state', async () => {
    const mockAppDispatch: ReturnType<typeof useAppDispatch> = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    const setMemberIdMock = jest.spyOn(AnalyticsHelper, 'setMemberId');
    const ampliIdentifyMock = jest.spyOn(AmpliHelper.ampli, 'identify');

    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
        memberUuid: MEMBER_UUID,
      },
    };
    const { renderFn } = preRenderPage({
      appState,
      mocks: [GET_SEEKER_INFO_MOCK],
    });
    renderFn(WrappedComponent);
    expect(await screen.findByText('Simple Component')).toBeVisible();

    expect(setMemberIdMock).toHaveBeenCalledWith(MEMBER_ID);
    expect(ampliIdentifyMock).not.toHaveBeenCalled();

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setMemberId',
      memberId: MEMBER_ID,
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setSeekerInfo',
      firstName: 'Tim',
      lastName: 'Allen',
      email: 'test@test.com',
      phone: '512-5555555',
    });
  });

  it('identifies the user id using both ampli and amplitude events during SC in-home seeker enrollment when feature flag is on', async () => {
    const mockAppDispatch: ReturnType<typeof useAppDispatch> = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
    (useFeatureFlags as jest.Mock).mockReturnValue({
      flags: { [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: { variationIndex: 1 } },
    });

    const setMemberIdMock = jest.spyOn(AnalyticsHelper, 'setMemberId');
    const ampliIdentifyMock = jest.spyOn(AmpliHelper.ampli, 'identify');

    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
        memberUuid: MEMBER_UUID,
      },
      seeker: {
        ...initialAppState.seeker,
        typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
      },
    };
    const { renderFn } = preRenderPage({
      appState,
      mocks: [GET_SEEKER_INFO_MOCK],
    });
    renderFn(WrappedComponent);
    expect(await screen.findByText('Simple Component')).toBeVisible();

    expect(setMemberIdMock).toHaveBeenCalledWith(MEMBER_ID);
    expect(ampliIdentifyMock).toHaveBeenCalledWith(MEMBER_ID);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setMemberId',
      memberId: MEMBER_ID,
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setSeekerInfo',
      firstName: 'Tim',
      lastName: 'Allen',
      email: 'test@test.com',
      phone: '512-5555555',
    });
  });

  it('displays the component if an error happens when looking up the memberId', async () => {
    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
        memberUuid: MEMBER_UUID,
      },
    };
    const setMemberIdMock = jest.spyOn(AnalyticsHelper, 'setMemberId');
    const { renderFn } = preRenderPage({ appState, mocks: [GET_SEEKER_INFO_MOCK_ERROR] });
    renderFn(WrappedComponent);

    await waitFor(() => expect(screen.queryByText('Simple Component')).not.toBeInTheDocument());
    await screen.findByText('Simple Component');
    expect(setMemberIdMock).not.toHaveBeenCalled();
  });

  it('Should display the component if legacyId is null and not calling AnalyticsHelper.setMemberId', async () => {
    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
        memberUuid: MEMBER_UUID,
      },
    };

    const setMemberIdMock = jest.spyOn(AnalyticsHelper, 'setMemberId');
    const { renderFn } = preRenderPage({ appState, mocks: [GET_SEEKER_INFO_MOCK_NO_LEGACY_ID] });
    renderFn(WrappedComponent);
    await waitFor(() => expect(screen.queryByText('Simple Component')).not.toBeInTheDocument());

    expect(setMemberIdMock).not.toHaveBeenCalled();
    await screen.findByText('Simple Component');
  });
});
