import React from 'react';
import { useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import Location from '../location';

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

function renderPage() {
  return render(<Location />);
}

describe('location page', () => {
  beforeEach(async () => {
    const pathname = '/seeker/pc/location';

    mockRouter = {
      push: jest.fn(),
      pathname,
      asPath: pathname,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    mockRouter = null;
  });

  it('renders correctly', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('handleNext', async () => {
    renderPage();
    const nextButton = await screen.findByRole('button', { name: 'Next' });
    nextButton.click();

    expect(mockRouter.push).toHaveBeenCalledWith('/seeker/pc/recap');
  });
});
