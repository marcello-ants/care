import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { SEEKER_TUTORING_ROUTES } from '@/constants';
import WhichSubjects from '../which-subjects';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('Which subjects page', () => {
  let mockRouter: any | null = null;

  const setup = () => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/tu/which-subjects',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    return render(
      <AppStateProvider>
        <WhichSubjects />
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

  it('should show error', async () => {
    setup();
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    const error = screen.queryByText('Please select the type of service needed');
    expect(error).toBeInTheDocument();
  });

  it('should redirect to location page', async () => {
    setup();
    const button = await screen.findByRole('button');
    const error = screen.queryByText('Please select the type of service needed');
    const pillCheckBox = screen.getByDisplayValue('SPECIAL_EDUCATION');
    const pill =
      screen.getByText('Special Education').nextElementSibling ||
      screen.getByText('Special Education');
    expect(pill).not.toBeNull();
    expect(pillCheckBox).not.toBeChecked();
    fireEvent.click(pill);
    fireEvent.change(pill);
    await waitFor(() => {
      expect(pillCheckBox).toBeChecked();
    });
    fireEvent.click(button);
    expect(error).not.toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_TUTORING_ROUTES.LOCATION);
  });
});
