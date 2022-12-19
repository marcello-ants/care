import { screen, fireEvent, waitFor } from '@testing-library/react';

import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import { SeniorCareFacilityAmenity } from '@/__generated__/globalTypes';
import { preRenderPage } from '@/__setup__/testUtil';

import AmenitiesPage from '../amenities';

describe('<Amenities /> Screen', () => {
  beforeAll(() => {
    jest.spyOn(AnalyticsHelper, 'logEvent');
  });

  it('Should match snapshot', () => {
    const { renderFn } = preRenderPage();
    const view = renderFn(AmenitiesPage);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('Should render correctly', () => {
    const { renderFn } = preRenderPage();
    const amenities = [
      'Pet friendly',
      'Art classes',
      'Exercise groups',
      'Community dining',
      'Library',
      'Beauty salon',
    ];
    renderFn(AmenitiesPage);

    expect(
      screen.getByText(
        /Communities often offer activities and amenities. Is your loved one interested in any of these?/
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/Select all that apply./)).toBeInTheDocument();

    amenities.forEach((amenity) => {
      expect(screen.getByText(amenity)).toBeInTheDocument();
    });

    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('Should call AnalyticsHelper.logEvent with correct data', async () => {
    const amenities = [
      SeniorCareFacilityAmenity.PET_FRIENDLY,
      SeniorCareFacilityAmenity.ART_CLASSES,
      SeniorCareFacilityAmenity.EXERCISE_GROUPS,
    ];
    const { renderFn } = preRenderPage();
    renderFn(AmenitiesPage);

    const petFriendly = screen.getByText(/Pet friendly/);
    fireEvent.click(petFriendly);
    const artClasses = screen.getByText(/Art classes/);
    fireEvent.click(artClasses);
    const exerciseGroups = screen.getByText(/Exercise groups/);
    fireEvent.click(exerciseGroups);

    const next = screen.getByText('Next');
    fireEvent.click(next);

    await waitFor(() =>
      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Member enrolled',
        data: {
          vertical: 'Seniorcare',
          enrollment_step: 'amenities',
          member_type: 'Seeker',
          cta_clicked: 'Next',
          amenities_selected: amenities.join(','),
        },
      })
    );
  });

  it('Should route to /recap screen', async () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(AmenitiesPage);

    const next = screen.getByText('Next');
    fireEvent.click(next);

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
