import { render, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';
import { ServiceType } from '@/__generated__/globalTypes';
import { initialAppState } from '@/state';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { GET_JOB_WAGES } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import PayForCare from '../pay-for-care';

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
  },
}));

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/FeatureFlagsContext', () => ({
  useFeatureFlags: jest.fn().mockReturnValue({ flags: {} }),
}));

const initialStateClone = cloneDeep(initialAppState);
const initialStateOverrideWithZip = {
  ...initialStateClone,
  seeker: {
    ...initialStateClone.seeker,
    zipcode: '10004',
  },
};

const wageMock = {
  request: {
    query: GET_JOB_WAGES,
    variables: {
      zipcode: '10004',
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
            amount: '17',
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
const wageMockError = {
  request: {
    query: GET_JOB_WAGES,
    variables: {
      zipcode: '10004',
      serviceType: ServiceType.CHILD_CARE,
    },
  },
  error: new Error('aw shucks'),
};
let mockRouter = null;

async function renderResultAndWaitFinished(mocks: any) {
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AppStateProvider initialStateOverride={initialStateOverrideWithZip}>
        <PayForCare />
      </AppStateProvider>
    </MockedProvider>,
    {}
  );
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  return view;
}

beforeEach(async () => {
  mockRouter = {
    push: jest.fn(),
    pathname: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

afterEach(() => {
  mockRouter = null;
});

describe('Pay for Care page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await renderResultAndWaitFinished([wageMock]);

    expect(asFragment()).toMatchSnapshot();
  });
  it('updates the slider value the from GQL call', async () => {
    await renderResultAndWaitFinished([wageMock]);

    const avgText = await screen.findByText('$20.00 is the average in your area');

    expect(avgText).toBeInTheDocument();
  });
  it('uses the slider defaults the  GQL call error out', async () => {
    await renderResultAndWaitFinished([wageMockError]);

    const avgRange = screen.getByText('$18.00 is the average in your area');

    expect(avgRange).not.toBeUndefined();
  });
  it('routes to the recap page after button click', async () => {
    await renderResultAndWaitFinished([wageMock]);

    screen.getByRole('button', { name: 'Next' }).click();

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Member Enrolled',
      data: {
        job_flow: 'MW VHP enrollment',
        final_step: false,
        enrollment_step: 'Booking Max Rate',
        booking_rate: 24,
        cta_clicked: 'next',
      },
    });
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.RECAP);
  });
});
