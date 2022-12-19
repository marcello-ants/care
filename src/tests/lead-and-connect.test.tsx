import { render, waitFor, screen } from '@testing-library/react';
import LeadAndConnect from '@/pages/lead-and-connect';
import { useRouter } from 'next/router';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { AppStateProvider } from '@/components/AppState';
import { MockedResponse } from '@apollo/client/utilities/testing/mocking/mockLink';
import { initialAppState } from '@/state';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      BASE_PATH: 'BASE_PATH',
    },
  };
});

const gqlMocks: MockedResponse[] = [];

describe('Lead and Connect', () => {
  let mockRouter: any;

  const setup = () => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/app/enrollment',
      query: { ffov: '' },
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    return render(
      <MockedProvider mocks={gqlMocks}>
        <AppStateProvider initialStateOverride={initialAppState}>
          <LeadAndConnect />
        </AppStateProvider>
      </MockedProvider>
    );
  };

  it('should render snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
  it('routes to L+C after clicking button', async () => {
    setup();

    const launchButton = screen.getByText('Launch L+C');
    launchButton.click();
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringMatching(/\/seeker\/sc\/lc\/caregiver-profile/)
      )
    );
  });
});
