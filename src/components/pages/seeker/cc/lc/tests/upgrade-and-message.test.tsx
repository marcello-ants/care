import { render } from '@testing-library/react';

import UpgradeAndMessage from '../upgrade-and-message';

describe('UpgradeAndMessage', () => {
  it('matches snapshot', () => {
    const view = render(<UpgradeAndMessage />);

    expect(view.asFragment()).toMatchSnapshot();
  });
});
