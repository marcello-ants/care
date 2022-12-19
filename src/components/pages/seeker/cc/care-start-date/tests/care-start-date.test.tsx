// External Dependencies
import React from 'react';
import { render, fireEvent, within, screen } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJSUtils from '@date-io/dayjs';
import { NextRouter, useRouter } from 'next/router';
import { initialAppState } from '../../../../../../state';
import { AppStateProvider } from '../../../../../AppState';
import { AppState } from '../../../../../../types/app';
import { SEEKER_DAYCARE_CHILD_CARE_ROUTES } from '../../../../../../constants';

// Internal Dependencies
import CareDate from '../care-start-date';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const initialState: AppState = {
  ...initialAppState,
};

function renderPage() {
  const pathname = '/seeker/dc/care-start-date';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <MuiPickersUtilsProvider utils={DayJSUtils}>
      <AppStateProvider initialStateOverride={initialState}>
        <CareDate />
      </AppStateProvider>
    </MuiPickersUtilsProvider>
  );
}

describe('Day care start date', () => {
  it('matches snapshot', () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should show the error on Next', () => {
    renderPage();

    screen.getByRole('button', { name: 'Next' }).click();
    expect(screen.getByText('Please enter a start month')).toBeVisible();
  });

  it('should remove error on change', () => {
    renderPage();

    screen.getByRole('button', { name: 'Next' }).click();
    expect(screen.getByText('Please enter a start month')).toBeVisible();

    fireEvent.mouseDown(screen.getAllByRole('button')[0]);
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('May', { exact: false }));
    expect(screen.queryByText('Please enter a start month')).not.toBeInTheDocument();
  });

  it('should go to next page', () => {
    renderPage();
    fireEvent.mouseDown(screen.getAllByRole('button')[0]);
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('May', { exact: false }));

    screen.getByRole('button', { name: 'Next' }).click();
    expect(mockRouter.push).toHaveBeenCalledWith(
      SEEKER_DAYCARE_CHILD_CARE_ROUTES.ADDITIONAL_INFORMATION
    );
  });
});
