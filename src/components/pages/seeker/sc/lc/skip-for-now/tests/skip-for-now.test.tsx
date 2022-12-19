import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { jobPostInitialState } from '@/state/seeker/reducer';
import SkipForNow from '../skip-for-now';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('when needs care', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;
  let renderResult: any | null = null;

  const renderComponent = (initialInnerState: AppState) => {
    renderResult = render(
      <AppStateProvider initialStateOverride={initialInnerState}>
        <SkipForNow />
      </AppStateProvider>
    );
    ({ asFragment } = renderResult);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/lc/skip-for-now',
      asPath: '/seeker/sc/lc/skip-for-now',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    mockRouter = null;
    asFragment = null;
  });

  it('matches snapshot', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
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
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correct heading when multiple caregivers', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
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
        /We’ve saved these caregivers to your favorites list so you can easily access them later/
      )
    ).toBeInTheDocument();
  });

  it('renders correct heading when single caregiver', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
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
        /We’ve saved this caregiver to your favorites list so you can easily access them later/
      )
    ).toBeInTheDocument();
  });

  it('should go to search results to see all providers when skip button clicked', async () => {
    const assignMock = jest.fn();
    const { location } = window;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { assign: assignMock };

    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        jobPost: { ...jobPostInitialState, zip: '78665' },
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);

    // Select Keep Browsing to load next provider
    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    nextButton.click();

    window.location = location;
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        '/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=78665&overrideMfeRedirect=true'
      )
    );
  });
});
