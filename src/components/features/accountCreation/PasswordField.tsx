import React, { useCallback, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useField, useFormikContext } from 'formik';
import { debounce } from 'lodash-es';
import { InlineTextField } from '@care/react-component-lib';
import {
  validateMemberPassword,
  // eslint-disable-next-line camelcase
  validateMemberPassword_validateMemberPassword_errors,
  validateMemberPasswordVariables,
} from '@/__generated__/validateMemberPassword';
import { VALIDATE_MEMBER_PASSWORD } from '@/components/request/GQL';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { TextFieldProps } from '@material-ui/core';
import PasswordRequirements from '../PasswordRequirements/PasswordRequirements';

const getTooShortErrorMsg = (minLength: number) =>
  `Password must be at least ${minLength} characters.`;

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultHelperText?: string;
  showErrorWhenTouched?: boolean;
  classes?: TextFieldProps['classes'];
  minLength?: number;
  allowEmptyField?: boolean;
  passwordCopyTest?: number;
};

const isLongEnough = (password: string, minLength: number) => password.length >= minLength;

function PasswordField(props: PasswordFieldProps) {
  const {
    id,
    name,
    label,
    defaultHelperText,
    showErrorWhenTouched,
    classes,
    minLength = 6,
    allowEmptyField,
    passwordCopyTest,
  } = props;
  const ref = useRef<{ password?: string; errorMessage?: string }>({});
  const apolloClient = useApolloClient();

  const debouncedValidation = useCallback(
    debounce(async (password: string, resolve: (msg: string | void) => void) => {
      // eslint-disable-next-line camelcase
      let responseError: validateMemberPassword_validateMemberPassword_errors | null;
      try {
        const { data } = await apolloClient.query<
          validateMemberPassword,
          validateMemberPasswordVariables
        >({
          query: VALIDATE_MEMBER_PASSWORD,
          variables: { password },
          context: { [SKIP_AUTH_CONTEXT_KEY]: true },
        });
        responseError = data?.validateMemberPassword.errors?.[0];
      } catch (e) {
        responseError = null;
      }

      let errorMessage;

      if (responseError) {
        if (
          responseError.__typename === 'MemberPasswordInvalidTerms' &&
          (password.includes('<') || password.includes('>'))
        ) {
          errorMessage = 'Sorry, please remove any < or > from the password and try again';
        } else {
          errorMessage = responseError.message || 'Validation Failed';
        }
      }

      resolve(errorMessage);
      ref.current = {
        password,
        errorMessage,
      };
    }, 500),
    [apolloClient]
  );

  const validate = useCallback(
    async (value: string) => {
      if (allowEmptyField && !value) {
        return '';
      }

      if (ref.current.password === value) {
        return ref.current.errorMessage;
      }

      if (!isLongEnough(value, minLength)) {
        return getTooShortErrorMsg(minLength);
      }

      return new Promise<string | void>((resolve) => {
        debouncedValidation(value, resolve);
      });
    },
    [debouncedValidation]
  );

  let helperText = defaultHelperText;

  if (passwordCopyTest === 2) {
    helperText = 'Minimum 8 characters';
  } else if (passwordCopyTest === 3) {
    helperText = '';
  }

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const { isValidating } = useFormikContext();
  const [field, meta] = useField({ name, validate });

  // server validation errors will be immediately shown, but client-side validation shows when the field is blurred
  const showError = Boolean(
    meta.error && // there's an error to show
      !isValidating && // formik is done validating
      (showErrorWhenTouched ? meta.touched : field.value) && // something was entered OR it was toched (focus & blur)
      (!isFocused || isLongEnough(field.value, minLength)) // only show server-side validations when in focus
  );

  function handleFocus() {
    setIsFocused(true);
    setShowPasswordRequirements(passwordCopyTest === 3);
  }

  function handleBlur(e: React.FocusEvent) {
    setIsFocused(false);
    field.onBlur(e);
  }

  return (
    <>
      <InlineTextField
        type="password"
        classes={classes}
        id={id}
        name={field.name}
        label={label}
        value={field.value}
        error={showError}
        helperText={showError ? meta.error : helperText}
        onChange={field.onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {showPasswordRequirements && <PasswordRequirements />}
    </>
  );
}

PasswordField.defaultProps = {
  showErrorWhenTouched: false,
  classes: undefined,
  minLength: 6,
  allowEmptyField: false,
  defaultHelperText: 'Minimum 6 characters',
  passwordCopyTest: undefined,
};

export default PasswordField;
