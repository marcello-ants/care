import { render, screen, waitFor } from '@testing-library/react';
import { useMediaQuery } from '@material-ui/core';
import { Caregiver } from '../CaregiverCard';
import CaregiversPreview from '../CaregiversPreview';

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');

  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn().mockReturnValue(false),
  };
});

describe('CaregiversPreview', () => {
  const defaultCareGivers: Caregiver[] = [
    {
      displayName: 'Moe',
      imageURL: 'https://s.cdn-care.com/img/moe.jpg',
      numberOfReviews: 5,
      yearsOfExperience: 2,
      avgReviewRating: 5.0,
      signUpDate: new Date('2020-06-17T11:48:00.000Z'),
    },
    {
      displayName: 'Larry',
      imageURL: 'https://s.cdn-care.com/img/larry.jpg',
      numberOfReviews: 5,
      yearsOfExperience: 2,
      avgReviewRating: 5.0,
      signUpDate: new Date('2020-06-17T11:48:00.000Z'),
    },
    {
      displayName: 'Curly',
      imageURL: 'https://s.cdn-care.com/img/curly.jpg',
      numberOfReviews: 5,
      yearsOfExperience: 2,
      avgReviewRating: 5.0,
      signUpDate: new Date(),
    },
  ];

  let onComplete: jest.Mock;
  beforeEach(() => {
    onComplete = jest.fn();
  });

  function renderComponent(careGivers?: Caregiver[]) {
    return render(
      <CaregiversPreview caregivers={careGivers || defaultCareGivers} onComplete={onComplete} />
    );
  }

  it('should match the snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot();
  });

  it('should call onComplete after displaying the passed caregivers', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderComponent([defaultCareGivers[0]]);
    await waitFor(() => expect(screen.getByText('Moe')).toBeVisible(), { timeout: 2000 });
    await waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('should display all caregivers that are passed', () => {
    renderComponent([
      ...defaultCareGivers,
      {
        displayName: 'Shemp',
        imageURL: 'https://s.cdn-care.com/img/curly.jpg',
        numberOfReviews: 5,
        yearsOfExperience: 2,
        avgReviewRating: 5.0,
        signUpDate: new Date('2020-06-17T11:48:00.000Z'),
      },
    ]);

    expect(screen.getByText('Moe')).toBeInTheDocument();
    expect(screen.getByText('Larry')).toBeInTheDocument();
    expect(screen.getByText('Curly')).toBeInTheDocument();
    expect(screen.getByText('Shemp')).toBeInTheDocument();
  });

  it('should render new member experience with no reviews and signUpDate < 6 months', () => {
    const noReviewNewMember: Caregiver = {
      displayName: 'Moe',
      imageURL: 'https://s.cdn-care.com/img/moe.jpg',
      numberOfReviews: 0,
      yearsOfExperience: 2,
      avgReviewRating: 0.0,
      signUpDate: new Date(),
    };

    renderComponent([noReviewNewMember]);
    expect(screen.getByText('New member')).toBeInTheDocument();
  });
  it('should render years of experience with no reviews and signUpDate > 6 months', () => {
    const noReviewNewMember: Caregiver = {
      displayName: 'Moe',
      imageURL: 'https://s.cdn-care.com/img/moe.jpg',
      numberOfReviews: 0,
      yearsOfExperience: 2,
      avgReviewRating: 0.0,
      signUpDate: new Date('2020-06-17T11:48:00.000Z'),
    };

    renderComponent([noReviewNewMember]);
    expect(screen.getByText('2 yrs exp')).toBeInTheDocument();
  });
  it('should render a progressbar', () => {
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should not render a progress bar if onComplete is not passed', () => {
    render(<CaregiversPreview caregivers={defaultCareGivers} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
