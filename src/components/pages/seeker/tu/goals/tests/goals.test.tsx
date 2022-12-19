import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { render, screen } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import AuthService from '@/lib/AuthService';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import useProviderCount from '@/components/hooks/useProviderCount';
import { FLOWS } from '@/constants';

import { Goals, GoalsLabels } from '@/types/seekerTU';
import GoalsPage from '../goals';

let mockRouter: NextRouter;
let buttonNext: HTMLElement;

const TEST_DATA_ZIP_CODE = '02452';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;
jest.mock('@/lib/AuthService');
jest.mock('@/components/hooks/useProviderCount');
const AuthServiceMock = AuthService as jest.Mock;
const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

function renderPage(mocks: MockedResponse[] = []) {
  const initialState: AppState = {
    ...initialAppState,
    flow: {
      ...initialAppState.flow,
      flowName: FLOWS.SEEKER_TUTORING.name,
    },
    seeker: {
      ...initialAppState.seeker,
      zipcode: TEST_DATA_ZIP_CODE,
    },
  };
  const pathname = '/seeker/tu/goals';
  // @ts-ignore
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    basePath: '',
  };

  const view = render(
    <RouterContext.Provider value={mockRouter}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <AppStateProvider initialStateOverride={initialState}>
          <GoalsPage />
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
  buttonNext = screen.getByRole('button', { name: 'Next' });

  return view;
}

describe('What are your tutoring goals page', () => {
  const mockProviderCount = {
    displayProviderMessage: true,
    numOfProviders: 100,
  };
  const mockNoProviderCount = {
    displayProviderMessage: false,
    numOfProviders: 0,
  };

  (useProviderCount as jest.Mock).mockReturnValue(mockProviderCount);

  it('matches snapshots', () => {
    const { asFragment } = renderPage();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders tutors found banner', () => {
    renderPage();

    expect(screen.queryByTestId('tutors-nearby')).toHaveTextContent(
      'Nice! 100 tutors are good matches'
    );
  });

  it("doesn't render banner if there are no tutors found", () => {
    (useProviderCount as jest.Mock).mockReturnValue(mockNoProviderCount);

    renderPage();

    expect(screen.queryByTestId('tutors-nearby')).not.toBeInTheDocument();
  });

  it('dispatch a `setGoals` action on checkbox click', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
    renderPage();
    const walkingCheckbox = screen.getByText(GoalsLabels.HOMEWORK_HELP);
    walkingCheckbox.click();
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setGoals',
      goals: [Goals.HOMEWORK_HELP],
    });
  });

  it('routes to next page when clicking a button', async () => {
    renderPage();
    buttonNext.click();
    expect(mockRouter.push).toHaveBeenCalled();
  });
});
