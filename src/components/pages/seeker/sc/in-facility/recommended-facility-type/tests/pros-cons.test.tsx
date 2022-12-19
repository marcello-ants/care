import { screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';

import ProsAndCons from '../pros-cons';

describe('RecommendedFacilityType - ProsAndCons', () => {
  const pros = [
    'Good for seniors who need help with daily activities',
    'Residents typically have access to at least one medical professional',
    'Offers social and community interaction',
  ];

  const cons = [
    'Not a great fit for those who need around-the-clock medical care or are dealing with severe physical or mental conditions',
  ];

  it('Match snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(<ProsAndCons pros={pros} cons={cons} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render Pros And Cons', () => {
    const { renderFn } = preRenderPage();
    renderFn(<ProsAndCons pros={pros} cons={cons} />);

    expect(
      screen.getByText('Good for seniors who need help with daily activities')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Residents typically have access to at least one medical professional')
    ).toBeInTheDocument();
    expect(screen.getByText('Offers social and community interaction')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Not a great fit for those who need around-the-clock medical care or are dealing with severe physical or mental conditions'
      )
    ).toBeInTheDocument();
  });
});
