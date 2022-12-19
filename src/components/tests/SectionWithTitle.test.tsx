import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
// Internal Dependencies
import SectionWithTitle from '../SectionWithTitle';

const props = {
  title: 'How do you take advantage of these tax credits',
  learnMoreLink: 'https://www.care.com/homepay',
  children:
    'In order to take advantage of these tax credits, you must pay your nanny on the books. Care.com Homepay can help.',
};

const mocks: MockedResponse[] = [];

afterEach(() => {
  jest.clearAllMocks();
});

describe('SectionWithTitle - test', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename>
        <SectionWithTitle {...props} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
