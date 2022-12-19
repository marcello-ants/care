import React from 'react';
import { render, screen } from '@testing-library/react';

import RatingOrExperience, { IRatingOrExperience } from '../RatingOrExperience';

describe('RatingOrExperience', () => {
  const renderComponent = (props: IRatingOrExperience) => {
    render(<RatingOrExperience {...props} />);
  };

  const now = new Date();
  it('renders "new member" when signUpDate is less than 6 months ago', () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth((now.getMonth() - 1) % 12);
    const props = {
      averageRating: 0,
      numberReviews: 0,
      yearsOfExperience: 0,
      signUpDate: oneMonthAgo,
    };
    renderComponent(props);
    expect(screen.getByText(/New member/)).toBeInTheDocument();
  });
  it('renders "yr exp" when signUpDate is greater than 6 months ago', () => {
    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth((now.getMonth() - 8) % 12);
    const props = {
      averageRating: 0,
      numberReviews: 0,
      yearsOfExperience: 0.6,
      signUpDate: eightMonthsAgo,
    };
    renderComponent(props);
    expect(screen.getByText(/1 yr exp/)).toBeInTheDocument();
  });

  it('renders "yrs exp" when signUpDate is greater than one year ago', () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);
    const props = {
      averageRating: 0,
      numberReviews: 0,
      yearsOfExperience: 1.5,
      signUpDate: twoYearsAgo,
    };
    renderComponent(props);
    expect(screen.getByText(/2 yrs exp/)).toBeInTheDocument();
  });

  it('renders rating component when averageRating >= 1', () => {
    const props = {
      averageRating: 1,
      numberReviews: 0,
      yearsOfExperience: 0.6,
      signUpDate: now,
    };
    renderComponent(props);
    expect(screen.getByTestId('rating')).toBeInTheDocument();
  });
});
