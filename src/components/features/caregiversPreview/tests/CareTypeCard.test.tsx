import { render, screen } from '@testing-library/react';
import { useMediaQuery } from '@material-ui/core';
import CareTypeCard, { CareTypeCardProps } from '../CareTypeCard';

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');

  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn().mockReturnValue(false),
  };
});

jest.mock('@/components/hooks/useResizeObserver', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('CareTypeCard', () => {
  const defaultProps: CareTypeCardProps = {
    careType: {
      description: 'Independent Living',
    },
  };

  function renderComponent(props?: CareTypeCardProps) {
    return render(<CareTypeCard {...(props || defaultProps)} />);
  }

  it('should match the snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot();
  });

  it('should set the width to 100% on small devices', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    renderComponent();

    expect(screen.getByText('Independent Living').parentElement).toHaveStyle({ width: '100%' });
  });
});
