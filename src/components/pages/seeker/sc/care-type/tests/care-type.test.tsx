import React from 'react';
import { useRouter } from 'next/router';
import { render, fireEvent, screen } from '@testing-library/react';
import { AppStateProvider } from '@/components/AppState';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { initialAppState } from '@/state';
import useNextRoute from '@/components/hooks/useNextRoute';
import { AppState } from '@/types/app';
import { SEEKER_IN_FACILITY_ROUTES, SEEKER_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { cloneDeep } from 'lodash-es';
import CareType from '@/components/pages/seeker/sc/care-type/care-type';
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useNextRoute');

const initialStateOverride = cloneDeep(initialAppState);
const initialAppStateInFacilitySelected: AppState = {
  ...initialStateOverride,
  seeker: {
    ...initialStateOverride.seeker,
    typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
  },
};

describe('CareType page', () => {
  let mockRouter: any = null;
  let mockRoute: any = null;
  let asFragment: any | null = null;

  const renderComponent = (
    initialState: AppState,
    flags: Record<string, LDEvaluationDetail> = {}
  ) => {
    const view = render(
      <FeatureFlagsProvider flags={flags}>
        <AppStateProvider initialStateOverride={initialState}>
          <CareType />
        </AppStateProvider>
      </FeatureFlagsProvider>
    );
    ({ asFragment } = view);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/',
      asPath: '/seeker/sc/',
      query: { test: true },
    };

    mockRoute = {
      pushNextRoute: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useNextRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    mockRoute = null;
    asFragment = null;
  });

  it('matches snapshot', () => {
    renderComponent(initialAppState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Uses pushNextRoute when inFacility not selected', async () => {
    renderComponent(initialAppState);
    const homePill = screen.getByText(/In-home care/i);
    const undecidedPill = screen.getByText(/I am not sure yet/i);

    fireEvent.click(homePill);
    fireEvent.click(undecidedPill);

    expect(mockRoute.pushNextRoute).toHaveBeenCalledTimes(2);
  });

  it('Uses router.push when inFacility selected', async () => {
    renderComponent(initialAppState);
    const communityPill = screen.getByText(/Senior living community/i);

    fireEvent.click(communityPill);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.CARE_TRUST);
  });

  it('Uses router.push when inFacility previously selected + inFacility not currently selected', async () => {
    renderComponent(initialAppStateInFacilitySelected);
    const homePill = screen.getByText(/In-home care/i);

    fireEvent.click(homePill);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_ROUTES.HELP_TYPE);
  });

  it('Uses router.push to location-optimized-flow when RECOMMENDATION_OPTIMIZATION flow', async () => {
    const flags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'control' },
        value: true,
        variationIndex: 1,
      },
    };
    renderComponent(initialAppState, flags);
    const communityPill = screen.getByText(/Senior living community/i);

    fireEvent.click(communityPill);

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION_OPTIMIZED_FLOW);
  });

  it('Fires only non-ampli analytic event when feature flag is off', () => {
    const amplitudeEventListener = jest.spyOn(AnalyticsHelper, 'logEvent');
    const ampliEventListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledTypeOfSeniorCareNeed');

    renderComponent(initialAppState);

    const homePill = screen.getByText(/In-home care/i);
    fireEvent.click(homePill);

    expect(amplitudeEventListener).toHaveBeenCalled();
    expect(ampliEventListener).not.toHaveBeenCalled();
  });

  it('Fires both analytic events when feature flag is on', () => {
    const amplitudeEventListener = jest.spyOn(AnalyticsHelper, 'logEvent');
    const ampliEventListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledTypeOfSeniorCareNeed');

    renderComponent(initialAppState, {
      [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
        variationIndex: 1,
        value: 'variant',
        reason: { kind: 'FALLTHROUGH' },
      },
    });

    const homePill = screen.getByText(/In-home care/i);
    fireEvent.click(homePill);

    expect(amplitudeEventListener).toHaveBeenCalled();
    expect(ampliEventListener).toHaveBeenCalled();
  });
});
