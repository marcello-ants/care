import { FormikConfig, FormikErrors } from 'formik';
import { EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR } from '@/constants';
import { HOW_DID_YOU_HEAR_ABOUT_US } from '@/__generated__/globalTypes';

export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  howDidYouHearAboutUs: HOW_DID_YOU_HEAR_ABOUT_US | '';
  isPasswordSinglePage?: boolean;
}

// top-level form validation to check for errors with interdependent fields
export function validateForm(values: FormValues) {
  const { email, password, firstName, lastName, isPasswordSinglePage } = values;
  const errors: FormikErrors<FormValues> = {};

  const passwordLowerCased = password.toLowerCase();

  if (passwordLowerCased.length) {
    // ensure password doesn't contain email
    if (email.length && passwordLowerCased.includes(email.toLowerCase())) {
      errors.password = EMAIL_PASSWORD_NAME_JOINT_VALIDATION_ERROR;
    }

    // ensure password doesn't contain the first or last name
    if (firstName.length && passwordLowerCased.includes(firstName.toLowerCase())) {
      if (isPasswordSinglePage) {
        errors.password = "Please don't use your first name in your password.";
      } else {
        errors.firstName = "Please don't use your first name in your password.";
      }
    }
    if (lastName.length && passwordLowerCased.includes(lastName.toLowerCase())) {
      if (isPasswordSinglePage) {
        errors.password = "Please don't use your last name in your password.";
      } else {
        errors.lastName = "Please don't use your last name in your password.";
      }
    }
  }

  return errors;
}

const defaultConfig: Partial<FormikConfig<FormValues>> = {
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    howDidYouHearAboutUs: '',
  },
  initialStatus: {},
  validateOnMount: true,
  validateOnBlur: false,
  validate: validateForm,
};

export function useAccountCreationFormConfig<T>(
  config: Partial<FormikConfig<T extends FormValues ? T : FormValues>>
): FormikConfig<T> {
  const mergedConfig = {
    ...(defaultConfig as Partial<FormikConfig<T>>),
    ...config,
  } as FormikConfig<T>;

  return mergedConfig;
}

const firstNameRegex = /[A-Za-z]{1,}/;
const lastNameRegex = /[A-Za-z]{2,}/;
const digits = /[0-9]/;
const alpha = /^[a-zA-ZÀ-ÿŸ0-9~`’’!@#$%^&*()-_=+:;'",<.>]+$/;
const specialChars = /[~`’!@#$%^&*()\-_=+:;'",<.>]+/;

// The checkSpecialCharacters param is used in SEEKER_NAME_SPECIAL_CHARS_VALIDATION Flag
export function validateFirstName(firstName: string, checkSpecialCharacters?: boolean) {
  let isFirstNameValid =
    firstName.match(alpha) &&
    !firstName.match(digits) &&
    firstName.match(firstNameRegex) &&
    firstName.length > 1;

  if (checkSpecialCharacters) {
    isFirstNameValid = isFirstNameValid && !firstName.match(specialChars);
  }

  return isFirstNameValid
    ? undefined
    : 'Please enter a valid first name. Special characters or numbers are not allowed.';
}

export function validateLastName(lastName: string, checkSpecialCharacters?: boolean) {
  let isLastNameValid =
    lastName.match(alpha) &&
    !lastName.match(digits) &&
    lastNameRegex.test(lastName) &&
    lastName.length > 1;

  if (checkSpecialCharacters) {
    isLastNameValid = isLastNameValid && !lastName.match(specialChars);
  }

  return isLastNameValid
    ? undefined
    : 'Please enter a valid last name. Special characters or numbers are not allowed.';
}
