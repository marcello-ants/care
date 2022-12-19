import { screen, fireEvent } from '@testing-library/react';

import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { preRenderPage } from '@/__setup__/testUtil';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';

import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { initialAppState } from '@/state';

import MemoryCare from '../memory-care';

describe('RecommendedFacilityType - MemoryCare', () => {
  it('Match Snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(MemoryCare);
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
    renderFn(MemoryCare);

    expect(
      screen.getByText("A specialized memory care community may match your parent's needs.")
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
    renderFn(MemoryCare);

    expect(
      screen.getByText("A specialized memory care community may match your spouse's needs.")
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
    renderFn(MemoryCare);

    expect(
      screen.getByText('A specialized memory care community may match your needs.')
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
    renderFn(MemoryCare);

    expect(
      screen.getByText("A specialized memory care community may match your loved one's needs.")
    ).toBeInTheDocument();
  });

  it('Should call router with correct url: CONTINUE', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(MemoryCare);

    const continueButton = screen.getByText('Yes, continue');
    fireEvent.click(continueButton);
    expect(routerMock.push).toBeCalledTimes(1);
    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
  });

  it('Should call router with correct url: THIS DOES NOT LOOK RIGHT', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(MemoryCare);

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
    renderFn(MemoryCare);

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
    renderFn(MemoryCare);

    fireEvent.click(screen.getByText('Yes, continue'));

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
