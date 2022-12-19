import { fireEvent, render, screen } from '@testing-library/react';

import NeedSomeTipsBanner from '@/components/NeedSomeTipsBanner';

describe('NeedSomeTipsBanner', () => {
  it('matches snapshot', () => {
    const view = render(<NeedSomeTipsBanner verticalName="PC" />);

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('shows popup with CC copy on click', async () => {
    render(<NeedSomeTipsBanner verticalName="CC" />);
    const bannerLink = screen.getByText('Need some tips?');

    fireEvent.click(bannerLink);

    expect(screen.getByText('Tell caregivers more about your:')).toBeInTheDocument();
  });

  it('shows popup with PC copy on click', async () => {
    render(<NeedSomeTipsBanner verticalName="PC" />);
    const bannerLink = screen.getByText('Need some tips?');

    fireEvent.click(bannerLink);

    expect(screen.getByText('Tell pet caregivers more about your:')).toBeInTheDocument();
  });

  it('shows popup with TU copy on click', async () => {
    render(<NeedSomeTipsBanner verticalName="TU" />);
    const bannerLink = screen.getByText('Need some tips?');

    fireEvent.click(bannerLink);

    expect(screen.getByText('Tell tutors more about your:')).toBeInTheDocument();
  });
});
