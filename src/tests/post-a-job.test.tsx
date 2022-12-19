// External Dependencies
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

// Internal Dependencies
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import { CLIENT_FEATURE_FLAGS, POST_A_JOB_ROUTES } from '@/constants';
import { TealiumUtagService } from '@/utilities/utagHelper';
import { initialAppState } from '@/state';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import * as accountCreationUtils from '@/utilities/account-creation-utils';
import Home from '../pages/post-a-job';

// Constants
const LD_FLAGS_CONTROL: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.GROWTH_SC_TYPE_OF_CARE]: {
    reason: { kind: '' },
    value: 0,
    variationIndex: 0,
  },
};

const LD_FLAGS_VARIATION_1: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.GROWTH_SC_TYPE_OF_CARE]: {
    reason: { kind: '' },
    value: 1,
    variationIndex: 1,
  },
};

// Mocks
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/utilities/utagHelper', () => ({
  TealiumUtagService: {
    view: jest.fn(),
  },
}));

const mockRouter = {
  push: jest.fn(),
  query: {
    zip: '10004',
    selfNeedsCare: 'true',
    servicesNeeded: ['SENIOR_CARE_TRANSPORTATION'],
    typeOfCare: 'UNDECIDED',
  },
  pathname: '',
};
(useRouter as jest.Mock).mockReturnValue(mockRouter);

// Utility Functions

const initialInHomeState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
  },
};

function customRender(LDFlags: FeatureFlags) {
  const view = render(
    <AppStateProvider initialStateOverride={initialInHomeState}>
      <FeatureFlagsProvider flags={LDFlags}>
        <Home />
      </FeatureFlagsProvider>
    </AppStateProvider>,
    {}
  );

  return view;
}

describe('Post a Job page', () => {
  it('matches snapshot - Control', () => {
    const { asFragment } = customRender(LD_FLAGS_CONTROL);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot - Variation 1', () => {
    const { asFragment } = customRender(LD_FLAGS_VARIATION_1);
    expect(asFragment()).toMatchSnapshot();
  });

  it('disables next button before selection is made', () => {
    customRender(LD_FLAGS_CONTROL);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
  it('enables next button after selection is made', () => {
    customRender(LD_FLAGS_CONTROL);
    const checkbox = screen.getByText(/recurring/i);
    fireEvent.click(checkbox);
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('routes to the recurring page after selection and button click', () => {
    customRender(LD_FLAGS_CONTROL);
    const checkbox = screen.getByText(/recurring/i);
    fireEvent.click(checkbox);
    screen.getByRole('button', { name: 'Next' }).click();
    expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.RECURRING);
  });

  it('routes to the onetime page after selection and button click', () => {
    customRender(LD_FLAGS_CONTROL);
    const checkbox = screen.getByText(/one-time/i);
    fireEvent.click(checkbox);
    screen.getByText(/next/i).click();
    expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.ONE_TIME);
  });

  it('TealiumUtagService.view triggered', () => {
    customRender(LD_FLAGS_CONTROL);
    expect(TealiumUtagService.view).toHaveBeenCalled();
  });

  it('triggers both analytic events when feature flag is on', () => {
    const ampliListener = jest.spyOn(AmpliHelper.ampli, 'jobPostedType');
    const amplitudeListener = jest.spyOn(AnalyticsHelper, 'logEvent');

    customRender({
      ...LD_FLAGS_CONTROL,
      [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
        variationIndex: 1,
        value: 'variant',
        reason: { kind: 'FALLTHROUGH ' },
      },
    });

    const checkbox = screen.getByText(/recurring/i);
    fireEvent.click(checkbox);
    screen.getByRole('button', { name: 'Next' }).click();

    expect(ampliListener).toBeCalledTimes(1);
    expect(amplitudeListener).toBeCalledTimes(1);
  });

  it('logInitialFlowStart should be called', () => {
    const amplitudeListener = jest.spyOn(accountCreationUtils, 'hash256');

    customRender(LD_FLAGS_CONTROL);

    expect(amplitudeListener).toBeCalledTimes(1);
  });
});
