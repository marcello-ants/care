// External Dependencies
import React from 'react';
import { render } from '@testing-library/react';

// Custom Dependencies
import { Icon48BrandChildcare } from '@care/react-icons';

// Internal Dependencies
import GenericBanner from '../genericBanner';

describe('<GenericBanner />', () => {
  it('matches snapshot', () => {
    const view = render(
      <GenericBanner messageText="Nice! {data} caregivers are near you." data={77}>
        <Icon48BrandChildcare size="48px" />
      </GenericBanner>,
      {}
    );
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot without "caregiversCount"', () => {
    const view = render(
      <GenericBanner messageText="Last step!">
        <Icon48BrandChildcare size="48px" />
      </GenericBanner>,
      {}
    );
    expect(view.asFragment()).toMatchSnapshot();
  });
});
