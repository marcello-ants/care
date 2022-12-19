import React from 'react';
import { useRouter } from 'next/router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { cloneDeep } from 'lodash-es';
import DayJSUtils from '@date-io/dayjs';
import { MockedProvider } from '@apollo/client/testing';
import Availability from '@/pages/provider/sc/availability';
import { AppStateProvider } from '@/components/AppState';
import { SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE } from '@/components/request/GQL';
import { initialAppState } from '@/state';
import { generateProviderAvailabilityUpdateInput } from '@/utilities/gqlPayloadHelper';
import { SeniorCareProviderAvailabilityUpdateInput } from '@/__generated__/globalTypes';
import { PROVIDER_ROUTES } from '@/constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

const initialState = {
  ...initialStateClone,
  provider: {
    ...initialStateClone.provider,
    recurring: {
      ...initialStateClone.provider.recurring,
      // use a date far into the future to avoid having to update snapshots for awhile
      start: '12-31-2100',
    },
  },
};

const successMock = {
  request: {
    query: SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE,
    variables: {
      input: {
        ...generateProviderAvailabilityUpdateInput(initialState.provider),
        schedule: {
          sunday: {
            blocks: [{ start: '06:00', end: '12:00' }],
          },
        },
      } as SeniorCareProviderAvailabilityUpdateInput,
    },
  },
  result: {
    data: {
      seniorCareProviderAvailabilityUpdate: {
        __typename: 'SeniorCareProviderAvailabilityUpdateSuccess',
      },
    },
  },
};

const errorMock = {
  request: {
    query: SENIOR_CARE_PROVIDER_AVAILABILITY_UPDATE,
    variables: {
      input: {
        ...generateProviderAvailabilityUpdateInput(initialState.provider),
        schedule: {
          monday: {
            blocks: [{ start: '06:00', end: '12:00' }],
          },
        },
      } as SeniorCareProviderAvailabilityUpdateInput,
    },
  },
  error: new Error('An error occurred'),
};

let mockRouter: any | null = null;

function renderPage() {
  return render(
    <MockedProvider mocks={[errorMock, successMock]} addTypename={false}>
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider initialStateOverride={initialState}>
          <Availability />
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

describe('Availability component', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should navigate to the headline-bio page after successfully saving the selections', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Sun'));
    fireEvent.click(screen.getByText('Mornings'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.HEADLINE_BIO));
  });

  it('should display a message when an error is thrown', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Mon'));
    fireEvent.click(screen.getByText('Mornings'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(screen.getByText(/We weren't able to save your availability/)).toBeVisible()
    );
  });

  it('should  navigate to the headline-bio page after acknowledging the error message', async () => {
    renderPage();
    fireEvent.click(screen.getByText('Mon'));
    fireEvent.click(screen.getByText('Mornings'));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText(/We weren't able to save your availability/);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.HEADLINE_BIO));
  });
});
