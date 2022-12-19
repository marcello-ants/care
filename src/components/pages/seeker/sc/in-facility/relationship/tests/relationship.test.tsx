import { screen, fireEvent } from '@testing-library/react';

import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';

import { useAppDispatch } from '@/components/AppState';
import { preRenderPage } from '@/__setup__/testUtil';
import Relationship from '../relationship';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

describe('in facility relationship', () => {
  const mockAppDispatch: ReturnType<typeof useAppDispatch> = jest.fn();
  (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(Relationship);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correclty when whoNeedsCare equals "PARENT"', () => {
    const { renderFn } = preRenderPage({ appState: initialAppState });
    renderFn(Relationship);
    expect(
      screen.getByText(/What is your relationship to the person needing care?/)
    ).toBeInTheDocument();
  });

  it('should go to the password page for the enrollment flow', () => {
    const { renderFn, routerMock } = preRenderPage({ appState: initialAppState });
    renderFn(Relationship);
    expect(
      screen.getByText(/What is your relationship to the person needing care?/)
    ).toBeInTheDocument();
    const clickableOption = screen.getByText('Child');
    fireEvent.click(clickableOption);
    expect(routerMock.push).toHaveBeenCalledWith(
      SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_PASSWORD
    );
  });

  it('should go to the recap page for the nth day flow', () => {
    const appState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
      },
    };
    const { renderFn, routerMock } = preRenderPage({ appState });
    renderFn(Relationship);
    expect(
      screen.getByText(/What is your relationship to the person needing care?/)
    ).toBeInTheDocument();
    const clickableOption = screen.getByText('Child');
    fireEvent.click(clickableOption);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
