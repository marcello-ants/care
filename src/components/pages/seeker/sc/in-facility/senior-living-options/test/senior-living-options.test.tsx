import { screen, fireEvent } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';

import { initialAppState } from '@/state';
import { SeniorLivingOptions as RecommendedSeniorLivingOptions } from '@/types/seeker';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';

import SeniorLivingOptions from '../senior-living-options';

const windowLocationAssignMock = jest.fn();

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');

  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn().mockReturnValue(true),
  };
});

describe('SeniorLivingOptions', () => {
  const originalLocation = window.location;

  beforeAll(async () => {
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

  it('Match snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(SeniorLivingOptions);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should show 4 senior living options', () => {
    const { renderFn } = preRenderPage();
    renderFn(SeniorLivingOptions);

    expect(screen.getByText('Independent living')).toBeInTheDocument();
    expect(screen.getByText('Assisted living')).toBeInTheDocument();
    expect(screen.getByText('Memory care')).toBeInTheDocument();
    expect(screen.getByText('Nursing home')).toBeInTheDocument();
  });

  it('Should show the recommended card on the first position', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.MEMORY_CARE,
        },
      },
    });
    renderFn(SeniorLivingOptions);

    const firstCard = screen.getAllByRole('heading', { level: 4 })[0];
    expect(firstCard).toHaveTextContent('Memory care');
  });

  it('Should show RECOMMENDED label on MEMORY CARE', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.MEMORY_CARE,
        },
      },
    });
    renderFn(SeniorLivingOptions);

    const memoryAncestor = screen.getByText('Memory care');
    const descendant = screen.getByText('Our recommendation');
    expect(memoryAncestor).toContainElement(descendant);

    const independentAncestor = screen.getByText('Independent living');
    expect(independentAncestor).not.toContainElement(descendant);

    const assistedAncestor = screen.getByText('Assisted living');
    expect(assistedAncestor).not.toContainElement(descendant);

    const NursingAncestor = screen.getByText('Nursing home');
    expect(NursingAncestor).not.toContainElement(descendant);
  });

  it('Should show RECOMMENDED label on ASSISTED LIVING', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.ASSISTED,
        },
      },
    });
    renderFn(SeniorLivingOptions);

    const descendant = screen.getByText('Our recommendation');

    const assistedAncestor = screen.getByText('Assisted living');
    expect(assistedAncestor).toContainElement(descendant);

    const independentAncestor = screen.getByText('Independent living');
    expect(independentAncestor).not.toContainElement(descendant);

    const NursingAncestor = screen.getByText('Nursing home');
    expect(NursingAncestor).not.toContainElement(descendant);

    const memoryAncestor = screen.getByText('Memory care');
    expect(memoryAncestor).not.toContainElement(descendant);
  });

  it('Should show RECOMMENDED label on INDEPENDENT LIVING', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.INDEPENDENT,
        },
      },
    });
    renderFn(SeniorLivingOptions);

    const descendant = screen.getByText('Our recommendation');

    const independentAncestor = screen.getByText('Independent living');
    expect(independentAncestor).toContainElement(descendant);

    const NursingAncestor = screen.getByText('Nursing home');
    expect(NursingAncestor).not.toContainElement(descendant);

    const assistedAncestor = screen.getByText('Assisted living');
    expect(assistedAncestor).not.toContainElement(descendant);

    const memoryAncestor = screen.getByText('Memory care');
    expect(memoryAncestor).not.toContainElement(descendant);
  });

  it('Should redirect to LOCATION route', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(SeniorLivingOptions);

    const [independentButton] = screen.getAllByText('This sounds right to me');
    fireEvent.click(independentButton);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.LOCATION);
  });

  it('Should redirect to Search Results page', async () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: '' },
        variationIndex: 0,
        value: 'variation',
      },
    };
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        flow: {
          ...initialAppState.flow,
          memberId: '123',
          userHasAccount: true,
        },
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.NURSING_HOME,
          zipcode: '99547',
        },
      },
      flags,
    });
    renderFn(SeniorLivingOptions);

    const nursingHomeButton = screen.getByText('Find caregivers');
    await new Promise((resolve) => setTimeout(resolve, 0));

    fireEvent.click(nursingHomeButton);

    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=99547&milesFromZipCode=20&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true'
    );
  });
  it('Should redirect to AMENITIES route with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations', () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: '' },
        variationIndex: 1,
        value: 'variation',
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
    renderFn(SeniorLivingOptions);

    const [independentButton] = screen.getAllByText('This sounds right to me');
    fireEvent.click(independentButton);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.AMENITIES);
  });

  it('Should redirect to RECAP route with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations for nursing home', () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: '' },
        variationIndex: 1,
        value: 'variation',
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.NURSING_HOME,
        },
      },
      flags,
    });
    renderFn(SeniorLivingOptions);

    const [nursingButton] = screen.getAllByText('This sounds right to me');
    fireEvent.click(nursingButton);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
  it('Should redirect to CZEN with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations for nursing home Nth day flow', () => {
    const flags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: '' },
        variationIndex: 1,
        value: 'variation',
      },
    };
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        flow: {
          ...initialAppState.flow,
          memberId: '123',
          userHasAccount: true,
        },
        seeker: {
          ...initialAppState.seeker,
          recommendedHelpType: RecommendedSeniorLivingOptions.NURSING_HOME,
          zipcode: '02451',
        },
      },
      flags,
    });
    renderFn(SeniorLivingOptions);

    const [nursingButton] = screen.getAllByText('Find caregivers');
    fireEvent.click(nursingButton);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=02451&milesFromZipCode=20&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true'
    );
  });
});
