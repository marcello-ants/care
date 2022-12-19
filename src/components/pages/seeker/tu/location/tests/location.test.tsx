import { useRouter } from 'next/router';
import React from 'react';
import { render, screen } from '@testing-library/react';

import useNextRoute from '@/components/hooks/useNextRoute';

import LocationPageTU from '../location';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

type mockedProps = {
  handleNext: () => null;
};

jest.mock('@/components/hooks/useNextRoute');
jest.mock('@/components/Location', () => ({ handleNext }: mockedProps) => (
  <button type="button" onClick={handleNext}>
    Next
  </button>
));

let mockRouter: any | null = null;
let mockRoute: any = null;

function renderPage() {
  return render(<LocationPageTU />);
}

describe('Tutoring location page', () => {
  beforeEach(async () => {
    const pathname = '/seeker/tu/location';

    mockRouter = {
      push: jest.fn(),
      pathname,
      asPath: pathname,
    };
    mockRoute = {
      pushNextRoute: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useNextRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    mockRouter = null;
    mockRoute = null;
  });

  it('renders correctly', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('redirects to the next page on button click', async () => {
    renderPage();
    const nextButton = await screen.findByRole('button', { name: 'Next' });
    nextButton.click();

    expect(mockRoute.pushNextRoute).toHaveBeenCalled();
  });
});
