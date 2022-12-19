import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { SEEKER_TUTORING_ROUTES } from '@/constants';
import VirtualOrInPerson from '../virtual-or-in-person';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

describe('Virtual Or In Person page', () => {
  let mockRouter: any | null = null;
  let mockAppDispatch: ReturnType<typeof useAppDispatch>;

  const setup = () => {
    mockAppDispatch = jest.fn();
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/tu/virtual-or-in-person',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    return render(
      <AppStateProvider>
        <VirtualOrInPerson />
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

  it('should set tutoringType to EITHER', async () => {
    setup();
    const pillCheckBox = screen.getByDisplayValue('EITHER');
    const pill = screen.getByText('Either').nextElementSibling || screen.getByText('Either');
    expect(pill).not.toBeNull();
    expect(pillCheckBox).not.toBeChecked();
    fireEvent.click(pill);
    fireEvent.change(pill);
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setTutoringType',
      tutoringType: 'EITHER',
    });
  });

  it('should route to the recap page when next is clicked', async () => {
    setup();
    const nextButton = await screen.findByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_TUTORING_ROUTES.RECAP));
  });
});
