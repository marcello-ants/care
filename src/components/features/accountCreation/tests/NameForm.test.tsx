import React from 'react';
import { Formik } from 'formik';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { PrepareTreeOptions, preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';

import NameForm from '../NameForm';

let firstNameField: HTMLElement;
let lastNameField: HTMLElement;
let submitBtn: HTMLElement;
let handleSubmit: jest.Mock;

const TEST_DATA_ZIP_CODE = '02452';

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: TEST_DATA_ZIP_CODE,
  },
};

function renderComponent(options?: PrepareTreeOptions) {
  handleSubmit = jest.fn();
  const { renderFn } = preRenderPage({
    appState: initialState,
    ...options,
  });
  const view = renderFn(
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
      }}
      onSubmit={() => {}}
      validateOnMount>
      <NameForm onSubmit={handleSubmit} />
    </Formik>
  );
  submitBtn = screen.getByRole('button', { name: 'Submit' });
  firstNameField = screen.getByLabelText('First name');
  lastNameField = screen.getByLabelText('Last name');

  return view;
}

describe('NameForm', () => {
  it('matches snapshot', () => {
    const view = renderComponent();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should render a "Submit" button thats initially disabled', async () => {
    renderComponent();

    await waitFor(() => expect(submitBtn).toBeDisabled());
  });

  it('should enable the "Submit" button when a valid email and password are entered', async () => {
    renderComponent();
    fireEvent.change(firstNameField, { target: { value: 'jane' } });
    fireEvent.change(lastNameField, { target: { value: 'doe' } });

    await waitFor(() => expect(submitBtn).toBeEnabled());
  });

  it('should disable the "Submit" button when the first name is too short', async () => {
    renderComponent();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(submitBtn).toBeEnabled());

    userEvent.clear(firstNameField);
    await userEvent.type(firstNameField, 'j', { delay: 1 });
    fireEvent.blur(firstNameField);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(
      screen.getByText(
        'Please enter a valid first name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  it('should disable the "Submit" button when the last name is too short', async () => {
    renderComponent();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(submitBtn).toBeEnabled());

    userEvent.clear(lastNameField);
    await userEvent.type(lastNameField, 'd', { delay: 1 });
    fireEvent.blur(lastNameField);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(
      screen.getByText(
        'Please enter a valid last name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  it('should disable the "Submit" button when the first name has special characters', async () => {
    renderComponent();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(submitBtn).toBeEnabled());

    userEvent.clear(firstNameField);
    await userEvent.type(firstNameField, 'janeª', { delay: 1 });
    fireEvent.blur(firstNameField);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(
      screen.getByText(
        'Please enter a valid first name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  it('should disable the "Submit" button when the last name has special characters', async () => {
    renderComponent();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(submitBtn).toBeEnabled());

    userEvent.clear(lastNameField);
    await userEvent.type(lastNameField, 'doeª', { delay: 1 });
    fireEvent.blur(lastNameField);

    await waitFor(() => expect(submitBtn).toBeDisabled());
    expect(
      screen.getByText(
        'Please enter a valid last name. Special characters or numbers are not allowed.'
      )
    ).toBeVisible();
  });

  it('should call props.onSubmit when submit button is clicked', async () => {
    renderComponent();
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(submitBtn).toBeEnabled());

    userEvent.click(submitBtn);
    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
  });

  it('should show error message when the first and last name have special characters and SEEKER_NAME_SPECIAL_CHARS_VALIDATION = 2', async () => {
    renderComponent({
      flags: {
        [CLIENT_FEATURE_FLAGS.SEEKER_NAME_SPECIAL_CHARS_VALIDATION]: {
          variationIndex: 2,
          value: 2,
          reason: { kind: '' },
        },
      },
    });
    await userEvent.type(firstNameField, 'jane', { delay: 1 });
    await userEvent.type(lastNameField, 'doe', { delay: 1 });

    await waitFor(() => expect(submitBtn).toBeEnabled());

    userEvent.clear(firstNameField);
    await userEvent.type(firstNameField, 'jane@', { delay: 1 });
    fireEvent.blur(firstNameField);

    userEvent.clear(lastNameField);
    await userEvent.type(lastNameField, 'doe!', { delay: 1 });
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
});
