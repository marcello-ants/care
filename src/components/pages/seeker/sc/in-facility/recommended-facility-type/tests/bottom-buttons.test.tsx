import { screen, fireEvent } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';

import Buttons from '../bottom-buttons';

describe('RecommendedFacilityType - Bottom Buttons', () => {
  it('Match Snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(
      <Buttons handleContinue={() => {}} handleOptionComparison={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should call handler click', () => {
    const handleContinueMock = jest.fn();
    const ButtonsComponent = (
      <Buttons handleOptionComparison={() => {}} handleContinue={handleContinueMock} />
    );
    const { renderFn } = preRenderPage();
    renderFn(ButtonsComponent);

    const continueButton = screen.getByText('Yes, continue');
    const notLookRight = screen.getByText("This doesn't look right");

    expect(continueButton).toBeInTheDocument();
    expect(notLookRight).toBeInTheDocument();

    fireEvent.click(continueButton);
    expect(handleContinueMock).toHaveBeenCalledTimes(1);
  });
});
