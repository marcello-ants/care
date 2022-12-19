import { render } from '@testing-library/react';
import Caregiver from '../Caregiver';

const mockProfile = {
  memberId: '1',
  memberUUID: '87c83b40-5c7d-486d-bc09-6175c90af0ad',
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
  qualities: {
    certifiedNursingAssistant: true,
  },
  services: {
    carpooling: true,
  },
};

describe('Caregiver component', () => {
  it('matches snapshot for DW', () => {
    const view = render(<Caregiver currentProvider={mockProfile} />);

    expect(view.asFragment()).toMatchSnapshot();
  });
});
