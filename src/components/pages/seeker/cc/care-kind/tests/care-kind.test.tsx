// External Dependencies
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextRouter, useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { MockedProvider } from '@apollo/client/testing';
// Internal Dependencies
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import {
  CARE_DATES,
  CLIENT_FEATURE_FLAGS,
  FLOWS,
  SEEKER_INSTANT_BOOK_ROUTES,
  SEEKER_INSTANT_BOOK_SHORT_ROUTES,
  SEM_CHILDCARE,
} from '@/constants';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import CareKindPage from '@/components/pages/seeker/cc/care-kind/care-kind';
import { AppState } from '@/types/app';
import {
  CareKindLabels,
  DayCareKind,
  DayCareKindLabels,
  DefaultCareKind,
  ServiceIdsForMember,
} from '@/types/seekerCC';
import { DistanceUnit } from '@/__generated__/globalTypes';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';

// Mocks
jest.mock('@/utilities/childCareAnalyticsHelper');
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const logChildCareEventMock = logChildCareEvent as jest.Mock;

// App State

const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
  seekerCC: {
    ...clonedAppState.seekerCC,
    careDate: CARE_DATES.JUST_BROWSING,
    enrollmentSource: '',
  },
};
appState.flow.flowName = 'SEEKER_CHILD_CARE';

const defaultFeatureFlags = {
  [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
    variationIndex: 0,
    value: 0,
    reason: { kind: '' },
  },
  [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]: {
    variationIndex: 0,
    value: 0,
    reason: { kind: '' },
  },
  [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_DIRECT_TO_BOOKING]: {
    value: 0,
    variationIndex: 0,
    reason: { kind: '' },
  },
  [CLIENT_FEATURE_FLAGS.IB_SHORTENED_FLOW]: {
    value: 0,
    variationIndex: 0,
    reason: { kind: '' },
  },
  [CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_TRAVELED_SELECTION]: {
    value: 'holdout',
    variationIndex: 0,
    reason: { kind: '' },
  },
  [CLIENT_FEATURE_FLAGS.GROWTH_CC_REMOVE_DC_OPTION]: {
    value: 0,
    variationIndex: 0,
    reason: { kind: '' },
  },
};

// Utility Functions

function renderPage(
  overrideState?: AppState,
  featureFlags = defaultFeatureFlags,
  pathname = '/seeker/cc/care-kind'
) {
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <MockedProvider mocks={[]} addTypename>
      <FeatureFlagsProvider flags={featureFlags}>
        <AppStateProvider initialStateOverride={overrideState || appState}>
          <CareKindPage />
        </AppStateProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
}

describe('/care-kind', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('matches snapshot - Default View', async () => {
    const view = renderPage(undefined);
    expect(view.asFragment()).toMatchSnapshot();

    expect(screen.getByText(CareKindLabels.ONE_TIME_BABYSITTERS)).toBeInTheDocument();
    expect(screen.getByText(CareKindLabels.NANNIES_RECURRING_BABYSITTERS)).toBeInTheDocument();
    expect(screen.getByText(CareKindLabels.DAY_CARE_CENTERS)).toBeInTheDocument();
  });

  it('matches snapshot - Daycare View', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        czenServiceIdForMember: ServiceIdsForMember.dayCare,
      },
    };

    const view = renderPage(state);
    expect(view.asFragment()).toMatchSnapshot();

    expect(screen.getByText(DayCareKindLabels.DAY_CARE_CENTERS)).toBeInTheDocument();
    expect(screen.getByText(DayCareKindLabels.AFTER_SCHOOL_CENTERS)).toBeInTheDocument();
    expect(screen.getByText(DayCareKindLabels.PRESCHOOL_CENTERS)).toBeInTheDocument();
  });
  it('routes to next page when clicking next button', async () => {
    renderPage();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalled();
  });

  [
    DayCareKindLabels.DAY_CARE_CENTERS,
    DayCareKindLabels.AFTER_SCHOOL_CENTERS,
    DayCareKindLabels.PRESCHOOL_CENTERS,
  ].forEach((label) =>
    it(`${label} - routes to next page when clicking next button - Daycare view`, async () => {
      const state: AppState = {
        ...appState,
        seekerCC: {
          ...appState.seekerCC,
          czenServiceIdForMember: ServiceIdsForMember.dayCare,
        },
      };

      renderPage(state);
      const nextButton = screen.getByRole('button', { name: 'Next' });
      const dayCareCentersRadio = screen.getByText(label);
      userEvent.click(dayCareCentersRadio);

      nextButton.click();

      // next day care page at mfe
      expect(mockRouter.push).toHaveBeenCalledWith('/seeker/dc/day-center-who-needs-care');
    })
  );

  it('daycare centers view should have a stepper input for travel distance', async () => {
    const state: AppState = {
      ...appState,
      seeker: {
        ...appState.seeker,
        maxDistanceFromSeekerDayCare: {
          distance: 18,
          unit: DistanceUnit.MILES,
        },
      },
      seekerCC: {
        ...appState.seekerCC,
        czenServiceIdForMember: ServiceIdsForMember.dayCare,
        careKind: DayCareKind.DAY_CARE_CENTERS,
      },
    };

    renderPage(state);

    expect(screen.getByText('How far are you willing to travel?')).toBeInTheDocument();
    const distanceInput = screen.getByRole('textbox');
    expect(distanceInput).toHaveValue('18');

    const minusButton = screen.getAllByRole('button')[0];
    minusButton.click();
    expect(distanceInput).toHaveValue('16');
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(appState, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText(/Got it./)).toBeInTheDocument();
  });
  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE variant 4', () => {
    renderPage(appState, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 4,
        value: 4,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText(/What kind of care do you need?/)).toBeInTheDocument();
  });
  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(appState, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 1,
        value: 1,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('What kind of care?')).toBeInTheDocument();
  });

  it('should render without INSTANT_BOOK_CARE_KIND_MERCHANDISING text', () => {
    renderPage(appState, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]: {
        variationIndex: 1,
        value: 1,
        reason: { kind: '' },
      },
    });
    expect(screen.queryByText('BOOK NOW')).not.toBeInTheDocument();
    expect(screen.queryByText('Try instant book')).not.toBeInTheDocument();
  });
  it('should render INSTANT_BOOK_CARE_KIND_MERCHANDISING text (Try instant book)', () => {
    renderPage(appState, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('Try instant book')).toBeInTheDocument();
  });
  it('should render INSTANT_BOOK_CARE_KIND_MERCHANDISING sticker (BOOK NOW', () => {
    renderPage(appState, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]: {
        variationIndex: 3,
        value: 3,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('BOOK NOW')).toBeInTheDocument();
  });
  it('routes to next page when clicking next button for INSTANT_BOOKING_CC flow', async () => {
    const state = {
      ...appState,
      flow: {
        ...appState.flow,
        flowName: FLOWS.SEEKER_INSTANT_BOOK.name,
      },
      seekerCC: {
        ...appState.seekerCC,
        careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
        instantBook: {
          ...appState.seekerCC.instantBook,
          eligibleLocation: true,
        },
      },
    };

    renderPage(state, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_DIRECT_TO_BOOKING]: {
        value: 2,
        variationIndex: 2,
        reason: { kind: '' },
      },
    });

    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.WHO);
  });

  it('should not render DAY_CARE_CENTERS option when enrollmentSource=semChildcare and in growth-childcare-dc-removal-test', () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        enrollmentSource: SEM_CHILDCARE,
      },
    };
    const view = renderPage(state, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.GROWTH_CC_REMOVE_DC_OPTION]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });

    expect(view.asFragment()).toMatchSnapshot();
    expect(screen.queryByText(CareKindLabels.DAY_CARE_CENTERS)).not.toBeInTheDocument();
  });

  it('routes to next page when clicking next button for IB_SHORTENED_FLOW flow', async () => {
    const state = {
      ...appState,
      flow: {
        ...appState.flow,
        flowName: FLOWS.SEEKER_INSTANT_BOOK_SHORT.name,
      },
      seekerCC: {
        ...appState.seekerCC,
        careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
        instantBook: {
          ...appState.seekerCC.instantBook,
          eligibleLocation: true,
        },
      },
    };

    renderPage(state, {
      ...defaultFeatureFlags,
      [CLIENT_FEATURE_FLAGS.IB_SHORTENED_FLOW]: {
        value: 2,
        variationIndex: 2,
        reason: { kind: '' },
      },
    });

    const nextButton = screen.getByRole('button', { name: 'Next' });
    nextButton.click();
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_SHORT_ROUTES.EMAIL);
  });

  it.each([
    {
      variationIndex: 1,
      value: 'control',
      careKindSelection: DayCareKindLabels.DAY_CARE_CENTERS,
      expectedResult: 'render',
    },
    {
      variationIndex: 2,
      value: 'distance',
      careKindSelection: DayCareKindLabels.DAY_CARE_CENTERS,
      expectedResult: 'render',
    },
    {
      variationIndex: 1,
      value: 'control',
      careKindSelection: DayCareKindLabels.AFTER_SCHOOL_CENTERS,
      expectedResult: 'not render',
    },
    {
      variationIndex: 2,
      value: 'distance',
      careKindSelection: DayCareKindLabels.AFTER_SCHOOL_CENTERS,
      expectedResult: 'render',
    },
    {
      variationIndex: 1,
      value: 'control',
      careKindSelection: DayCareKindLabels.PRESCHOOL_CENTERS,
      expectedResult: 'not render',
    },
    {
      variationIndex: 2,
      value: 'distance',
      careKindSelection: DayCareKindLabels.PRESCHOOL_CENTERS,
      expectedResult: 'render',
    },
  ])(
    'should $expectedResult distance-travel stepper when feature flag is evaluated to "$value" and selection is "$careKindSelection" in Daycare flow',
    ({ variationIndex, value, careKindSelection, expectedResult }) => {
      const state: AppState = {
        ...appState,
        seekerCC: {
          ...appState.seekerCC,
          czenServiceIdForMember: ServiceIdsForMember.dayCare,
        },
      };

      const flags = {
        ...defaultFeatureFlags,
        [CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_TRAVELED_SELECTION]: {
          variationIndex,
          value,
          reason: { kind: 'RULE_MATCH' },
        },
      };
      renderPage(state, flags);

      const dayCareCentersRadio = screen.getByText(careKindSelection);
      userEvent.click(dayCareCentersRadio);

      const distanceElement = screen.queryAllByText('How far are you willing to travel?');
      expect(distanceElement).toHaveLength(expectedResult === 'render' ? 1 : 0);
    }
  );

  it.each([
    [ServiceIdsForMember.dayCare, 'disabled', 'Daycare centers'],
    [ServiceIdsForMember.dayCare, 'enabled', 'Daycare centers'],
    [ServiceIdsForMember.dayCare, 'enabled', 'Preschool centers'],
    [ServiceIdsForMember.dayCare, 'enabled', 'After school care'],
    [ServiceIdsForMember.babysitter, 'enabled', 'Daycare centers'],
    [ServiceIdsForMember.babysitter, 'disabled', 'Daycare centers'],
    [ServiceIdsForMember.nanny, 'enabled', 'Daycare centers'],
    [ServiceIdsForMember.nanny, 'not enabled', 'Daycare centers'],
  ])(
    'should fire "Member Enrolled" event with extraData as attribute if is "%s" flow, daycare-distance-traveled-selection test is %s and user clicked on "%s"',
    async (flow, testStatus, ctaText) => {
      const state = {
        ...appState,
        seekerCC: {
          ...appState.seekerCC,
          czenServiceIdForMember: flow,
        },
      } as AppState;

      const flags = {
        ...defaultFeatureFlags,
        [CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_TRAVELED_SELECTION]: {
          variationIndex: 3,
          value: testStatus === 'enabled' ? 'distance' : 'control',
          reason: { kind: 'RULE_MATCH' },
        },
      };

      renderPage(state, flags);

      const option = screen.getByText(ctaText);
      const nextButton = screen.getByRole('button', { name: 'Next' });

      expect(option).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();

      userEvent.click(option);
      userEvent.click(nextButton);

      expect(logChildCareEventMock).toBeCalledWith(
        'Member Enrolled',
        'Care Kind',
        '',
        expect.objectContaining({
          extraData: {
            user_distance: expect.any(Number),
            user_distance_unit: expect.any(String),
          },
        })
      );
    }
  );

  it.each([
    [ServiceIdsForMember.dayCare, 'not enabled', 'Preschool centers'],
    [ServiceIdsForMember.dayCare, 'not enabled', 'After school care'],
    [ServiceIdsForMember.babysitter, 'enabled', 'Nannies / recurring sitters'],
    [ServiceIdsForMember.babysitter, 'not enabled', 'Nannies / recurring sitters'],
    [ServiceIdsForMember.babysitter, 'enabled', 'One-time sitters'],
    [ServiceIdsForMember.babysitter, 'not enabled', 'One-time sitters'],
    [ServiceIdsForMember.nanny, 'enabled', 'Nannies / recurring sitters'],
    [ServiceIdsForMember.nanny, 'not enabled', 'Nannies / recurring sitters'],
    [ServiceIdsForMember.nanny, 'enabled', 'One-time sitters'],
    [ServiceIdsForMember.nanny, 'not enabled', 'One-time sitters'],
    ['instantBook', 'not enabled', 'Nannies / recurring sitters', 1],
    ['instantBook', 'enabled', 'Nannies / recurring sitters', 1],
    ['instantBook', 'not enabled', 'One-time sitters', 1],
    ['instantBook', 'enabled', 'One-time sitters', 1],
    ['instantBook', 'not enabled', 'One-time sitters', 1],
    ['instantBook', 'enabled', 'One-time sitters', 2],
    ['instantBook', 'not enabled', 'One-time sitters', 2],
    ['instantBook', 'enabled', 'One-time sitters', 3],
    ['instantBook', 'not enabled', 'One-time sitters', 3],
  ])(
    'should fire "Member Enrolled" event without extraData as attribute if is "%s" flow, daycare-distance-traveled-selection test is %s and user clicked on "%s"',
    async (flow, testStatus, ctaText, ibMerchandising = 1) => {
      const czenServiceIdForMember = flow === 'instantBook' ? ServiceIdsForMember.babysitter : flow;

      const state = {
        ...appState,
        seekerCC: {
          ...appState.seekerCC,
          czenServiceIdForMember,
        },
      } as AppState;

      const flags = {
        ...defaultFeatureFlags,
        [CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_TRAVELED_SELECTION]: {
          variationIndex: 3,
          value: testStatus === 'enabled' ? 'distance' : 'control',
          reason: { kind: 'RULE_MATCH' },
        },
        [CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]: {
          variationIndex: 3,
          value: ibMerchandising,
          reason: { kind: 'RULE_MATCH' },
        },
      };

      renderPage(state, flags);

      const option = screen.getByText(ctaText);
      const nextButton = screen.getByRole('button', { name: 'Next' });

      expect(option).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();

      userEvent.click(option);
      userEvent.click(nextButton);

      expect(logChildCareEventMock).toBeCalled();
      expect(logChildCareEventMock).not.toBeCalledWith(
        'Member Enrolled',
        'Care Kind',
        '',
        expect.objectContaining({
          extraData: {
            user_distance: expect.any(Number),
            user_distance_unit: expect.any(String),
          },
        })
      );
    }
  );
});
