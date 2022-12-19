import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import { useAppDispatch } from '@/components/AppState';
import { Tasks, TasksLabels } from '@/types/seekerHK';
import WhatTasks from '../what-tasks';

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
  const pathname = '/seeker/hk/what-tasks';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(<WhatTasks />);
}

describe('What tasks page', () => {
  it('renders correctly', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });
  it('routes to next page when clicking a button', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalled();
  });
  it('dispatch a `setTasks` action on checkbox click', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

    renderPage();
    const laundryCheckbox = screen.getByText(TasksLabels.LAUNDRY);
    laundryCheckbox.click();

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setTasks',
      tasks: [Tasks.LAUNDRY],
    });
  });
});
