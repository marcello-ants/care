import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import { VALIDATE_MEMBER_EMAIL } from '@/components/request/GQL';
// eslint-disable-next-line camelcase
import { validateMemberEmail_validateMemberEmail_errors } from '@/__generated__/validateMemberEmail';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { SEEKER_ROUTES } from '@/constants';
import EmailField from '../EmailField';

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL_LOGIN: 'https://www.care.com/login',
    },
  };
});

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
  },
}));

const emailValidationMock = (
  email: string,
  // eslint-disable-next-line camelcase
  error?: validateMemberEmail_validateMemberEmail_errors
) => ({
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email,
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [error] },
    },
  },
});

let emailField: HTMLElement;

function renderComponent(mocks?: ReadonlyArray<MockedResponse>, props?: { [key: string]: any }) {
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Formik
        initialValues={{
          email: '',
        }}
        validate={(values) => {
          const errors = {};

          if (!values.email) {
            // @ts-ignore
            errors.email = 'Email is required.';
          }

          return errors;
        }}
        onSubmit={() => {}}
        validateOnMount>
        <EmailField
          id="email"
          name="email"
          label="Email Address"
          czenGeneralLoginUrl="https://www.care.com/login"
          {...props}
        />
      </Formik>
    </MockedProvider>
  );

  emailField = screen.getByLabelText('Email Address');

  return view;
}

describe('EmailField', () => {
  it('matches snapshot', () => {
    const view = renderComponent();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should display a validation error when an invalid email is entered', async () => {
    renderComponent();

    fireEvent.change(emailField, { target: { value: 'tim' } });

    const validationMsg = await screen.findByText('Please enter a valid email.');
    expect(validationMsg).toBeVisible();
  });

  it('should not display the invalid email message when the field is focused', async () => {
    renderComponent();

    fireEvent.change(emailField, { target: { value: 'tim' } });

    await screen.findByText('Please enter a valid email.');

    fireEvent.focus(emailField);

    await waitFor(() =>
      expect(screen.queryByText('Please enter a valid email.')).not.toBeInTheDocument()
    );
  });

  it('should display the invalid email message when the field is blurred', async () => {
    renderComponent();

    fireEvent.change(emailField, { target: { value: 'tim' } });
    fireEvent.focus(emailField);

    await waitFor(() =>
      expect(screen.queryByText('Please enter a valid email.')).not.toBeInTheDocument()
    );

    fireEvent.blur(emailField);

    expect(await screen.findByText('Please enter a valid email.')).toBeVisible();
  });

  it('should display a login link when the entered email is already registered and call Amplitude tracking', async () => {
    Object.defineProperty(window, 'location', {
      get() {
        return {
          href: `http://localhost${SEEKER_ROUTES.ACCOUNT_CREATION_NAME}`,
          pathname: SEEKER_ROUTES.ACCOUNT_CREATION_NAME,
        };
      },
    });
    renderComponent([
      emailValidationMock('tim@care.com', {
        __typename: 'MemberEmailAlreadyRegistered',
        message: 'This email is already registered.',
      }),
    ]);

    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });

    const validationMsg = await screen.findByText('This email is already registered.');
    expect(validationMsg).toBeVisible();

    const loginLink = screen.getByRole('link', { name: 'Log in?' });
    expect(loginLink).toHaveAttribute('href', 'https://www.care.com/login');

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'Email Already Registered',
    });
  });

  it('should display "validation failed" when an unexpected response is returned', async () => {
    renderComponent([
      emailValidationMock('tim@care.com', {
        __typename: 'MemberEmailInvalid',
        message: '',
      }),
    ]);

    fireEvent.change(emailField, { target: { value: 'tim@care.com' } });

    const validationMsg = await screen.findByText('Validation Failed');
    expect(validationMsg).toBeVisible();
  });

  it('should display email is empty message when the field is blurred and empty', async () => {
    renderComponent([], { showErrorWhenTouched: true });

    fireEvent.focus(emailField);
    fireEvent.blur(emailField);

    expect(await screen.findByText('Email is required.')).toBeVisible();
  });
});
