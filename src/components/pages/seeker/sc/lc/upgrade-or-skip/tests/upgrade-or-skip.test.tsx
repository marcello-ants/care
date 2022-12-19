import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider, useMediaQuery } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import UpgradeOrSkip from '../upgrade-or-skip';

const mockCookie = {
  set: jest.fn(),
};
jest.mock('universal-cookie', () => {
  return jest.fn(() => mockCookie);
});
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');

  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn().mockReturnValue(false),
  };
});

describe('upgrade or skip lead connect', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;
  let renderResult: any | null = null;

  const renderComponent = (initialInnerState: AppState, ldFlags?: FeatureFlags | undefined) => {
    renderResult = render(
      <FeatureFlagsProvider flags={ldFlags || {}}>
        <AppStateProvider initialStateOverride={initialInnerState}>
          <ThemeProvider theme={theme}>
            <UpgradeOrSkip />
          </ThemeProvider>
        </AppStateProvider>
      </FeatureFlagsProvider>
    );
    ({ asFragment } = renderResult);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/lc/upgrade-or-skip',
      asPath: '/seeker/sc/lc/upgrade-or-skip',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    mockRouter = null;
    asFragment = null;
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 3, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const allProviders = [
    {
      displayName: 'Michelle T.',
      imgSource: '/app/enrollment/joanna.jpg',
      memberId: '23135',
      memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
      numberReviews: 0,
      yearsOfExperience: 10,
    },
    {
      averageRating: 3,
      displayName: 'Lauren K.',
      imgSource: '/app/enrollment/lauren.jpg',
      memberId: '69817',
      memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
      numberReviews: 8,
      yearsOfExperience: 2,
    },
    {
      displayName: 'Tasha M.',
      imgSource: '/app/enrollment/tasha.jpg',
      memberId: '3501',
      memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
      numberReviews: 0,
      yearsOfExperience: 10,
    },
    {
      displayName: 'Mikasa A.',
      imgSource: '/app/enrollment/mikasa.jpg',
      memberId: '350178',
      memberUUID: '3079eb2a-81bd-4906-b6b4-4125e437c148',
      numberReviews: 0,
      yearsOfExperience: 10,
    },
    {
      displayName: 'John D.',
      imgSource: '/app/enrollment/john.jpg',
      memberId: '350179',
      memberUUID: '06a502e9-ffbd-49f7-a90d-f1bacf928114',
      numberReviews: 2,
      yearsOfExperience: 3,
    },
  ];

  function stateWithNumProviders(numProviders: number): AppState {
    const acceptedProviders = allProviders.slice(0, numProviders);
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };

    return overrideState;
  }

  it('matches snapshot', () => {
    renderComponent(stateWithNumProviders(3));
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct heading when more than 3 caregivers are provided', () => {
    renderComponent(stateWithNumProviders(5));
    expect(
      screen.getByText(
        "Let's get you started with evaluating these caregivers and many more like them."
      )
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('img')).toHaveLength(5);
  });

  it('renders correct heading when 3 caregivers are provided', () => {
    renderComponent(stateWithNumProviders(3));
    expect(
      screen.getByText(
        "Let's get you started with evaluating these caregivers and many more like them."
      )
    ).toBeInTheDocument();
  });

  it('renders correct heading when 2 caregivers are provided', () => {
    renderComponent(stateWithNumProviders(2));
    expect(
      screen.getByText(
        "Let's get you started with evaluating these caregivers and many more like them."
      )
    ).toBeInTheDocument();
  });

  it('renders correct heading when single caregiver', () => {
    renderComponent(stateWithNumProviders(1));
    expect(
      screen.getByText(
        "Let's get you started with evaluating these caregivers and many more like them."
      )
    ).toBeInTheDocument();
  });

  it('should go to mobile nth day rate card when upgrade button clicked', async () => {
    const assignMock = jest.fn();
    const { location } = window;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { assign: assignMock };

    renderComponent(stateWithNumProviders(1));

    // Select Keep Browsing to load next provider
    const upgradeButton = screen.getByRole('button', {
      name: 'Get started',
    });
    upgradeButton.click();

    window.location = location;
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith('/mwb/seeker/upgrade/pricingPlans')
    );

    // the cookie was set
    await waitFor(() =>
      expect(mockCookie.set).toHaveBeenCalledWith('lead_and_connect_origin', 'true', {
        path: '/',
        expires: new Date(2022, 3, 1),
      })
    );
  });

  it('should go to desktop nth day rate card when upgrade button clicked', async () => {
    const assignMock = jest.fn();
    const { location } = window;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { assign: assignMock };

    (useMediaQuery as jest.Mock).mockImplementation(
      (breakpoint) => breakpoint === theme.breakpoints.up('md')
    );

    renderComponent(stateWithNumProviders(1));

    // Select Keep Browsing to load next provider
    const upgradeButton = screen.getByRole('button', {
      name: 'Get started',
    });
    upgradeButton.click();

    window.location = location;
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/seeker\/upgradeMembershipPlanActual.do/)
      )
    );
  });

  it('should go to the skip for now page when the skip button clicked', async () => {
    renderComponent(stateWithNumProviders(1));

    // Select Keep Browsing to load next provider
    const skipButton = screen.getByRole('button', {
      name: 'Not yet',
    });
    skipButton.click();
    expect(mockRouter.push).toHaveBeenCalledWith('/seeker/sc/lc/skip-for-now');
  });

  it('should render smaller thumbnails on smaller screens', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderComponent(stateWithNumProviders(1));

    const thumbnail = screen.getByRole('img');
    // eslint-disable-next-line no-self-assign
    document.head.innerHTML = document.head.innerHTML;
    expect(thumbnail.parentElement).toHaveStyle({ width: '48px', height: '48px' });
  });
});
