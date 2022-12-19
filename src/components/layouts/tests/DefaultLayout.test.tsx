import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS, CC_REBRANDED_PATHS } from '@/constants';
import DefaultLayout from '../DefaultLayout';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: any | null = null;

const renderComponent = (ldFlags: FeatureFlags = {}) => {
  return render(
    <FeatureFlagsProvider flags={ldFlags}>
      <ThemeProvider theme={theme}>
        <DefaultLayout>test</DefaultLayout>
      </ThemeProvider>
    </FeatureFlagsProvider>
  );
};

beforeEach(() => {
  mockRouter = {
    asPath: '',
    pathname: CC_REBRANDED_PATHS[0],
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

describe('Default Layout component', () => {
  it('matches snapshot', () => {
    const view = renderComponent();

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches rebranded snapshot', () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_REBRANDED_ENROLLMENT]: {
        reason: { kind: '' },
        value: 2,
        variationIndex: 2,
      },
    };

    const view = renderComponent(ldFlags);

    expect(view.asFragment()).toMatchSnapshot();
  });
});
