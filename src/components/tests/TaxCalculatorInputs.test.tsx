import React from 'react';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

// Internal Dependencies
import TaxCalculatorInputs from '../TaxCalculatorInputs';

const props = {
  userInfo: {
    location: {
      zipcode: '78746',
      city: 'Austin',
      state: 'TX',
    },
    kidsNumber: 1,
    hoursNumber: 40,
  },
  onChangeInfo: jest.fn(),
  handleError: jest.fn(),
};

const mocks: MockedResponse[] = [];

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockRouter = {
  query: {},
};

describe('TaxCalculatorInputs - test', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename>
        <TaxCalculatorInputs {...props} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
