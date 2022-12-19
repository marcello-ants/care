import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/router';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { AppStateProvider } from '@/components/AppState';
import AccountCreationNameFormDC from '../dc-name';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
  pathname: '',
};

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '12123',
  },
};

function renderPage() {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={initialState}>
      <MockedProvider mocks={[]} addTypename={false}>
        <AccountCreationNameFormDC />
      </MockedProvider>
    </AppStateProvider>
  );
}

describe('Day Care Account Creation - Split account AccountCreationNameFormDC', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show errors with empty fields', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Join and view matches' });
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
    await waitFor(() => {
      const lastNameError = screen.getByText('Last name is required');
      expect(lastNameError).toBeInTheDocument();
    });
  });
});
