import { fireEvent, screen } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';

import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { GET_SEEKER_INFO } from '@/components/request/GQL';
import { SeniorCareRecipientCondition } from '@/types/seeker';
import { SEEKER_IN_FACILITY_ROUTES, SEEKER_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { cloneDeep } from 'lodash-es';
import { SENIOR_CARE_TYPE, SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { NextRouter } from 'next/router';
import { preRenderPage } from '@/__setup__/testUtil';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import HelpType from '../help-type';

const initialStateOverride = cloneDeep(initialAppState);

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

describe('help-type page', () => {
  let mockRouter: NextRouter | null;
  let asFragment: any | null = null;

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
    ({ asFragment } = utils.renderFn(HelpType));
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
    expect(screen.getByText(/What kind of help are you looking for/i)).toBeInTheDocument();
  });

  it('renders with PARENT in the header when IN_FACILITY flow', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };
    renderComponent(modifiedInitialState, undefined, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
    expect(screen.getByText(/What kind of help is your parent looking for/i)).toBeInTheDocument();
  });

  it('renders with LOVED ONE in the header when IN_FACILITY flow', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };
    renderComponent(modifiedInitialState, undefined, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
    expect(
      screen.getByText(/What kind of help is your loved one looking for/i)
    ).toBeInTheDocument();
  });

  it('routes to correct path: /seeker/sc/location', () => {
    renderComponent(initialAppState);
    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_ROUTES.LOCATION);
  });

  it('routes to correct path: /sc/in-facility/location enrollment flow', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };
    renderComponent(modifiedInitialState, undefined, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
  });

  it('routes to correct path: /recommended-facility-assisted nth-day flow', async () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
        memberId: '123',
      },
    };
    renderComponent(modifiedInitialState, undefined, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE, [
      getSeekerInfoMock,
    ]);

    expect(await screen.findByText(/Personal Care/i)).toBeInTheDocument();

    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED);
  });

  it('routes to the Nursing options page when Next button is clicked', async () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      flow: { ...initialAppState.flow, userHasAccount: true, memberId: '123' },
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
        condition: SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
      },
    };
    renderComponent(modifiedInitialState, undefined, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE, [
      getSeekerInfoMock,
    ]);

    expect(await screen.findByText(/Personal Care/i)).toBeInTheDocument();

    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.NURSING_OPTIONS);
  });

  it('renders InFacility Memory Care Help Type option', () => {
    const stateOverride = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        typeOfCare: 'IN_FACILITY' as SENIOR_CARE_TYPE,
      },
    };
    renderComponent(stateOverride, undefined, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);

    const memoryCarePill = screen.getByText('Memory care');
    fireEvent.click(memoryCarePill);

    expect(memoryCarePill).toBeInTheDocument();
  });

  it('renders different header when RECOMMENDATION_OPTIMIZATION flow', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };
    const flags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'variant' },
        value: true,
        variationIndex: 1,
      },
    };
    renderComponent(modifiedInitialState, flags, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
    expect(screen.getByText(/What kind of help are they looking for/i)).toBeInTheDocument();
  });

  it('triggers only non-ampli analytic events when feature flag is off', async () => {
    const amplitudeEventListener = jest.spyOn(AnalyticsHelper, 'logEvent');
    const ampliEventListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledCaregiverNeeds');

    renderComponent(
      {
        ...initialStateOverride,
        seeker: {
          ...initialStateOverride.seeker,
          typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
        },
      },
      undefined,
      SEEKER_IN_FACILITY_ROUTES.HELP_TYPE
    );

    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(amplitudeEventListener).toHaveBeenCalled();
    expect(ampliEventListener).not.toHaveBeenCalled();
  });

  it('triggers both analytic events when feature flag is on', async () => {
    const amplitudeEventListener = jest.spyOn(AnalyticsHelper, 'logEvent');
    const ampliEventListener = jest.spyOn(AmpliHelper.ampli, 'memberEnrolledCaregiverNeeds');

    renderComponent(
      {
        ...initialStateOverride,
        seeker: {
          ...initialStateOverride.seeker,
          typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
        },
      },
      {
        [CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]: {
          variationIndex: 1,
          value: 'variation',
          reason: { kind: 'FALLTHROUGH' },
        },
      },
      SEEKER_IN_FACILITY_ROUTES.HELP_TYPE
    );

    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(amplitudeEventListener).toHaveBeenCalled();
    expect(ampliEventListener).toHaveBeenCalled();
  });
});
