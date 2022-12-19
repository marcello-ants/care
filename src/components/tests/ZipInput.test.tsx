import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { GET_ZIP_CODE_SUMMARY } from '@/components/request/GQL';
import ZipInput from '../ZipInput';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const validZipcode = '91911';
const invalidZipcode = '00000';
const partialZipcode = '99';
const city = 'Chula Vista';
const state = 'CA';
const latitude = 3;
const longitude = 3;
const errorText = 'Enter a valid ZIP code (e.g. "02453")';

const getMocks = (withSuccess: boolean) => {
  if (withSuccess) {
    return [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: validZipcode,
          },
        },
        result: {
          data: {
            getZipcodeSummary: {
              __typename: 'ZipcodeSummary',
              city,
              state,
              zipcode: validZipcode,
              latitude,
              longitude,
            },
          },
        },
      },
    ];
  }
  if (!withSuccess) {
    return [
      {
        request: {
          query: GET_ZIP_CODE_SUMMARY,
          variables: {
            zipcode: invalidZipcode,
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
  }

  return [];
};

function renderPage(
  withSuccess: boolean,
  validateOnLostFocusOrClick = false,
  validateOnClick = false
) {
  const mocks: MockedResponse[] = getMocks(withSuccess);
  const mockRouter = {
    query: {},
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <MockedProvider mocks={mocks} addTypename>
      <ZipInput
        location={{ zipcode: '', city: '', state: '' }}
        onChange={() => null}
        onError={() => null}
        validateOnLostFocusOrClick={validateOnLostFocusOrClick}
        validateOnClick={validateOnClick}
      />
    </MockedProvider>
  );
}

describe('ZipInput', () => {
  describe('Default ZipInput', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not update zipcode when longer than 5 digits', async () => {
      renderPage(true);
      const textField = screen.getByLabelText('ZIP code');

      fireEvent.change(textField, { target: { value: '123456' } });

      expect(textField).not.toHaveDisplayValue('123456');
    });
    it('should get the location of the zipCode', async () => {
      renderPage(true);
      const textField = screen.getByLabelText('ZIP code');

      fireEvent.change(textField, { target: { value: validZipcode } });

      expect(await screen.findByText('Chula Vista, CA')).toBeInTheDocument();
    });
    it('should get the error text if invalid zipcode', async () => {
      renderPage(false);
      const textField = screen.getByLabelText('ZIP code');

      fireEvent.change(textField, { target: { value: invalidZipcode } });

      const errorTexr = await screen.findByText(errorText);
      expect(errorTexr).toBeInTheDocument();
    });
  });

  describe('ZipInput validated on lost focus and button click', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get the error text if invalid zipcode on blur', async () => {
      renderPage(false, true, false);
      const textField = screen.getByLabelText('ZIP code');

      fireEvent.change(textField, { target: { value: partialZipcode } });
      fireEvent.blur(textField);

      const errorTexr = await screen.findByText(errorText);
      expect(errorTexr).toBeInTheDocument();
    });

    it('should get the error text if invalid zipcode on button click', async () => {
      const mocks = getMocks(false);

      const { rerender } = renderPage(false, true, false);
      const textField = screen.getByLabelText('ZIP code');

      fireEvent.change(textField, { target: { value: '' } });

      await waitFor(() => expect(screen.queryByText(errorText)).not.toBeInTheDocument());

      rerender(
        <MockedProvider mocks={mocks} addTypename>
          <ZipInput
            location={{ zipcode: '', city: '', state: '' }}
            onChange={() => null}
            onError={() => null}
            validateOnLostFocusOrClick
            validateOnClick
          />
        </MockedProvider>
      );

      const errorTexr = await screen.findByText(errorText);
      expect(errorTexr).toBeInTheDocument();
    });
  });
});
