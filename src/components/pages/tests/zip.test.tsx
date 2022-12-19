import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, waitFor, act, screen, RenderResult } from '@testing-library/react';
import { useRouter } from 'next/router';

import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { GET_ZIP_CODE_SUMMARY } from '@/components/request/GQL';
import { PROVIDER_ROUTES } from '@/constants';
import ZipPage from '@/pages/provider/sc';

const testZipCode = '90001';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('ZipPage', () => {
  let renderResult: RenderResult;
  let mockRouter: any | null = null;

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/sc/zip',
      query: {},
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: testZipCode,
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'ZipcodeSummary',
              city: 'Los Angeles',
              state: 'CA',
              zipcode: testZipCode,
              latitude: 3,
              longitude: 3,
            },
          },
        },
      },
    ];

    renderResult = render(
      <AppStateProvider initialStateOverride={initialAppState}>
        <MockedProvider mocks={mocks} addTypename>
          <ZipPage />
        </MockedProvider>
      </AppStateProvider>
    );

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', () => {
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    expect(screen.getByText('Where are you located?')).toBeInTheDocument();
  });

  it('should enable next button if zip code is correct', async () => {
    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await waitFor(() => expect(nextButton).toBeDisabled());

    fireEvent.change(textField, { target: { value: testZipCode } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => expect(nextButton).toBeEnabled());
  });

  it('should show invalid zip code text if zip code is not valid', () => {
    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    fireEvent.change(textField, { target: { value: '900' } });
    expect(nextButton).toBeDisabled();
  });

  it('routes to the /provider/sc/account-creation page after selection and button click', async () => {
    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: testZipCode } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => expect(nextButton).toBeEnabled());

    nextButton.click();

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.ACCOUNT_CREATION)
    );
  });
});

describe('Zip - gql', () => {
  let mockRouter: any | null = null;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/sc/zip',
      query: {},
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('should get the location of the zipCode', async () => {
    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: testZipCode,
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'ZipcodeSummary',
              city: 'Los Angeles',
              state: 'CA',
              zipcode: testZipCode,
              latitude: 3,
              longitude: 3,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename>
        <AppStateProvider initialStateOverride={initialAppState}>
          <ZipPage />
        </AppStateProvider>
      </MockedProvider>,
      {}
    );

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: testZipCode } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    await waitFor(() => expect(nextButton).toBeEnabled());

    await screen.findByText('Los Angeles, CA');
  });

  it('should get the error text if invalid zipcode', async () => {
    const errorText = 'Enter a valid ZIP code (e.g. "02453")';
    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: '00000',
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'InvalidZipcodeError',
              message: errorText,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename>
        <AppStateProvider initialStateOverride={initialAppState}>
          <ZipPage />
        </AppStateProvider>
      </MockedProvider>,
      {}
    );

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: '00000' } });

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    await waitFor(() => expect(nextButton).toBeDisabled());
    await screen.findByText(errorText);
  });

  it('should still enable next button when czen is down, and zip query doesnt return', async () => {
    const mocks = [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: '00000',
          },
        },
        result: {
          data: {
            getZipcodeSummaryByZip: {
              __typename: 'ZipcodeSummary',
              city: 'Los Angeles',
              state: 'CA',
              zipcode: testZipCode,
              latitude: 3,
              longitude: 3,
            },
          },
        },
      },
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: '78703',
          },
        },
        error: new Error('Unexpected Error Occurred - czen was down'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AppStateProvider initialStateOverride={initialAppState}>
          <ZipPage />
        </AppStateProvider>
      </MockedProvider>,
      {}
    );

    const textField = screen.getByLabelText('ZIP code');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(textField, { target: { value: '78703' } });

    await waitFor(() => expect(nextButton).toBeEnabled());

    fireEvent.click(nextButton);
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.ACCOUNT_CREATION)
    );
  });
});
