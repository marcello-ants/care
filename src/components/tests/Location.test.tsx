import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, act, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { AppStateProvider } from '@/components/AppState';
import useNextRoute from '@/components/hooks/useNextRoute';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import Location from '../Location';

const testZipCode = '90001';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useNextRoute');

jest.mock('@/components/hooks/useFlowHelper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    currentFlow: 'SEEKER',
  })),
}));

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: testZipCode,
  },
};
interface optionProps {
  headerText?: string;
  mocks?: MockedResponse[];
  flags?: Record<string, LDEvaluationDetail>;
  appState?: AppState;
}
describe('Location', () => {
  let mockRouter: any | null = null;
  let mockRoute: any = null;

  const renderComponent = (options?: optionProps) => {
    const { headerText, appState = initialState, flags = {} } = options || {};

    const view = render(
      <MockedProvider>
        <FeatureFlagsProvider flags={flags}>
          <AppStateProvider initialStateOverride={appState}>
            <Location headerText={headerText} handleNext={() => {}} />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    );

    return { view };
  };

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/location',
      query: {},
    };
    mockRoute = {
      pushNextRoute: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useNextRoute as jest.Mock).mockReturnValue(mockRoute);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    mockRoute = null;
  });

  it('matches snapshot', () => {
    const { view } = renderComponent();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with default header', () => {
    renderComponent();
    expect(screen.getByText("Let's confirm where you'll need help.")).toBeInTheDocument();
  });

  it('renders correctly with custom header', () => {
    renderComponent({ headerText: 'Custom header' });
    expect(screen.getByText('Custom header')).toBeInTheDocument();
  });
});
