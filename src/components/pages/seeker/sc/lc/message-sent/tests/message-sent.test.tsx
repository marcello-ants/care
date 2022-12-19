import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import MessageSent from '../message-sent';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('when needs care', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;

  const renderComponent = (initialInnerState: AppState) => {
    const view = render(
      <AppStateProvider initialStateOverride={initialInnerState}>
        <MessageSent />
      </AppStateProvider>
    );
    ({ asFragment } = view);
  };

  const { location: originalLocation } = window;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/lc/message-sent',
      asPath: '/seeker/sc/lc/message-sent',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // @ts-ignore
    delete window.location;
    /* eslint-disable no-restricted-globals */
    (window.location as Pick<typeof window.location, 'assign'>) = {
      assign: jest.fn(),
    };
  });

  afterEach(() => {
    mockRouter = null;
    asFragment = null;
    window.location = originalLocation;
  });

  const defaultProviders = [
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
      imgSource: '/tasha.jpg',
      memberId: '3501',
      memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
      numberReviews: 0,
      yearsOfExperience: 10,
    },
  ];

  it('matches snapshot', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: {
          ...initialAppState.seeker.leadAndConnect,
          acceptedProviders: defaultProviders,
        },
      },
    };
    renderComponent(overrideState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct heading when more than 3 caregivers are provided', () => {
    const acceptedProviders = [
      ...defaultProviders,
      {
        displayName: 'Mikasa A.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '350178',
        memberUUID: '3079eb2a-81bd-4906-b6b4-4125e437c148',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(
      screen.getByText(
        /Your message has been sent to Michelle T., Lauren K., Tasha M., and Mikasa A./
      )
    ).toBeInTheDocument();
  });

  it('renders correct heading when 3 caregivers are provided', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: {
          ...initialAppState.seeker.leadAndConnect,
          acceptedProviders: defaultProviders,
        },
      },
    };
    renderComponent(overrideState);
    expect(
      screen.getByText(/Your message has been sent to Michelle T., Lauren K., and Tasha M./)
    ).toBeInTheDocument();
  });

  it('renders correct heading when 2 caregivers are provided', () => {
    const acceptedProviders = defaultProviders.slice(0, 2);
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(
      screen.getByText(/Your message has been sent to Michelle T. and Lauren K./)
    ).toBeInTheDocument();
  });

  it('renders correct heading when single caregiver', () => {
    const acceptedProviders = defaultProviders.slice(0, 1);
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(screen.getByText(/Your message has been sent to Michelle T./)).toBeInTheDocument();
  });

  it('renders correct heading when no caregivers', () => {
    renderComponent(initialAppState);
    expect(screen.getByText(/Your message has been sent/)).toBeInTheDocument();
  });

  it('should navigate to /ppr.do#3 after 3 seconds', async () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: {
          ...initialAppState.seeker.leadAndConnect,
          acceptedProviders: defaultProviders,
        },
      },
    };
    renderComponent(overrideState);
    await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/ppr.do#3'), {
      timeout: 4000,
    });
  });
});
