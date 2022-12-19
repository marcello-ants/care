import { render, screen, waitFor } from '@testing-library/react';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import Recap from '@/components/pages/seeker/sc/lc/recap/recap';
import { useRouter } from 'next/router';
import { MinimalProviderProfile } from '@/types/seeker';
import { SEEKER_LEAD_CONNECT_ROUTES } from '@/constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('L&C Recap Page', () => {
  const defaultProviders = [
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
      imgSource: '/app/enrollment/tasha.jpg',
      memberId: '3501',
      memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
      numberReviews: 0,
      yearsOfExperience: 10,
      signUpDate: new Date('2020-06-17T11:48:00.000Z'),
    },
  ];

  let mockRouter: any | null = null;

  function renderComponent(profiles?: MinimalProviderProfile[]) {
    const initialState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: {
          ...initialAppState.seeker.leadAndConnect,
          acceptedProviders: profiles || defaultProviders,
        },
      },
    };

    const container = document.createElement('div');
    const lcHeader = document.createElement('div');
    lcHeader.id = 'lcheader';
    container.appendChild(lcHeader);

    return render(
      <AppStateProvider initialStateOverride={initialState}>
        <Recap />
      </AppStateProvider>,
      {
        container: document.body.appendChild(container),
      }
    );
  }

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/lc/recap',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('matches snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot();
  });

  it('should display the number of caregivers added', () => {
    renderComponent();
    expect(screen.getByText("Great! You've added 3 caregivers to your list")).toBeInTheDocument();
  });

  it('should adjust wording when only one caregiver is selected', () => {
    renderComponent(defaultProviders.slice(0, 1));
    expect(screen.getByText("Great! You've added 1 caregiver to your list")).toBeInTheDocument();
  });

  it('should navigate to the upgrade or skip page when complete', async () => {
    renderComponent(defaultProviders.slice(0, 1));
    await waitFor(
      () =>
        expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_LEAD_CONNECT_ROUTES.UPGRADE_OR_SKIP),
      { timeout: 4000 }
    );
  });
});
