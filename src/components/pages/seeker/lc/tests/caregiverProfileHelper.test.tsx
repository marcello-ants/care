import { SEEKER_CC_LEAD_CONNECT_ROUTES } from '@/constants';
import { findMatchingIndex, generateCaregiverPath } from '../caregiverProfileHelper';

const mockProfiles = [
  {
    memberId: '123456',
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
    memberId: '2123123',
    memberUUID: '01de07fd-7a0b-4326-b83a-15bfa8163c9c',
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
    memberId: '3123123',
    memberUUID: 'c08104b2-37f9-48ca-8f13-580d30d8330d',
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

describe('Caregiver Profile Helper Functions', () => {
  it('should generate correct path', () => {
    const generatedPath = generateCaregiverPath(mockProfiles[0]);
    const expectedResult = `${SEEKER_CC_LEAD_CONNECT_ROUTES.CAREGIVER_LIST}/123456`;

    expect(generatedPath === expectedResult).toBeTruthy();
  });

  it('should find matching profile', () => {
    // should return id of the third profile
    const result = findMatchingIndex('3123123', mockProfiles);
    expect(result === 2).toBeTruthy();
  });
});
