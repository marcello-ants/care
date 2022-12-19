import { render, screen } from '@testing-library/react';
import CaregiverCard, { CaregiverCardProps } from '../CaregiverCard';

describe('CaregiverCard', () => {
  const defaultProps: CaregiverCardProps[] = [
    {
      caregiver: {
        displayName: 'Tim A.',
        imageURL: 'https://s.cdn-care.com/img/cms/web/aboutUs/team/MT-tallen-227x227.jpg',
        numberOfReviews: 100,
        yearsOfExperience: 10,
        avgReviewRating: 5.0,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
    },
    {
      caregiver: {
        displayName: 'Ryan L.',
        imageURL: 'https://s.cdn-care.com/img/cms/web/aboutUs/team/MT-tallen-227x227.jpg',
        numberOfReviews: 0,
        yearsOfExperience: 0,
        avgReviewRating: 0.0,
        signUpDate: new Date(),
      },
    },
    {
      caregiver: {
        displayName: 'Chris B.',
        imageURL: 'https://s.cdn-care.com/img/cms/web/aboutUs/team/MT-tallen-227x227.jpg',
        numberOfReviews: 0,
        yearsOfExperience: 8,
        avgReviewRating: 0.0,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
    },
  ];

  function renderComponent(props?: CaregiverCardProps) {
    return render(<CaregiverCard {...(props || defaultProps[0])} />);
  }

  it('should match the snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot();
  });
  it('render experience correctly for no reviews, sign up date < 6 months', async () => {
    renderComponent(defaultProps[1]);
    expect(screen.getByText('New member')).toBeInTheDocument();
  });
  it('render experience correctly for no reviews, sign up date > 6 months', async () => {
    renderComponent(defaultProps[2]);
    expect(screen.getByText('8 yrs exp')).toBeInTheDocument();
  });
});
