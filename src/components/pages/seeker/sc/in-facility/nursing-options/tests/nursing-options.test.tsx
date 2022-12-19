import { useRouter } from 'next/router';
import { screen, fireEvent } from '@testing-library/react';

import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { preRenderPage } from '@/__setup__/testUtil';
import { FeatureFlags } from '@/components/FeatureFlagsContext';

import NursingOptions from '../nursing-options';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('in facility nursing-home', () => {
  let mockRouter: any = null;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/in-facility/nursing-home',
      asPath: '/seeker/sc/in-facility/nursing-home',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(NursingOptions);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correclty when whoNeedsCare equals "SELF"', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'SELF' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help do you need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
  });

  it('renders correclty when whoNeedsCare equals "OTHER"', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help does your loved one need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
  });

  it('renders correclty when whoNeedsCare equals "PARENT"', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help does your parent need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
  });

  it('should go to the correct route when Litte to no help is selected', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help does your loved one need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
    const clickableOption = screen.getByText('Little to no help');
    fireEvent.click(clickableOption);
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED);
  });
  it('should go to the correct route when Minimal assistance getting up is selected', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help does your loved one need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
    const clickableOption = screen.getByText('Minimal assistance getting up');
    fireEvent.click(clickableOption);
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED);
  });
  it('should go to the correct route when extensive support is selected', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help does your loved one need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
    const clickableOption = screen.getByText(
      'Extensive support (multiple people or special technology)'
    );
    fireEvent.click(clickableOption);
    expect(mockRouter.push).toHaveBeenCalledWith(
      SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME
    );
  });

  it('should go to the correct route when salc optimization flag is on', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: '' },
        variationIndex: 1,
        value: 'variation',
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState, flags });
    renderFn(NursingOptions);
    expect(
      screen.getByText(
        /How much help does your loved one need with daily tasks like bathing, dressing and using the restroom?/
      )
    ).toBeInTheDocument();
    const clickableOption = screen.getByText(
      'Extensive support (multiple people or special technology)'
    );
    fireEvent.click(clickableOption);
    expect(mockRouter.push).toHaveBeenCalledWith(
      SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME_IN_FACILITY
    );
  });
});
