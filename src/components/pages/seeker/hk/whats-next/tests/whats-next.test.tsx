import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import { useMediaQuery } from '@material-ui/core';
import { setupWindowLocation } from '@/__setup__/testUtil';
import userEvent from '@testing-library/user-event';
import WhatsNext from '../whats-next';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');
  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn(),
  };
});

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

function renderPage() {
  const pathname = '/seeker/hk/whats-next';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  (useMediaQuery as jest.Mock).mockReturnValue(true);
  return render(<WhatsNext />);
}

describe('WhatsNext page', () => {
  let windowLocation: ReturnType<typeof setupWindowLocation>;

  beforeAll(() => {
    windowLocation = setupWindowLocation();
  });
  afterAll(() => {
    windowLocation.cleanUp();
  });

  beforeEach(() => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    windowLocation.mock.mockClear();
  });

  it('renders correctly', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('onLetsGoClick redirects to upgrade membership plan page', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderPage();
    userEvent.click(screen.getByText(`Let's go`));
    expect(windowLocation.mock).toHaveBeenLastCalledWith('CZEN_GENERAL/dwb/upgrade/viewPage');
  });
});
