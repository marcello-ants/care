import React from 'react';
import { render, screen } from '@testing-library/react';
import LocationIneligible from '../location-ineligible';

describe('LocationIneligible Page', () => {
  let asFragment: any | null = null;

  const renderComponent = () => {
    const view = render(<LocationIneligible />);
    ({ asFragment } = view);
  };

  afterEach(() => {
    // cleanup on exiting
    asFragment = null;
  });

  it('matches snapshot', () => {
    renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render correctly', () => {
    renderComponent();
    const headerText = screen.getByText(
      /Unfortunately, we're still building up coverage in your area./i
    );
    const childrenText = screen.getByText(/Reach out to LTCG for more options/i);
    const phoneText = screen.getByText(/833-894-8576/i);
    expect(childrenText).toBeInTheDocument();
    expect(phoneText).toBeInTheDocument();
    expect(headerText).toBeInTheDocument();
  });
});
