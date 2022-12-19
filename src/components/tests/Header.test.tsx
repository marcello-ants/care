import { render } from '@testing-library/react';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import Header from '../Header';

describe('Header test', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <FeatureFlagsProvider flags={{}}>
        <Header>This is a header</Header>
      </FeatureFlagsProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
