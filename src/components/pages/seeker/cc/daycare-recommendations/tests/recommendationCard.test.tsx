// External Dependencies
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { CenterType } from '@/__generated__/globalTypes';

// Internal Dependencies
import { DaycareProviderProfile } from '@/types/seekerCC';
import RecommendationCard from '../Cards';
import { DayCareProps } from '../Cards/RecommendationCard';

const dayCareSample: DaycareProviderProfile = {
  __typename: 'Provider',
  id: '1',
  description:
    'The Transportation Childrens Center, a non-profit child care facility, in downtown Boston, provides full day Infant, Toddler, Preschool and Pre-Kindergarten Programs year round. Open to the general public, the center is available to children 3 months through age five. The center is open from 8:00 a.m. to 6:00 p.m. with both part time and full time programs available. Every effort is made to keep tuition rates as low as possible while maintaining high quality services. The established and long-term professional staff hold degrees in early education and have extensive experience working with young children. The facility provides an outdoor roof-top play space, drop-off parking and is accessible by the MBTA.\r\nEstablished since 1986 the center is NAEYC Accredited. The beautifully designed and well-equipped center provides a stimulating and nurturing environment which will enhance the childrens self-esteem and future success in school. TCC has implemented the Creative Curriculum philosophy, a hands-on approach to learning and discovering where activities are planned to assure optimum growth and development of the whole child. Slots are filled on a first come, first served basis according to status on the wait list. Families are encouraged to visit the center and schedule a tour.',
  name: 'CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY',
  images: null,
  logo: null,
  address: {
    __typename: 'Address',
    addressLine1: '5800 GREENWICH ST',
    addressLine2: null,
    city: 'WORTHINGTON',
    state: 'Ohio',
    zip: '43085',
    latitude: null,
    longitude: null,
  },
  reviews: null,
  avgReviewRating: 3,
  license: {
    __typename: 'License',
    externalUrl: null,
    verifiedDate: '11/22/3333',
    certified: true,
    name: '123 license',
    administrativeArea: 'area 51',
  },
  selected: false,
  hasCoordinates: true,
  centerType: CenterType.FCC,
};

const mockClick = jest.fn();
const mockSelectChange = jest.fn();

const recommendationCardProps: DayCareProps = {
  daycareProfile: dayCareSample,
  isDisabled: false,
  isSelected: false,
  onClick: mockClick,
  onSelectChange: mockSelectChange,
  order: 1,
  photoIndex: 1,
};

jest.mock('@/components/pages/seeker/cc/daycare-recommendations/Cards/CardImage', () => () => (
  <div>Card Image</div>
));

const renderPage = (props: DayCareProps) => {
  return render(
    <ThemeProvider theme={theme}>
      <RecommendationCard {...props} />
    </ThemeProvider>
  );
};

describe('<RecommendationCard />', () => {
  beforeEach(() => {
    mockClick.mockClear();
    mockSelectChange.mockClear();
  });

  it('matches snapshot', () => {
    const view = renderPage(recommendationCardProps);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('Call on change method on checkbox click', () => {
    renderPage(recommendationCardProps);
    const daycareCheckBox = screen.getByRole('checkbox');

    daycareCheckBox.click();
    expect(mockSelectChange).toBeCalledWith('1', true);
    expect(mockSelectChange).toBeCalledTimes(1);
  });

  it('should not call on change method on checkbox checked/unchecked when disabled', () => {
    renderPage({ ...recommendationCardProps, isDisabled: true });
    const daycareCheckBox = screen.getByRole('checkbox');

    daycareCheckBox.click();
    expect(mockClick).not.toHaveBeenCalled();
    expect(mockSelectChange).not.toHaveBeenCalled();
  });

  it('Calls onSelect when clicking card', () => {
    renderPage(recommendationCardProps);

    userEvent.click(screen.getByText('5800 GREENWICH ST, WORTHINGTON, Ohio 43085'));

    expect(mockClick).toHaveBeenCalled();
  });

  it('should render In-home badge when centertype is FCC', () => {
    renderPage(recommendationCardProps);
    expect(screen.getByText('In-home daycare')).toBeInTheDocument();
  });

  it('should render Daycare badge when centertype is not FCC', () => {
    renderPage({
      ...recommendationCardProps,
      daycareProfile: {
        ...dayCareSample,
        centerType: CenterType.SMALL_MEDIUM_BUSINESS,
      },
    });
    expect(screen.getByText('Daycare center')).toBeInTheDocument();
  });

  it('should render the rating badge when the rating is > 0', () => {
    renderPage(recommendationCardProps);
    expect(screen.queryByTestId('average-rating-badge')).not.toBeInTheDocument();
  });

  it('should not render the rating badge when the average is null', () => {
    renderPage({
      ...recommendationCardProps,
      daycareProfile: {
        ...dayCareSample,
        avgReviewRating: 0,
      },
    });
    expect(screen.queryByTestId('average-rating-badge')).not.toBeInTheDocument();
  });

  it('should render the license badge when the center is certified', () => {
    renderPage(recommendationCardProps);
    expect(screen.getByText('License Verified')).toBeInTheDocument();
  });

  it('should not render the license badge when the center is not certified', () => {
    renderPage({
      ...recommendationCardProps,
      daycareProfile: {
        ...dayCareSample,
        license: null,
      },
    });
    expect(screen.queryByText('License  Verified')).not.toBeInTheDocument();
  });
});
