import React from 'react';
import { useRouter } from 'next/router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { cloneDeep } from 'lodash-es';
import DayJSUtils from '@date-io/dayjs';
import { MockedProvider } from '@apollo/client/testing';
import Availability from '@/pages/provider/cc/availability';
import { AppStateProvider } from '@/components/AppState';
import { PROVIDER_AVAILABILITY_UPDATE } from '@/components/request/GQL';
import { initialAppState } from '@/state';
import { generateProviderAvailabilityUpdateInput } from '@/utilities/gqlPayloadHelper';
import { ProviderAvailabilityUpdateInput, ServiceType } from '@/__generated__/globalTypes';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

const initialState = {
  ...initialStateClone,
  providerCC: {
    ...initialStateClone.providerCC,
    recurring: {
      ...initialStateClone.providerCC.recurring,
      // use a date far into the future to avoid having to update snapshots for awhile
      start: '12-31-2100',
    },
  },
};

const successMock = {
  request: {
    query: PROVIDER_AVAILABILITY_UPDATE,
    variables: {
      input: {
        ...generateProviderAvailabilityUpdateInput(initialState.providerCC),
        schedule: {
          sunday: {
            blocks: [{ start: '06:00', end: '12:00' }],
          },
        },
        serviceType: ServiceType.CHILD_CARE,
      } as ProviderAvailabilityUpdateInput,
    },
  },
  result: {
    data: {
      providerAvailabilityUpdate: {
        __typename: 'ProviderAvailabilityUpdateSuccess',
      },
    },
  },
};

const errorMock = {
  request: {
    query: PROVIDER_AVAILABILITY_UPDATE,
    variables: {
      input: {
        ...generateProviderAvailabilityUpdateInput(initialState.providerCC),
        schedule: {
          monday: {
            blocks: [{ start: '06:00', end: '12:00' }],
          },
        },
        serviceType: ServiceType.CHILD_CARE,
      } as ProviderAvailabilityUpdateInput,
    },
  },
  error: new Error('An error occurred'),
};

let mockRouter: any | null = null;

const featureFlagsMock = {
  [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
    value: false,
    reason: {
      kind: 'FALLTHROUGH',
    },
  },
};

function renderPage() {
  return render(
    <MockedProvider mocks={[errorMock, successMock]} addTypename={false}>
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider initialStateOverride={initialState}>
          <FeatureFlagsProvider flags={featureFlagsMock}>
            <Availability />
          </FeatureFlagsProvider>
        </AppStateProvider>
      </MuiPickersUtilsProvider>
    </MockedProvider>
  );
}

beforeEach(() => {
  mockRouter = {
    push: jest.fn(),
    pathname: '',
    asPath: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

afterEach(() => {
  // cleanup on exiting
  mockRouter = null;
});

describe('Availability Page', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should navigate to the profile page after successfully saving the selections', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Sun'));
    fireEvent.click(screen.getByText('Mornings'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PROFILE)
    );
  });

  it('should render sliders for choosen dates', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Sun'));
    fireEvent.click(screen.getByText('Add specific times instead'));
    expect(await screen.findByTestId('accordion')).toBeInTheDocument();
  });
});
