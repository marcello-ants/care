import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';
import { GET_JOB_WAGES, SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { PROVIDER_ROUTES } from '@/constants';
import { SeniorCareProviderAttributesUpdateInput } from '@/__generated__/globalTypes';
import { seniorCareProviderAttributesUpdate } from '@/__generated__/seniorCareProviderAttributesUpdate';
import PayRange from '../pay-range';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);
const initialStateOverrideWithZip = {
  ...initialStateClone,
  provider: {
    ...initialStateClone.provider,
    zipcode: '10004',
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

const updateMock: MockedResponse<seniorCareProviderAttributesUpdate> = {
  request: {
    query: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
    variables: {
      input: {
        jobRate: {
          minimum: {
            amount: '17',
            currencyCode: 'USD',
          },
          maximum: {
            amount: '26',
            currencyCode: 'USD',
          },
        },
      } as SeniorCareProviderAttributesUpdateInput,
    },
  },
  result: {
    data: {
      seniorCareProviderAttributesUpdate: {
        __typename: 'SeniorCareProviderAttributesUpdateSuccess',
        dummy: 'hi',
      },
    },
  },
};

const updateErrorMock: MockedResponse<seniorCareProviderAttributesUpdate> = {
  request: {
    query: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
    variables: {
      input: {
        jobRate: {
          minimum: {
            amount: '17',
            currencyCode: 'USD',
          },
          maximum: {
            amount: '26',
            currencyCode: 'USD',
          },
        },
      } as SeniorCareProviderAttributesUpdateInput,
    },
  },
  error: new Error('An error occurred'),
};

let mockRouter = null;

async function renderResultAndWaitFinished(mocks: any) {
  const view = render(
    <MockedProvider mocks={mocks}>
      <AppStateProvider initialStateOverride={initialStateOverrideWithZip}>
        <PayRange />
      </AppStateProvider>
    </MockedProvider>,
    {}
  );
  await screen.findByRole('button', { name: 'Next' });

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

describe('Pay Range page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await renderResultAndWaitFinished([wageMock]);

    expect(asFragment()).toMatchSnapshot();
  });
  it('updates the slider value the from GQL call', async () => {
    await renderResultAndWaitFinished([wageMock]);

    const avgRange = screen.getByText('$17 - 26');
    expect(avgRange).not.toBeUndefined();
  });
  it('uses the slider defaults the GQL call error out', async () => {
    await renderResultAndWaitFinished([wageMockError]);

    // default wages
    const avgRange = screen.getByText('$14 - 22');
    expect(avgRange).not.toBeUndefined();
  });

  it('updates the slider value when moved', async () => {
    await renderResultAndWaitFinished([wageMock]);

    const minSlider = screen.queryAllByRole('slider')[0];
    fireEvent.keyDown(minSlider, { key: 'ArrowRight' });
    expect(screen.getByText('$18 - 26')).toBeVisible();
  });

  it('should navigate to the job-type page after successfully saving the selections', async () => {
    await renderResultAndWaitFinished([wageMock, updateMock]);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.JOB_TYPE));
  });

  it('should display a message when an error is thrown', async () => {
    await renderResultAndWaitFinished([wageMock, updateErrorMock]);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(screen.getByText(/We weren't able to save your pay range/)).toBeVisible()
    );
  });

  it('should navigate to the job-type page after acknowledging the error message', async () => {
    await renderResultAndWaitFinished([wageMock, updateErrorMock]);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText(/We weren't able to save your pay range/);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.JOB_TYPE));
  });
});
