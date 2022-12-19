import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import AuthService from '@/lib/AuthService';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import useProviderCount from '@/components/hooks/useProviderCount';
import { FLOWS } from '@/constants';

import { ServiceType } from '@/__generated__/globalTypes';
import AccountCreationEmailForm from '../email';

let mockRouter: NextRouter;
let textboxEmail: HTMLElement;
let buttonNext: HTMLElement;

const TEST_DATA_ZIP_CODE = '02452';
const TEST_DATA_EMAIL = 'email@test.com';
const INVALID_TEST_DATA_EMAIL = 'email';

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
      flowName: FLOWS.SEEKER_HOUSEKEEPING.name,
    },
    seeker: {
      ...initialAppState.seeker,
      zipcode: TEST_DATA_ZIP_CODE,
    },
  };
  const pathname = '/seeker/hk/account-creation';
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
          <AccountCreationEmailForm serviceType={ServiceType.HOUSEKEEPING} />
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
  textboxEmail = screen.getByRole('textbox', { name: 'Email address' });
  buttonNext = screen.getByRole('button', { name: 'Next' });

  return view;
}

describe('Housekeeping - email account creation form', () => {
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

  it('renders correctly', () => {
    renderPage();
    expect(textboxEmail).toBeInTheDocument();
    expect(buttonNext).toBeInTheDocument();
  });

  it('renders housekeepers nearby banner', () => {
    renderPage();

    expect(screen.queryByTestId('housekeepers-nearby')).toHaveTextContent(
      'Nice! 100 housekeepers near you!'
    );
  });

  it("doesn't render housekeepers nearby banner if there are no housekeepers around", () => {
    (useProviderCount as jest.Mock).mockReturnValue(mockNoProviderCount);

    renderPage();

    expect(screen.queryByTestId('housekeepers-nearby')).not.toBeInTheDocument();
  });

  it('shows validation errors', async () => {
    renderPage();

    userEvent.click(buttonNext);
    expect(await screen.findByText(/Email is required/)).toBeInTheDocument();
  });
  it('invalid email error', async () => {
    renderPage();

    userEvent.type(textboxEmail, INVALID_TEST_DATA_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(textboxEmail).not.toBeValid();
    });

    userEvent.click(buttonNext);
    expect(await screen.findByText(/Please enter a valid email./)).toBeInTheDocument();
  });
  it('email successfully validated', async () => {
    renderPage();

    userEvent.type(textboxEmail, TEST_DATA_EMAIL);
    fireEvent.blur(textboxEmail);
    await waitFor(() => {
      expect(textboxEmail).toBeValid();
    });

    userEvent.click(buttonNext);
    expect(screen.queryByText(/Please enter a valid email./)).not.toBeInTheDocument();
  });
});
