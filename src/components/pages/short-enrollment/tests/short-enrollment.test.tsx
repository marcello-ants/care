import React from 'react';
import { render } from '@testing-library/react';

import ShortEnrollmentContainer from '../short-enrollment-container';

describe('Short Enrollment Container - test', () => {
  test('matches snapshot', async () => {
    const { asFragment } = render(<ShortEnrollmentContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('matches snapshot with child node', async () => {
    const { asFragment } = render(<ShortEnrollmentContainer>TEST</ShortEnrollmentContainer>);
    expect(asFragment()).toMatchSnapshot();
  });
});
