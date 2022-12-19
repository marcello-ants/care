import { screen, fireEvent } from '@testing-library/react';

import { NextRouter } from 'next/router';
import { preRenderPage } from '@/__setup__/testUtil';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { SEEKER_IN_FACILITY_ROUTES, SEEKER_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { cloneDeep } from 'lodash-es';
import { SENIOR_CARE_TYPE, SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import HelpType from '@/pages/seeker/sc/in-facility/help-type';

const initialStateOverride = cloneDeep(initialAppState);

describe('help-type page', () => {
  let mockRouter: NextRouter | null;
  let asFragment: any | null = null;

  const renderComponent = (
    initialState: AppState,
    ldFlags: FeatureFlags = {},
    pathName: string = '/seeker/sc/help-type'
  ) => {
    const utils = preRenderPage({
      appState: initialState,
      flags: ldFlags,
      pathname: pathName,
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

  it('routes to the location page', () => {
    renderComponent(initialAppState);
    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_ROUTES.LOCATION);
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

  it('routes to the location page when Next button is clicked', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.NOT_SURE,
      },
    };
    renderComponent(modifiedInitialState);
    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_ROUTES.LOCATION);
  });

  it('routes to the recommendation page when Next button is clicked inside salc optimization test', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    const flags = {
      'enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations': {
        reason: { kind: '' },
        value: 1,
        variationIndex: 1,
      },
    };

    renderComponent(modifiedInitialState, flags);
    const houseHoldTasksPill = screen.getByText(/Personal Care/i);
    fireEvent.click(houseHoldTasksPill);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockRouter?.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED);
  });
  it('renders InFacility Memory Care Help Type option', () => {
    const stateOverride = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        typeOfCare: 'IN_FACILITY' as SENIOR_CARE_TYPE,
      },
    };
    const flags = {
      'enrollment-mfe-caring-lead-optimization': {
        reason: { kind: 'FALLTHROUGH' },
        value: true,
        variationIndex: 0,
      },
    };
    renderComponent(stateOverride, flags, SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);

    const memoryCarePill = screen.getByText('Memory care');
    fireEvent.click(memoryCarePill);

    expect(memoryCarePill).toBeInTheDocument();
  });
});
