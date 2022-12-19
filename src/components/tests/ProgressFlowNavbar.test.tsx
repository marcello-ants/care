import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import useFlowHelper from '@/components/hooks/useFlowHelper';
import ProgressFlowNavbar from '../ProgressFlowNavbar';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useFlowHelper', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/AppState', () => ({
  __esModule: true,
  ...(jest.requireActual('@/components/AppState') as object),

  useFlowState: () => ({
    flowName: 'SEEKER_CHILD_CARE',
  }),
}));

describe('ProgressFlowNavbar', () => {
  (useRouter as jest.Mock).mockReturnValue({ asPath: 'path' });

  it('should render snapshot for informational steps', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 1,
      totalSteps: 5,
      currentFlow: 'PROVIDER_CC_INFORMATIONAL_STEPS',
      hideStepNumber: false,
    });
    const { asFragment } = render(<ProgressFlowNavbar />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct label for steps screen', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 1,
      totalSteps: 2,
      currentFlow: 'PROVIDER_CC_INFORMATIONAL_STEPS',
      hideStepNumber: false,
    });
    render(<ProgressFlowNavbar />);

    expect(screen.getByText('Great start!')).toBeInTheDocument();
  });

  it('should render correct label for jobs matching screen', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 2,
      totalSteps: 2,
      currentFlow: 'PROVIDER_CC_INFORMATIONAL_STEPS',
      hideStepNumber: false,
    });
    render(<ProgressFlowNavbar />);

    expect(screen.getByText('Nice!')).toBeInTheDocument();
  });

  it('should render snapshot for account creation', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 1,
      totalSteps: 5,
      currentFlow: 'PROVIDER_CC_ACCOUNT_CREATION',
      hideStepNumber: false,
    });
    const { asFragment } = render(<ProgressFlowNavbar />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render snapshot for profile details', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 1,
      totalSteps: 5,
      currentFlow: 'PROVIDER_CC_PROFILE_DETAILS',
      hideStepNumber: false,
    });
    const { asFragment } = render(<ProgressFlowNavbar />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct label for profile details', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 1,
      totalSteps: 5,
      currentFlow: 'PROVIDER_CC_PROFILE_DETAILS',
      hideStepNumber: false,
    });
    render(<ProgressFlowNavbar />);

    expect(screen.getByText('Build your profile')).toBeInTheDocument();
  });

  it('should render snapshot for hideStepNumber', () => {
    (useFlowHelper as jest.Mock).mockReturnValue({
      stepNumber: 1,
      totalSteps: 8,
      currentFlow: 'SEEKER_CHILD_CARE',
      hideStepNumber: true,
    });
    const { asFragment } = render(<ProgressFlowNavbar />);

    expect(asFragment()).toMatchSnapshot();
  });
});
