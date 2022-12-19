// External Dependencies
import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';

// Internal Dependencies
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { initialAppState } from '../../../../../../state';
import { AppStateProvider } from '../../../../../AppState';
import { AppState } from '../../../../../../types/app';
import CareFrequency from '../care-frequency';

// Mocks

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/FeatureFlagsContext', () => ({
  __esModule: true,
  useFeatureFlags: jest.fn(),
}));

// Constants

const FEATURE_FLAGS_CONTROL = {
  flags: {
    [CLIENT_FEATURE_FLAGS.DAYCARE_DAYS_SELECTOR]: {
      reason: { kind: '' },
      value: 'control',
      variationIndex: 0,
    },
  },
};

const FEATURE_FLAGS_VARIATION_1 = {
  flags: {
    [CLIENT_FEATURE_FLAGS.DAYCARE_DAYS_SELECTOR]: {
      reason: { kind: '' },
      value: 'variation1',
      variationIndex: 1,
    },
  },
};

// Utils

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const initialState: AppState = {
  ...initialAppState,
};

function renderPage(featureFlags = {}) {
  const pathname = '/seeker/cc/care-frequency';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  (useFeatureFlags as jest.Mock).mockReturnValue(featureFlags);

  return render(
    <AppStateProvider initialStateOverride={initialState}>
      <CareFrequency />
    </AppStateProvider>
  );
}

describe('Day care frequency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot', () => {
    const view = renderPage(FEATURE_FLAGS_CONTROL);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('full time should be selected by default', async () => {
    renderPage(FEATURE_FLAGS_CONTROL);
    const radio = screen.getByLabelText('Every weekday (Monday to Friday)');
    expect(radio).toBeChecked();
  });

  it('specific days show up when part-time is selected', async () => {
    renderPage(FEATURE_FLAGS_CONTROL);
    const radio = screen.getByLabelText('Custom');
    fireEvent.click(radio);
    await waitFor(() => expect(screen.getByText('Mon')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Tue')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Wed')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Thu')).toBeVisible());
    await waitFor(() => expect(screen.getByText('Fri')).toBeVisible());
  });

  it('make sure at least day is selected when custom is selected', async () => {
    renderPage(FEATURE_FLAGS_CONTROL);
    const radio = screen.getByLabelText('Custom');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(radio);
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('Please select at least 1 day from the list below')).toBeVisible();
    });
  });

  it('remove error msg when day is selected', async () => {
    renderPage(FEATURE_FLAGS_CONTROL);
    const radio = screen.getByLabelText('Custom');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(radio);
    fireEvent.click(nextButton);
    fireEvent.click(screen.getByText('Mon'));
    await waitFor(() => {
      expect(
        screen.queryByText('Please select at least 1 day from the list below')
      ).not.toBeInTheDocument();
    });
  });

  it('matches snapshot - A/B Test - growth-daycare-days-selector', async () => {
    const view = renderPage(FEATURE_FLAGS_VARIATION_1);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('interacts with view elements correctly - A/B Test - growth-daycare-days-selector', async () => {
    renderPage(FEATURE_FLAGS_VARIATION_1);
    // "Next" button disabled by default
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

    // When an option is selected, enable the button
    fireEvent.click(screen.getByText('Mon'));
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

    // When all options are selected, checkbox is automatically checked
    fireEvent.click(screen.getByText('Tue'));
    fireEvent.click(screen.getByText('Wed'));
    fireEvent.click(screen.getByText('Thu'));
    fireEvent.click(screen.getByText('Fri'));
    expect(screen.getByRole('checkbox', { name: 'Select all days' })).toBeChecked();

    // When clicking on checkbox it toggles the options and disables "Next" button
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all days' }));
    expect(screen.getByText('Mon')).not.toBeChecked();
    expect(screen.getByText('Tue')).not.toBeChecked();
    expect(screen.getByText('Wed')).not.toBeChecked();
    expect(screen.getByText('Thu')).not.toBeChecked();
    expect(screen.getByText('Fri')).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
