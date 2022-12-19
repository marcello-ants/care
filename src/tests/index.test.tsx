import { render } from '@testing-library/react';
import Index from '@/pages/index';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      BASE_PATH: 'BASE_PATH',
    },
  };
});

describe('Index', () => {
  it('should render snapshot', () => {
    const router = {
      push: jest.fn(),
      pathname: '/pages/index',
    };
    (useRouter as jest.Mock).mockReturnValue(router);

    const { asFragment } = render(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});
