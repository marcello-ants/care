import React from 'react';
import { render } from '@testing-library/react';

import Home from '@/components/pages/provider/sc/index-old';

describe('Provider Sc Home', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
