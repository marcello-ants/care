import { Formik } from 'formik';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLIENT_FEATURE_FLAGS, SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import { HOW_DID_YOU_HEAR_ABOUT_US } from '@/__generated__/globalTypes';
import { preRenderPage } from '@/__setup__/testUtil';
import { useAppDispatch } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import NamePage from '../name-HDYHAU';

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
    logTestExposure: jest.fn(),
  },
}));

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;
interface RenderPageOptions {
  ldFlags?: FeatureFlags;
}

let firstNameField: HTMLElement;
let lastNameField: HTMLElement;
let nextButton: HTMLElement;
let hdyhauField: HTMLSelectElement;
let handleSubmit: jest.Mock;

function renderPage({ ldFlags }: RenderPageOptions = {}) {
  handleSubmit = jest.fn();

  const { renderFn, routerMock } = preRenderPage({
    pathname: '/seeker/ib/name',
    flags: ldFlags,
  });
  const view = renderFn(
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        howDidYouHearAboutUs: '',
      }}
      onSubmit={handleSubmit}
      validateOnMount>
      <NamePage />
    </Formik>
  );

  nextButton = screen.getByRole('button', { name: 'Next' });
  firstNameField = screen.getByLabelText('First name');
  lastNameField = screen.getByLabelText('Last name');
  if (ldFlags?.[CLIENT_FEATURE_FLAGS.HDYHAU]?.variationIndex === 1) {
    hdyhauField = screen.getByRole('button', { name: 'How did you hear about us?' });
  }

  return { ...view, routerMock };
}

describe('Name Page', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should match a snapshot', () => {
    const { asFragment } = renderPage();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should show error message when the first name is too short', async () => {
    renderPage();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.clear(firstNameField);
    await userEvent.type(firstNameField, 'j', { delay: 1 });
    fireEvent.blur(firstNameField);

    expect(screen.getByText('First name needs to have at least two letters.')).toBeVisible();
  });

  it('should show error message when the last name is too short', async () => {
    renderPage();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.clear(lastNameField);
    await userEvent.type(lastNameField, 'd', { delay: 1 });
    fireEvent.blur(lastNameField);

    expect(screen.getByText('Last name needs to have at least two letters.')).toBeVisible();
  });

  it('should show error message when the first name has special characters', async () => {
    renderPage();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.clear(firstNameField);
    await userEvent.type(firstNameField, 'janeª', { delay: 1 });
    fireEvent.blur(firstNameField);

    expect(
      screen.getByText(
        'Please enter a valid first name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  it('should show error message when the last name has special characters', async () => {
    renderPage();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.clear(lastNameField);
    await userEvent.type(lastNameField, 'doeª', { delay: 1 });
    fireEvent.blur(lastNameField);

    expect(
      screen.getByText(
        'Please enter a valid last name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  it('should show error message when the first and last name have special characters and SEEKER_NAME_SPECIAL_CHARS_VALIDATION = 2', async () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.SEEKER_NAME_SPECIAL_CHARS_VALIDATION]: {
        reason: { kind: '' },
        value: 2,
        variationIndex: 2,
      },
    };

    renderPage({ ldFlags });
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.clear(firstNameField);
    await userEvent.type(firstNameField, 'jane!', { delay: 1 });
    fireEvent.blur(firstNameField);

    userEvent.clear(lastNameField);
    await userEvent.type(lastNameField, 'doe@', { delay: 1 });
    fireEvent.blur(lastNameField);

    expect(
      screen.getByText(
        'Please enter a valid first name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();

    expect(
      screen.getByText(
        'Please enter a valid last name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  describe('with HDYHAU enabled', () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.HDYHAU]: {
        reason: { kind: '' },
        value: 1,
        variationIndex: 1,
      },
    };

    it('should match a snapshot', () => {
      const { asFragment } = renderPage({ ldFlags });

      expect(asFragment()).toMatchSnapshot();
    });

    it('should route to correct route and save first name, last name if HDYHAU is not entered because its optional', async () => {
      const { routerMock } = renderPage({ ldFlags });
      mockAppDispatch = jest.fn();
      (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

      await userEvent.type(firstNameField, 'jane', { delay: 1 });
      await userEvent.type(lastNameField, 'doe', { delay: 1 });
      const hdyhauInput = hdyhauField.parentElement?.querySelector('input');
      expect(hdyhauInput).toBeInTheDocument();
      await waitFor(() => {
        expect(nextButton).toBeEnabled();
      });

      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(mockAppDispatch).toHaveBeenCalledWith({
          firstName: 'jane',
          lastName: 'doe',
          type: 'cc_setSeekerName',
        });
      });

      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.LAST_STEP);
    });

    it('should route to correct route and save first name, last name & HDYHAU values on Next button click', async () => {
      const { routerMock } = renderPage({ ldFlags });
      mockAppDispatch = jest.fn();
      (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

      await userEvent.type(firstNameField, 'jane', { delay: 1 });
      await userEvent.type(lastNameField, 'doe', { delay: 1 });
      const hdyhauInput = hdyhauField.parentElement?.querySelector('input');
      fireEvent.change(hdyhauInput!, { target: { value: HOW_DID_YOU_HEAR_ABOUT_US.TV_AD } });

      await waitFor(() => {
        expect(nextButton).toBeEnabled();
      });

      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(mockAppDispatch).toHaveBeenCalledWith({
          firstName: 'jane',
          lastName: 'doe',
          type: 'cc_setSeekerName',
        });
      });
      await waitFor(() => {
        expect(mockAppDispatch).toHaveBeenCalledWith({
          hdyhau: HOW_DID_YOU_HEAR_ABOUT_US.TV_AD,
          type: 'setHdyhau',
        });
      });

      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          job_flow: 'MW VHP enrollment',
          final_step: false,
          enrollment_step: 'First and Last Name',
          hdyhau: HOW_DID_YOU_HEAR_ABOUT_US.TV_AD,
          cta_clicked: 'next',
        },
      });
      expect(routerMock.push).toHaveBeenCalledWith(SEEKER_INSTANT_BOOK_ROUTES.LAST_STEP);
    });
  });
});
