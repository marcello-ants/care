import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LTCG_ROUTES } from '@/constants';
import { useAppDispatch } from '@/components/AppState';
import { preRenderPage } from '@/__setup__/testUtil';
import { YesOrNoAnswer } from '@/__generated__/globalTypes';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import EligiblePolicy from '../eligible-policy';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

describe('EligiblePolicy', () => {
  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(EligiblePolicy);
    expect(asFragment()).toMatchSnapshot();
  });

  it('navigate to "details about yourself" page when "No" is clicked', async () => {
    const mockAppDispatch: ReturnType<typeof useAppDispatch> = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    const { renderFn, routerMock } = preRenderPage();
    renderFn(EligiblePolicy);

    const noButton = screen.getByText('No');
    fireEvent.click(noButton);
    await waitFor(() =>
      expect(routerMock.push).toHaveBeenCalledWith(LTCG_ROUTES.DETAILS_ABOUT_YOURSELF)
    );

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setLtcgCaregiverNeeded',
        caregiverNeeded: YesOrNoAnswer.NO,
      })
    );
  });

  it('navigate to the "where" page when "Yes" is clicked', async () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(EligiblePolicy);

    const yesButton = screen.getByText('Yes');
    userEvent.click(yesButton);
    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith(LTCG_ROUTES.WHERE));
  });

  it('should pre-select the option stored in app state', async () => {
    const appState: AppState = {
      ...initialAppState,
      ltcg: {
        ...initialAppState.ltcg,
        caregiverNeeded: YesOrNoAnswer.NO,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(EligiblePolicy);

    const noButton = screen.getByDisplayValue('NO');
    expect(noButton).toBeChecked();
  });
});
