import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preRenderPage } from '@/__setup__/testUtil';
import { LTCG_ROUTES } from '@/constants';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { CareDate } from '@/__generated__/globalTypes';
import WhenPage from '../when';

describe('WhenPage', () => {
  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(WhenPage);
    expect(asFragment()).toMatchSnapshot();
  });

  it('routes to next page', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(WhenPage);
    const asapPill = screen.getByText('As soon as possible');
    userEvent.click(asapPill);
    expect(routerMock.push).toBeCalled();
    expect(routerMock.push).toBeCalledWith(LTCG_ROUTES.DETAILS_ABOUT_YOURSELF);
  });

  it('should pre-select the value from app state', () => {
    const appState: AppState = {
      ...initialAppState,
      ltcg: {
        ...initialAppState.ltcg,
        careDate: CareDate.WITHIN_A_MONTH,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(WhenPage);
    const nextMonth = screen.getByDisplayValue(CareDate.WITHIN_A_MONTH);
    expect(nextMonth).toBeChecked();
  });

  it('should highlight the selected option when clicked', () => {
    const { renderFn } = preRenderPage();
    renderFn(WhenPage);
    const nextMonth = screen.getByDisplayValue(CareDate.WITHIN_A_MONTH);
    expect(nextMonth).not.toBeChecked();
    userEvent.click(screen.getByText('Within the next month'));
    expect(nextMonth).toBeChecked();
  });
});
