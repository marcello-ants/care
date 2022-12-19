import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import { useAppDispatch } from '@/components/AppState';
import { BringOptions, BringOptionsLabels } from '@/types/seekerHK';
import HousekeeperWhatPage from '../housekeeper-what';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

function renderPage() {
  const pathname = '/seeker/hk/housekeeper-what';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(<HousekeeperWhatPage />);
}

describe('What to do and bring page', () => {
  it('renders correctly', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('routes to next page when clicking next button', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it('dispatch a `setBringOptions` action on change housekeeping bring options', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    renderPage();
    const equipmentCheckbox = screen.getByText(BringOptionsLabels.EQUIPMENT);
    equipmentCheckbox.click();

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setBringOptions',
      bringOptions: [BringOptions.EQUIPMENT],
    });
  });
});
