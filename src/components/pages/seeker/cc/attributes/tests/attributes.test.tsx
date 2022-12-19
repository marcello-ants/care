// External Dependencies
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { cloneDeep } from 'lodash-es';
import { NextRouter, useRouter } from 'next/router';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { AppStateProvider } from '@/components/AppState';
import Attributes from '../attributes';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
};

function renderPage() {
  const pathname = '/seeker/cc/attributes';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AppStateProvider initialStateOverride={appState}>
      <Attributes />
    </AppStateProvider>
  );
}
describe('Seeker - Child Care - Attributes', () => {
  it('Test snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });
  it('Test attribute rendering', async () => {
    renderPage();
    expect(screen.getByText('Structuring activities')).toBeInTheDocument();
    expect(screen.getByText('CPR / First Aid trained')).toBeInTheDocument();
  });
  it('Test on change of attributes', async () => {
    renderPage();
    const homeworkCheckBox = screen.getByRole('checkbox', { name: 'Homework or curriculum help' });
    const setHasCPROrFirstAidCheckBox = screen.getByRole('checkbox', {
      name: 'CPR / First Aid trained',
    });
    expect(homeworkCheckBox).not.toBeChecked();
    fireEvent.click(homeworkCheckBox);
    fireEvent.change(homeworkCheckBox);
    expect(homeworkCheckBox).toBeChecked();
    expect(setHasCPROrFirstAidCheckBox).not.toBeChecked();
    fireEvent.click(setHasCPROrFirstAidCheckBox);
    fireEvent.change(setHasCPROrFirstAidCheckBox);
    expect(setHasCPROrFirstAidCheckBox).toBeChecked();
  });
});
