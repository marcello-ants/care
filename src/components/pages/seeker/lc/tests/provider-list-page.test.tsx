import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import ProviderListPage from '../provider-list-page';

const mockProviderProfiles = [
  {
    memberId: '1',
    memberUUID: '43a945d4-4325-476e-b29f-ac52eb912f5f',
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
  },
  {
    memberId: '2',
    memberUUID: '43a945d4-4325-476e-b29f-ac52eb912f5f',
    imgSource: '',
    displayName: 'Paola T.',
    firstName: 'Paola',
    averageRating: 4.5,
    numberOfReviews: 12,
    cityAndState: 'Austin, TX',
    distanceFromSeeker: 2,
    minRate: '20',
    maxRate: '25',
    yearsOfExperience: 6,
    biography: 'Current CNA/HHA certification. Hospital and hospice experience. Cardiolo...',
  },
  {
    memberId: '3',
    memberUUID: '37e57bde-aad1-4f61-b891-58fb8bb1afa7',
    imgSource: '',
    displayName: 'Lana K.',
    firstName: 'Lana',
    averageRating: 4.5,
    numberOfReviews: 12,
    cityAndState: 'Austin, TX',
    distanceFromSeeker: 2,
    minRate: '20',
    maxRate: '25',
    yearsOfExperience: 6,
    biography: 'Current CNA/HHA certification. Hospital and hospice experience. Cardiolo...',
  },
];

const mockFavoritedProviderIds = ['1', '2'];

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: any | null = null;

const renderPage = (favoritedProviderIds?: string[]) => {
  mockRouter = {
    push: jest.fn(),
    query: { param: [] },
    asPath: '',
    pathname: '',
    basePath: '',
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <ProviderListPage
      headerText="Header"
      subheaderText="Subheader"
      providerType="provider"
      providerProfiles={mockProviderProfiles}
      favoritedProviderIds={favoritedProviderIds ?? []}
      updateFavoritedProviderIds={() => {}}
      onNextClick={() => {}}
      onSkipClick={() => {}}
      reviewedProvidersIds={[]}
      ctaInteractionLogger={() => {}}
    />
  );
};

describe('ProviderListPage', () => {
  it('matches snapshot', () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('bottom drawer is hidden by default', async () => {
    renderPage();
    expect(screen.queryByText(/You've favorited [*] providers/)).not.toBeInTheDocument();
  });

  it('bottom drawer is shown if at least one provider is favorited', () => {
    renderPage(mockFavoritedProviderIds);
    expect(screen.getByText("You've favorited 2 providers")).toBeInTheDocument();
  });
});
