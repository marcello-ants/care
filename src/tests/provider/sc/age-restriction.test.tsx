import React from 'react';
import { render } from '@testing-library/react';

import AgeRestrictionPage from '../../../pages/provider/sc/age-restriction';

describe('Sc Provider Account Created', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<AgeRestrictionPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
