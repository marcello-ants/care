import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import { preRenderPage } from '@/__setup__/testUtil';
import { VALIDATE_MEMBER_EMAIL, VALIDATE_MEMBER_PASSWORD } from '@/components/request/GQL';
import ContactInfo from '../contact-info';

const emailValidationMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: 'guest@care-test.com',
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [] },
    },
  },
};

const passwordValidationMock = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: 'tav*awf6mfa9xmh@HXD',
    },
  },
  result: {
    data: {
      validateMemberPassword: { errors: [] },
    },
  },
};

let onSubmitMock: jest.Mock;
function renderComponent(props?: any) {
  onSubmitMock = jest.fn();
  const { renderFn } = preRenderPage({ mocks: [emailValidationMock, passwordValidationMock] });
  const utils = renderFn(
    <Formik
      initialValues={{
        email: '',
        password: '',
        phoneNumber: '',
      }}
      onSubmit={onSubmitMock}
      validateOnMount>
      <ContactInfo {...props} />
    </Formik>
  );
  return { ...utils };
}

describe('ContactInfo', () => {
  it('matches snapshot', () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('starts with disabled button', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button');
    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('enables button with correct info', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText('Email address');
    const phoneInput = screen.getByLabelText('Phone number');
    const passwordInput = screen.getByLabelText('Password');

    const submitButton = screen.getByRole('button');
    await waitFor(() => expect(submitButton).toBeDisabled());

    userEvent.type(emailInput, 'guest@care-test.com');
    userEvent.type(phoneInput, '3107645678');
    userEvent.type(passwordInput, 'tav*awf6mfa9xmh@HXD');

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('should call submit when the submit button is clicked', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button');

    await waitFor(() => expect(submitButton).toBeDisabled());

    userEvent.type(screen.getByLabelText('Email address'), 'guest@care-test.com');
    userEvent.type(screen.getByLabelText('Phone number'), '3107645678');
    userEvent.type(screen.getByLabelText('Password'), 'tav*awf6mfa9xmh@HXD');

    await waitFor(() => expect(submitButton).toBeEnabled());
    userEvent.click(submitButton);

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());
  });
});
