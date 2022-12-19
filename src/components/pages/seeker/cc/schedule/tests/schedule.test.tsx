import React from 'react';
import { useRouter } from 'next/router';
import { render, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJSUtils from '@date-io/dayjs';

import { initialAppState } from '@/state';
import { AppStateProvider } from '@/components/AppState';
import { GET_CAREGIVERS_NEARBY, GET_JOB_WAGES } from '@/components/request/GQL';
import { ServiceType } from '@/__generated__/globalTypes';

import PostAJobSchedulePageCC from '../schedule';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let mockRouter: any | null = null;
const wageMock = {
  request: {
    query: GET_JOB_WAGES,
    variables: {
      zipcode: '02452',
      serviceType: ServiceType.CHILD_CARE,
    },
  },
  result: {
    data: {
      getJobWages: {
        averages: {
          average: {
            amount: '20',
          },
          minimum: {
            amount: '18',
          },
          maximum: {
            amount: '26',
          },
        },
        legalMinimum: {
          amount: '15',
        },
      },
    },
  },
};

const caregiversNearbyMock = {
  request: {
    query: GET_CAREGIVERS_NEARBY,
    variables: {
      zipcode: '02452',
      serviceType: ServiceType.CHILD_CARE,
      radius: 1,
      subServiceType: null,
    },
  },
  result: {
    data: {
      getCaregiversNearby: 60,
    },
  },
};

const initialStateOverrideWithZip = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '02452',
  },
  seekerCC: {
    ...initialAppState.seekerCC,
  },
};
const mocksList = [wageMock, caregiversNearbyMock];

async function renderPage(mocks: any) {
  mockRouter = {
    push: jest.fn(),
    asPath: '/seeker/cc/schedule',
    pathname: '/seeker/cc/schedule',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider initialStateOverride={initialStateOverrideWithZip}>
          <PostAJobSchedulePageCC />
        </AppStateProvider>
      </MuiPickersUtilsProvider>
    </MockedProvider>
  );
}

describe('PostAJobSchedulePageCC', () => {
  it('renders correctly', async () => {
    await renderPage(mocksList);

    await screen.findByText('When do you need care?');
    await screen.findByText('$18 - 26');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());
  });
});
