import { screen, fireEvent } from '@testing-library/react';
import { FeatureFlags } from '@/components/FeatureFlagsContext';

import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { initialAppState } from '@/state';

import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { preRenderPage } from '@/__setup__/testUtil';

import Independent from '../independent';

describe('RecommendedFacilityType - Independent', () => {
  it('Match Snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(Independent);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render information with PARENT header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        },
      },
    });
    renderFn(Independent);

    expect(
      screen.getByText("An independent living community may match your parent's needs.")
    ).toBeInTheDocument();
  });

  it('Should render information with SPOUSE header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.SPOUSE,
        },
      },
    });
    renderFn(Independent);

    expect(
      screen.getByText("An independent living community may match your spouse's needs.")
    ).toBeInTheDocument();
  });

  it('Should render information with SELF header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.SELF,
        },
      },
    });
    renderFn(Independent);

    expect(
      screen.getByText('An independent living community may match your needs.')
    ).toBeInTheDocument();
  });

  it('Should render information with LOVED ONE header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.OTHER,
        },
      },
    });
    renderFn(Independent);

    expect(
      screen.getByText("An independent living community may match your loved one's needs.")
    ).toBeInTheDocument();
  });

  it('Should call router with correct url: CONTINUE', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(Independent);

    const continueButton = screen.getByText('Yes, continue');
    fireEvent.click(continueButton);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
  });

  it('Should call router with correct url: THIS DOES NOT LOOK RIGHT', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(Independent);

    const notLookRight = screen.getByText("This doesn't look right");
    fireEvent.click(notLookRight);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.SENIOR_LIVING_OPTIONS);
  });

  it('Variant / Should route to the /amenities page', () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        variationIndex: 1,
        value: true,
        reason: { kind: 'variant' },
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          assistedLivingCenterFacilityCount: 5,
        },
      },
      flags,
    });
    renderFn(Independent);

    fireEvent.click(screen.getByText('Yes, continue'));

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.AMENITIES);
  });

  it('Variant / Should route to the /recap page if unhappy path', () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        variationIndex: 1,
        value: true,
        reason: { kind: 'variant' },
      },
    };

    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          assistedLivingCenterFacilityCount: 0,
        },
      },
      flags,
    });
    renderFn(Independent);

    fireEvent.click(screen.getByText('Yes, continue'));

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
