import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import AuthError from '@/pages/auth-error';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import logger from '@/lib/clientLogger';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const windowHistoryBackMock = jest.fn();
const loggerInfoMock = jest.fn();

describe('auth-error page', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;

  const renderComponent = (initialState: AppState) => {
    const view = render(
      <AppStateProvider initialStateOverride={initialState}>
        <AuthError />
      </AppStateProvider>
    );
    ({ asFragment } = view);
  };

  beforeAll(() => {
    // @ts-ignore
    delete window.history;
    // @ts-ignore
    window.history = {
      back: windowHistoryBackMock,
    };
    logger.info = loggerInfoMock;
  });

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/auth-error',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    asFragment = null;
    loggerInfoMock.mockReset();
  });

  it('matches snapshot', () => {
    renderComponent(initialAppState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    renderComponent(initialAppState);
    expect(screen.getByText(/It looks like you're already logged in./i)).toBeInTheDocument();
  });

  it('logout and continue', () => {
    renderComponent(initialAppState);
    const logoutButton = screen.getByText(/Logout and continue/i);
    fireEvent.click(logoutButton);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'logOutClick',
      page: 'authError',
    });
  });

  it('should go to back', () => {
    renderComponent(initialAppState);
    const goBackButton = screen.getByText(/Go back/i);
    fireEvent.click(goBackButton);
    expect(windowHistoryBackMock).toHaveBeenCalled();
  });
});
