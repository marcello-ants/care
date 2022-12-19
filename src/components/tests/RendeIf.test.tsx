import { render, screen } from '@testing-library/react';

import RenderIf from '../RenderIf';

describe('RenderIf', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      // eslint-disable-next-line react/jsx-boolean-value
      <RenderIf condition={true}>
        <p>This is a test</p>
      </RenderIf>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders a component when condition is met', () => {
    render(
      // eslint-disable-next-line react/jsx-boolean-value
      <RenderIf condition={true}>
        <p>This is a test</p>
      </RenderIf>
    );

    const textElement = screen.getByText('This is a test');
    expect(textElement).toBeInTheDocument();
  });

  it('Do not render a component when condition is not met', () => {
    render(
      // eslint-disable-next-line react/jsx-boolean-value
      <RenderIf condition={false}>
        <p data-testid="test">This is a test</p>
      </RenderIf>
    );

    const textElement = screen.queryByTestId('test');
    expect(textElement).not.toBeInTheDocument();
  });
});
