import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { SEEKER_TUTORING_ROUTES } from '@/constants';
import WhatLevel from '../what-level';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('What level page', () => {
  let mockRouter: any | null = null;
  const pathname = '/seeker/tu/what-level';

  const setup = () => {
    mockRouter = {
      push: jest.fn(),
      pathname,
      asPath: pathname,
      query: {},
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    return render(
      <AppStateProvider>
        <WhatLevel />
      </AppStateProvider>
    );
  };

  afterEach(() => {
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be selected MIDDLE_SCHOOL', async () => {
    setup();
    const pillCheckBox = screen.getByDisplayValue('MIDDLE_SCHOOL');
    const pill =
      screen.getByText('Middle school').nextElementSibling || screen.getByText('Middle school');
    expect(pill).not.toBeNull();
    expect(pillCheckBox).not.toBeChecked();
    fireEvent.click(pill);
    fireEvent.change(pill);
    await waitFor(() => {
      expect(pillCheckBox).toBeChecked();
    });
  });

  it('should route to the care date page when next is clicked', async () => {
    setup();
    const nextButton = await screen.findByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_TUTORING_ROUTES.CARE_DATE)
    );
  });
});
