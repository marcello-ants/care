import { fireEvent, screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { AppState } from '@/types/app';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { useAppDispatch } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import IsHomeAddressPage from '../is-home-address';

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
  },
}));
jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;

const ADDRESS_LINE1_MOCK = 'address';
const ZIPCODE_MOCK = '02453';
const DISPLAYED_ADDRESS_MOCK = 'address \n address2, MA 02453';

function renderPage(overrideState?: AppState) {
  const { renderFn, routerMock } = preRenderPage({ appState: overrideState || initialAppState });

  const view = renderFn(IsHomeAddressPage);

  return { view, routerMock };
}

describe('Is Home Page', () => {
  beforeEach(() => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
  });

  it('Should match a snapshot', () => {
    const { view } = renderPage();

    expect(view.asFragment()).toMatchSnapshot();
  });

  it("'Yes' option should be set as default and route to correct route on Next button click", () => {
    const state: AppState = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          address: {
            ...initialAppState.seekerCC.instantBook.address,
            addressLine1: ADDRESS_LINE1_MOCK,
            zip: ZIPCODE_MOCK,
          },
          displayAddress: {
            ...initialAppState.seekerCC.instantBook.displayAddress,
            bookingAddress: DISPLAYED_ADDRESS_MOCK,
          },
        },
      },
    };
    const { routerMock } = renderPage(state);

    const yesRadio = screen.getByDisplayValue('YES');
    expect(yesRadio).toBeChecked();
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      isHomeAddress: true,
      type: 'cc_setIbIsHomeAddress',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      address: state.seekerCC.instantBook.address,
      type: 'cc_setIbHomeAddress',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      displayAddress: state.seekerCC.instantBook.displayAddress.bookingAddress,
      type: 'cc_setIbDisplayHomeAddress',
    });

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.NAME);
  });

  it("Should route to correct route on Next button click with 'No' option selected", () => {
    const { routerMock } = renderPage();

    const noRadio = screen.getByText('No');
    fireEvent.click(noRadio);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);

    expect(mockAppDispatch).toHaveBeenCalledWith({
      isHomeAddress: false,
      type: 'cc_setIbIsHomeAddress',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      address: initialAppState.seekerCC.instantBook.homeAddress,
      type: 'cc_setIbHomeAddress',
    });

    expect(mockAppDispatch).toHaveBeenCalledWith({
      displayAddress: initialAppState.seekerCC.instantBook.displayAddress.bookingAddress,
      type: 'cc_setIbDisplayHomeAddress',
    });

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Member Enrolled',
      data: {
        job_flow: 'MW VHP enrollment',
        final_step: false,
        enrollment_step: 'Booking Location Confirmation',
        is_booking_location_home: false,
        cta_clicked: 'next',
      },
    });

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.HOME_ADDRESS);
  });
});
