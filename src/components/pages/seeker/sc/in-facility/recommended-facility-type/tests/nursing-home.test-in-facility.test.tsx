import { screen, fireEvent } from '@testing-library/react';
import { FeatureFlags } from '@/components/FeatureFlagsContext';

import { preRenderPage } from '@/__setup__/testUtil';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';

import { initialAppState } from '@/state';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';

import NursingHomeInfacility from '../nursing-home-in-facility';

const windowLocationAssignMock = jest.fn();

describe('RecommendedFacilityType - NursingHomeInfacility', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Match Snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(NursingHomeInfacility);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        },
      },
    });
    renderFn(NursingHomeInfacility);

    expect(
      screen.getByText('Based on what you’ve shared, a nursing home may match your needs.')
    ).toBeInTheDocument();
  });

  it('Should call router with correct url: CONTINUE', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(NursingHomeInfacility);

    const continueButton = screen.getByText('Yes, continue');
    fireEvent.click(continueButton);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
  });

  it('Should call router with correct url: THIS DOES NOT LOOK RIGHT', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(NursingHomeInfacility);

    const notLookRight = screen.getByText("This doesn't look right");
    fireEvent.click(notLookRight);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.SENIOR_LIVING_OPTIONS);
  });

  it('Variant / Should route to the /recap page', () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        variationIndex: 1,
        value: true,
        reason: { kind: 'variant' },
      },
    };
    const { renderFn, routerMock } = preRenderPage({ flags });
    renderFn(NursingHomeInfacility);

    fireEvent.click(screen.getByText('Yes, continue'));

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
