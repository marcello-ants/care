import { useRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';

import CaregiverListPage from '../caregiver-list';

const mockProviderProfiles = [
  {
    memberId: '1',
    memberUUID: '312b10e6-7797-4f4e-9a1d-74a7d8271e93',
    imgSource: '',
    displayName: 'Olivia D.',
    firstName: 'Olivia',
    averageRating: 5,
    numberOfReviews: 3,
    cityAndState: 'Austin, TX',
    distanceFromSeeker: 1.2,
    minRate: '25',
    maxRate: '30',
    yearsOfExperience: 10,
    biography: 'I am a CNA who’s been working in this field for more than 10 years. I enjoy...',
    numberReviews: 10,
    attributeTags: [],
    listedAttributests: [],
  },
  {
    memberId: '2',
    memberUUID: 'fc60a286-0352-401f-9752-f4d7b0751148',
    imgSource: '',
    displayName: 'Paola T.',
    firstName: 'Paola',
    averageRating: 4.5,
    numberOfReviews: 2,
    cityAndState: 'Austin, TX',
    distanceFromSeeker: 2,
    minRate: '20',
    maxRate: '25',
    yearsOfExperience: 6,
    biography: 'Current CNA/HHA certification. Hospital and hospice experience. Cardiolo...',
    numberReviews: 11,
    attributeTags: [],
    listedAttributests: [],
  },
];

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    jobPost: {
      ...initialAppState.seeker.jobPost,
    },
    zipcode: '02453',
  },
  seekerCC: {
    ...initialAppState.seekerCC,
    lcProviders: mockProviderProfiles,
  },
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: any | null = null;

const renderPage = async () => {
  mockRouter = {
    push: jest.fn(),
    query: { param: [] },
    asPath: '',
    pathname: '',
    basePath: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  const view = render(
    <RouterContext.Provider value={mockRouter}>
      <MockedProvider>
        <AppStateProvider initialStateOverride={initialState}>
          <CaregiverListPage />
        </AppStateProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );

  await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

  return view;
};

describe('CaregiverListPage', () => {
  afterEach(() => {
    mockRouter = null;
  });
  it('matches snapshot', async () => {
    const view = await renderPage();

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('favorites caregiver on favorite button click', async () => {
    await renderPage();

    const favoriteButtons = await screen.findAllByTestId('favoriteButton');
    favoriteButtons[0].click();

    expect(screen.getByText("You've favorited 1 caregiver")).toBeInTheDocument();
  });

  it('unfavorites caregiver on second favorite button click', async () => {
    await renderPage();

    const favoriteButtons = await screen.findAllByTestId('favoriteButton');
    favoriteButtons[0].click();
    favoriteButtons[0].click();

    expect(screen.queryByText("You've favorited 1 caregiver")).not.toBeInTheDocument();
  });
});
