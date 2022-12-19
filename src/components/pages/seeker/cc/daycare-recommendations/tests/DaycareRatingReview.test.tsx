import React from 'react';
import { render, screen } from '@testing-library/react';

import DaycareRatingReview from '../DaycareRatingReview';

describe('<DaycareRatingReview />', () => {
  it('renders correctly with all fields', async () => {
    render(<DaycareRatingReview author="sample" rating={2.5} text="review" />);

    expect(screen.getByText('sample')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '2.5 Stars' })).toBeInTheDocument();
    expect(screen.getByText('review')).toBeInTheDocument();
  });
});
