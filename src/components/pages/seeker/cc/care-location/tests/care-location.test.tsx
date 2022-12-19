import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { screen, render, waitFor } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { ServiceIdsForMember } from '@/types/seekerCC';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { initialAppState } from '@/state';
import { GET_ZIP_CODE_SUMMARY } from '@/components/request/GQL';
import CareLocation from '@/pages/seeker/cc/care-location';
import { AppState } from '@/types/app';
import { CLIENT_FEATURE_FLAGS } from '@/constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname' | 'query'>;

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const validZipcode = '91911';
const invalidZipcode = '00000';
const city = 'Chula Vista';
const state = 'CA';
const latitude = 3;
const longitude = 3;
const errorText = 'Enter a valid ZIP code (e.g. "02453")';
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: validZipcode,
  },
};

appState.flow.flowName = 'SEEKER_CHILD_CARE';

function renderView(
  withSuccess: boolean,
  ldFlags: FeatureFlags = {},
  customAppState: AppState = appState
) {
  const pathname = '/seeker/cc/care-location';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    query: {
      sendLeadEnabled: 'false',
    },
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  const mocks: MockedResponse[] = [];
  if (withSuccess) {
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
            city,
            state,
            zipcode: validZipcode,
            latitude,
            longitude,
          },
        },
      },
    });
  } else {
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
  }
  return render(
    <MockedProvider mocks={mocks} addTypename>
      <FeatureFlagsProvider flags={ldFlags}>
        <AppStateProvider initialStateOverride={customAppState}>
          <CareLocation />
        </AppStateProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
}
describe('/care-location', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderView(true);
    const nextButton = screen.getByRole('button', { name: 'Next' });

    await waitFor(() => expect(nextButton).toBeEnabled());
    expect(asFragment).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    renderView(true);
    expect(await screen.findByText('Where do you need care?')).toBeInTheDocument();
    expect(await screen.findByLabelText('ZIP code')).toBeInTheDocument();
    expect(await screen.findByText('Next')).toBeInTheDocument();
  });
  it('routes to next view when clicking next button', async () => {
    const customAppState: AppState = {
      ...clonedAppState,
      seeker: {
        ...clonedAppState.seeker,
        zipcode: validZipcode,
        city,
        state,
      },
      seekerCC: {
        ...clonedAppState.seekerCC,
        czenServiceIdForMember: ServiceIdsForMember.dayCare,
      },
    };
    renderView(true, undefined, customAppState);
    const nextButton = await screen.findByRole('button', { name: 'Next' });

    nextButton.click();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderView(true, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText(/Hi there, let's get started./)).toBeInTheDocument();
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderView(true, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 1,
        value: 1,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('Where do you need care?')).toBeInTheDocument();
  });
});
