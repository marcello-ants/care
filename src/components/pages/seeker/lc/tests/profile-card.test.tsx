import { render, screen } from '@testing-library/react';

import ProfileCard from '@/components/pages/seeker/lc/profile-card';

const mockProfile = {
  memberId: '1',
  memberUUID: '1094159e-f4e4-4be4-9c41-39b025c2c50a',
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
};

const onFavoriteMock = jest.fn();
const onOpenProfileDrawerMock = jest.fn();

describe('ProfileCard', () => {
  it('matches snapshot for DW', () => {
    const view = render(
      <ProfileCard
        isDesktopOrUp
        profile={mockProfile}
        isFavorited={false}
        onFavorite={() => {}}
        showRates={false}
        onClick={() => {}}
      />
    );

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot for MW', () => {
    const view = render(
      <ProfileCard
        isDesktopOrUp={false}
        profile={mockProfile}
        isFavorited={false}
        onFavorite={() => {}}
        showRates={false}
        onClick={() => {}}
      />
    );

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('favorites provider on click', async () => {
    render(
      <ProfileCard
        isDesktopOrUp
        profile={mockProfile}
        isFavorited={false}
        onFavorite={onFavoriteMock}
        showRates={false}
        onClick={() => {}}
      />
    );

    const favoriteButton = await screen.findByTestId('favoriteButton');
    favoriteButton.click();

    expect(onFavoriteMock).toHaveBeenCalled();
  });

  it('opens profile drawer on card click', async () => {
    render(
      <>
        <ProfileCard
          isDesktopOrUp
          profile={mockProfile}
          isFavorited={false}
          onFavorite={() => {}}
          showRates={false}
          onClick={onOpenProfileDrawerMock}
        />
      </>
    );

    const card = await screen.findByTestId('caregiverCard');
    card.click();

    expect(onOpenProfileDrawerMock).toHaveBeenCalled();
  });
});
