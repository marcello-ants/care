import { render, screen } from '@testing-library/react';
import CommunityDetails from '@/components/pages/seeker/sc/in-facility/community-list/communityDetails';
import { testingCommunity } from '@/components/pages/seeker/sc/in-facility/community-list/tests/CommunityHelper';

function renderComponent(props?: any) {
  const utils = render(<CommunityDetails {...props} />);
  return { ...utils };
}

describe('CommunityDetails', () => {
  it('matches snapshot', () => {
    const props = {
      community: testingCommunity,
      displayCTA: true,
    };
    const { asFragment } = renderComponent(props);
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows services and amenities', async () => {
    const props = {
      community: testingCommunity,
    };
    renderComponent(props);

    expect(screen.getByText('Services and amenities')).toBeInTheDocument();
    expect(screen.getByText('Care Services')).toBeInTheDocument();
    expect(screen.getByText('12-16 hours nursing')).toBeInTheDocument();

    expect(screen.getByText('On site services')).toBeInTheDocument();
    expect(screen.getByText('Beautician')).toBeInTheDocument();

    expect(screen.getByText('Facility amenities')).toBeInTheDocument();
    expect(screen.getByText('Swimming pool')).toBeInTheDocument();

    expect(screen.getByText('Food amenities')).toBeInTheDocument();
    expect(screen.getByText('All meals provided')).toBeInTheDocument();
  });

  it("shouldn't show services header if there is nothing to show", () => {
    const testingCommunityWithoutServices = {
      ...testingCommunity,
      careServices: undefined,
      onSiteServices: undefined,
      nonCareServices: undefined,
      roomAmenities: undefined,
      communityAmenities: undefined,
      facilityAmenities: undefined,
      foodAmenities: undefined,
    };
    const props = {
      community: testingCommunityWithoutServices,
    };
    renderComponent(props);

    expect(screen.queryByText('Services and amenities')).not.toBeInTheDocument();
  });

  it('does not display CTA when is in auto lead test', () => {
    const props = {
      community: testingCommunity,
      displayCTA: false,
    };
    renderComponent(props);
    expect(screen.queryByText('Interested')).not.toBeInTheDocument();
  });
});
