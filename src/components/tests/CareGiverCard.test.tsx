import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import CareGiverCard from '../CareGiverCard';

describe('SavingCard - test', () => {
  test('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider>
        <CareGiverCard
          avgReviewRating={5}
          yearsOfExperience={3}
          member={{ displayName: 'test', imageURL: '' }}
        />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
