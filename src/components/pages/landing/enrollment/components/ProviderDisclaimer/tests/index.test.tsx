// External Dependencies
import { render } from '@testing-library/react';

// Internal Dependencies
import ProviderDisclaimerV1 from '../index';

describe('<ProviderDisclaimerV1>', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<ProviderDisclaimerV1 />);
    expect(asFragment()).toMatchSnapshot();
  });
});
