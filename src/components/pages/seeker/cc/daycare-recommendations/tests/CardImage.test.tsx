// External Dependencies
import React from 'react';
import { render, RenderResult } from '@testing-library/react';

// Internal Dependencies
import CardImage from '../Cards/CardImage';

describe('<CardImage />', () => {
  let cardImageComponentRender: RenderResult;

  // Util Functions
  const renderComponent = (isDesktopOrUp: boolean) => {
    cardImageComponentRender = render(<CardImage photoIndex={1} isDesktopOrUp={isDesktopOrUp} />);
  };

  it('Card Image renders correctly - Desktop', async () => {
    renderComponent(true);
    expect(cardImageComponentRender.asFragment()).toMatchSnapshot();
  });

  it('Card Image renders correctly - Mobile', async () => {
    renderComponent(false);
    expect(cardImageComponentRender.asFragment()).toMatchSnapshot();
  });
});
