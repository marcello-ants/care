import React from 'react';
import { render, screen } from '@testing-library/react';
import IneligibleLayout from '../IneligibleLayout';

describe('IneligibleLayout Page', () => {
  let asFragment: any | null = null;

  const renderComponent = () => {
    const view = render(
      <IneligibleLayout
        icon="close"
        headerText="Unfortunately, your insurance carrier is not eligible for use with Care.com">
        <>A child component</>
      </IneligibleLayout>
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

  it('Should pass children and render correctly', () => {
    renderComponent();
    const layoutHeaderText = screen.getByText(
      /Unfortunately, your insurance carrier is not eligible for use with Care.com/i
    );
    expect(layoutHeaderText).toBeInTheDocument();

    const childrenText = screen.getByText(/A child component/i);
    expect(childrenText).toBeInTheDocument();
  });
});
