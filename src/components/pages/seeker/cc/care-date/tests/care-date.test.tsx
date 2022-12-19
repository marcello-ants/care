import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { CARE_DATE_LABELS, CLIENT_FEATURE_FLAGS, DAY_CARE_DATE_LABELS } from '@/constants';
import { MockedProvider } from '@apollo/client/testing';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { ServiceIdsForMember } from '@/types/seekerCC';
import { AppStateProvider } from '@/components/AppState';
import CareDatePage from '../care-date';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
};
appState.flow.flowName = 'SEEKER_CHILD_CARE';
function renderPage(flags: FeatureFlags = {}, overrideState?: AppState) {
  const pathname = '/seeker/cc/care-date';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <MockedProvider mocks={[]} addTypename>
      <AppStateProvider initialStateOverride={overrideState || appState}>
        <FeatureFlagsProvider flags={flags}>
          <CareDatePage />
        </FeatureFlagsProvider>
      </AppStateProvider>
    </MockedProvider>
  );
}
describe('/care-date', () => {
  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });
  it('renders correctly', async () => {
    renderPage();
    expect(screen.getByText(CARE_DATE_LABELS.IN_1_2_MONTHS)).toBeInTheDocument();
    expect(screen.getByText(CARE_DATE_LABELS.JUST_BROWSING)).toBeInTheDocument();
    expect(screen.getByText(CARE_DATE_LABELS.RIGHT_NOW)).toBeInTheDocument();
    expect(screen.getByText(CARE_DATE_LABELS.WITHIN_A_WEEK)).toBeInTheDocument();
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage({
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText(/How soon do you need help?/)).toBeInTheDocument();
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage({
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 1,
        value: 1,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('When do you need care?')).toBeInTheDocument();
  });
  it('routes to next page when clicking next button', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalled();
  });
  it('renders correctly for Day care with growth-dc-enrollment-just-browsing-vs-no-rush', async () => {
    const flags = {
      [CLIENT_FEATURE_FLAGS.DAYCARE_JUST_BROWSING_VS_NO_RUSH]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    };
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        czenServiceIdForMember: ServiceIdsForMember.dayCare,
      },
    };
    renderPage(flags, state);
    Object.values(DAY_CARE_DATE_LABELS).forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
