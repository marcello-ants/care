import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';

import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { VALIDATE_MEMBER_EMAIL, VALIDATE_MEMBER_PASSWORD } from '@/components/request/GQL';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import EmailPasswordForm from '../EmailPasswordForm';

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL_LOGIN: 'https://www.care.com/login',
    },
  };
});

const passingEmail = 'test@test.com';
const passingPassword = 'ABCDEFGH';

const emailValidationMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: passingEmail,
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [] },
    },
  },
};

const passwordValidationMock = (matchPassword: string) => {
  return {
    request: {
      query: VALIDATE_MEMBER_PASSWORD,
      variables: {
        password: matchPassword,
      },
    },
    result: {
      data: {
        validateMemberPassword: { errors: [] },
      },
    },
  };
};

let joinNowBtn: HTMLElement;
let emailField: HTMLElement;
let passwordField: HTMLElement;
let hdyhauField: HTMLElement;
let handleJoinNow: jest.Mock;

interface RenderComponentOptions {
  mocks?: ReadonlyArray<MockedResponse>;
  ldFlags?: FeatureFlags;
}

function renderComponent({ mocks, ldFlags }: RenderComponentOptions = {}) {
  handleJoinNow = jest.fn();
  const view = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <FeatureFlagsProvider flags={ldFlags || {}}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={() => {}}
          validateOnMount>
          <EmailPasswordForm handleJoinNow={handleJoinNow} />
        </Formik>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
  joinNowBtn = screen.getByRole('button', { name: 'Continue' });
  emailField = screen.getByLabelText('Email address');
  passwordField = screen.getByLabelText('Password');

  if (ldFlags?.[CLIENT_FEATURE_FLAGS.HDYHAU]?.variationIndex === 1) {
    hdyhauField = screen.getByRole('button', { name: 'How did you hear about us?' });
  }

  return view;
}

describe('EmailPasswordForm', () => {
  it('matches snapshot', () => {
    const view = renderComponent();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should render a "Join now" button thats initially disabled', () => {
    renderComponent();
    expect(joinNowBtn).toBeDisabled();
  });

  it('should enable the "Join now" button when a valid email and password are entered', async () => {
    renderComponent({ mocks: [emailValidationMock, passwordValidationMock(passingPassword)] });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.change(passwordField, { target: { value: passingPassword } });

    await waitFor(() => {
      expect(joinNowBtn).toBeEnabled();
    });
  });

  it('should disable the "Join now" button when an invalid email is entered', async () => {
    renderComponent({ mocks: [emailValidationMock, passwordValidationMock(passingPassword)] });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.change(passwordField, { target: { value: passingPassword } });

    await waitFor(() => {
      expect(joinNowBtn).toBeEnabled();
    });

    fireEvent.change(emailField, { target: { value: 'email' } });

    await waitFor(() => {
      expect(joinNowBtn).toBeDisabled();
    });
  });

  it('should disable the "Join now" button when an invalid password is entered', async () => {
    renderComponent({ mocks: [emailValidationMock, passwordValidationMock(passingPassword)] });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.change(passwordField, { target: { value: passingPassword } });

    await waitFor(() => {
      expect(joinNowBtn).toBeEnabled();
    });

    fireEvent.change(passwordField, { target: { value: 'foo' } });

    await waitFor(() => {
      expect(joinNowBtn).toBeDisabled();
    });
  });

  it('should call props.handleJoinNow when the join now button is clicked', async () => {
    renderComponent({ mocks: [emailValidationMock, passwordValidationMock(passingPassword)] });
    fireEvent.change(emailField, { target: { value: passingEmail } });
    fireEvent.change(passwordField, { target: { value: passingPassword } });

    await waitFor(() => {
      expect(joinNowBtn).toBeEnabled();
    });

    fireEvent.click(joinNowBtn);
    expect(handleJoinNow).toHaveBeenCalled();
  });

  describe('with HDYHAU enabled', () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.HDYHAU]: {
        reason: { kind: '' },
        value: 1,
        variationIndex: 1,
      },
    };

    it('should render the HDYHAU select when the flag is enabled', () => {
      renderComponent({
        ldFlags,
        mocks: [emailValidationMock, passwordValidationMock(passingPassword)],
      });
      expect(hdyhauField).toBeVisible();
    });

    it('should enable the "Join now" button when all inputs are entered', async () => {
      renderComponent({
        ldFlags,
        mocks: [emailValidationMock, passwordValidationMock(passingPassword)],
      });
      fireEvent.change(emailField, { target: { value: passingEmail } });
      fireEvent.change(passwordField, { target: { value: passingPassword } });
      const hdyhauInput = hdyhauField.parentElement?.querySelector('input');
      fireEvent.change(hdyhauInput!, { target: { value: 'OTHER' } });

      await waitFor(() => {
        expect(joinNowBtn).toBeEnabled();
      });
    });

    it('should disable the "Join now" button if HDYHAU is not entered', async () => {
      renderComponent({
        ldFlags,
        mocks: [emailValidationMock, passwordValidationMock(passingPassword)],
      });
      fireEvent.change(emailField, { target: { value: passingEmail } });
      fireEvent.change(passwordField, { target: { value: passingPassword } });
      const hdyhauInput = hdyhauField.parentElement?.querySelector('input');
      fireEvent.change(hdyhauInput!, { target: { value: 'OTHER' } });

      await waitFor(() => {
        expect(joinNowBtn).toBeEnabled();
      });

      fireEvent.change(hdyhauInput!, { target: { value: '' } });

      await waitFor(() => {
        expect(joinNowBtn).toBeDisabled();
      });
    });
  });
});
