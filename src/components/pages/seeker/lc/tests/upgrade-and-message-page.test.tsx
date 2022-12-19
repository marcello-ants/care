import { render, screen } from '@testing-library/react';

import UpgradeAndMessagePage from '../upgrade-and-message-page';

const mockProviderProfiles = [
  {
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
  },
  {
    memberId: '2',
    memberUUID: '01de07fd-7a0b-4326-b83a-15bfa8163c9c',
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
  },
];

describe('UpgradeAndMessagePage', () => {
  it('matches snapshot', () => {
    const view = render(
      <UpgradeAndMessagePage
        providerProfiles={mockProviderProfiles}
        onUpgradeClick={() => {}}
        onSkipClick={() => {}}
      />
    );

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('handles clicks', async () => {
    const onUpgradeClick = jest.fn();
    const onSkipClick = jest.fn();

    render(
      <UpgradeAndMessagePage
        providerProfiles={mockProviderProfiles}
        onUpgradeClick={onUpgradeClick}
        onSkipClick={onSkipClick}
      />
    );

    const upgradeButton = await screen.findByText('Send a message');
    const skipButton = await screen.findByText('Not yet');
    upgradeButton.click();
    skipButton.click();

    expect(onUpgradeClick).toHaveBeenCalled();
    expect(onSkipClick).toHaveBeenCalled();
  });
});
