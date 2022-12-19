import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import CareDate from '../care-date';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

describe('Tutoring Care Date page', () => {
  let mockRouter: any | null = null;
  let mockAppDispatch: ReturnType<typeof useAppDispatch>;

  const pathname = '/seeker/tu/care-date';

  const setup = () => {
    mockAppDispatch = jest.fn();
    mockRouter = {
      push: jest.fn(),
      pathname,
      asPath: pathname,
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    return render(
      <AppStateProvider>
        <CareDate />
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

  it('routes to next page when clicking next button', async () => {
    setup();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('should set careDate to IN_1_2_MONTHS', () => {
    setup();
    const pill = screen.getByText('In 1-2 months');
    fireEvent.click(pill);
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setTutoringDate',
      careDate: 'IN_1_2_MONTHS',
    });
  });
});
