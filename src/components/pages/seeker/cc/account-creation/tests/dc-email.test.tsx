import React from 'react';
import { useRouter } from 'next/router';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { SEEKER_SPLIT_ACCOUNT_DC } from '@/constants';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { cloneDeep } from 'lodash-es';
import SeekerEmailPhoneFormDC from '../dc-email';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: any | null = null;

const initialStateClone = cloneDeep(initialAppState);

function renderPage() {
  mockRouter = {
    push: jest.fn(),
    pathname: SEEKER_SPLIT_ACCOUNT_DC.EMAIL,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={initialStateClone}>
      <MockedProvider mocks={[]} addTypename={false}>
        <SeekerEmailPhoneFormDC />
      </MockedProvider>
    </AppStateProvider>
  );
}

describe('Day Care Account Creation - Split account SeekerEmailPhoneFormDC', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show errors with empty fields', async () => {
    renderPage();
    const nextButton = screen.getByRole('button');
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
    await waitFor(() => {
      const phoneError = screen.getByText('Phone number is required');
      expect(phoneError).toBeInTheDocument();
    });
  });

  it('shold redirect to next page', async () => {
    renderPage();
    const nextButton = screen.getByRole('button');
    const email = screen.getByRole('textbox', { name: 'Email address' });
    const phone = screen.getByRole('textbox', { name: 'Phone number' });

    userEvent.type(email, 'test@email.com');
    userEvent.type(phone, '5555555555');

    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_SPLIT_ACCOUNT_DC.NAME);
    });
  });
});
