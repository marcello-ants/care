import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';

import { VALIDATE_MEMBER_PASSWORD } from '@/components/request/GQL';
// eslint-disable-next-line camelcase
import { validateMemberPassword_validateMemberPassword_errors } from '@/__generated__/validateMemberPassword';
import PasswordField from '../PasswordField';

const passwordValidationMock = (
  password: string,
  // eslint-disable-next-line camelcase
  error?: validateMemberPassword_validateMemberPassword_errors
) => ({
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password,
    },
  },
  result: {
    data: {
      validateMemberPassword: { errors: [error] },
    },
  },
});

const passwordValidationErrorMock = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: 'blowup',
    },
  },
  error: new Error('ruh roh'),
};

let passwordField: HTMLElement;

function renderComponent(mocks?: ReadonlyArray<MockedResponse>, props?: { [key: string]: any }) {
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Formik
        initialValues={{
          password: '',
        }}
        validate={(values) => {
          const errors = {};

          if (props?.allowEmptyField && !values.password) {
            // @ts-ignore
            errors.password = '';
          } else if (!values.password) {
            // @ts-ignore
            errors.password = 'Password is required.';
          }

          return errors;
        }}
        onSubmit={() => {}}
        validateOnMount>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          defaultHelperText="This is the helper text"
          {...props}
        />
      </Formik>
    </MockedProvider>
  );

  passwordField = screen.getByLabelText('Password');

  return view;
}

describe('PasswordField', () => {
  it('matches snapshot', () => {
    const view = renderComponent();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should display a validation error when an invalid password is entered', async () => {
    renderComponent();

    fireEvent.change(passwordField, { target: { value: 'foo' } });

    const validationMsg = await screen.findByText('Password must be at least 6 characters.');
    expect(validationMsg).toBeVisible();
  });

  it('should not display the invalid password message when the field is focused', async () => {
    renderComponent();

    fireEvent.change(passwordField, { target: { value: 'foo' } });

    await screen.findByText('Password must be at least 6 characters.');

    fireEvent.focus(passwordField);

    await waitFor(() =>
      expect(screen.queryByText('Password must be at least 6 characters.')).not.toBeInTheDocument()
    );
  });

  it('should not display the invalid password message when the field is focused and with custom length', async () => {
    renderComponent(undefined, { minLength: 8 });

    fireEvent.change(passwordField, { target: { value: 'foo' } });

    await screen.findByText('Password must be at least 8 characters.');

    fireEvent.focus(passwordField);

    await waitFor(() =>
      expect(screen.queryByText('Password must be at least 6 characters.')).not.toBeInTheDocument()
    );
  });

  it('should display the invalid password message when the field is blurred', async () => {
    renderComponent();

    fireEvent.change(passwordField, { target: { value: 'foo' } });
    fireEvent.focus(passwordField);

    await waitFor(() =>
      expect(screen.queryByText('Password must be at least 6 characters.')).not.toBeInTheDocument()
    );

    fireEvent.blur(passwordField);

    expect(await screen.findByText('Password must be at least 6 characters.')).toBeVisible();
  });

  it('should display server-side validation errors', async () => {
    renderComponent([
      passwordValidationMock('123456', {
        __typename: 'MemberPasswordInvalid',
        message: 'I have the same password on my luggage',
      }),
    ]);

    fireEvent.change(passwordField, { target: { value: '123456' } });

    const validationMsg = await screen.findByText('I have the same password on my luggage');
    expect(validationMsg).toBeVisible();
  });

  it('should display html validation errors', async () => {
    renderComponent([
      passwordValidationMock('12345<6', {
        __typename: 'MemberPasswordInvalidTerms',
        message: 'Server side cryptic message',
      }),
    ]);

    fireEvent.change(passwordField, { target: { value: '12345<6' } });

    const validationMsg = await screen.findByText(/from the password and try again/);
    expect(validationMsg).toBeVisible();
  });

  it('should display "validation failed" when an unexpected response is returned', async () => {
    renderComponent([
      passwordValidationMock('password', {
        __typename: 'MemberPasswordInvalid',
        message: '',
      }),
    ]);

    fireEvent.change(passwordField, { target: { value: 'password' } });

    const validationMsg = await screen.findByText('Validation Failed');
    expect(validationMsg).toBeVisible();
  });

  it('should ignore validation failures', async () => {
    renderComponent([passwordValidationErrorMock]);

    fireEvent.change(passwordField, { target: { value: 'foo' } });

    await screen.findByText('Password must be at least 6 characters.');

    fireEvent.change(passwordField, { target: { value: 'blowup' } });

    await waitFor(() =>
      expect(screen.queryByText('Password must be at least 6 characters.')).not.toBeInTheDocument()
    );

    expect(screen.getByText('This is the helper text')).toBeVisible();
  });

  it('should display password is empty message when the field is blurred and empty', async () => {
    renderComponent([], { showErrorWhenTouched: true });

    fireEvent.focus(passwordField);
    fireEvent.blur(passwordField);

    expect(await screen.findByText('Password is required.')).toBeVisible();
  });
  it('password should be optional', async () => {
    renderComponent([passwordValidationErrorMock], { allowEmptyField: true });

    fireEvent.change(passwordField, { target: { value: 'foo' } });

    await screen.findByText('Password must be at least 6 characters.');

    fireEvent.change(passwordField, { target: { value: '' } });

    await waitFor(() =>
      expect(screen.queryByText('Password must be at least 6 characters.')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.queryByText('Password is required.')).not.toBeInTheDocument()
    );

    expect(screen.getByText('This is the helper text')).toBeVisible();
  });
  it('password copy test with password rules', () => {
    renderComponent([], { passwordCopyTest: 3 });
    fireEvent.focus(passwordField);
    expect(screen.getByText('No more than 2 repeated characters in a row')).toBeVisible();
    fireEvent.blur(passwordField);
    expect(screen.getByText('No more than 2 repeated characters in a row')).toBeVisible();
  });
  it('password copy test with min-8 copy change', async () => {
    renderComponent([], { passwordCopyTest: 2 });
    expect(screen.getByText('Minimum 8 characters')).toBeVisible();
  });
});
