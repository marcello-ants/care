import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import sentryTestkit from 'sentry-testkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SessionStorageHelper } from '@/utilities/SessionStorageHelper';
import getVertical from '@/utilities/verticalUtils';
import { LOCAL_STORAGE_STATE_KEY } from '@/constants';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch, useAppState, useFlowState } from '../AppState';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/utilities/verticalUtils', () => ({
  __esModule: true,
  default: jest.fn(() => 'Seniorcare'),
  getVertical: jest.fn(),
}));

jest.mock('@/utilities/SessionStorageHelper', () => {
  const original = jest.requireActual('@/utilities/SessionStorageHelper');

  return {
    __esModule: true,
    SessionStorageHelper: {
      ...original.SessionStorageHelper,
      isAvailable: jest.fn(),
    },
  };
});

describe('AppState', () => {
  const { testkit, sentryTransport } = sentryTestkit();

  beforeAll(() => {
    Sentry.init({
      dsn: 'https://mydsn@sentry.io/123456790',
      transport: sentryTransport,
      defaultIntegrations: false,
    });
  });

  beforeEach(() => {
    (SessionStorageHelper.isAvailable as jest.Mock).mockReturnValue(true);
  });

  describe('flowDetection', () => {
    const FlowName = () => {
      const flowState = useFlowState();
      return <div>FlowName: {flowState.flowName}</div>;
    };

    let mockRouter: any;
    beforeEach(() => {
      mockRouter = {
        push: jest.fn(),
      };
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /post-a-job path', () => {
      mockRouter.pathname = '/post-a-job';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });

    it('should update Sentry context to have current flow and vertical', async () => {
      mockRouter.pathname = '/post-a-job';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      (getVertical as jest.Mock).mockReturnValue('Seniorcare');
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      Sentry.captureException(new Error('yikes!'));

      await waitFor(() => expect(testkit.reports()).toHaveLength(1));
      const [report] = testkit.reports();
      expect(report.tags.flow).toBe('SEEKER_POST_A_JOB');
      expect(report.tags.vertical).toBe('Seniorcare');
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /recurring path', () => {
      mockRouter.pathname = '/recurring';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /onetime path', () => {
      mockRouter.pathname = '/onetime';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /pay-for-care path', () => {
      mockRouter.pathname = '/pay-for-care';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /ideal-caregiver path', () => {
      mockRouter.pathname = '/ideal-caregiver';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /about-loved-one path', () => {
      mockRouter.pathname = '/about-loved-one';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });

    it('should set the flow to SEEKER_POST_A_JOB for the /caregivers-near-you path', () => {
      mockRouter.pathname = '/caregivers-near-you';
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      render(
        <AppStateProvider>
          <FlowName />
        </AppStateProvider>
      );
      expect(screen.getByText('FlowName: SEEKER_POST_A_JOB')).toBeInTheDocument();
    });
  });

  describe('getStateFromStorageOrDefault', () => {
    function StatefulComponent() {
      const state = useAppState();
      return <div>{state.flow.memberId}</div>;
    }

    it('should prefer sessionStorage to localStorage', () => {
      window.localStorage.setItem(
        LOCAL_STORAGE_STATE_KEY,
        JSON.stringify({
          ...initialAppState,
          flow: { ...initialAppState.flow, memberId: 'localStorage' },
        })
      );
      window.sessionStorage.setItem(
        LOCAL_STORAGE_STATE_KEY,
        JSON.stringify({
          ...initialAppState,
          flow: { ...initialAppState.flow, memberId: 'sessionStorage' },
        })
      );

      render(
        <AppStateProvider>
          <StatefulComponent />
        </AppStateProvider>
      );

      expect(screen.getByText('sessionStorage')).toBeInTheDocument();
      expect(screen.queryByText('localStorage')).not.toBeInTheDocument();
    });
  });

  describe('persistState', () => {
    function StatefulComponent() {
      const state = useAppState();
      const dispatch = useAppDispatch();

      function handleClick() {
        dispatch({ type: 'setMemberId', memberId: 'updated' });
      }

      return (
        <button type="button" onClick={handleClick}>
          {state.flow.memberId}
        </button>
      );
    }

    it('should persist to sessionStorage', async () => {
      window.sessionStorage.setItem(
        LOCAL_STORAGE_STATE_KEY,
        JSON.stringify({
          ...initialAppState,
          flow: { ...initialAppState.flow, memberId: 'sessionStorage' },
        })
      );

      render(
        <AppStateProvider>
          <StatefulComponent />
        </AppStateProvider>
      );

      fireEvent.click(screen.getByText('sessionStorage'));
      expect(screen.getByText('updated')).toBeInTheDocument();
      await waitFor(() => {
        const sessionState = JSON.parse(
          window.sessionStorage.getItem(LOCAL_STORAGE_STATE_KEY) || ''
        );
        expect(sessionState.flow.memberId).toBe('updated');
      });
    });
  });
});
