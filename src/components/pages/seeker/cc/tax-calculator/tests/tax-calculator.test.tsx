import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { NextRouter, useRouter } from 'next/router';
import { GET_TAX_CALCULATOR_PRICING, GET_ZIP_CODE_SUMMARY } from '@/components/request/GQL';
import { AppStateProvider } from '../../../../../AppState';
import { initialAppState } from '../../../../../../state';
import { AppState } from '../../../../../../types/app';
import TaxCalculator from '../tax-calculator';

const testZipCode = '78746';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: '/',
    },
  };
});

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname' | 'query'>;

const zipRequest = {
  request: {
    query: GET_ZIP_CODE_SUMMARY,
    variables: {
      zipcode: testZipCode,
    },
  },
  result: {
    data: {
      getZipcodeSummary: {
        city: 'Austin',
        state: 'TX',
        zipcode: '78746',
        latitude: 30.2958,
        longitude: -97.8101,
        __typename: 'ZipcodeSummary',
      },
    },
  },
};

const userDataRequest = {
  request: {
    query: GET_TAX_CALCULATOR_PRICING,
    variables: {
      input: {
        zipcode: testZipCode,
        numberOfChildren: 1,
        weeklyHours: 40,
      },
    },
  },
  result: {
    data: {
      calculateChildCareTaxCreditSaving: {
        __typename: 'ChildCareTaxCreditSavingCalculationSuccess',
        options: [
          {
            originalTotal: {
              amount: '0',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            discountedTotal: {
              amount: '-40',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            savingPercentage: 2147483647,
            savingAmount: {
              amount: '40',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            subServiceType: 'NANNY',
            __typename: 'TaxCreditSaving',
          },
          {
            originalTotal: {
              amount: '0',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            discountedTotal: {
              amount: '-40',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            savingPercentage: 2147483647,
            savingAmount: {
              amount: '40',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            subServiceType: 'NANNY_SHARE',
            __typename: 'TaxCreditSaving',
          },
          {
            originalTotal: {
              amount: '283',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            discountedTotal: {
              amount: '283',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            savingPercentage: 0,
            savingAmount: {
              amount: '0',
              currencyCode: 'USD',
              __typename: 'Money',
            },
            subServiceType: 'DAY_CARE',
            __typename: 'TaxCreditSaving',
          },
        ],
      },
    },
  },
};

jest.mock('@/components/hooks/useFlowHelper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    currentFlow: 'SEEKER',
  })),
}));

const setup = () => {
  const initialState: AppState = {
    ...initialAppState,
    seeker: {
      ...initialAppState.seeker,
      zipcode: testZipCode,
    },
  };
  const mocks: MockedResponse[] = [zipRequest, userDataRequest];
  const pathname = '/seeker/cc/tax-calculator';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    query: {},
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <MockedProvider mocks={mocks} addTypename>
      <AppStateProvider initialStateOverride={initialState}>
        <TaxCalculator />
      </AppStateProvider>
    </MockedProvider>
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('TaxCalculator - test', () => {
  it('matches snapshot', async () => {
    const { asFragment } = setup();
    await screen.findByText('$283/week');
    expect(asFragment()).toMatchSnapshot();
  });
});
