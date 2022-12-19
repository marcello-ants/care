import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { render, screen } from '@testing-library/react';
import CareDatePage from '../care-date';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const mockHeading = 'When do you need care?';
const mockDateOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
];
const mockSelectedCareDate = 2;
const mockOnChangeDateHandler = jest.fn();
const mockHandleNext = jest.fn();

function renderPage() {
  const pathname = '/seeker/care-date';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <CareDatePage
      heading={mockHeading}
      dateOptions={mockDateOptions}
      selectedCareDate={mockSelectedCareDate}
      onChangeDateHandler={mockOnChangeDateHandler}
      handleNext={mockHandleNext}
    />
  );
}

describe('CareDatePage', () => {
  it('matches snapshot', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    renderPage();

    expect(screen.getByText(mockDateOptions[0].label)).toBeInTheDocument();
    expect(screen.getByText(mockDateOptions[1].label)).toBeInTheDocument();
    expect(screen.getByText(mockDateOptions[2].label)).toBeInTheDocument();
  });

  it('fire onChangeDateHandler on care date change', async () => {
    renderPage();
    const lastButton = screen.getByText(mockDateOptions[2].label);
    lastButton.click();

    expect(mockOnChangeDateHandler).toHaveBeenCalled();
  });
});
