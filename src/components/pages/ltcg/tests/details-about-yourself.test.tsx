import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { GET_ZIP_CODE_SUMMARY } from '@/components/request/GQL';
import { PrepareTreeOptions, preRenderPage } from '@/__setup__/testUtil';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { YesOrNoAnswer } from '@/__generated__/globalTypes';
import DetailsAboutYourself from '../details-about-yourself';

const zipCodeSummaryMock = {
  request: {
    query: GET_ZIP_CODE_SUMMARY,
    variables: {
      zipcode: '10001',
    },
  },
  result: {
    data: {
      getZipcodeSummary: {
        __typename: 'ZipcodeSummary',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        latitude: 3,
        longitude: 3,
      },
    },
  },
};

let onSubmitMock: jest.Mock;
function renderComponent(options: PrepareTreeOptions = {}) {
  onSubmitMock = jest.fn();
  const { renderFn, routerMock } = preRenderPage({
    ...options,
    mocks: [zipCodeSummaryMock],
    pathname: '/ltcg/details-about-yourself',
  });
  const utils = renderFn(
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        address: '',
        zip: '',
        dateOfBirth: '',
      }}
      onSubmit={onSubmitMock}
      validateOnMount>
      <DetailsAboutYourself />
    </Formik>
  );
  return { ...utils, mockRouter: routerMock };
}

describe('DetailsAboutYourself', () => {
  it('matches snapshot', async () => {
    const { asFragment } = renderComponent();
    await waitFor(() => expect(screen.getByRole('button')).toBeDisabled());
    expect(asFragment()).toMatchSnapshot();
  });

  it('starts with disabled button & shows Good news banner', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button');
    const goodNewsBanner = screen.getByText(
      /You can keep your existing caregiver while taking advantage of our partnership with your insurance carrier./i
    );
    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(goodNewsBanner).toBeInTheDocument();
  });

  it('enables button with correct info and calls submit when clicked', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button');

    await waitFor(() => expect(submitButton).toBeDisabled());

    const firstNameInput = screen.getByLabelText('First name');
    const lastNameInput = screen.getByLabelText('Last name');
    const streetInput = screen.getByLabelText('Street address');
    const zipCodeInput = screen.getByLabelText('ZIP code');
    const birthDayInput = screen.getByLabelText('Your birth date (MM/DD/YYYY)');

    userEvent.type(firstNameInput, 'Jon');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(streetInput, '5th street');
    userEvent.type(birthDayInput, '07101993');

    expect(birthDayInput).toHaveValue('07/10/1993');

    userEvent.type(zipCodeInput, '10001');
    await screen.findByText(/New York, NY/);

    await waitFor(() => expect(submitButton).toBeEnabled());

    userEvent.click(submitButton);
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());
  });

  it('should not enable the next button when the DOB is less than 18 years', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button');

    await waitFor(() => expect(submitButton).toBeDisabled());

    const firstNameInput = screen.getByLabelText('First name');
    const lastNameInput = screen.getByLabelText('Last name');
    const streetInput = screen.getByLabelText('Street address');
    const zipCodeInput = screen.getByLabelText('ZIP code');
    const birthDayInput = screen.getByLabelText('Your birth date (MM/DD/YYYY)');
    const tenYearsOld = dayjs().subtract(10, 'years');

    userEvent.type(firstNameInput, 'Jon');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(streetInput, '5th street');
    userEvent.type(zipCodeInput, '10001');
    userEvent.type(birthDayInput, tenYearsOld.format('MMDDYYYY'));
    fireEvent.blur(birthDayInput);

    await waitFor(() => expect(submitButton).toBeDisabled());

    expect(screen.getByText('You must be 18 years or older to use Care.com')).toBeVisible();
  });

  it('should display an error mesasge when the DOB is invalid', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button');

    await waitFor(() => expect(submitButton).toBeDisabled());

    const birthDayInput = screen.getByLabelText('Your birth date (MM/DD/YYYY)');
    userEvent.type(birthDayInput, '9999999999');
    fireEvent.blur(birthDayInput);

    await waitFor(() => expect(submitButton).toBeDisabled());

    expect(
      screen.getByText('Please enter a valid date of birth format (mm/dd/yyyy)')
    ).toBeVisible();
  });

  it('should not show the zip code field and banner when the user needs to find a caregiver', async () => {
    const appState: AppState = {
      ...initialAppState,
      ltcg: {
        ...initialAppState.ltcg,
        caregiverNeeded: YesOrNoAnswer.YES,
      },
    };
    renderComponent({ appState });

    await waitFor(() => expect(screen.getByRole('button')).toBeDisabled());

    expect(screen.queryByLabelText('ZIP code')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'You can keep your existing caregiver while taking advantage of our partnership with your insurance carrier.'
      )
    ).not.toBeInTheDocument();
  });
});
