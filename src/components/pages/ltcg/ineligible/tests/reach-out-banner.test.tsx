import React from 'react';
import { render, screen } from '@testing-library/react';
import ReachOutBanner from '../reach-out-banner';

describe('ReachOutBanner Component', () => {
  let asFragment: any | null = null;

  const renderComponent = () => {
    const view = render(
      <ReachOutBanner bannerText="Reach out to LTCG for more options" phoneNumber="877-367-1959" />
    );
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
    const bannerText = screen.getByText(/Reach out to LTCG for more options/i);
    const phoneText = screen.getByText(/877-367-1959/i);
    expect(bannerText).toBeInTheDocument();
    expect(phoneText).toBeInTheDocument();
  });
});
