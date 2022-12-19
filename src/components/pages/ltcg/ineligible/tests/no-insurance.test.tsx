import { screen, fireEvent } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import NoInsurance from '../no-insurance';

describe('NoInsurance page', () => {
  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(NoInsurance);
    expect(asFragment()).toMatchSnapshot();
  });

  it('router should be called with /seeker/sc/help-type', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(NoInsurance);

    fireEvent.click(screen.getByText('Find a caregiver'));
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith('/seeker/sc/help-type');
  });

  it('router should be called with /seeker/sc/in-facility/care-trust', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(NoInsurance);

    fireEvent.click(screen.getByText('Find a senior living community'));
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith('/seeker/sc/in-facility/care-trust');
  });
});
