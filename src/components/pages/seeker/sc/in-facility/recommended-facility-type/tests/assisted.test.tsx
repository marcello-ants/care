import { screen, fireEvent } from '@testing-library/react';

import { FeatureFlags } from '@/components/FeatureFlagsContext';

import { preRenderPage } from '@/__setup__/testUtil';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { initialAppState } from '@/state';
import Assisted from '../assisted';

describe('RecommendedFacilityType - Assisted', () => {
  it('Match Snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(Assisted);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render header with PARENT text', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        },
      },
    });
    renderFn(Assisted);

    expect(
      screen.getByText("An assisted living community may match your parent's needs.")
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
    renderFn(Assisted);

    expect(
      screen.getByText("An assisted living community may match your spouse's needs.")
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
    renderFn(Assisted);

    expect(
      screen.getByText('An assisted living community may match your needs.')
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
    renderFn(Assisted);

    expect(
      screen.getByText("An assisted living community may match your loved one's needs.")
    ).toBeInTheDocument();
  });

  it('Should call router with correct url: CONTINUE', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(Assisted);

    const continueButton = screen.getByText('Yes, continue');
    fireEvent.click(continueButton);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
  });

  it('Should call router with correct url: THIS DOES NOT LOOK RIGHT', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(Assisted);

    const notLookRight = screen.getByText("This doesn't look right");
    fireEvent.click(notLookRight);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.SENIOR_LIVING_OPTIONS);
  });

  it('Variant / Should route to the /amenities page if happy path', () => {
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
    renderFn(Assisted);

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
    renderFn(Assisted);

    fireEvent.click(screen.getByText('Yes, continue'));

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
