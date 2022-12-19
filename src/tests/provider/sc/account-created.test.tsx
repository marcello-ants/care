import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import AccountCreatedPage from '../../../pages/provider/sc/account-created';
import { PROVIDER_ROUTES } from '../../../constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter = null;

beforeEach(() => {
  mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
    pathname: '/provider/sc/account-created',
    asPath: '/provider/sc/account-created',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

describe('Sc Provider Account Created', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<AccountCreatedPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('routes to the experience level page after next button click', () => {
    render(<AccountCreatedPage />);
    screen.getByRole('button', { name: 'Next' }).click();
    expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.TYPE_SPECIFIC);
  });
});
