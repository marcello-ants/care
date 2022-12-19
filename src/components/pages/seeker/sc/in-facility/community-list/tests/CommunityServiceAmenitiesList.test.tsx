import { render, screen } from '@testing-library/react';
import CommunityServiceAmenitiesList from '../CommunityServiceAmenitiesList';

const props = {
  list: ['one', 'two', 'three'],
  title: 'test',
};

describe('CommunityServiceAmenitiesList', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<CommunityServiceAmenitiesList {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    render(<CommunityServiceAmenitiesList {...props} />);
    const one = screen.getByText('one');
    const two = screen.getByText('two');
    const three = screen.getByText('three');
    expect(one).toBeInTheDocument();
    expect(two).toBeInTheDocument();
    expect(three).toBeInTheDocument();
  });
});
