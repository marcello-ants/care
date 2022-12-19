import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS, POST_A_JOB_ROUTES } from '../constants';
import Home from '../pages/pay-for-care';
import { GET_JOB_WAGES } from '../components/request/GQL';
import { AppStateProvider } from '../components/AppState';
import { initialAppState } from '../state';

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
    typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
    jobPost: {
      ...initialStateClone.seeker.jobPost,
      zip: '10004',
    },
  },
};

const wageMock = {
  request: {
    query: GET_JOB_WAGES,
    variables: {
      zipcode: '10004',
      serviceType: 'SENIOR_CARE',
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
      serviceType: 'SENIOR_CARE',
    },
  },
  error: new Error('aw shucks'),
};
let mockRouter = null;

async function renderResultAndWaitFinished(mocks: any) {
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AppStateProvider initialStateOverride={initialStateOverrideWithZip}>
        <Home />
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
    push: jest.fn(), // the component uses `router.push` only
    pathname: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

afterEach(() => {
  // cleanup on exiting
  mockRouter = null;
});

describe('Pay for Care page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await renderResultAndWaitFinished([wageMock]);

    expect(asFragment()).toMatchSnapshot();
  });
  it('updates the slider value the from GQL call', async () => {
    await renderResultAndWaitFinished([wageMock]);

    const avgRange = screen.getByText('$17 - 26');
    expect(avgRange).not.toBeUndefined();
  });
  it('uses the slider defaults the  GQL call error out', async () => {
    await renderResultAndWaitFinished([wageMockError]);

    // default wages
    const avgRange = screen.getByText('$14 - 22');
    expect(avgRange).not.toBeUndefined();
  });
  it('routes to the about-loved-one page after button click', async () => {
    await renderResultAndWaitFinished([wageMock]);
    screen.getByRole('button', { name: 'Next' }).click();

    expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.ABOUT_LOVED_ONE);
  });

  it('triggers both analytic events when feature flag is on', async () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'jobPostedHourlyRate');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');

    (useFeatureFlags as jest.Mock).mockReturnValue({
      flags: { [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: { variationIndex: 1 } },
    });

    await renderResultAndWaitFinished([wageMock]);
    screen.getByRole('button', { name: 'Next' }).click();

    expect(ampliListener).toBeCalledTimes(1);
    expect(amplitudeListener).toBeCalledTimes(1);
  });
});
