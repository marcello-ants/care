import { screen, fireEvent, waitFor } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { WhenLookingToMoveIntoCommunity } from '@/types/seeker';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { useAppDispatch } from '@/components/AppState';

import Urgency from '../urgency';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

describe('Urgency component', () => {
  it('Match snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(Urgency);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Render title for Parent', () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(Urgency);

    expect(
      screen.getByText('How soon would your parent be looking to move into a community?')
    ).toBeInTheDocument();
  });

  it('Render title for Spouse', () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: SeniorCareRecipientRelationshipType.SPOUSE,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(Urgency);

    expect(
      screen.getByText('How soon would your spouse be looking to move into a community?')
    ).toBeInTheDocument();
  });

  it('Render title for Myself', () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: SeniorCareRecipientRelationshipType.SELF,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(Urgency);

    expect(
      screen.getByText('How soon would you be looking to move into a community?')
    ).toBeInTheDocument();
  });

  it('Render title for Other', () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: SeniorCareRecipientRelationshipType.OTHER,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(Urgency);

    expect(
      screen.getByText('How soon would your loved one be looking to move into a community?')
    ).toBeInTheDocument();
  });

  it('Select an option and router called', async () => {
    const mockAppDispatch: ReturnType<typeof useAppDispatch> = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    const { renderFn, routerMock } = preRenderPage();
    renderFn(Urgency);

    fireEvent.click(screen.getByText('Within the next 30 days'));
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenLastCalledWith(SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE);
    await waitFor(() => {
      expect(mockAppDispatch).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setWhenLookingToMove',
        whenLookingToMove: WhenLookingToMoveIntoCommunity.IMMEDIATELY,
      });
    });
  });
});
