import { NextRouter } from 'next/router';
import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';

import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { GET_SEEKER_INFO, GET_SEEKER_ZIP_CODE } from '@/components/request/GQL';
import * as AppStateComponent from '@/components/AppState';

import { initialAppState } from '@/state';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { preRenderPage } from '@/__setup__/testUtil';
import { AppState } from '@/types/app';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import WhoNeedsInfacilityCare from '../who-needs-care';

const getSeekerInfoMock = {
  request: {
    operationName: 'getSeekerInfo',
    variables: { memberId: '123' },
    query: GET_SEEKER_INFO,
  },
  result: {
    data: {
      getSeeker: {
        member: {
          firstName: 'John',
          lastName: 'Doe',
          contact: {
            primaryPhone: '',
            __typename: 'MemberContact',
          },
          email: 'sc-1769-3@test.com',
          __typename: 'Member',
        },
        __typename: 'Seeker',
      },
    },
  },
};

describe('Who needs care', () => {
  describe('In facility', () => {
    let mockRouter: NextRouter | null;
    let asFragment: () => DocumentFragment;

    const renderComponent = (
      initialState: AppState,
      ldFlags: FeatureFlags = {},
      pathName: string = '/seeker/sc/help-type',
      mocks: MockedResponse[] = []
    ) => {
      const utils = preRenderPage({
        appState: initialState,
        flags: ldFlags,
        pathname: pathName,
        mocks,
      });
      mockRouter = utils.routerMock;
      ({ asFragment } = utils.renderFn(WhoNeedsInfacilityCare));
    };

    afterEach(() => {
      // cleanup on exiting
      mockRouter = null;
    });

    it('matches snapshot', () => {
      renderComponent(initialAppState);
      expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly', () => {
      renderComponent(initialAppState);
      expect(
        screen.getByText('Let’s get started by learning more about your senior care needs')
      ).toBeInTheDocument();
      expect(screen.getByText('Who needs care?')).toBeInTheDocument();
      expect(screen.getByText('How old are they?')).toBeInTheDocument();
      // makes sure it's defaulted to 80's
      expect(screen.getByText(/80's/)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should enable next button when selecting an option', async () => {
      renderComponent(initialAppState);
      expect(screen.getByText('Who needs care?')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Other'));

      fireEvent.mouseDown(screen.getByText(/80's/));
      const listbox = within(screen.getByRole('listbox'));
      fireEvent.click(listbox.getByText("30's"));

      await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());

      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(mockRouter!.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE);
    });

    it('Should route to /location when ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION is on', () => {
      jest.spyOn(AnalyticsHelper, 'logTestExposure');

      const flags: FeatureFlags = {
        [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
          reason: {
            kind: 'OVERRIDE',
          },
          value: '',
          variationIndex: 1,
        },
      };
      const { renderFn, routerMock } = preRenderPage({ flags });
      renderFn(WhoNeedsInfacilityCare);

      expect(
        screen.queryByText(/Let’s get started by learning more about your senior care needs/)
      ).not.toBeInTheDocument();
      expect(AnalyticsHelper.logTestExposure).toHaveBeenCalledWith(
        CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION,
        flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]
      );
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
    });

    it('Should prevent screen view event to be fired when ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION is on', () => {
      jest.spyOn(AnalyticsHelper, 'logEvent');

      const flags: FeatureFlags = {
        [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
          reason: {
            kind: 'OVERRIDE',
          },
          value: '',
          variationIndex: 1,
        },
      };
      const { renderFn } = preRenderPage({ flags });
      renderFn(WhoNeedsInfacilityCare);
      expect(AnalyticsHelper.logEvent).not.toHaveBeenCalledWith({
        name: 'Screen Viewed',
        data: {
          lead_flow: 'mhp module',
        },
      });
      expect(AnalyticsHelper.logEvent).not.toHaveBeenCalledWith({
        name: 'Screen Viewed',
        data: {},
      });
    });

    it('should fire screen view event', async () => {
      jest.spyOn(AnalyticsHelper, 'logEvent');
      const { renderFn } = preRenderPage();

      renderFn(WhoNeedsInfacilityCare);
      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Screen Viewed',
        data: {},
      });
    });
  });

  const getZipCodeMock = {
    request: {
      query: GET_SEEKER_ZIP_CODE,
      variables: {
        memberId: '123',
      },
    },
    result: {
      data: {
        getSeeker: {
          member: {
            address: {
              zip: '90001',
            },
          },
        },
      },
    },
  };

  describe('In facility nth day', () => {
    const nthDayState: AppState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call zip query if memberId exists', async () => {
      const mockAppDispatch = jest.fn();
      const spy = jest.spyOn(AppStateComponent, 'useAppDispatch').mockReturnValue(mockAppDispatch);
      const { renderFn } = preRenderPage({
        appState: {
          ...initialAppState,
          flow: {
            ...initialAppState.flow,
            memberId: '123',
          },
        },
        mocks: [getZipCodeMock],
      });

      renderFn(WhoNeedsInfacilityCare);

      await waitFor(() =>
        expect(mockAppDispatch).toHaveBeenCalledWith({
          type: 'setZipcode',
          zipcode: '90001',
        })
      );

      spy.mockRestore();
    });

    it('should go to urgency screen', async () => {
      const { renderFn, routerMock } = preRenderPage({
        appState: nthDayState,
        mocks: [getSeekerInfoMock, getZipCodeMock],
      });

      renderFn(WhoNeedsInfacilityCare);

      expect(await screen.findByText('Who needs care?')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Other'));
      expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(routerMock?.push).toHaveBeenCalledTimes(1);
      expect(routerMock?.push).toHaveBeenLastCalledWith(SEEKER_IN_FACILITY_ROUTES.URGENCY);
    });

    it('should fire screen view event mhp_module', async () => {
      jest.spyOn(AnalyticsHelper, 'logEvent');
      const { renderFn } = preRenderPage({
        appState: nthDayState,
      });

      renderFn(WhoNeedsInfacilityCare);
      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Screen Viewed',
        data: {
          lead_flow: 'mhp module',
        },
      });
    });
  });
});
