import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import useZipLocation from '../useZipLocation';
import { GET_ZIP_CODE_SUMMARY } from '../../../request/GQL';

enum MountType {
  initialLoadSuccess,
  success,
  error,
  topLevelError,
}

type MountHook = {
  type: MountType;
  initialLoadLocationInfoEnabled?: boolean;
  validateOnLostFocusOrClick?: boolean;
  populateZipOnPageEnter?: boolean;
};

const validZipcode = '91911';
const invalidZipcode = '00000';
const errorText = 'Enter a valid ZIP code (e.g. "02453")';
const GQLcallError =
  'Sorry, we experienced an issue on our end. Please try again, then click Next.';

function mountView({
  type,
  validateOnLostFocusOrClick = false,
  populateZipOnPageEnter = false,
}: MountHook) {
  const mocks: MockedResponse[] = [];

  if (type === MountType.success) {
    mocks.push({
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
            city: 'Chula Vista',
            state: 'CA',
            zipcode: validZipcode,
            latitude: 3,
            longitude: 3,
          },
        },
      },
    });
  } else if (type === MountType.error) {
    mocks.push({
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
    });
  } else if (type === MountType.topLevelError) {
    mocks.push({
      request: {
        query: GET_ZIP_CODE_SUMMARY,
        variables: {
          zipcode: invalidZipcode,
        },
      },
      error: new Error('An error occurred'),
      result: {
        data: null,
      },
    });
  } else if (type === MountType.initialLoadSuccess) {
    mocks.push({
      request: {
        query: GET_ZIP_CODE_SUMMARY,
      },
      result: {
        data: {
          getZipcodeSummary: {
            __typename: 'ZipcodeSummary',
            city: 'Austin',
            state: 'TX',
            zipcode: validZipcode,
            latitude: 3,
            longitude: 3,
          },
        },
      },
    });
    mocks.push({
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
            city: 'Chula Vista',
            state: 'CA',
            zipcode: validZipcode,
            latitude: 3,
            longitude: 3,
          },
        },
      },
    });
  }

  return renderHook(
    () =>
      useZipLocation({
        initialZipcode: '',
        validateOnLostFocusOrClick,
        populateZipOnPageEnter,
      }),
    {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename>
          {children}
        </MockedProvider>
      ),
    }
  );
}

describe('useZipLocation', () => {
  it('should initially load location when populateZipOnPageEnter is true', async () => {
    const view = mountView({
      type: MountType.initialLoadSuccess,
      populateZipOnPageEnter: true,
    });

    expect(view.result.current.zipComponentState.zipcode).toBe('');

    await view.waitFor(() => view.result.current.zipComponentState.zipcode === validZipcode);

    expect(view.result.current.zipComponentState.zipcode).toBe(validZipcode);
  });

  it('should updated zipcode when calling setZipcode', () => {
    const view = mountView({
      type: MountType.success,
    });

    act(() => {
      view.result.current.setZipcodeHook('91');
    });

    expect(view.result.current.zipComponentState.zipcode).toEqual('91');
  });

  it('should eventually set city and state when calling setZipcode with valid zipcode', async () => {
    const view = mountView({
      type: MountType.success,
    });

    act(() => {
      view.result.current.setZipcodeHook(validZipcode);
    });
    await view.waitForValueToChange(() => {
      return view.result.current.zipComponentState.city;
    });

    expect(view.result.current.zipComponentState.city).toEqual('Chula Vista');
    expect(view.result.current.zipComponentState.state).toEqual('CA');
  });

  it('should set an error with helper text when zipcode is not valid', async () => {
    const view = mountView({
      type: MountType.success,
    });

    act(() => {
      view.result.current.setZipcodeHook('91');
    });
    act(() => {
      view.result.current.validateZipCode(true);
    });

    expect(view.result.current.zipComponentState.error).toEqual(true);
    expect(view.result.current.zipComponentState.helperText).toEqual(errorText);
  });

  it('should set an error when graphql query returns error result', async () => {
    const view = mountView({
      type: MountType.error,
    });

    act(() => {
      view.result.current.setZipcodeHook(invalidZipcode);
    });
    await view.waitFor(() => view.result.current.zipComponentState.helperText === errorText);

    expect(view.result.current.zipComponentState.error).toEqual(true);
    expect(view.result.current.zipComponentState.helperText).toEqual(errorText);
  });

  it('should clear results and show error when graphql query returns top level error and zip code is not populated on page enter', async () => {
    const view = mountView({
      type: MountType.topLevelError,
      populateZipOnPageEnter: false,
      validateOnLostFocusOrClick: true,
    });

    act(() => {
      view.result.current.setZipcodeHook(invalidZipcode);
    });
    await view.waitFor(() => view.result.current.zipComponentState.helperText === GQLcallError);

    expect(view.result.current.zipComponentState.error).toEqual(true);
    expect(view.result.current.zipComponentState.helperText).toEqual(GQLcallError);
    expect(view.result.current.zipComponentState.city).toEqual('');
    expect(view.result.current.zipComponentState.state).toEqual('');
  });
});
