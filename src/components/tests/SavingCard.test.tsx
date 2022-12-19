import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { IconIllustrationSmallNannies } from '@care/react-icons';
// Internal Dependencies
import SavingCard from '../SavingCard';

const props = {
  careType: 'Nanny',
  icon: <IconIllustrationSmallNannies size="100px" />,
  price: 981,
  link: 'https://www.dev.carezen.net/dwb/visitor/enrollSeeker?memberType=seeker&serviceId=CHILDCARE&subService=nannyBabysiiter&comeFrom=costOfChildcare&zip=12123&numOfInfants=0&numOfToddlers=0&numOfPreSchoolers=1&numOfPreKindergarteners=0',
  isLoading: false,
};

const mocks: MockedResponse[] = [];

afterEach(() => {
  jest.clearAllMocks();
});

describe('SavingCard - test', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename>
        <SavingCard {...props} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
