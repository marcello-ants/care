import { fireEvent, screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import HomeAddressPage from '../home-address';

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
  },
}));

const ADDRESS_LINE1_MOCK = 'address';
const ZIPCODE_MOCK = '02453';
const DISPLAYED_ADDRESS_MOCK = 'address \n address2, MA 02453';

function renderPage(overrideState?: AppState) {
  const { renderFn, routerMock } = preRenderPage({
    mocks: [],
    addTypeName: true,
    appState: overrideState || initialAppState,
    pathname: '/cc/home-address',
  });

  const view = renderFn(HomeAddressPage);

  return { view, routerMock };
}

describe('Home Address Page', () => {
  it('Should match a snapshot', () => {
    const { view } = renderPage();

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('Should render the Edit mode and route to next step with existing home address information', () => {
    const state: AppState = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          homeAddress: {
            ...initialAppState.seekerCC.instantBook.homeAddress,
            addressLine1: ADDRESS_LINE1_MOCK,
            zip: ZIPCODE_MOCK,
          },
          displayAddress: {
            ...initialAppState.seekerCC.instantBook.displayAddress,
            homeAddress: DISPLAYED_ADDRESS_MOCK,
          },
        },
      },
    };

    const { routerMock } = renderPage(state);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const editButton = screen.getByRole('button', { name: 'Edit' });

    expect(nextButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Member Enrolled',
      data: {
        job_flow: 'MW VHP enrollment',
        final_step: false,
        enrollment_step: 'Home Address',
        cta_clicked: 'next',
      },
    });
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.NAME);
  });

  it('Should render the Edit mode, display error message and not route to next page', () => {
    const state: AppState = {
      ...initialAppState,
      seekerCC: {
        ...initialAppState.seekerCC,
        instantBook: {
          ...initialAppState.seekerCC.instantBook,
          homeAddress: {
            ...initialAppState.seekerCC.instantBook.address,
            addressLine1: ADDRESS_LINE1_MOCK,
          },
          displayAddress: {
            ...initialAppState.seekerCC.instantBook.displayAddress,
            homeAddress: DISPLAYED_ADDRESS_MOCK,
          },
        },
      },
    };

    const { routerMock } = renderPage(state);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const editButton = screen.getByRole('button', { name: 'Edit' });
    const errorMessageText = 'Invalid address';
    const errorMessage = screen.getByText(errorMessageText);

    expect(nextButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
