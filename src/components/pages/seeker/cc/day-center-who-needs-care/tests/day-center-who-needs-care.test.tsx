// External Dependencies
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextRouter, useRouter } from 'next/router';
import { cloneDeep, merge } from 'lodash-es';
import MockDate from 'mockdate';

// Internal Dependencies
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import WhoNeedsCareDayCenterPage from '@/components/pages/seeker/cc/day-center-who-needs-care/day-center-who-needs-care';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

// Mocks
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useFeatureFlag');
jest.mock('@/utilities/analyticsHelper', () => {
  return {
    __esModule: true,
    AnalyticsHelper: {
      logTestExposure: jest.fn(),
    },
  };
});

const birthdate9MonthsOutControl = {
  reason: { kind: 'kind' },
  value: 'control',
  variationIndex: 1,
} as LDEvaluationDetail;

const birthdate9MonthsOutVariation = {
  reason: { kind: 'kind' },
  value: 'variation1',
  variationIndex: 2,
} as LDEvaluationDetail;

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const appState = merge(
  {
    seeker: {
      zipcode: '91911',
      city: 'city',
      state: 'state',
    },
  },
  cloneDeep(initialAppState)
);

function renderPage(overrideState?: AppState) {
  const pathname = '/seeker/cc/day-center-who-needs-care';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={overrideState || appState}>
      <WhoNeedsCareDayCenterPage />
    </AppStateProvider>
  );
}

describe('Day Center - Who needs care?', () => {
  const getState = (length: number): AppState =>
    merge(
      {
        seekerCC: {
          dayCare: {
            childrenDateOfBirth: Array.from({ length })
              .fill(null)
              .map(() => ({ month: '1', year: '2017' })),
          },
        },
      },
      appState
    );

  const getNodeOptions = async (label: string) => {
    const listBox = await screen.findByRole('listbox', { name: label });
    return {
      listBox,
      options: within(listBox).getAllByRole('option'),
    };
  };

  beforeEach(() => {
    (AnalyticsHelper.logTestExposure as jest.Mock).mockClear();
    (useFeatureFlag as jest.Mock).mockClear();
    (useFeatureFlag as jest.Mock).mockReturnValue(birthdate9MonthsOutControl);
  });

  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with initial app state', async () => {
    const view = renderPage(getState(2));
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('disables "Add Another Child" when children count is 7', async () => {
    renderPage(getState(7));

    const addAnotherChildButton = screen.getByRole('button', { name: 'Add Another Child' });
    expect(addAnotherChildButton).toBeDisabled();
  });

  it('validates form when clicking "Next" - Displays errors', async () => {
    renderPage();

    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();

    const errorMonth = await screen.findByText('Select their birth month');
    const errorYear = await screen.findByText('Select their birth year');

    expect(errorMonth).toBeInTheDocument();
    expect(errorYear).toBeInTheDocument();
  });

  it('removes child when "Remove Child" link is clicked', async () => {
    renderPage(getState(2));

    const removeChildButton = screen.getByRole('button', { name: 'Remove Child' });
    removeChildButton.click();

    const child2 = screen.queryByText('Child 2');
    expect(child2).not.toBeInTheDocument();
  });

  it('adds new child when clicking "Add New Child"', async () => {
    renderPage();

    const addAnotherChildButton = screen.getByRole('button', { name: 'Add Another Child' });
    addAnotherChildButton.click();

    const child2 = await screen.findByText('Child 2');
    expect(child2).toBeInTheDocument();
  });

  it('should fire test exposure event - A/B Test - enrollment-birthdate-9-months-out', () => {
    renderPage();

    expect(AnalyticsHelper.logTestExposure).toHaveBeenCalledTimes(1);
    expect(AnalyticsHelper.logTestExposure).toHaveBeenCalledWith(
      'enrollment-birthdate-9-months-out',
      birthdate9MonthsOutControl
    );
  });

  it('provides correct select options based on date (7 of February, 2022) - A/B Test - enrollment-birthdate-9-months-out', async () => {
    MockDate.set('2022-02-07T05:00:00Z');
    (useFeatureFlag as jest.Mock).mockReturnValue(birthdate9MonthsOutVariation);

    renderPage();

    let childMonthInput = screen.getByLabelText('Birth month');
    const childYearInput = screen.getByLabelText('Birth year');

    userEvent.click(childMonthInput);
    let { options: months, listBox: monthsListBox } = await getNodeOptions('Birth month');
    userEvent.click(childYearInput);
    const { listBox: yearsListBox } = await getNodeOptions('Birth year');

    // No month and year selected => all months available, maxYear is 2022
    expect(months.length).toBe(12);
    expect(within(yearsListBox).queryByText('2023')).not.toBeInTheDocument();
    expect(within(yearsListBox).getByText('2022')).toBeInTheDocument();

    // Select 2022 year => the latest month for 2022 is November
    userEvent.click(within(yearsListBox).getByText('2022'));
    childMonthInput = screen.getByLabelText('Birth month');
    userEvent.click(childMonthInput);
    ({ listBox: monthsListBox, options: months } = await getNodeOptions('Birth month'));
    expect(months.length).toBe(11);
    expect(within(monthsListBox).queryByText('December')).not.toBeInTheDocument();

    MockDate.reset();
  });

  it('provides correct select options based on date (7 of June, 2022) and selected fields - A/B Test - enrollment-birthdate-9-months-out', async () => {
    (useFeatureFlag as jest.Mock).mockReturnValue(birthdate9MonthsOutVariation);
    MockDate.set('2022-06-07T05:00:00Z');

    renderPage(getState(1));

    let childMonthInput = screen.getByLabelText('Birth month');
    const childYearInput = screen.getByLabelText('Birth year');

    userEvent.click(childMonthInput);
    let { options: months, listBox: monthsListBox } = await getNodeOptions('Birth month');
    // Child's year is 2017 => all months are available
    expect(months.length).toBe(12);

    // June + 9 months is March, 2023
    userEvent.click(childYearInput);
    let { listBox: yearsListBox } = await getNodeOptions('Birth year');
    expect(within(yearsListBox).getByText('2023')).toBeInTheDocument();

    // Select April month, 2023 year is not included
    userEvent.click(within(monthsListBox).getByText('April'));
    ({ listBox: yearsListBox } = await getNodeOptions('Birth year'));
    expect(within(yearsListBox).queryByText('2023')).not.toBeInTheDocument();

    // Select March month, 2023 is in the document
    userEvent.click(childMonthInput);
    ({ listBox: monthsListBox } = await getNodeOptions('Birth month'));
    userEvent.click(within(monthsListBox).getByText('March'));
    ({ listBox: yearsListBox } = await getNodeOptions('Birth year'));
    expect(within(yearsListBox).getByText('2023')).toBeInTheDocument();

    // Select 2023 Year, only January, February, March are available
    userEvent.click(within(yearsListBox).getByText('2023'));
    childMonthInput = screen.getByLabelText('Birth month');
    userEvent.click(childMonthInput);
    ({ options: months } = await getNodeOptions('Birth month'));
    expect(months.length).toBe(3);

    MockDate.reset();
  });
});
