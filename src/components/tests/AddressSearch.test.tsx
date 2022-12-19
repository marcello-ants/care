import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preRenderPage } from '@/__setup__/testUtil';
import { AddressInput } from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import AddressSearch from '../AddressSearch';

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
  },
}));

const initialSeekerAddress = {
  addressLine1: '',
  city: '',
  state: '',
  zip: '',
};

const ADDRESS_LINE1_MOCK = 'address';
const DISPLAYED_ADDRESS_MOCK = 'address \n address2, MA 02453';
const ZIPCODE_MOCK = '02453';

const setSeekerAddress = jest.fn();
const setDisplayAddress = jest.fn();

function renderPage(overrideSeekerAddress?: AddressInput, overrideDisplayAddress?: string) {
  const { renderFn, routerMock } = preRenderPage();

  const view = renderFn(
    <AddressSearch
      seekerAddress={overrideSeekerAddress || initialSeekerAddress}
      setSeekerAddress={setSeekerAddress}
      displayAddress={overrideDisplayAddress || ''}
      setDisplayAddress={setDisplayAddress}
      pageName="Test"
    />
  );

  return { view, routerMock };
}

describe('AddressSearch', () => {
  it('Should match a snapshot', () => {
    const { view } = renderPage();

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('Should change the label on input focus and blur', () => {
    renderPage();

    const streetAddressInput = screen.getByRole('textbox', { name: 'Street address' });
    fireEvent.focus(streetAddressInput);

    const searchAddressInput = screen.getByRole('textbox', { name: 'Search address' });

    expect(searchAddressInput).toBeInTheDocument();

    fireEvent.blur(searchAddressInput);

    expect(streetAddressInput).toBeInTheDocument();
  });

  it('Should render the Edit mode with existing address information and switch to Search mode on Edit click', () => {
    const seekerAddress: AddressInput = {
      ...initialSeekerAddress,
      addressLine1: ADDRESS_LINE1_MOCK,
      zip: ZIPCODE_MOCK,
    };

    renderPage(seekerAddress, DISPLAYED_ADDRESS_MOCK);

    const editButton = screen.getByRole('button', { name: 'Edit' });

    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    const streetAddressInput = screen.getByRole('textbox', { name: 'Street address' });

    expect(streetAddressInput).toBeInTheDocument();
  });

  it('Should render the Edit mode, display error message and log an error event', () => {
    const seekerAddress: AddressInput = {
      ...initialSeekerAddress,
      addressLine1: ADDRESS_LINE1_MOCK,
    };

    renderPage(seekerAddress, DISPLAYED_ADDRESS_MOCK);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    const errorMessageText = 'Invalid address';
    const errorMessage = screen.getByText(errorMessageText);

    expect(editButton).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Error Viewed',
      data: {
        enrollment_step: 'Test',
        error_type: 'Form Validation Error',
        error: errorMessageText,
      },
    });
  });

  it('Should set addressLine 2 on Apt or Suite input change', () => {
    const seekerAddress: AddressInput = {
      ...initialSeekerAddress,
      addressLine1: ADDRESS_LINE1_MOCK,
    };

    renderPage(seekerAddress, DISPLAYED_ADDRESS_MOCK);

    const suiteInput = screen.getByRole('textbox', { name: 'Apt or Suite (optional)' });

    expect(suiteInput).toBeInTheDocument();

    userEvent.type(suiteInput, '2');

    expect(setSeekerAddress).toHaveBeenCalledWith({
      ...seekerAddress,
      addressLine2: '2',
    });
  });
});
